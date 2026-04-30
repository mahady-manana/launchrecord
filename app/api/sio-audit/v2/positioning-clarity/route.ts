import { connectToDatabase } from "@/lib/db";
import SIOReport from "@/models/sio-report";
import {
  buildCleanContent,
  buildV2ApiData,
  getV2Band,
  mergeMetricsArrays,
  normalizeCategoryInsights,
  normalizeIssues,
} from "@/services/sio-audit-v2";
import { runPositioningClarity } from "@/services/sio-audit-v2-ai";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const positioningClaritySchema = z.object({
  reportId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const validation = positioningClaritySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validation.error.errors },
        { status: 400 },
      );
    }

    const { reportId } = validation.data;

    const report = await SIOReport.findById(reportId);
    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    if (report.progress !== "summary_complete") {
      return NextResponse.json(
        {
          error: "Report is not in summary_complete state",
          currentProgress: report.progress,
        },
        { status: 400 },
      );
    }

    const cleanContent = buildCleanContent(report);
    const aiData = await runPositioningClarity(cleanContent, report);

    // Merge issues from previous step
    const currentIssues = report.issues || [];
    const newIssues = normalizeIssues(aiData.issues);
    const mergedIssues = [...currentIssues, ...newIssues];

    // Merge category insights
    const newCategoryInsights = normalizeCategoryInsights(
      aiData.categoryInsights,
    );
    const mergedCategoryInsights = {
      ...report.categoryInsights,
      ...newCategoryInsights,
    };

    // Merge metrics
    const metrics = mergeMetricsArrays(report.metrics, aiData.metrics);

    const newScoring = {
      overall: aiData.scoring?.overall ?? report.scoring?.overall ?? 0,
      positioning:
        aiData.scoring?.positioning ?? report.scoring?.positioning ?? 0,
      clarity: aiData.scoring?.clarity ?? report.scoring?.clarity ?? 0,
      first_impression: report.scoring?.first_impression ?? 0,
      aeo: 0,
    };
    const overallScore = aiData.overallScore ?? newScoring.overall;

    await SIOReport.findByIdAndUpdate(reportId, {
      progress: "positioning_clarity_complete",
      statement: aiData.statement || report.statement || "",
      issues: mergedIssues,
      overallScore,
      reportBand: getV2Band(overallScore),
      scoring: newScoring,
      metrics: metrics,
      categoryInsights: mergedCategoryInsights,
    });

    const savedReport = await SIOReport.findById(reportId).lean();
    if (!savedReport) {
      throw new Error("Failed to refetch updated report");
    }

    return NextResponse.json({
      success: true,
      reportId,
      progress: savedReport.progress,
      data: buildV2ApiData(savedReport),
      nextStep: "/api/sio-audit/v2/aeo-analysis",
    });
  } catch (error) {
    console.error("Positioning Clarity API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

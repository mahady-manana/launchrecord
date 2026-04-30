import { connectToDatabase } from "@/lib/db";
import SIOReport from "@/models/sio-report";
import {
  buildCleanContent,
  buildV2ApiData,
  getV2Band,
  mapStrengthsFromSummary,
  normalizeCategoryInsights,
  normalizeFirstImpressions,
  normalizeIssues,
  normalizeWebsiteSummary,
} from "@/services/sio-audit-v2";
import { runSummaryFirstImpressions } from "@/services/sio-audit-v2-ai";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const summarySchema = z.object({
  reportId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const validation = summarySchema.safeParse(body);

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

    if (report.progress !== "content_fetched") {
      return NextResponse.json(
        {
          error: "Report is not in content_fetched state",
          currentProgress: report.progress,
        },
        { status: 400 },
      );
    }

    if (!report.tempData?.simplifiedContent) {
      return NextResponse.json(
        { error: "No content available for analysis" },
        { status: 400 },
      );
    }

    const cleanContent = buildCleanContent(report);
    const aiData = await runSummaryFirstImpressions(cleanContent);

    const websiteSummary = normalizeWebsiteSummary(aiData.websiteSummary);
    const firstImpressions = normalizeFirstImpressions(aiData.firstImpressions);
    const issues = normalizeIssues(aiData.issues);
    const categoryInsights = normalizeCategoryInsights(aiData.categoryInsights);
    const strengths = mapStrengthsFromSummary(websiteSummary);
    const metrics = aiData.metrics || {};
    const scoring = {
      overall: aiData.scoring?.overall ?? 0,
      positioning: aiData.scoring?.positioning ?? 0,
      clarity: aiData.scoring?.clarity ?? 0,
      first_impression: aiData.scoring?.first_impression ?? 0,
      aeo: 0,
    };
    const overallScore = aiData.overallScore ?? scoring.overall;

    await SIOReport.findByIdAndUpdate(reportId, {
      progress: "summary_complete",
      statement: aiData.statement || "",
      firstImpressions,
      websiteSummary: websiteSummary,
      issues,
      overallScore,
      reportBand: getV2Band(overallScore),
      scoring,
      metrics,
      categoryInsights,
      strengths,
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
      nextStep: "/api/sio-audit/v2/positioning-clarity",
    });
  } catch (error) {
    console.error("Summary API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

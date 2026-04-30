import { connectToDatabase } from "@/lib/db";
import SIOReport from "@/models/sio-report";
import {
  buildCleanContent,
  buildV2ApiData,
  getV2Band,
  normalizeCategoryInsights,
  normalizeIssues,
} from "@/services/sio-audit-v2";
import { runValidation } from "@/services/sio-audit-v2-ai";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const validationSchema = z.object({
  reportId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const validation = validationSchema.safeParse(body);

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

    if (report.progress !== "aeo_complete") {
      return NextResponse.json(
        {
          error: "Report is not in aeo_complete state",
          currentProgress: report.progress,
        },
        { status: 400 },
      );
    }

    const cleanContent = buildCleanContent(report);
    const aiData = await runValidation(cleanContent, report);

    const issues = normalizeIssues(aiData.issues);
    const categoryInsights = normalizeCategoryInsights(aiData.categoryInsights);

    const scoring = {
      overall: aiData.scoring?.overall ?? report.scoring?.overall ?? 0,
      positioning:
        aiData.scoring?.positioning ?? report.scoring?.positioning ?? 0,
      clarity: aiData.scoring?.clarity ?? report.scoring?.clarity ?? 0,
      first_impression:
        aiData.scoring?.first_impression ??
        report.scoring?.first_impression ??
        0,
      aeo: aiData.scoring?.aeo ?? report.scoring?.aeo ?? 0,
    };
    const overallScore = aiData.overallScore ?? scoring.overall;

    await SIOReport.findByIdAndUpdate(reportId, {
      progress: "complete",
      statement: aiData.statement || report.statement || "",
      issues,
      overallScore,
      reportBand: getV2Band(overallScore),
      scoring,
      metrics: aiData.metrics || report.metrics || {},
      categoryInsights,
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
      nextStep: null, // Final step
    });
  } catch (error) {
    console.error("Validation API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

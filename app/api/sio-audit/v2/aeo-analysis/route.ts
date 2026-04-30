import { connectToDatabase } from "@/lib/db";
import SIOReport from "@/models/sio-report";
import {
  buildCleanContent,
  buildV2ApiData,
  normalizeIssues,
} from "@/services/sio-audit-v2";
import { runAeoAnalysis } from "@/services/sio-audit-v2-ai";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const aeoAnalysisSchema = z.object({
  reportId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const validation = aeoAnalysisSchema.safeParse(body);

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

    // This step happens after positioning_clarity_complete
    if (report.progress !== "positioning_clarity_complete") {
      return NextResponse.json(
        {
          error: "Report is not in positioning_clarity_complete state",
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
    const previousReport = buildV2ApiData(report);
    const aiData = await runAeoAnalysis(cleanContent, previousReport);

    const newAeoIssues = normalizeIssues(aiData.issues);

    // Merge existing issues with new AEO issues
    const existingIssues = report.issues || [];
    const mergedIssues = [...existingIssues, ...newAeoIssues];

    // Merge metrics
    const existingMetrics = report.metrics || {};
    const newMetrics = aiData.metrics || {};
    const combinedMetrics = { ...existingMetrics, ...newMetrics };

    // Update AEO category insight
    const categoryInsights = report.categoryInsights || {};
    if (aiData.categoryInsights?.aeo) {
      categoryInsights.aeo = aiData.categoryInsights.aeo;
    }

    const scoring = {
      overall: normalizeScore(report.overallScore),
      positioning: normalizeScore(report.scoring?.positioning),
      clarity: normalizeScore(report.scoring?.clarity),
      first_impression: normalizeScore(report.scoring?.first_impression),
      aeo: normalizeScore(aiData.scoring?.aeo ?? report.scoring?.aeo),
    };

    await SIOReport.findByIdAndUpdate(reportId, {
      progress: "aeo_complete",
      issues: mergedIssues,
      categoryInsights,
      metrics: combinedMetrics,
      scoring,
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
      nextStep: "/api/sio-audit/v2/validation",
    });
  } catch (error: any) {
    console.error("SIO Audit V2 AEO Analysis Error:", error);

    try {
      const body = await request.json().catch(() => null);
      if (body?.reportId) {
        await SIOReport.findByIdAndUpdate(body.reportId, {
          progress: "failed",
          failedAt: "v2_aeo_analysis",
          errorMessage:
            error.message ||
            "Unknown error during AEO visibility readiness analysis",
        });
      }
    } catch {}

    return NextResponse.json(
      { error: "Failed to perform AEO analysis" },
      { status: 500 },
    );
  }
}

function normalizeScore(value: unknown): number {
  if (typeof value !== "number" || Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

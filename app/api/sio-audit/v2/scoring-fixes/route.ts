import { connectToDatabase } from "@/lib/db";
import ApiError from "@/models/api-error";
import SIOReport from "@/models/sio-report";
import {
    buildV2ApiData,
    getV2Band,
    normalizeIssues,
} from "@/services/sio-audit-v2";
import { runScoringAndFixes } from "@/services/sio-audit-v2-ai";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const scoringFixesSchema = z.object({
  reportId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const validation = scoringFixesSchema.safeParse(body);

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

    const promptInput = {
      issues: normalizeIssues(report.issues || []),
      firstImpressions: report.firstImpressions,
      categoryInsights: report.categoryInsights,
      websiteSummary: report.websiteSummary,
      scoring: report.scoring,
    };

    const previousReport = buildV2ApiData(report);
    const aiData = await runScoringAndFixes(promptInput, previousReport);

    const issues = [...normalizeIssues(report.issues || []), ...normalizeIssues(aiData.issues)];
    const scoring = {
      overall: normalizeScore(report.overallScore),
      positioning: normalizeScore(aiData.scoring?.positioning ?? report.scoring?.positioning),
      clarity: normalizeScore(aiData.scoring?.clarity ?? report.scoring?.clarity),
      first_impression: normalizeScore(report.scoring?.first_impression),
      aeo: normalizeScore(report.scoring?.aeo),
    };
    await SIOReport.findByIdAndUpdate(reportId, {
      progress: "positioning_clarity_complete",
      issues,
      overallScore: scoring.overall,
      reportBand: getV2Band(scoring.overall),
      scoring,
      categoryInsights: {
        ...(report.categoryInsights || {}),
        positioning: aiData.categoryInsights?.positioning || report.categoryInsights?.positioning,
        clarity: aiData.categoryInsights?.clarity || report.categoryInsights?.clarity,
      },
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
  } catch (error: any) {
    console.error("SIO Audit V2 Scoring & Fixes Error:", error);

    try {
      const body = await request.json().catch(() => null);
      if (body?.reportId) {
        await SIOReport.findByIdAndUpdate(body.reportId, {
          progress: "failed",
          failedAt: "v2_scoring_and_fixes",
          errorMessage:
            error.message || "Unknown error during scoring and fix generation",
        });
      }
    } catch {}

    const errordb = new ApiError({
      path: "/api/sio-audit/v2/scoring-fixes",
      content: JSON.stringify(error),
      metadata: {
        body: JSON.stringify(await request.json().catch(() => null)),
      },
    });
    await errordb.save();

  return NextResponse.json(
      { error: "Failed to generate scoring and fixes" },
      { status: 500 },
    );
  }
}

function normalizeScore(value: unknown): number {
  if (typeof value !== "number" || Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

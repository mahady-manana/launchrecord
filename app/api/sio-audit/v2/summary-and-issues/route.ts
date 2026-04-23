import { connectToDatabase } from "@/lib/db";
import ApiError from "@/models/api-error";
import SIOReport from "@/models/sio-report";
import {
  buildCleanContent,
  buildV2ApiData,
  mapStrengthsFromSummary,
  normalizeCategoryInsights,
  normalizeFirstImpressions,
  normalizeIssues,
  normalizeWebsiteSummary,
} from "@/services/sio-audit-v2";
import { runSummaryAndIssues } from "@/services/sio-audit-v2-ai";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const summaryAndIssuesSchema = z.object({
  reportId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const validation = summaryAndIssuesSchema.safeParse(body);

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
    const aiData = await runSummaryAndIssues(cleanContent);

    const websiteSummary = normalizeWebsiteSummary(aiData.websiteSummary);
    const firstImpressions = normalizeFirstImpressions(aiData.firstImpressions);
    const issues = normalizeIssues(aiData.issues);
    const categoryInsights = normalizeCategoryInsights(aiData.categoryInsights);
    const strengths = mapStrengthsFromSummary(websiteSummary);

    await SIOReport.findByIdAndUpdate(reportId, {
      progress: "issues_generated",
      statement: aiData.statement || "",
      firstImpressions,
      websiteSummary: websiteSummary,
      issues,
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
      nextStep: "/api/sio-audit/v2/aeo-analysis",
    });
  } catch (error: any) {
    console.error("SIO Audit V2 Summary & Issues Error:", error);

    try {
      const body = await request.json().catch(() => null);
      if (body?.reportId) {
        await SIOReport.findByIdAndUpdate(body.reportId, {
          progress: "failed",
          failedAt: "v2_summary_and_issues",
          errorMessage:
            error.message ||
            "Unknown error during summary and issue generation",
        });
      }
    } catch {}

    const errordb = new ApiError({
      path: "/api/sio-audit/v2/summary-and-issues",
      content: JSON.stringify(error),
      metadata: {
        body: JSON.stringify(await request.json().catch(() => null)),
      },
    });
    await errordb.save();

    return NextResponse.json(
      { error: "Failed to generate summary and issues" },
      { status: 500 },
    );
  }
}

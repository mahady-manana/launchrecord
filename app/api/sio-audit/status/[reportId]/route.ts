/**
 * Audit Status Endpoint
 *
 * Purpose:
 * - Check current progress of an audit
 * - Used by client to poll for updates
 * - Returns current step and any available data
 */

import { connectToDatabase } from "@/lib/db";
import SIOReport from "@/models/sio-report";
import { sanitizeReportForGuest } from "@/services/sio-report/sanitizer";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ reportId: string }> },
) {
  try {
    await connectToDatabase();

    const { reportId } = await params;

    if (!reportId) {
      return NextResponse.json(
        { error: "Report ID is required" },
        { status: 400 },
      );
    }

    const report = await SIOReport.findById(reportId).lean();

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    // Build response based on progress
    const response: any = {
      reportId: report._id.toString(),
      progress: report.progress || "initializing",
      url: report.url,
      createdAt: report.createdAt,
    };

    // Include partial data based on progress
    if (
      report.progress === "content_fetched" ||
      report.progress === "summary_complete" ||
      report.progress === "positioning_clarity_complete" ||
      report.progress === "aeo_complete" ||
      report.progress === "scoring_complete" ||
      report.progress === "complete"
    ) {
      response.contentSummary = report.tempData
        ? {
            contentLength: report.tempData.contentLength,
            hasSitemap: report.tempData.hasSitemap,
            hasRobots: report.tempData.hasRobots,
          }
        : null;
    }

    if (
      report.progress === "summary_complete" ||
      report.progress === "positioning_clarity_complete" ||
      report.progress === "aeo_complete" ||
      report.progress === "scoring_complete" ||
      report.progress === "complete"
    ) {
      response.websiteSummary =
        report.websiteSummary || (report as any).websiteSummaryV2;
      response.firstImpressionScore = report.scoring?.first_impression;
    }

    if (
      report.progress === "positioning_clarity_complete" ||
      report.progress === "aeo_complete" ||
      report.progress === "scoring_complete" ||
      report.progress === "complete"
    ) {
      response.positioningScore = report.scoring?.positioning;
      response.clarityScore = report.scoring?.clarity;
    }

    if (
      report.progress === "aeo_complete" ||
      report.progress === "scoring_complete" ||
      report.progress === "complete"
    ) {
      response.aeoScore = report.scoring?.aeo;
    }

    if (
      report.progress === "scoring_complete" ||
      report.progress === "complete"
    ) {
      response.overallScore = report.overallScore;
      response.reportBand = report.reportBand;
    }

    // If complete, return full report
    if (report.progress === "complete") {
      response.data = sanitizeReportForGuest(report);
    }

    // If failed, return error info
    if (report.progress === "failed") {
      response.failedAt = report.failedAt;
      response.errorMessage = report.errorMessage;
    }

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("SIO Audit Status Check Error:", error);

    return NextResponse.json(
      { error: "Failed to check audit status" },
      { status: 500 },
    );
  }
}

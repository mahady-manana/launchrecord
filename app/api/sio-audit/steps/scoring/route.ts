/**
 * Step 6: Calculate Final Scores
 *
 * Purpose:
 * - Retrieve all step data from DB
 * - Calculate weighted overall score
 * - Determine report band
 * - Generate overall statement and comments
 * - Update progress to scoring_complete
 */

import { connectToDatabase } from "@/lib/db";
import ApiError from "@/models/api-error";
import SIOReport from "@/models/sio-report";
import { getBand } from "@/services/sio-report/schema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const scoringSchema = z.object({
  reportId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const validation = scoringSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validation.error.errors },
        { status: 400 },
      );
    }

    const { reportId } = validation.data;

    // Find report
    const report = await SIOReport.findById(reportId).lean();
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

    // Calculate weighted overall score
    // Weights: First Impression (20%), Positioning (25%), Clarity (25%), AEO (10%), Website Summary (20%)
    const firstImpressionScore = report.firstImpression?.score || 0;
    const positioningScore = report.positioning?.score || 0;
    const clarityScore = report.clarity?.score || 0;
    const aeoScore = report.aeo?.score || 0;

    // Calculate raw weighted score
    let overallScore = Math.min(
      Math.round(
        firstImpressionScore * 0.3 +
          positioningScore * 0.3 +
          clarityScore * 0.3 +
          aeoScore * 0.1,
      ),
      90,
    );

    // Apply automatic penalties based on identified issues

    // Determine report band
    const band = getBand(overallScore);

    // Generate overall statement
    const statement = generateOverallStatement(report, overallScore, band);

    // Compile positive and negative comments
    const overallCommentPositive = compilePositiveComments(report);
    const overallCommentNegative = compileNegativeComments(report);

    // Update report with final scores
    await SIOReport.findByIdAndUpdate(reportId, {
      progress: "scoring_complete",
      overallScore,
      statement,
      reportBand: band.name,
      overallCommentPositive,
      overallCommentNegative,
    });

    return NextResponse.json({
      success: true,
      reportId,
      progress: "scoring_complete",
      overallScore,
      reportBand: band.name,
      bandDescription: band.description,
      nextStep: "/api/sio-audit/steps/refine",
    });
  } catch (error: any) {
    console.error("SIO Audit Scoring Error:", error);

    try {
      const body = await request.json().catch(() => null);
      if (body?.reportId) {
        await SIOReport.findByIdAndUpdate(body.reportId, {
          progress: "failed",
          failedAt: "scoring",
          errorMessage: error.message || "Unknown error during scoring",
        });
      }
    } catch {}

    const errordb = new ApiError({
      path: "/api/sio-audit/steps/scoring",
      content: JSON.stringify(error),
      metadata: {
        body: JSON.stringify(await request.json().catch(() => null)),
      },
    });
    await errordb.save();

    return NextResponse.json(
      { error: "Failed to calculate scores" },
      { status: 500 },
    );
  }
}

function generateOverallStatement(
  report: any,
  score: number,
  band: any,
): string {
  const sections: string[] = [];

  // Opening based on band
  if (band.name === "Dominant" || band.name === "Strong") {
    sections.push(
      `Your startup demonstrates ${band.name.toLowerCase()} positioning with clear differentiation in the market.`,
    );
  } else if (band.name === "Blended") {
    sections.push(
      "Your startup has understandable positioning but lacks distinctive elements that set you apart.",
    );
  } else {
    sections.push(
      `Your startup's positioning needs significant improvement to establish market presence.`,
    );
  }

  // Specific strengths
  const strengths: string[] = [];
  if (report.positioning?.score >= 70)
    strengths.push("strong market positioning");
  if (report.clarity?.score >= 70) strengths.push("clear messaging");
  if (report.firstImpression?.score >= 70)
    strengths.push("compelling hero section");
  if (report.aeo?.score >= 70) strengths.push("good AI visibility readiness");

  if (strengths.length > 0) {
    sections.push(`Key strengths include ${strengths.join(", ")}.`);
  }

  // Specific weaknesses
  const weaknesses: string[] = [];
  if (report.positioning?.score < 50)
    weaknesses.push("unclear market positioning");
  if (report.clarity?.score < 50) weaknesses.push("muddled messaging");
  if (report.firstImpression?.score < 50) weaknesses.push("weak hero section");
  if (report.aeo?.score < 50) weaknesses.push("poor AI engine visibility");

  if (weaknesses.length > 0) {
    sections.push(`Critical areas to address: ${weaknesses.join(", ")}.`);
  }

  // Closing recommendation
  sections.push(
    `Focus on the high-priority actions in this report to improve your score.`,
  );

  return sections.join(" ");
}

function compilePositiveComments(report: any): string[] {
  const comments: string[] = [];

  // From first impression
  if (report.firstImpression?.overallCommentPositive?.length > 0) {
    comments.push(...report.firstImpression.overallCommentPositive.slice(0, 2));
  }

  // From positioning
  if (report.positioning?.overallCommentPositive?.length > 0) {
    comments.push(...report.positioning.overallCommentPositive.slice(0, 2));
  }

  // From clarity
  if (report.clarity?.overallCommentPositive?.length > 0) {
    comments.push(...report.clarity.overallCommentPositive.slice(0, 2));
  }

  // From website summary
  if (report.websiteSummary?.summaryComment) {
    comments.push(report.websiteSummary.summaryComment);
  }

  return comments.slice(0, 6); // Limit to top 6
}

function compileNegativeComments(report: any): string[] {
  const comments: string[] = [];

  // From first impression
  if (report.firstImpression?.overallCommentNegative?.length > 0) {
    comments.push(...report.firstImpression.overallCommentNegative.slice(0, 2));
  }

  // From positioning
  if (report.positioning?.overallCommentNegative?.length > 0) {
    comments.push(...report.positioning.overallCommentNegative.slice(0, 2));
  }

  // From clarity
  if (report.clarity?.overallCommentNegative?.length > 0) {
    comments.push(...report.clarity.overallCommentNegative.slice(0, 2));
  }

  // From unclear sentences
  if (report.clarity?.unclearSentences?.length > 0) {
    comments.push(
      `${report.clarity.unclearSentences.length} unclear sentences/phrases found`,
    );
  }

  return comments.slice(0, 6); // Limit to top 6
}

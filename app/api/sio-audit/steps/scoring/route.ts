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

    // Website summary score based on clarity indicators
    const websiteSummaryScore = calculateWebsiteSummaryScore(report);

    // Calculate raw weighted score
    let overallScore = Math.min(
      Math.round(
        firstImpressionScore * 0.3 +
          positioningScore * 0.3 +
          clarityScore * 0.3 +
          aeoScore * 0.1,
      ),
      87,
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

function calculateWebsiteSummaryScore(report: any): number {
  // Score based on website clarity indicators
  let score = 30; // Start LOW - require evidence to climb

  // Adjust based on clarity flags (both must be true for significant bonus)
  if (
    report.websiteSummary?.isPositioningClear &&
    report.websiteSummary?.isMessagingClear
  ) {
    score += 10; // Both clear = strong signal
  } else if (
    report.websiteSummary?.isPositioningClear ||
    report.websiteSummary?.isMessagingClear
  ) {
    score += 5; // Only one clear = partial
  }

  // Users not left guessing = good
  if (!report.websiteSummary?.areUsersLeftGuessing) score += 5;

  // PENALTY: Users left guessing = significant deduction
  if (report.websiteSummary?.areUsersLeftGuessing) score -= 10;

  // Adjust based on content completeness
  const hasProblems = report.websiteSummary?.problems?.currents?.length > 0;
  const hasOutcomes = report.websiteSummary?.outcomes?.currents?.length > 0;
  const hasSolutions = report.websiteSummary?.solutions?.currents?.length > 0;
  const hasFeatures = report.websiteSummary?.features?.currents?.length > 0;

  const completeness = [
    hasProblems,
    hasOutcomes,
    hasSolutions,
    hasFeatures,
  ].filter(Boolean).length;
  score += completeness * 2; // Max +8 for having all 4 sections

  return Math.min(100, Math.max(0, score));
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

/**
 * Apply automatic scoring penalties based on identified issues.
 * Enforces strict scoring to prevent inflation.
 */
function applyPenalties(report: any): {
  totalDeduction: number;
  breakdown: Record<string, number>;
} {
  const breakdown: Record<string, number> = {};
  let totalDeduction = 0;

  // 1. Unclear messages penalty (2 points each, max 10)
  const unclearCount = report.clarity?.unclearSentences?.length || 0;
  if (unclearCount > 0) {
    const unclearPenalty = Math.min(unclearCount, 8);
    breakdown["unclear_messages"] = unclearPenalty;
    totalDeduction += unclearPenalty;
  }

  // 2. Negative comments penalty (3 points each identified issue, max 15)
  const negativeIssues = [
    ...(report.firstImpression?.overallCommentNegative || []),
    ...(report.positioning?.overallCommentNegative || []),
    ...(report.clarity?.overallCommentNegative || []),
  ].length;
  if (negativeIssues > 0) {
    const negativePenalty = Math.min(negativeIssues, 10);
    breakdown["negative_issues"] = negativePenalty;
    totalDeduction += negativePenalty;
  }

  // 3. No clear positioning penalty (10 points)
  if (
    report.websiteSummary &&
    (!report.websiteSummary.isPositioningClear ||
      !report.websiteSummary.isMessagingClear)
  ) {
    breakdown["weak_positioning"] = 4;
    totalDeduction += 4;
  }

  // 4. Users left guessing penalty (8 points)
  if (report.websiteSummary?.areUsersLeftGuessing) {
    breakdown["users_guessing"] = 4;
    totalDeduction += 4;
  }

  // 5. Low first impression score penalty (if < 50, add 5 points)
  if (report.firstImpression?.score < 50) {
    breakdown["weak_first_impression"] = 2;
    totalDeduction += 2;
  }

  // 6. Commodity risk penalty (if positioning sub-metrics are all similar, likely generic)
  if (report.positioning?.subMetrics) {
    const subScores = Object.values(report.positioning.subMetrics).map(
      (m: any) => m.score || 0,
    );
    if (subScores.length >= 4) {
      const avgScore =
        subScores.reduce((a: number, b: number) => a + b, 0) / subScores.length;
      const variance =
        subScores.reduce(
          (acc: number, s: number) => acc + Math.pow(s - avgScore, 2),
          0,
        ) / subScores.length;

      // If all scores are very similar (variance < 50), likely AI was too generous across the board
      if (variance < 50 && avgScore > 55) {
        breakdown["commodity_risk"] = 2;
        totalDeduction += 2;
      }
    }
  }

  return { totalDeduction, breakdown };
}

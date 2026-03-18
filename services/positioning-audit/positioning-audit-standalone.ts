"use server";

import { runPositioningAudit as runAudit } from "./positioning-audit";
import {
  createPositioningReport,
  getLatestPositioningReport,
} from "./positioning-report-crud";
import type { PositioningAuditOptions, PositioningAuditResult } from "./types";

/**
 * Standalone Positioning Audit Runner
 *
 * Can be used from API routes or server components without
 * requiring the full audit infrastructure.
 *
 * @param options - Audit options including URL and timeout
 * @param productId - Optional product ID to save report to database
 * @param saveToDb - Whether to save the report to database (default: false)
 */
export async function runStandalonePositioningAudit(
  options: PositioningAuditOptions,
  productId?: string,
  saveToDb = false,
): Promise<PositioningAuditResult> {
  const { url, timeout = 15000 } = options;
  const startTime = Date.now();

  try {
    // Run the audit
    const result = await runAudit({ url, timeout });

    // Calculate audit duration
    const auditDuration = Date.now() - startTime;

    // Save to database if requested and productId is provided
    if (saveToDb && productId) {
      try {
        await createPositioningReport(productId, url, result, {
          auditDuration,
          modelUsed: "gpt-4o-mini",
        });
      } catch (dbError) {
        console.error(
          "Failed to save positioning report to database:",
          dbError,
        );
        // Don't fail the audit if DB save fails
      }
    }

    return result;
  } catch (error) {
    console.error("Positioning Audit failed:", error);

    // Return a failed result instead of throwing
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return {
      url,
      overallScore: 0,
      categoryOwnership: {
        score: 0,
        maxScore: 100,
        categoryDefinition: "",
        ownedKeywords: [],
        missingKeywords: [],
        categoryLeaders: [],
        categoryOwnershipLevel: "Ghost",
        recommendations: [`Audit failed: ${errorMessage}`],
      },
      uniqueValueProposition: {
        score: 0,
        maxScore: 100,
        identifiedUVP: "",
        uvpClarity: "Absent",
        uniquenessLevel: "Common",
        supportingEvidence: [],
        recommendations: [`Audit failed: ${errorMessage}`],
      },
      competitiveDifferentiation: {
        score: 0,
        maxScore: 100,
        identifiedCompetitors: [],
        differentiationFactors: [],
        weakPoints: [],
        differentiationStrength: "Absent",
        recommendations: [`Audit failed: ${errorMessage}`],
      },
      targetAudienceClarity: {
        score: 0,
        maxScore: 100,
        identifiedAudiences: [],
        audienceSpecificity: "Undefined",
        personaDepth: "Missing",
        recommendations: [`Audit failed: ${errorMessage}`],
      },
      problemSolutionFit: {
        score: 0,
        maxScore: 100,
        identifiedProblems: [],
        solutionClarity: "",
        fitQuality: "Poor",
        recommendations: [`Audit failed: ${errorMessage}`],
      },
      messagingConsistency: {
        score: 0,
        maxScore: 100,
        toneConsistency: "Chaotic",
        valuePropConsistency: "Contradictory",
        channelAlignment: [],
        recommendations: [`Audit failed: ${errorMessage}`],
      },
      timestamp: new Date(),
    };
  }
}

/**
 * Get or Run Positioning Audit
 *
 * Returns cached report if available (within 30 days), otherwise runs new audit
 */
export async function getOrRunPositioningAudit(
  options: PositioningAuditOptions,
  productId: string,
): Promise<PositioningAuditResult & { fromCache: boolean }> {
  // Check for recent report
  const recentReport = await getLatestPositioningReport(productId);

  if (recentReport) {
    // Check if report is recent (within 30 days)
    const now = new Date();
    const reportDate = recentReport.createdAt as Date;
    const diffInDays =
      (now.getTime() - reportDate.getTime()) / (1000 * 60 * 60 * 24);

    if (diffInDays <= 30) {
      // Convert mongoose document to PositioningAuditResult
      return {
        fromCache: true,
        url: recentReport.url,
        overallScore: recentReport.overallScore,
        categoryOwnership: recentReport.categoryOwnership,
        uniqueValueProposition: recentReport.uniqueValueProposition,
        competitiveDifferentiation: recentReport.competitiveDifferentiation,
        targetAudienceClarity: recentReport.targetAudienceClarity,
        problemSolutionFit: recentReport.problemSolutionFit,
        messagingConsistency: recentReport.messagingConsistency,
        timestamp: recentReport.createdAt,
      };
    }
  }

  // Run new audit
  const result = await runStandalonePositioningAudit(options, productId, true);

  return {
    fromCache: false,
    ...result,
  };
}

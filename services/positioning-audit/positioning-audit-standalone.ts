"use server";
import { runPositioningAudit as runAudit } from "./positioning-audit";
import type { PositioningAuditOptions, PositioningAuditResult } from "./types";

/**
 * Standalone Positioning Audit Runner
 *
 * Can be used from API routes or server components without
 * requiring the full audit infrastructure.
 */
export async function runStandalonePositioningAudit(
  options: PositioningAuditOptions,
): Promise<PositioningAuditResult> {
  const { url, timeout = 15000 } = options;

  try {
    const result = await runAudit({ url, timeout });
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
        recommendations: [`Audit failed: ${errorMessage}`],
      },
      uniqueValueProposition: {
        score: 0,
        maxScore: 100,
        identifiedUVP: "",
        uvpClarity: "unclear",
        uniquenessLevel: "not unique",
        supportingEvidence: [],
        recommendations: [`Audit failed: ${errorMessage}`],
      },
      competitiveDifferentiation: {
        score: 0,
        maxScore: 100,
        identifiedCompetitors: [],
        differentiationFactors: [],
        weakPoints: [],
        recommendations: [`Audit failed: ${errorMessage}`],
      },
      targetAudienceClarity: {
        score: 0,
        maxScore: 100,
        identifiedAudiences: [],
        audienceSpecificity: "vague",
        personaDepth: "missing",
        recommendations: [`Audit failed: ${errorMessage}`],
      },
      problemSolutionFit: {
        score: 0,
        maxScore: 100,
        identifiedProblems: [],
        solutionClarity: "",
        fitQuality: "weak",
        recommendations: [`Audit failed: ${errorMessage}`],
      },
      messagingConsistency: {
        score: 0,
        maxScore: 100,
        toneConsistency: "inconsistent",
        valuePropConsistency: "inconsistent",
        channelAlignment: [],
        recommendations: [`Audit failed: ${errorMessage}`],
      },
      timestamp: new Date(),
    };
  }
}

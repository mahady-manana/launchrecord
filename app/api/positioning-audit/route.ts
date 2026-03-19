import {
  getLatestPositioningReport,
  runStandalonePositioningAudit,
} from "@/services/positioning-audit";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const positioningAuditSchema = z.object({
  url: z.string().url("Invalid URL format"),
  productId: z.string().optional(),
  saveToDb: z.boolean().optional().default(false),
  force: z.boolean().optional().default(false), // Force new audit even if recent report exists
});

/**
 * POST /api/positioning-audit
 *
 * Run a comprehensive startup positioning audit on a given URL.
 * Analyzes category ownership, UVP, competitive differentiation,
 * target audience clarity, problem-solution fit, and messaging consistency.
 *
 * CACHING BEHAVIOR:
 * - Checks for existing reports for the same URL within last 30 days
 * - Returns cached report if found (unless force=true)
 * - This ensures consistent scores for the same website
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = positioningAuditSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid request",
          details: validation.error.errors,
        },
        { status: 400 },
      );
    }

    const { url, productId, saveToDb, force } = validation.data;

    // Check for existing recent report if productId is provided and force is false
    if (productId && !force) {
      const existingReport = await getLatestPositioningReport(productId);

      if (existingReport) {
        // Check if report is recent (within 30 days)
        const now = new Date();
        const reportDate = existingReport.createdAt as Date;
        const diffInDays =
          (now.getTime() - reportDate.getTime()) / (1000 * 60 * 60 * 24);

        if (diffInDays <= 30) {
          // Return cached report with metadata
          return NextResponse.json({
            ...existingReport.toObject(),
            fromCache: true,
            cacheAge: Math.round(diffInDays),
          });
        }
      }
    }

    // Run new audit (no recent report found or force=true)
    const result = await runStandalonePositioningAudit(
      {
        url,
        timeout: 30000, // 30 second timeout for comprehensive analysis
      },
      productId,
      saveToDb,
    );

    return NextResponse.json({
      ...result,
      fromCache: false,
    });
  } catch (error) {
    console.error("Positioning audit API error:", error);

    if (error instanceof Error) {
      // Handle OpenAI API errors
      if (error.message.includes("API key")) {
        return NextResponse.json(
          {
            error: "OpenAI API key not configured",
            message:
              "Please configure your OpenAI API key in environment variables",
          },
          { status: 503 },
        );
      }

      // Handle rate limit errors
      if (error.message.includes("rate limit")) {
        return NextResponse.json(
          {
            error: "Rate limit exceeded",
            message: "Please try again in a few moments",
          },
          { status: 429 },
        );
      }
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/positioning-audit
 *
 * Returns information about the positioning audit service.
 */
export async function GET() {
  return NextResponse.json({
    name: "Positioning Audit API",
    description: "Comprehensive startup positioning analysis",
    version: "1.0.0",
    endpoints: {
      audit: {
        method: "POST",
        path: "/api/positioning-audit",
        body: {
          url: "string (required) - The website URL to audit",
        },
        response: {
          overallScore: "number (0-100)",
          categoryOwnership: "CategoryOwnershipResult",
          uniqueValueProposition: "UniqueValuePropositionResult",
          competitiveDifferentiation: "CompetitiveDifferentiationResult",
          targetAudienceClarity: "TargetAudienceClarityResult",
          problemSolutionFit: "ProblemSolutionFitResult",
          messagingConsistency: "MessagingConsistencyResult",
          timestamp: "ISO 8601 datetime",
        },
      },
    },
    analysisDimensions: [
      {
        name: "Category Ownership",
        description:
          "How well the startup defines and owns their market category",
      },
      {
        name: "Unique Value Proposition",
        description: "Clarity and uniqueness of the value proposition",
      },
      {
        name: "Competitive Differentiation",
        description: "How well the startup differentiates from competitors",
      },
      {
        name: "Target Audience Clarity",
        description: "Specificity and depth of target audience definition",
      },
      {
        name: "Problem-Solution Fit",
        description: "Quality of fit between problem and solution",
      },
      {
        name: "Messaging Consistency",
        description: "Consistency of messaging across content",
      },
    ],
  });
}

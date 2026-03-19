import { connectToDatabase } from "@/lib/db";
import Subscription from "@/models/subscription";
import Usage from "@/models/usage";
import {
  getLatestPositioningReport,
  runStandalonePositioningAudit,
} from "@/services/positioning-audit";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const positioningAuditSchema = z.object({
  url: z.string(),
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

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 },
      );
    }

    // Check audit limits based on subscription
    await connectToDatabase();

    const subscription = await Subscription.findOne({
      productId,
      status: "active",
      deletedAt: null,
    });

    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    // Get or create usage record
    let usage = await Usage.findOne({
      productId,
      periodStart: { $gte: monthStart, $lte: monthEnd },
    });

    if (!usage) {
      // Create new usage record for this month
      usage = await Usage.create({
        productId,
        periodStart: monthStart,
        periodEnd: monthEnd,
        auditsUsed: 0,
        auditsLimit: subscription?.monthlyAuditLimit || 1,
        weeklyAuditUsed: 0,
        weeklyAuditLimit: subscription?.weeklyAuditLimit || 0,
        weekStart,
        weekEnd,
        resetAt: weekEnd,
      });
    }

    // Reset weekly count if new week
    if (now < usage.weekStart || now > usage.weekEnd) {
      usage.weeklyAuditUsed = 0;
      usage.weekStart = weekStart;
      usage.weekEnd = weekEnd;
      usage.resetAt = weekEnd;
      await usage.save();
    }

    // Determine audit limits
    const monthlyLimit = subscription?.monthlyAuditLimit || 1;
    const weeklyLimit = subscription?.weeklyAuditLimit || 0;
    const isFree = !subscription || subscription.planType === "free";

    // Check if user has reached their monthly limit
    if (usage.auditsUsed >= monthlyLimit) {
      return NextResponse.json(
        {
          error: isFree
            ? "You've reached your monthly positioning audit limit (1/month). Upgrade to Founder plan for 15 audits/month."
            : `You've reached your monthly positioning audit limit (${monthlyLimit}/month).`,
          limitReached: true,
          limitType: "monthly",
          used: usage.auditsUsed,
          limit: monthlyLimit,
        },
        { status: 403 },
      );
    }

    // Check weekly limit for paid plans
    if (!isFree && usage.weeklyAuditUsed >= weeklyLimit) {
      return NextResponse.json(
        {
          error: `You've reached your weekly positioning audit limit (${weeklyLimit}/week). Next reset on ${usage.resetAt.toLocaleDateString()}.`,
          limitReached: true,
          limitType: "weekly",
          used: usage.weeklyAuditUsed,
          limit: weeklyLimit,
          resetAt: usage.resetAt,
        },
        { status: 403 },
      );
    }

    // Check for existing recent report if force is false
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

    // Increment usage counters
    usage.auditsUsed += 1;
    usage.weeklyAuditUsed += 1;
    await usage.save();

    return NextResponse.json({
      ...result,
      fromCache: false,
      usage: {
        auditsUsed: usage.auditsUsed,
        auditsLimit: monthlyLimit,
        weeklyAuditUsed: usage.weeklyAuditUsed,
        weeklyAuditLimit: weeklyLimit,
        resetAt: usage.resetAt,
      },
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

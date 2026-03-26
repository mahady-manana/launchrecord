import { connectToDatabase } from "@/lib/db";
import Subscription from "@/models/subscription";
import Usage from "@/models/usage";
import { getOrRunClarityAudit } from "@/services/clarity-audit/clarity-audit-standalone";

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const clarityAuditSchema = z.object({
  url: z.string(),
  productId: z.string().optional(),
  saveToDb: z.boolean().optional().default(false),
  force: z.boolean().optional().default(false),
  name: z.string().optional(),
  tagline: z.string().optional(),
  description: z.string().optional(),
});

/**
 * POST /api/clarity-audit
 *
 * Run a product clarity audit on a given URL.
 * Analyzes headline clarity, visual flow, value hierarchy,
 * benefit clarity, CTA clarity, and proof placement.
 *
 * CACHING BEHAVIOR:
 * - Checks for existing reports for the same URL within last 30 days
 * - Returns cached report if found (unless force=true)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = clarityAuditSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid request",
          details: validation.error.errors,
        },
        { status: 400 },
      );
    }

    const { url, productId, saveToDb, force, name, tagline, description } =
      validation.data;

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
    weekStart.setDate(now.getDate() - now.getDay());
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
      usage = await Usage.create({
        productId,
        periodStart: monthStart,
        periodEnd: monthEnd,
        sioAuditsUsed: 0,
        sioAuditsLimit: subscription?.monthlyAuditLimit || 1,
        sioWeeklyAuditUsed: 0,
        sioWeeklyAuditLimit: subscription?.weeklyAuditLimit || 0,
        weekStart,
        weekEnd,
        positioningAuditsUsed: 0,
        positioningAuditsLimit: subscription?.monthlyAuditLimit || 1,
        positioningWeeklyAuditUsed: 0,
        positioningWeeklyAuditLimit: subscription?.weeklyAuditLimit || 0,
        clarityAuditsUsed: 0,
        clarityAuditsLimit: subscription?.monthlyAuditLimit || 1,
        clarityWeeklyAuditUsed: 0,
        clarityWeeklyAuditLimit: subscription?.weeklyAuditLimit || 0,
        resetAt: weekEnd,
      });
    }

    // Reset weekly count if new week
    if (now < usage.weekStart || now > usage.weekEnd) {
      usage.sioWeeklyAuditUsed = 0;
      usage.positioningWeeklyAuditUsed = 0;
      usage.clarityWeeklyAuditUsed = 0;
      usage.weekStart = weekStart;
      usage.weekEnd = weekEnd;
      usage.resetAt = weekEnd;
      await usage.save();
    }

    // Determine audit limits
    const monthlyLimit = subscription?.monthlyAuditLimit || 1;
    const weeklyLimit = subscription?.weeklyAuditLimit || 0;
    const isFree = !subscription || subscription.planType === "free";

    // Check monthly clarity audit limit
    if (usage.clarityAuditsUsed >= monthlyLimit) {
      return NextResponse.json(
        {
          error: isFree
            ? "You've reached your monthly clarity audit limit (1/month). Upgrade to Founder plan for 15 audits/month."
            : `You've reached your monthly clarity audit limit (${monthlyLimit}/month).`,
          limitReached: true,
          limitType: "monthly",
          used: usage.clarityAuditsUsed,
          limit: monthlyLimit,
        },
        { status: 403 },
      );
    }

    // Check weekly limit for paid plans
    if (!isFree && usage.clarityWeeklyAuditUsed >= weeklyLimit) {
      return NextResponse.json(
        {
          error: `You've reached your weekly clarity audit limit (${weeklyLimit}/week). Next reset on ${usage.resetAt.toLocaleDateString()}.`,
          limitReached: true,
          limitType: "weekly",
          used: usage.clarityWeeklyAuditUsed,
          limit: weeklyLimit,
          resetAt: usage.resetAt,
        },
        { status: 403 },
      );
    }

    // Run clarity audit
    const result = await getOrRunClarityAudit(
      {
        url,
        name,
        tagline,
        description,
        timeout: 30000,
      },
      productId,
      saveToDb,
      force,
    );

    // Increment usage counters
    usage.clarityAuditsUsed += 1;
    usage.clarityWeeklyAuditUsed += 1;
    await usage.save();

    return NextResponse.json({
      ...result,
      usage: {
        clarityAuditsUsed: usage.clarityAuditsUsed,
        clarityAuditsLimit: monthlyLimit,
        clarityWeeklyAuditUsed: usage.clarityWeeklyAuditUsed,
        clarityWeeklyAuditLimit: weeklyLimit,
        resetAt: usage.resetAt,
      },
    });
  } catch (error) {
    console.error("Clarity audit API error:", error);

    if (error instanceof Error) {
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
 * GET /api/clarity-audit
 *
 * Returns information about the clarity audit service.
 */
export async function GET() {
  return NextResponse.json({
    name: "Clarity Audit API",
    description: "Product clarity analysis using the 5-Second Test",
    version: "1.0.0",
    endpoints: {
      audit: {
        method: "POST",
        path: "/api/clarity-audit",
        body: {
          url: "string (required) - The website URL to audit",
          productId: "string (required) - Product ID for saving results",
        },
        response: {
          score: "number (0-100)",
          band: "instant | clear | average | confusing | opaque",
          critique: "string",
          metrics: "object",
          findings: "array",
          recommendations: "array",
          fiveSecondTest: "object",
        },
      },
    },
    analysisDimensions: [
      {
        name: "Headline Clarity",
        description: "How quickly visitors understand the headline",
      },
      {
        name: "Visual Flow",
        description: "How well design guides attention to key messages",
      },
      {
        name: "Value Hierarchy",
        description: "Whether most important info is most visible",
      },
      {
        name: "Benefit Clarity",
        description: "How clearly outcomes and transformations are stated",
      },
      {
        name: "CTA Clarity",
        description: "Whether next step is obvious and compelling",
      },
      {
        name: "Proof Placement",
        description: "Strategic positioning of trust signals",
      },
    ],
  });
}

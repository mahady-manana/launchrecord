/**
 * Step 1: Initialize & Fetch Content
 *
 * Purpose:
 * - Validate URL and user permissions
 * - Check for existing recent reports
 * - Verify usage limits
 * - Fetch website content
 * - Validate content sufficiency
 * - ONLY create report if all conditions pass
 * - Return reportId with content already fetched
 */

import { connectToDatabase } from "@/lib/db";
import { getUserSession } from "@/lib/session";
import { validateUrlServer } from "@/lib/url-validation";
import ApiError from "@/models/api-error";
import Product from "@/models/product";
import SIOReport from "@/models/sio-report";
import Subscription from "@/models/subscription";
import Usage from "@/models/usage";
import { getWebsiteContent } from "@/services/getWebsiteContent";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const initAuditSchema = z.object({
  url: z.string(),
  productId: z.string().optional(),
  isGuest: z.boolean().optional(),
});

function getWeekBounds(date: Date) {
  const now = new Date(date);
  const dayOfWeek = now.getDay();
  const diff = now.getDate() - dayOfWeek;

  const weekStart = new Date(now);
  weekStart.setDate(diff);
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);
  weekEnd.setMilliseconds(-1);

  return { weekStart, weekEnd };
}

function getMonthBounds(date: Date) {
  const now = new Date(date);
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

  return { monthStart, monthEnd };
}

async function getOrCreateSioUsage(
  productId: string,
  monthlyLimit: number,
  weeklyLimit: number,
) {
  const now = new Date();
  const { weekStart, weekEnd } = getWeekBounds(now);
  const { monthStart, monthEnd } = getMonthBounds(now);

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
      sioAuditsLimit: monthlyLimit,
      sioWeeklyAuditUsed: 0,
      sioWeeklyAuditLimit: weeklyLimit,
      positioningAuditsUsed: 0,
      positioningAuditsLimit: monthlyLimit,
      positioningWeeklyAuditUsed: 0,
      positioningWeeklyAuditLimit: weeklyLimit,
      clarityAuditsUsed: 0,
      clarityAuditsLimit: monthlyLimit,
      clarityWeeklyAuditUsed: 0,
      clarityWeeklyAuditLimit: weeklyLimit,
      weekStart,
      weekEnd,
      resetAt: weekEnd,
    });
  } else {
    if (usage.weekEnd < now) {
      usage.sioWeeklyAuditUsed = 0;
      usage.positioningWeeklyAuditUsed = 0;
      usage.clarityWeeklyAuditUsed = 0;
      usage.weekStart = weekStart;
      usage.weekEnd = weekEnd;
      usage.resetAt = weekEnd;
    }

    usage.sioAuditsLimit = monthlyLimit;
    usage.sioWeeklyAuditLimit = weeklyLimit;
    usage.positioningAuditsLimit = monthlyLimit;
    usage.positioningWeeklyAuditLimit = weeklyLimit;
    usage.clarityAuditsLimit = monthlyLimit;
    usage.clarityWeeklyAuditLimit = weeklyLimit;
    usage.periodEnd = monthEnd;

    await usage.save();
  }

  return usage;
}

export async function POST(request: NextRequest) {
  let website = "";

  try {
    await connectToDatabase();

    const body = await request.json();
    const validation = initAuditSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validation.error.errors },
        { status: 400 },
      );
    }

    const { url, productId, isGuest: guest } = validation.data;

    // Server-side URL validation
    const urlValidation = validateUrlServer(url);
    if (!urlValidation.isValid || !urlValidation.normalizedUrl) {
      return NextResponse.json(
        { error: urlValidation.error || "Invalid URL" },
        { status: 400 },
      );
    }

    const { normalizedUrl, hostUrl } = urlValidation;
    website = normalizedUrl;

    // Check authentication
    const { user } = await getUserSession({ required: false });
    const isGuest = !user?._id || guest;
    const userId = user?.id;

    if (!isGuest && !productId) {
      return NextResponse.json(
        { error: "Product ID is required for authenticated users" },
        { status: 400 },
      );
    }

    if (!isGuest && !userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check for existing recent report (30 days)
    if (isGuest) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const existingReport = await SIOReport.findOne({
        url: hostUrl,
        createdAt: { $gte: thirtyDaysAgo },
        progress: "complete",
      })
        .sort({ createdAt: -1 })
        .lean();

      if (existingReport) {
        return NextResponse.json(
          {
            error: "A recent audit for this URL already exists",
            existingReportId: existingReport._id,
            cached: true,
            reportGeneratedAt: existingReport.createdAt,
          },
          { status: 409 },
        );
      }
    }

    // Verify product access for logged-in users
    if (!isGuest && productId) {
      const product = await Product.findOne({ _id: productId, users: userId });

      if (!product) {
        return NextResponse.json(
          { error: "Product not found or access denied" },
          { status: 403 },
        );
      }
    }

    // Check usage limits
    let usage: Awaited<ReturnType<typeof getOrCreateSioUsage>> | null = null;
    let monthlyLimit = 0;
    let weeklyLimit = 0;
    let totalLimit = 0;
    let planType = "free";

    if (!isGuest && productId) {
      const subscription = await Subscription.findOne({
        productId,
        status: "active",
        deletedAt: null,
      }).sort({ createdAt: -1 });

      monthlyLimit = subscription?.monthlyAuditLimit || 0;
      weeklyLimit = subscription?.weeklyAuditLimit || 0;
      totalLimit = subscription?.totalAuditLimit || 0;
      planType = subscription?.planType || "free";

      // Check total audit limit (for one-time payments)
      if (totalLimit > 0) {
        usage = await getOrCreateSioUsage(productId, totalLimit, 0);

        if (usage.sioAuditsUsed >= totalLimit) {
          return NextResponse.json(
            {
              error: `You've used all ${totalLimit} audits included in your one-time pass. Upgrade to Founder for unlimited audits.`,
              limitReached: true,
              limitType: "total",
              used: usage.sioAuditsUsed,
              limit: totalLimit,
              resetAt: null,
              upgradeRequired: true,
            },
            { status: 403 },
          );
        }
      }
      // Check monthly limit (for subscriptions)
      else if (monthlyLimit > 0) {
        usage = await getOrCreateSioUsage(productId, monthlyLimit, weeklyLimit);

        if (usage.sioAuditsUsed >= monthlyLimit) {
          return NextResponse.json(
            {
              error: `You've reached your monthly SIO audit limit (${monthlyLimit}/month). Next reset on ${usage.periodEnd.toLocaleDateString()}.`,
              limitReached: true,
              limitType: "monthly",
              used: usage.sioAuditsUsed,
              limit: monthlyLimit,
              resetAt: usage.periodEnd,
            },
            { status: 403 },
          );
        }

        // Check weekly limit
        if (weeklyLimit > 0 && usage.sioWeeklyAuditUsed >= weeklyLimit) {
          return NextResponse.json(
            {
              error: `You've reached your weekly SIO audit limit (${weeklyLimit}/week). Next reset on ${usage.resetAt.toLocaleDateString()}.`,
              limitReached: true,
              limitType: "weekly",
              used: usage.sioWeeklyAuditUsed,
              limit: weeklyLimit,
              resetAt: usage.resetAt,
            },
            { status: 403 },
          );
        }
      }
      // Free plan - check if they already have any reports (only 1 allowed ever)
      else {
        const existingReports = await SIOReport.countDocuments({
          product: productId,
          progress: "complete",
        });

        if (existingReports >= 1) {
          return NextResponse.json(
            {
              error:
                "Free plan includes 1 audit only. Upgrade to a paid plan for more audits.",
              limitReached: true,
              limitType: "free",
              used: existingReports,
              limit: 1,
              resetAt: null,
              upgradeRequired: true,
            },
            { status: 403 },
          );
        }

        // Initialize usage for tracking
        usage = await getOrCreateSioUsage(productId, 1, 0);
      }
    }

    // Fetch website content BEFORE creating report
    const websiteContent = await getWebsiteContent(normalizedUrl, true);

    if (!websiteContent) {
      return NextResponse.json(
        { error: "Failed to fetch website content" },
        { status: 500 },
      );
    }

    // Validate content sufficiency BEFORE creating report
    const contentLength = websiteContent.simplifiedContent?.trim().length || 0;
    if (contentLength < 100) {
      return NextResponse.json(
        {
          error:
            "This website appears to be client-side rendered or has insufficient content for analysis. We don't support client-side rendered websites for now.",
          contentLength,
        },
        { status: 400 },
      );
    }

    // ALL CONDITIONS MET - Now create the report with content
    const newReport = await SIOReport.create({
      url: hostUrl,
      product: isGuest ? undefined : productId || undefined,
      progress: "content_fetched",
      overallScore: 0,
      statement: "",
      reportBand: "Ghost",
      overallCommentPositive: [],
      overallCommentNegative: [],
      websiteSummary: {
        summary: "",
        summaryComment: "",
        problems: { currents: [], positiveComments: [], negativeComments: [] },
        outcomes: { currents: [], positiveComments: [], negativeComments: [] },
        solutions: { currents: [], positiveComments: [], negativeComments: [] },
        features: { currents: [], positiveComments: [], negativeComments: [] },
        isPositioningClear: false,
        isMessagingClear: false,
        areUsersLeftGuessing: false,
      },
      firstImpression: {
        score: 0,
        statement: "",
        overallCommentPositive: [],
        overallCommentNegative: [],
        recommendation: [],
        headline: {
          statement: "",
          current: "",
          positiveComments: [],
          negativeComments: [],
          recommendation: [],
          suggested: [],
        },
        subheadline: {
          statement: "",
          current: "",
          positiveComments: [],
          negativeComments: [],
          recommendation: [],
          suggested: [],
        },
        cta: {
          statement: "",
          current: "",
          positiveComments: [],
          negativeComments: [],
          recommendation: [],
          suggested: [],
        },
      },
      positioning: {
        score: 0,
        statement: "",
        overallCommentPositive: [],
        overallCommentNegative: [],
        recommendation: [],
        summary: {
          current: "",
          positiveComments: [],
          negativeComments: [],
          recommendation: [],
          suggested: [],
        },
        subMetrics: {
          categoryOwnership: {
            statement: "",
            score: 0,
            current: "",
            positiveComments: [],
            negativeComments: [],
            recommendation: [],
            suggested: [],
          },
          uniqueValueProp: {
            statement: "",
            score: 0,
            current: "",
            positiveComments: [],
            negativeComments: [],
            recommendation: [],
            suggested: [],
          },
          competitiveDiff: {
            statement: "",
            score: 0,
            current: "",
            positiveComments: [],
            negativeComments: [],
            recommendation: [],
            suggested: [],
          },
          targetAudience: {
            statement: "",
            score: 0,
            current: "",
            positiveComments: [],
            negativeComments: [],
            recommendation: [],
            suggested: [],
          },
          problemSolutionFit: {
            statement: "",
            score: 0,
            current: "",
            positiveComments: [],
            negativeComments: [],
            recommendation: [],
            suggested: [],
          },
          messagingConsistency: {
            statement: "",
            score: 0,
            current: "",
            positiveComments: [],
            negativeComments: [],
            suggested: [],
          },
        },
      },
      clarity: {
        score: 0,
        statement: "",
        overallCommentPositive: [],
        overallCommentNegative: [],
        recommendation: [],
        summary: {
          current: "",
          positiveComments: [],
          negativeComments: [],
          recommendation: [],
          suggested: [],
        },
        unclearSentences: [],
        subMetrics: {
          headlineClarity: {
            statement: "",
            score: 0,
            current: "",
            positiveComments: [],
            negativeComments: [],
            recommendation: [],
            suggested: [],
            unclearTexts: [],
          },
          valueProposition: {
            statement: "",
            score: 0,
            current: "",
            positiveComments: [],
            negativeComments: [],
            recommendation: [],
            suggested: [],
            unclearTexts: [],
          },
          featureBenefitMapping: {
            statement: "",
            score: 0,
            current: "",
            positiveComments: [],
            negativeComments: [],
            recommendation: [],
            suggested: [],
            unclearTexts: [],
          },
          visualHierarchy: {
            statement: "",
            score: 0,
            current: "",
            positiveComments: [],
            negativeComments: [],
            recommendation: [],
            suggested: [],
            unclearTexts: [],
          },
          ctaClarity: {
            statement: "",
            score: 0,
            current: "",
            positiveComments: [],
            negativeComments: [],
            recommendation: [],
            suggested: [],
            unclearTexts: [],
          },
          proofPlacement: {
            statement: "",
            score: 0,
            current: "",
            positiveComments: [],
            negativeComments: [],
            recommendation: [],
            suggested: [],
            unclearTexts: [],
          },
        },
      },
      aeo: {
        score: 0,
        statement: "",
        aiPresence: { isPresent: false, engines: [], comment: "" },
        recommendations: [],
      },
      // Store content in tempData immediately
      tempData: {
        rawWebsiteContent: JSON.stringify(websiteContent),
        simplifiedContent: websiteContent.simplifiedContent,
        metadata: websiteContent.meta,
        ldJson: websiteContent.ldJson,
        robotsTxt: websiteContent.robottxts,
        sitemap: websiteContent.sitemap,
        contentLength,
        hasSitemap: !!websiteContent.sitemap,
        hasRobots: !!websiteContent.robottxts,
        metadataCount: websiteContent.meta
          ? Object.keys(websiteContent.meta).length
          : 0,
      },
    });

    return NextResponse.json({
      success: true,
      reportId: newReport._id.toString(),
      progress: "content_fetched",
      contentSummary: {
        contentLength,
        hasSitemap: !!websiteContent.sitemap,
        hasRobots: !!websiteContent.robottxts,
        metadataCount: websiteContent.meta
          ? Object.keys(websiteContent.meta).length
          : 0,
      },
      nextStep: "/api/sio-audit/steps/summary",
      metadata: {
        url: hostUrl,
        isGuest,
        planType,
        usageRemaining:
          totalLimit > 0
            ? totalLimit - (usage?.sioAuditsUsed || 0)
            : monthlyLimit > 0
              ? monthlyLimit - (usage?.sioAuditsUsed || 0)
              : usage
                ? 1 - usage.sioAuditsUsed
                : null,
        limitType:
          totalLimit > 0 ? "total" : monthlyLimit > 0 ? "monthly" : null,
      },
    });
  } catch (error: any) {
    console.error("SIO Audit Init Error:", error);

    const errordb = new ApiError({
      path: "/api/sio-audit/steps/init",
      content: JSON.stringify(error),
      metadata: {
        website,
        body: JSON.stringify(await request.json().catch(() => null)),
      },
    });
    await errordb.save();

    if (
      error.message?.includes("capacity") ||
      error.message?.includes("rate_limit") ||
      error.message?.includes("overloaded")
    ) {
      return NextResponse.json(
        {
          error:
            "System is currently at capacity. Please try again in a few minutes.",
          retry: true,
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { error: "Failed to initialize audit" },
      { status: 500 },
    );
  }
}

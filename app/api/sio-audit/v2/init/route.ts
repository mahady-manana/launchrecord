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

async function findSubscription(productId: string) {
  const subscription = await Subscription.findOne({
    productId,
    status: "active",
    deletedAt: null,
  }).sort({ createdAt: -1 });

  return subscription;
}

async function getOrCreateUsage(productId: string) {
  const now = new Date();

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

  const dayOfWeek = now.getDay();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - dayOfWeek);
  weekStart.setHours(0, 0, 0, 0);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);
  weekEnd.setMilliseconds(-1);

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
      sioWeeklyAuditUsed: 0,
      weekStart,
      weekEnd,
      resetAt: weekEnd,
    });
  } else {
    if (usage.weekEnd < now) {
      usage.sioWeeklyAuditUsed = 0;
      usage.weekStart = weekStart;
      usage.weekEnd = weekEnd;
      usage.resetAt = weekEnd;
    }

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

    const urlValidation = validateUrlServer(url);
    if (!urlValidation.isValid || !urlValidation.normalizedUrl) {
      return NextResponse.json(
        { error: urlValidation.error || "Invalid URL" },
        { status: 400 },
      );
    }

    const { normalizedUrl, hostUrl } = urlValidation;
    website = normalizedUrl;

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

    if (isGuest) {
      const existingReport = await SIOReport.findOne({
        url: hostUrl,
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

    if (!isGuest && productId) {
      const product = await Product.findOne({ _id: productId, users: userId });

      if (!product) {
        return NextResponse.json(
          { error: "Product not found or access denied" },
          { status: 403 },
        );
      }

      const subscription = await findSubscription(productId);

      console.log("[Audit Init V2] Subscription check:", {
        productId,
        found: !!subscription,
        planType: subscription?.planType,
        monthlyLimit: subscription?.monthlyAuditLimit,
        weeklyLimit: subscription?.weeklyAuditLimit,
        totalLimit: subscription?.totalAuditLimit,
        auditsUsed: subscription?.auditsUsed,
      });

      if (!subscription || subscription.planType === "free") {
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
      } else if (subscription.planType === "onetime") {
        const totalLimit = subscription.totalAuditLimit || 5;
        const auditsUsed = subscription.auditsUsed || 0;

        if (auditsUsed >= totalLimit) {
          return NextResponse.json(
            {
              error: `You've used all ${totalLimit} audits included in your one-time pass. Upgrade to Founder for unlimited audits.`,
              limitReached: true,
              limitType: "total",
              used: auditsUsed,
              limit: totalLimit,
              resetAt: null,
              upgradeRequired: true,
            },
            { status: 403 },
          );
        }
      } else {
        const monthlyLimit = subscription.monthlyAuditLimit || 0;
        const weeklyLimit = subscription.weeklyAuditLimit || 0;
        const usage = await getOrCreateUsage(productId);

        if (monthlyLimit > 0 && usage.sioAuditsUsed >= monthlyLimit) {
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
    }

    const websiteContent = await getWebsiteContent(normalizedUrl, true);

    if (!websiteContent) {
      return NextResponse.json(
        { error: "Failed to fetch website content" },
        { status: 500 },
      );
    }

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

    const newReport = await SIOReport.create({
      url: hostUrl,
      product: isGuest ? undefined : productId || undefined,
      version: 2,
      progress: "content_fetched",
      overallScore: 0,
      statement: "",
      reportBand: "Ghost",
      websiteSummaryV2: {
        overview: "",
        problems: [],
        solutions: [],
      },
      issues: [],
      strengths: [],
      scoring: {
        first_impression: 0,
        positioning: 0,
        clarity: 0,
        aeo: 0,
      },
      categoryInsights: {
        positioning: {
          statement: "",
          summary: "",
        },
        clarity: {
          statement: "",
          summary: "",
        },
        first_impression: {
          statement: "",
          summary: "",
        },
        aeo: {
          statement: "",
          summary: "",
        },
      },
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

    let planType = "free";
    let usageRemaining: number | null = null;

    if (!isGuest && productId) {
      const subscription = await findSubscription(productId);
      if (subscription) {
        planType = subscription.planType;

        if (subscription.planType === "onetime") {
          const totalLimit = subscription.totalAuditLimit || 5;
          const auditsUsed = subscription.auditsUsed || 0;
          usageRemaining = totalLimit - auditsUsed - 1;
        } else if (
          ["founder", "growth", "sovereign"].includes(subscription.planType)
        ) {
          const usage = await Usage.findOne({
            productId,
            periodStart: { $lte: new Date() },
            periodEnd: { $gte: new Date() },
          });
          if (usage && subscription.monthlyAuditLimit > 0) {
            usageRemaining =
              subscription.monthlyAuditLimit - usage.sioAuditsUsed - 1;
          }
        }
      }
    }

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
      nextStep: "/api/sio-audit/v2/summary-and-issues",
      metadata: {
        url: hostUrl,
        isGuest,
        planType,
        usageRemaining,
      },
    });
  } catch (error: any) {
    console.error("SIO Audit V2 Init Error:", error);

    const errordb = new ApiError({
      path: "/api/sio-audit/v2/init",
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

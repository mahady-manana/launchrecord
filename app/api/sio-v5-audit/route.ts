import { connectToDatabase } from "@/lib/db";
import { getOpenRouterClient } from "@/lib/openrouter";
import { getUserSession } from "@/lib/session";
import { validateUrlServer } from "@/lib/url-validation";
import ApiError from "@/models/api-error";
import Product from "@/models/product";
import SIOReport from "@/models/sio-report";
import Subscription from "@/models/subscription";
import Usage from "@/models/usage";
import { getWebsiteContent } from "@/services/getWebsiteContent";
import { mapToSIOReport } from "@/services/sio-report/mappers";
import { sanitizeReportForGuest } from "@/services/sio-report/sanitizer";
import { sioV5JsonSchema } from "@/services/sio-v5-json-schema";
import {
  sioV5CriticalPoints,
  sioV5SchemaPrompt,
  sioV5SystemPrompt,
} from "@/services/sio-v5-system-prompt";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const sioV5AuditSchema = z.object({
  url: z.string(),
  productId: z.string().optional(),
  isGuest: z.boolean().optional(),
});

function getWeekBounds(date: Date) {
  const now = new Date(date);
  const dayOfWeek = now.getDay(); // 0 = Sunday
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
  } catch (error) {
    // nothing we can do if DB connection fails, but we should log it
  }
  try {
    const body = await request.json();
    const validation = sioV5AuditSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validation.error.errors },
        { status: 400 },
      );
    }

    const { url, productId, isGuest: guest } = validation.data;

    // Strong server-side URL validation
    const urlValidation = validateUrlServer(url);
    if (!urlValidation.isValid || !urlValidation.normalizedUrl) {
      return NextResponse.json(
        { error: urlValidation.error || "Invalid URL" },
        { status: 400 },
      );
    }

    const { normalizedUrl, hostUrl } = urlValidation;
    // Check if user is authenticated
    const { user } = await getUserSession({ required: false });
    const isGuest = !user?._id || guest;
    const userId = user?.id;

    // For logged-in users, productId is required
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
      const existingReport = await SIOReport.findOne({ url: hostUrl })
        .sort({
          createdAt: -1,
        })
        .lean();

      if (existingReport) {
        const responseReport = sanitizeReportForGuest(existingReport);
        return NextResponse.json({
          success: true,
          data: responseReport,
          isGuest: true,
          metadata: {
            cached: true,
            reportId: existingReport._id,
            reportGeneratedAt: existingReport.createdAt,
          },
        });
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
    }

    let usage: Awaited<ReturnType<typeof getOrCreateSioUsage>> | null = null;
    let monthlyLimit = 0;
    let weeklyLimit = 0;
    let isFreePlan = true;

    if (!isGuest && productId) {
      const subscription = await Subscription.findOne({
        productId,
        status: "active",
        deletedAt: null,
      }).sort({ createdAt: -1 });

      monthlyLimit = subscription?.monthlyAuditLimit || 1;
      weeklyLimit = subscription?.weeklyAuditLimit || 0;
      isFreePlan = !subscription || subscription.planType === "free";

      usage = await getOrCreateSioUsage(productId, monthlyLimit, weeklyLimit);

      if (usage.sioAuditsUsed >= monthlyLimit) {
        return NextResponse.json(
          {
            error: isFreePlan
              ? "You've reached your monthly SIO audit limit (1/month). Please upgrade to a paid plan for more audits."
              : `You've reached your monthly SIO audit limit (${monthlyLimit}/month).`,
            limitReached: true,
            limitType: "monthly",
            used: usage.sioAuditsUsed,
            limit: monthlyLimit,
            resetAt: usage.periodEnd,
          },
          { status: 403 },
        );
      }

      if (!isFreePlan && weeklyLimit > 0) {
        if (usage.sioWeeklyAuditUsed >= weeklyLimit) {
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

    // Get OpenRouter client
    const client = getOpenRouterClient();
    website = normalizedUrl;
    // Extract website content
    const websiteContent = await getWebsiteContent(normalizedUrl, true);

    if (!websiteContent) {
      return NextResponse.json(
        { error: "Failed to fetch website content" },
        { status: 500 },
      );
    }

    // Validate that we have enough content to audit
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

    // Prepare clean content for AI
    const cleanContent = {
      webcontent: websiteContent.simplifiedContent,
      jsonLd: websiteContent.ldJson,
      metadata: websiteContent.meta,
      robotstxt: websiteContent.robottxts,
      sitemap: websiteContent.sitemap,
    };
    const keyInfo = await client.apiKeys.getCurrentKeyMetadata();
    console.log(keyInfo);
    // Step 1: Generate initial SIO-V5 audit report
    const initialResponse = await client.chat.send({
      chatGenerationParams: {
        models: [
          "x-ai/grok-4.1-fast",
          "qwen/qwen3.5-35b-a3b",
          "qwen/qwen3-vl-8b-thinking",
          // "inception/mercury-2",
          // "qwen/qwen3.6-plus-preview:free",
          // "openai/gpt-5.4-nano",
          // "qwen/qwen2.5-coder-7b-instruct",
          // "qwen/qwen3.5-9b",
        ],

        messages: [
          {
            role: "system",
            content: sioV5SystemPrompt,
          },
          {
            role: "system",
            content: sioV5SchemaPrompt,
          },
          {
            role: "system",
            content: sioV5CriticalPoints,
          },
          {
            role: "user",
            content: `Website content to analyze:\n\n${JSON.stringify(cleanContent, null, 2)}`,
          },
          {
            role: "user",
            content: `Analyze this website content and generate a complete SIO-V5 audit report following the instructions and JSON schema provided.`,
          },
        ],
        responseFormat: {
          type: "json_schema",
          jsonSchema: {
            name: "sio_v5_report",
            strict: true,
            schema: sioV5JsonSchema,
          },
        },
        provider: {
          requireParameters: true,
          sort: "throughput",
        },
        stream: false,
        reasoning: {
          effort: "high",
        },
      },
    });

    const initialContent = initialResponse.choices[0]?.message?.content;

    if (!initialContent) {
      throw new Error("No content returned from OpenRouter");
    }

    console.log("====================================");
    console.log("Initial Audit Usage:", initialResponse.usage);
    console.log("====================================");

    // Step 2: Verify and improve the generated report
    // const verificationResponse = await client.chat.send({
    //   chatGenerationParams: {
    //     models: [
    //       "qwen/qwen3.6-plus-preview:free",
    //       "nvidia/nemotron-3-super-120b-a12b:free",
    //     ],
    //     messages: [
    //       {
    //         role: "system",
    //         content: sioV5VerificationPrompt,
    //       },
    //       {
    //         role: "system",
    //         content: sioV5SchemaPrompt,
    //       },
    //  {
    //   role: "system",
    //   content: sioV5CriticalPoints,
    // },
    //       {
    //         role: "user",
    //         content: `Website content for reference:\n\n${JSON.stringify(cleanContent, null, 2)}`,
    //       },
    //       {
    //         role: "user",
    //         content: `Review and improve this SIO-V5 audit report:\n\n${initialContent}`,
    //       },
    //     ],
    //     responseFormat: {
    //       type: "json_schema",
    //       jsonSchema: {
    //         name: "sio_v5_report",
    //         strict: true,
    //         schema: sioV5JsonSchema,
    //       },
    //     },
    //     provider: {
    //       requireParameters: true,
    //     },
    //     stream: false,
    //   },
    // });

    // const verifiedContent = verificationResponse.choices[0]?.message?.content;

    const verifiedContent = initialContent;
    if (!verifiedContent) {
      throw new Error("No verification content returned from OpenRouter");
    }

    // console.log("====================================");
    // console.log("Verification Usage:", verificationResponse.usage);
    // console.log("Total Usage:", {
    //   promptTokens:
    //     (initialResponse.usage?.promptTokens || 0) +
    //     (verificationResponse.usage?.promptTokens || 0),
    //   completionTokens:
    //     (initialResponse.usage?.completionTokens || 0) +
    //     (verificationResponse.usage?.completionTokens || 0),
    //   totalTokens:
    //     (initialResponse.usage?.totalTokens || 0) +
    //     (verificationResponse.usage?.totalTokens || 0),
    // });
    // console.log("====================================");

    // Parse and map the verified response

    let rawData;
    try {
      rawData = JSON.parse(verifiedContent);
    } catch (error) {
      // If verification failed to return JSON, use the initial report
      rawData = JSON.parse(initialContent);
    }

    // Map to proper format for DB and frontend
    const reportData = mapToSIOReport(rawData);

    // Save to database (for both guest and logged-in users)
    const savedReport = await SIOReport.create({
      ...reportData,
      product: isGuest ? null : productId || null,
      url: hostUrl,
      auditDuration: 0, // Can be calculated from timestamps
      // tokenUsage:
      //   (initialResponse.usage?.totalTokens || 0) +
      //   (verificationResponse.usage?.totalTokens || 0),
      // modelUsed: "qwen/qwen3.6-plus-preview:free",
      // rawAnalysis: initialContent,
      // verifiedAnalysis: verifiedContent,
    });

    // For guest users, sanitize the response (omit sensitive data)
    const responseReport = isGuest
      ? sanitizeReportForGuest(savedReport.toObject())
      : savedReport.toObject();

    if (usage) {
      usage.sioAuditsUsed += 1;
      usage.sioWeeklyAuditUsed += 1;
      await usage.save();
    }

    if (productId) {
      await Product.findByIdAndUpdate(productId, {
        score: reportData.overallScore,
      });
    }
    return NextResponse.json({
      success: true,
      data: responseReport,
      isGuest,
      metadata: {
        verified: true,
        savedToDb: true,
        reportId: savedReport._id,
        cached: false,
        reportGeneratedAt: savedReport.createdAt,
        // tokenUsage: {
        //   initial: initialResponse.usage,
        //   verification: verificationResponse.usage,
        //   total: {
        //     promptTokens:
        //       (initialResponse.usage?.promptTokens || 0) +
        //       (verificationResponse.usage?.promptTokens || 0),
        //     completionTokens:
        //       (initialResponse.usage?.completionTokens || 0) +
        //       (verificationResponse.usage?.completionTokens || 0),
        //     totalTokens:
        //       (initialResponse.usage?.totalTokens || 0) +
        //       (verificationResponse.usage?.totalTokens || 0),
        //   },
        // },
      },
    });
  } catch (error: any) {
    console.error("SIO-V5 Audit API error:", error);

    const errordb = new ApiError({
      path: "/api/sio-v5-audit",
      content: JSON.stringify(error),
      metadata: {
        website: website,
        stack: error.stack,
      },
    });
    // Handle API capacity errors
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
      { error: "Failed to generate SIO-V5 audit report" },
      { status: 500 },
    );
  }
}

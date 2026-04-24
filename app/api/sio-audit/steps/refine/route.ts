/**
 * Step 7: Refine & Finalize Report
 *
 * Purpose:
 * - AI quality assurance and cross-validation
 * - Check for contradictions between sections
 * - Refine unclear statements
 * - Verify all required fields present
 * - Clean up tempData
 * - Set progress to complete
 * - Return final report
 */

import { connectToDatabase } from "@/lib/db";
import { getOpenRouterClient } from "@/lib/openrouter";
import ApiError from "@/models/api-error";
import Product from "@/models/product";
import SIOReport from "@/models/sio-report";
import Subscription from "@/models/subscription";
import Usage from "@/models/usage";
import {
  generalInstructions,
  refinementInstruction,
} from "@/services/sio-audit-instructions/next";
import { refinementModels } from "@/services/sio-report/ai-models";
import { sanitizeReportForGuest } from "@/services/sio-report/sanitizer";
import { sioV5JsonSchema } from "@/services/sio-v5-json-schema.bkp";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const refineSchema = z.object({
  reportId: z.string(),
  isGuest: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const validation = refineSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validation.error.errors },
        { status: 400 },
      );
    }

    const { reportId, isGuest: guestFlag } = validation.data;

    // Find report
    const report = await SIOReport.findById(reportId);
    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    if (report.progress !== "scoring_complete") {
      return NextResponse.json(
        {
          error: "Report is not in scoring_complete state",
          currentProgress: report.progress,
        },
        { status: 400 },
      );
    }

    // Prepare COMPLETE report data for AI review
    const completeReportContext = {
      overallScore: report.overallScore,
      statement: report.statement,
      reportBand: report.reportBand,
      // websiteSummaryV2: report.websiteSummaryV2,
      issues: report.issues,
      strengths: report.strengths,
      scoring: report.scoring,
      categoryInsights: report.categoryInsights,
    };

    // Replace context placeholder in instructions
    const stepInstructions = refinementInstruction.replace(
      "{COMPLETE_REPORT_CONTEXT}",
      JSON.stringify(completeReportContext, null, 2),
    );

    const client = getOpenRouterClient();

    // Call AI for quality assurance - returns complete refined report in SIO-V5 format
    const aiResponse = await client.chat.send({
      chatGenerationParams: {
        models: refinementModels.models,
        messages: [
          {
            role: "system",
            content: generalInstructions,
          },
          {
            role: "system",
            content: stepInstructions,
          },
          {
            role: "user",
            content: `Review and refine this complete SIO-V5 audit report:\n\n${JSON.stringify(completeReportContext, null, 2)}`,
          },
          {
            role: "user",
            content: `Review this report, apply any refinements needed, and return the complete updated report following the SIO-V5 JSON schema provided. Maintain all existing data and only change what needs improvement.`,
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
        provider: refinementModels.provider,
        stream: false,
        // reasoning: {
        //   effort: refinementModels.reasoning,
        // },
      },
    });

    const aiContent = aiResponse.choices[0]?.message?.content;

    let refinedReport = null;
    if (aiContent) {
      console.log(
        `[Step 7] AI Usage - Prompt: ${aiResponse.usage?.promptTokens}, Completion: ${aiResponse.usage?.completionTokens}`,
      );

      try {
        refinedReport = JSON.parse(aiContent);
      } catch (error) {
        console.warn(
          "Failed to parse refined report response, proceeding without refinements",
        );
      }
    }

    // Apply refined report if available
    if (refinedReport) {
      // Update all sections with refined data
      if (refinedReport.overallScore)
        report.overallScore = refinedReport.overallScore;
      if (refinedReport.statement) report.statement = refinedReport.statement;
      if (refinedReport.scoring) report.scoring = refinedReport.scoring;
      if (refinedReport.categoryInsights)
        report.categoryInsights = refinedReport.categoryInsights;
      if (refinedReport.websiteSummaryV2)
        if (refinedReport.issues)
          // report.websiteSummaryV2 = refinedReport.websiteSummaryV2;
          report.issues = refinedReport.issues;
      if (refinedReport.strengths) report.strengths = refinedReport.strengths;
    }

    // Remove temporary data
    report.tempData = undefined;

    // Set progress to complete
    report.progress = "complete";

    await report.save();

    // Update usage if not guest
    if (!guestFlag && report.product) {
      await updateUsage(report.product);

      // Update product score
      await Product.findByIdAndUpdate(report.product, {
        score: report.overallScore,
      });
    }

    // Sanitize for guest users
    const responseReport = guestFlag
      ? sanitizeReportForGuest(report.toObject())
      : report.toObject();

    return NextResponse.json({
      success: true,
      data: responseReport,
      progress: "complete",
      metadata: {
        reportId: report._id.toString(),
        reportGeneratedAt: report.createdAt,
        cached: false,
        stepsCompleted: 6,
        refinementsApplied: !!refinedReport,
      },
    });
  } catch (error: any) {
    console.error("SIO Audit Refinement Error:", error);

    try {
      const body = await request.json().catch(() => null);
      if (body?.reportId) {
        await SIOReport.findByIdAndUpdate(body.reportId, {
          progress: "failed",
          failedAt: "refinement",
          errorMessage: error.message || "Unknown error during refinement",
        });
      }
    } catch {}

    const errordb = new ApiError({
      path: "/api/sio-audit/steps/refine",
      content: JSON.stringify(error),
      metadata: {
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
      { error: "Failed to finalize report" },
      { status: 500 },
    );
  }
}

/**
 * Update usage counters after successful audit completion.
 *
 * Logic per plan type:
 * - Free users: No tracking (already blocked by init check after 1 audit)
 * - One-time pass: Increment subscription.auditsUsed only (lifetime counter)
 * - Subscription (founder/growth/sovereign): Increment Usage model (monthly + weekly)
 */
async function updateUsage(productId: any) {
  try {
    const subscription = await Subscription.findOne({
      productId: productId.toString(),
      status: "active",
      deletedAt: null,
    }).sort({ createdAt: -1 });

    if (!subscription) {
      console.log(
        "[Audit Complete] No subscription found, skipping usage update",
      );
      return;
    }

    console.log("[Audit Complete] Updating usage:", {
      productId,
      planType: subscription.planType,
      currentAuditsUsed: subscription.auditsUsed,
    });

    // ------------------------------------------------------------------
    // ONE-TIME PASS: Increment lifetime counter on subscription
    // No Usage model needed - simple counter
    // ------------------------------------------------------------------
    if (subscription.planType === "onetime") {
      subscription.auditsUsed = (subscription.auditsUsed || 0) + 1;
      await subscription.save();

      console.log("[Audit Complete] One-time pass updated:", {
        auditsUsed: subscription.auditsUsed,
        totalAuditLimit: subscription.totalAuditLimit,
        remaining: subscription.totalAuditLimit - subscription.auditsUsed,
      });
      return;
    }

    // ------------------------------------------------------------------
    // SUBSCRIPTION PLANS: Increment Usage model (monthly + weekly)
    // ------------------------------------------------------------------
    if (["founder", "growth", "sovereign"].includes(subscription.planType)) {
      const now = new Date();

      // Find current month's usage record
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

      let usage = await Usage.findOne({
        productId: productId.toString(),
        periodStart: { $gte: monthStart, $lte: monthEnd },
      });

      if (usage) {
        usage.sioAuditsUsed += 1;
        usage.sioWeeklyAuditUsed += 1;
        await usage.save();

        console.log("[Audit Complete] Subscription usage updated:", {
          sioAuditsUsed: usage.sioAuditsUsed,
          monthlyLimit: subscription.monthlyAuditLimit,
          sioWeeklyAuditUsed: usage.sioWeeklyAuditUsed,
          weeklyLimit: subscription.weeklyAuditLimit,
        });
      } else {
        console.warn(
          "[Audit Complete] No Usage record found for subscription user",
        );
      }
      return;
    }

    // ------------------------------------------------------------------
    // FREE USERS: No usage tracking (already handled by init check)
    // ------------------------------------------------------------------
    console.log("[Audit Complete] Free user - no usage tracking needed");
  } catch (error) {
    console.error("Failed to update usage:", error);
  }
}

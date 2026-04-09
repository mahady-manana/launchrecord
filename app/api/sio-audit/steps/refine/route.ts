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
  sioV5BaseInstructions,
  step7RefinementInstructions,
} from "@/services/sio-audit-instructions";
import { sanitizeReportForGuest } from "@/services/sio-report/sanitizer";
import { sioV5JsonSchema } from "@/services/sio-v5-json-schema";
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
      overallCommentPositive: report.overallCommentPositive,
      overallCommentNegative: report.overallCommentNegative,
      websiteSummary: report.websiteSummary,
      firstImpression: report.firstImpression,
      positioning: report.positioning,
      clarity: report.clarity,
      aeo: report.aeo,
    };

    // Replace context placeholder in instructions
    const stepInstructions = step7RefinementInstructions.replace(
      "{COMPLETE_REPORT_CONTEXT}",
      JSON.stringify(completeReportContext, null, 2),
    );

    const client = getOpenRouterClient();

    // Call AI for quality assurance - returns complete refined report in SIO-V5 format
    const aiResponse = await client.chat.send({
      chatGenerationParams: {
        models: [
          "qwen/qwen3.5-35b-a3b",
          "x-ai/grok-4.1-fast",
          "google/gemma-4-31b-it:free",
        ],
        messages: [
          {
            role: "system",
            content: sioV5BaseInstructions,
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
        provider: {
          requireParameters: true,
          // sort: "throughput",
        },
        stream: false,
        reasoning: {
          effort: "medium",
        },
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
      if (refinedReport.positioning)
        report.positioning = refinedReport.positioning;
      if (refinedReport.clarity) report.clarity = refinedReport.clarity;
      if (refinedReport.firstImpression)
        report.firstImpression = refinedReport.firstImpression;
      if (refinedReport.aeo) report.aeo = refinedReport.aeo;
      if (refinedReport.websiteSummary)
        report.websiteSummary = refinedReport.websiteSummary;
      if (refinedReport.overallCommentPositive)
        report.overallCommentPositive = refinedReport.overallCommentPositive;
      if (refinedReport.overallCommentNegative)
        report.overallCommentNegative = refinedReport.overallCommentNegative;
    }

    // Calculate audit duration
    const auditDuration = Date.now() - report.createdAt.getTime();
    report.auditDuration = auditDuration;

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
        auditDuration,
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

async function updateUsage(productId: any) {
  try {
    const subscription = await Subscription.findOne({
      productId: productId.toString(),
      status: "active",
      deletedAt: null,
    }).sort({ createdAt: -1 });

    const usage = await Usage.findOne({
      productId: productId.toString(),
      periodStart: { $lte: new Date() },
      periodEnd: { $gte: new Date() },
    });

    if (usage) {
      usage.sioAuditsUsed += 1;
      usage.sioWeeklyAuditUsed += 1;
      await usage.save();
    }
  } catch (error) {
    console.error("Failed to update usage:", error);
  }
}

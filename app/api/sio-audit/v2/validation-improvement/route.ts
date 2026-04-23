import { connectToDatabase } from "@/lib/db";
import { getOpenRouterClient } from "@/lib/openrouter";
import ApiError from "@/models/api-error";
import Product from "@/models/product";
import SIOReport from "@/models/sio-report";
import Subscription from "@/models/subscription";
import Usage from "@/models/usage";
import {
  generalInstructions,
  validationAndImprovementInstruction,
} from "@/services/sio-audit-instructions/v2";
import {
  buildV2ApiData,
  buildV2ValidationInput,
  getV2Band,
  mapStrengthsFromSummary,
  normalizeCategoryInsights,
  normalizeFirstImpressions,
  normalizeIssues,
  normalizeWebsiteSummary,
  validationImprovementJsonSchema,
} from "@/services/sio-audit-v2";
import { refinementModels } from "@/services/sio-report/ai-models";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const validationImprovementSchema = z.object({
  reportId: z.string(),
  isGuest: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const validation = validationImprovementSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validation.error.errors },
        { status: 400 },
      );
    }

    const { reportId, isGuest: guestFlag } = validation.data;

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

    const promptInput = buildV2ValidationInput(report);
    const client = getOpenRouterClient();

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
            content: validationAndImprovementInstruction,
          },
          {
            role: "user",
            content: `Persisted report state from DB:\n\n${JSON.stringify(promptInput, null, 2)}`,
          },
          {
            role: "user",
            content:
              "Validate and improve this report without breaking consistency. Return ONLY the validation-improvement payload following the JSON schema provided.",
          },
        ],
        responseFormat: {
          type: "json_schema",
          jsonSchema: {
            name: "sio_v2_validation_improvement",
            strict: true,
            schema: validationImprovementJsonSchema,
          },
        },
        provider: refinementModels.provider,
        stream: false,
        reasoning: {
          effort: refinementModels.reasoning,
        },
      },
    });

    const aiContent = aiResponse.choices[0]?.message?.content;
    if (!aiContent) {
      throw new Error("No content returned from AI");
    }

    const aiData = JSON.parse(aiContent);
    const websiteSummary = normalizeWebsiteSummary(aiData.websiteSummary);
    const firstImpressions = normalizeFirstImpressions(aiData.firstImpressions);
    const issues = normalizeIssues(aiData.issues);
    const overallScore = normalizeScore(aiData.scoring?.overall);
    console.log("====================================");
    console.log(aiData.scoring);
    console.log("====================================");
    report.statement = aiData.statement || report.statement;
    report.firstImpressions = firstImpressions as any;
    report.websiteSummary = websiteSummary as any;
    report.issues = issues;
    report.overallScore = overallScore;
    report.reportBand = getV2Band(overallScore);
    report.scoring = {
      overall: overallScore,
      first_impression: normalizeScore(aiData.scoring?.first_impression),
      positioning: normalizeScore(aiData.scoring?.positioning),
      clarity: normalizeScore(aiData.scoring?.clarity),
      aeo: normalizeScore(aiData.scoring?.aeo),
    };
    report.categoryInsights = normalizeCategoryInsights(
      aiData.categoryInsights,
    );
    report.strengths = mapStrengthsFromSummary(websiteSummary);
    report.progress = "complete";

    await report.save();

    if (!guestFlag && report.product) {
      await updateUsage(report.product);
      await Product.findByIdAndUpdate(report.product, {
        score: report.overallScore,
      });
    }

    const savedReport = await SIOReport.findById(reportId).lean();
    if (!savedReport) {
      throw new Error("Failed to refetch updated report");
    }

    return NextResponse.json({
      success: true,
      progress: "complete",
      data: buildV2ApiData(savedReport),
      metadata: {
        reportId,
        reportGeneratedAt: savedReport.createdAt,
        cached: false,
        stepsCompleted: 4,
      },
    });
  } catch (error: any) {
    console.error("SIO Audit V2 Validation Error:", error);

    try {
      const body = await request.json().catch(() => null);
      if (body?.reportId) {
        await SIOReport.findByIdAndUpdate(body.reportId, {
          progress: "failed",
          failedAt: "v2_validation_improvement",
          errorMessage:
            error.message || "Unknown error during validation improvement",
        });
      }
    } catch {}

    const errordb = new ApiError({
      path: "/api/sio-audit/v2/validation-improvement",
      content: JSON.stringify(error),
      metadata: {
        body: JSON.stringify(await request.json().catch(() => null)),
      },
    });
    await errordb.save();

    return NextResponse.json(
      { error: "Failed to validate and improve report" },
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

    if (!subscription) {
      return;
    }

    if (subscription.planType === "onetime") {
      subscription.auditsUsed = (subscription.auditsUsed || 0) + 1;
      await subscription.save();
      return;
    }

    if (["founder", "growth", "sovereign"].includes(subscription.planType)) {
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

      const usage = await Usage.findOne({
        productId: productId.toString(),
        periodStart: { $gte: monthStart, $lte: monthEnd },
      });

      if (usage) {
        usage.sioAuditsUsed += 1;
        usage.sioWeeklyAuditUsed += 1;
        await usage.save();
      }
    }
  } catch (error) {
    console.error("Failed to update usage:", error);
  }
}

function normalizeScore(value: unknown): number {
  if (typeof value !== "number" || Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

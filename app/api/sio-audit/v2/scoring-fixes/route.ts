import { connectToDatabase } from "@/lib/db";
import { getOpenRouterClient } from "@/lib/openrouter";
import ApiError from "@/models/api-error";
import SIOReport from "@/models/sio-report";
import {
  generalInstructions,
  scoringAndFixesInstruction,
} from "@/services/sio-audit-instructions/v2";
import {
  buildV2ApiData,
  getV2Band,
  normalizeIssues,
  scoringFixesJsonSchema,
} from "@/services/sio-audit-v2";
import { positioningClarityModels } from "@/services/sio-report/ai-models";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const scoringFixesSchema = z.object({
  reportId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const validation = scoringFixesSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validation.error.errors },
        { status: 400 },
      );
    }

    const { reportId } = validation.data;

    const report = await SIOReport.findById(reportId);
    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    if (report.progress !== "issues_generated") {
      return NextResponse.json(
        {
          error: "Report is not in issues_generated state",
          currentProgress: report.progress,
        },
        { status: 400 },
      );
    }

    const promptInput = {
      issues: normalizeIssues(report.issues || []),
      firstImpressions: report.firstImpressions,
      categoryInsights: report.categoryInsights,
      websiteSummary: report.websiteSummary,
    };

    const client = getOpenRouterClient();
    const aiResponse = await client.chat.send({
      chatGenerationParams: {
        models: positioningClarityModels.models,
        messages: [
          {
            role: "system",
            content: generalInstructions,
          },
          {
            role: "system",
            content: scoringAndFixesInstruction,
          },
          {
            role: "user",
            content: `Persisted report issues from DB:\n\n${JSON.stringify(promptInput, null, 2)}`,
          },
          {
            role: "user",
            content:
              "Generate ONLY the scoring-and-fixes payload following the JSON schema provided. Keep the same issues and enrich them.",
          },
        ],
        responseFormat: {
          type: "json_schema",
          jsonSchema: {
            name: "sio_v2_scoring_and_fixes",
            strict: true,
            schema: scoringFixesJsonSchema,
          },
        },
        provider: positioningClarityModels.provider,
        stream: false,
        reasoning: {
          effort: positioningClarityModels.reasoning,
        },
      },
    });

    const aiContent = aiResponse.choices[0]?.message?.content;
    if (!aiContent) {
      throw new Error("No content returned from AI");
    }

    const aiData = JSON.parse(aiContent);
    const issues = normalizeIssues(aiData.issues);
    const overallScore = normalizeScore(aiData.scoring?.overall);

    await SIOReport.findByIdAndUpdate(reportId, {
      progress: "scoring_complete",
      issues,
      overallScore,
      reportBand: getV2Band(overallScore),
      scoring: {
        first_impression: normalizeScore(aiData.scoring?.first_impression),
        positioning: normalizeScore(aiData.scoring?.positioning),
        clarity: normalizeScore(aiData.scoring?.clarity),
        aeo: normalizeScore(aiData.scoring?.aeo),
      },
    });

    const savedReport = await SIOReport.findById(reportId).lean();
    if (!savedReport) {
      throw new Error("Failed to refetch updated report");
    }

    return NextResponse.json({
      success: true,
      reportId,
      progress: savedReport.progress,
      data: buildV2ApiData(savedReport),
      nextStep: "/api/sio-audit/v2/validation-improvement",
    });
  } catch (error: any) {
    console.error("SIO Audit V2 Scoring & Fixes Error:", error);

    try {
      const body = await request.json().catch(() => null);
      if (body?.reportId) {
        await SIOReport.findByIdAndUpdate(body.reportId, {
          progress: "failed",
          failedAt: "v2_scoring_and_fixes",
          errorMessage:
            error.message || "Unknown error during scoring and fix generation",
        });
      }
    } catch {}

    const errordb = new ApiError({
      path: "/api/sio-audit/v2/scoring-fixes",
      content: JSON.stringify(error),
      metadata: {
        body: JSON.stringify(await request.json().catch(() => null)),
      },
    });
    await errordb.save();

    return NextResponse.json(
      { error: "Failed to generate scoring and fixes" },
      { status: 500 },
    );
  }
}

function normalizeScore(value: unknown): number {
  if (typeof value !== "number" || Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

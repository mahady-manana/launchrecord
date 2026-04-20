import { connectToDatabase } from "@/lib/db";
import { getOpenRouterClient } from "@/lib/openrouter";
import ApiError from "@/models/api-error";
import SIOReport from "@/models/sio-report";
import {
  buildCleanContent,
  buildV2ApiData,
  mapStrengthsFromSummary,
  normalizeCategoryInsights,
  normalizeIssues,
  normalizeWebsiteSummary,
  summaryAndIssuesJsonSchema,
} from "@/services/sio-audit-v2";
import {
  generalInstructions,
  summaryAndIssuesInstruction,
} from "@/services/sio-audit-instructions/v2";
import { summaryModels } from "@/services/sio-report/ai-models";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const summaryAndIssuesSchema = z.object({
  reportId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const validation = summaryAndIssuesSchema.safeParse(body);

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

    if (report.progress !== "content_fetched") {
      return NextResponse.json(
        {
          error: "Report is not in content_fetched state",
          currentProgress: report.progress,
        },
        { status: 400 },
      );
    }

    if (!report.tempData?.simplifiedContent) {
      return NextResponse.json(
        { error: "No content available for analysis" },
        { status: 400 },
      );
    }

    const client = getOpenRouterClient();
    const cleanContent = buildCleanContent(report);

    const aiResponse = await client.chat.send({
      chatGenerationParams: {
        models: summaryModels.models,
        messages: [
          {
            role: "system",
            content: generalInstructions,
          },
          {
            role: "system",
            content: summaryAndIssuesInstruction,
          },
          {
            role: "user",
            content: `Website content to analyze:\n\n${JSON.stringify(cleanContent, null, 2)}`,
          },
          {
            role: "user",
            content:
              "Analyze this website and generate ONLY the summary-and-issues payload following the JSON schema provided.",
          },
        ],
        responseFormat: {
          type: "json_schema",
          jsonSchema: {
            name: "sio_v2_summary_and_issues",
            strict: true,
            schema: summaryAndIssuesJsonSchema,
          },
        },
        provider: summaryModels.provider,
        stream: false,
        reasoning: {
          effort: summaryModels.reasoning,
        },
      },
    });

    const aiContent = aiResponse.choices[0]?.message?.content;
    if (!aiContent) {
      throw new Error("No content returned from AI");
    }

    const aiData = JSON.parse(aiContent);
    const websiteSummary = normalizeWebsiteSummary(aiData.websiteSummary);
    const issues = normalizeIssues(aiData.issues);
    const categoryInsights = normalizeCategoryInsights(aiData.categoryInsights);
    const strengths = mapStrengthsFromSummary(websiteSummary);

    await SIOReport.findByIdAndUpdate(reportId, {
      progress: "issues_generated",
      statement: aiData.firstImpression || "",
      websiteSummaryV2: websiteSummary,
      issues,
      categoryInsights,
      strengths,
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
      nextStep: "/api/sio-audit/v2/scoring-fixes",
    });
  } catch (error: any) {
    console.error("SIO Audit V2 Summary & Issues Error:", error);

    try {
      const body = await request.json().catch(() => null);
      if (body?.reportId) {
        await SIOReport.findByIdAndUpdate(body.reportId, {
          progress: "failed",
          failedAt: "v2_summary_and_issues",
          errorMessage:
            error.message || "Unknown error during summary and issue generation",
        });
      }
    } catch {}

    const errordb = new ApiError({
      path: "/api/sio-audit/v2/summary-and-issues",
      content: JSON.stringify(error),
      metadata: {
        body: JSON.stringify(await request.json().catch(() => null)),
      },
    });
    await errordb.save();

    return NextResponse.json(
      { error: "Failed to generate summary and issues" },
      { status: 500 },
    );
  }
}

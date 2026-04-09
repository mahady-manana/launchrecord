/**
 * Step 3: Generate Summary & First Impressions
 *
 * Purpose:
 * - AI analyzes website content for understanding
 * - Extract website summary (what they do, problems, outcomes, etc.)
 * - Analyze first impressions (headline, subheadline, CTA)
 * - Store results in report document
 * - Update progress to summary_complete
 */

import { connectToDatabase } from "@/lib/db";
import { getOpenRouterClient } from "@/lib/openrouter";
import ApiError from "@/models/api-error";
import SIOReport from "@/models/sio-report";
import {
  sioV5BaseInstructions,
  step3SummaryInstructions,
} from "@/services/sio-audit-instructions";
import { sioV5JsonSchema } from "@/services/sio-v5-json-schema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const summarySchema = z.object({
  reportId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const validation = summarySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validation.error.errors },
        { status: 400 },
      );
    }

    const { reportId } = validation.data;

    // Find report
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

    // Get content from tempData
    if (!report.tempData?.simplifiedContent) {
      return NextResponse.json(
        { error: "No content available for analysis" },
        { status: 400 },
      );
    }

    // Prepare clean content for AI
    const cleanContent = {
      webcontent: report.tempData.simplifiedContent,
      jsonLd: report.tempData.ldJson,
      metadata: report.tempData.metadata,
      robotstxt: report.tempData.robotsTxt,
      sitemap: report.tempData.sitemap,
    };

    const client = getOpenRouterClient();

    // Call AI for summary and first impression analysis
    const aiResponse = await client.chat.send({
      chatGenerationParams: {
        models: [
          "x-ai/grok-4.1-fast",
          "google/gemma-4-31b-it:free",
          "qwen/qwen3.5-35b-a3b",
        ],
        messages: [
          {
            role: "system",
            content: sioV5BaseInstructions,
          },
          {
            role: "system",
            content: step3SummaryInstructions,
          },
          {
            role: "user",
            content: `Website content to analyze:\n\n${JSON.stringify(cleanContent, null, 2)}`,
          },
          {
            role: "user",
            content: `Analyze this website and generate ONLY the websiteSummary and firstImpression sections following the JSON schema provided.`,
          },
        ],
        responseFormat: {
          type: "json_schema",
          jsonSchema: {
            name: "sio_v5_summary_section",
            strict: true,
            schema: {
              type: "object",
              properties: {
                websiteSummary: sioV5JsonSchema.properties.websiteSummary,
                firstImpression: sioV5JsonSchema.properties.firstImpression,
              },
              required: ["websiteSummary", "firstImpression"],
              additionalProperties: false,
            },
          },
        },
        provider: {
          requireParameters: true,
          preferredMinThroughput: 38,
          // sort: "throughput",
        },
        stream: false,
        reasoning: {
          effort: "medium",
        },
      },
    });

    const aiContent = aiResponse.choices[0]?.message?.content;
    if (!aiContent) {
      throw new Error("No content returned from AI");
    }

    console.log(
      `[Step 3] AI Usage - Prompt: ${aiResponse.usage?.promptTokens}, Completion: ${aiResponse.usage?.completionTokens}`,
    );

    // Parse AI response
    let aiData;
    try {
      aiData = JSON.parse(aiContent);
    } catch (error) {
      throw new Error("Failed to parse AI response as JSON");
    }

    // Update report with summary and first impression
    await SIOReport.findByIdAndUpdate(reportId, {
      progress: "summary_complete",
      websiteSummary: aiData.websiteSummary,
      firstImpression: aiData.firstImpression,
    });

    return NextResponse.json({
      success: true,
      reportId,
      progress: "summary_complete",
      summary: aiData.websiteSummary.summary,
      firstImpressionScore: aiData.firstImpression.score,
      nextStep: "/api/sio-audit/steps/positioning-clarity",
    });
  } catch (error: any) {
    console.error("SIO Audit Summary Error:", error);

    try {
      const body = await request.json().catch(() => null);
      if (body?.reportId) {
        await SIOReport.findByIdAndUpdate(body.reportId, {
          progress: "failed",
          failedAt: "summary_generation",
          errorMessage:
            error.message || "Unknown error during summary generation",
        });
      }
    } catch {}

    const errordb = new ApiError({
      path: "/api/sio-audit/steps/summary",
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
      { error: "Failed to generate summary" },
      { status: 500 },
    );
  }
}

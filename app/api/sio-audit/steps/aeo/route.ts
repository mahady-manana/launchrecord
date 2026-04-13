/**
 * Step 5: AEO (Answer Engine Optimization) Visibility
 *
 * Purpose:
 * - Analyze AI engine presence and visibility
 * - Check structured data for AI readiness
 * - Assess answer engine optimization
 * - Store results in report document
 * - Update progress to aeo_complete
 */

import { connectToDatabase } from "@/lib/db";
import { getOpenRouterClient } from "@/lib/openrouter";
import ApiError from "@/models/api-error";
import SIOReport from "@/models/sio-report";
import { step5AEOInstructions } from "@/services/sio-audit-instructions";
import { generalInstructions } from "@/services/sio-audit-instructions/next";
import { aeoModels } from "@/services/sio-report/ai-models";
import { sioV5JsonSchema } from "@/services/sio-v5-json-schema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const aeoSchema = z.object({
  reportId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const validation = aeoSchema.safeParse(body);

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

    if (report.progress !== "positioning_clarity_complete") {
      return NextResponse.json(
        {
          error: "Report is not in positioning_clarity_complete state",
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
    };

    // Prepare context from ALL previous steps
    const previousContext = {
      websiteSummary: {
        summary: report.websiteSummary?.summary,
        summaryComment: report.websiteSummary?.summaryComment,
        isPositioningClear: report.websiteSummary?.isPositioningClear,
        isMessagingClear: report.websiteSummary?.isMessagingClear,
        areUsersLeftGuessing: report.websiteSummary?.areUsersLeftGuessing,
        problems: report.websiteSummary?.problems,
        outcomes: report.websiteSummary?.outcomes,
        solutions: report.websiteSummary?.solutions,
        features: report.websiteSummary?.features,
      },
      firstImpression: {
        score: report.firstImpression?.score,
        statement: report.firstImpression?.statement,
        overallCommentPositive: report.firstImpression?.overallCommentPositive,
        overallCommentNegative: report.firstImpression?.overallCommentNegative,
        headline: report.firstImpression?.headline,
        subheadline: report.firstImpression?.subheadline,
        cta: report.firstImpression?.cta,
      },
      positioning: {
        score: report.positioning?.score,
        statement: report.positioning?.statement,
        overallCommentPositive: report.positioning?.overallCommentPositive,
        overallCommentNegative: report.positioning?.overallCommentNegative,
        summary: report.positioning?.summary,
        subMetrics: report.positioning?.subMetrics,
      },
      clarity: {
        score: report.clarity?.score,
        statement: report.clarity?.statement,
        overallCommentPositive: report.clarity?.overallCommentPositive,
        overallCommentNegative: report.clarity?.overallCommentNegative,
        summary: report.clarity?.summary,
        unclearSentences: report.clarity?.unclearSentences,
      },
    };

    // Replace context placeholders in instructions
    const stepInstructions = step5AEOInstructions
      .replace(
        "{WEBSITE_SUMMARY_CONTEXT}",
        JSON.stringify(previousContext.websiteSummary, null, 2),
      )
      .replace(
        "{FIRST_IMPRESSION_CONTEXT}",
        JSON.stringify(previousContext.firstImpression, null, 2),
      )
      .replace(
        "{POSITIONING_CONTEXT}",
        JSON.stringify(previousContext.positioning, null, 2),
      )
      .replace(
        "{CLARITY_CONTEXT}",
        JSON.stringify(previousContext.clarity, null, 2),
      );

    const client = getOpenRouterClient();

    // Call AI for AEO analysis
    const aiResponse = await client.chat.send({
      chatGenerationParams: {
        models: aeoModels.models,
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
            content: `Website content to analyze:\n\n${JSON.stringify(cleanContent, null, 2)}`,
          },
          {
            role: "user",
            content: `Analyze this website's AEO visibility and generate the AEO section following the JSON schema provided.`,
          },
        ],
        responseFormat: {
          type: "json_schema",
          jsonSchema: {
            name: "sio_v5_aeo",
            strict: true,
            schema: {
              type: "object",
              properties: {
                aeo: sioV5JsonSchema.properties.aeo,
              },
              required: ["aeo"],
              additionalProperties: false,
            },
          },
        },
        provider: aeoModels.provider,
        stream: false,
        reasoning: {
          effort: aeoModels.reasoning,
        },
      },
    });

    const aiContent = aiResponse.choices[0]?.message?.content;
    if (!aiContent) {
      throw new Error("No content returned from AI");
    }

    console.log(
      `[Step 5] AI Usage - Prompt: ${aiResponse.usage?.promptTokens}, Completion: ${aiResponse.usage?.completionTokens}`,
    );

    // Parse AI response
    let aiData;
    try {
      aiData = JSON.parse(aiContent);
    } catch (error) {
      throw new Error("Failed to parse AI response as JSON");
    }

    // Update report with AEO
    await SIOReport.findByIdAndUpdate(reportId, {
      progress: "aeo_complete",
      aeo: aiData.aeo,
    });

    return NextResponse.json({
      success: true,
      reportId,
      progress: "aeo_complete",
      aeoScore: aiData.aeo.score,
      nextStep: "/api/sio-audit/steps/scoring",
    });
  } catch (error: any) {
    console.error("SIO Audit AEO Error:", error);

    try {
      const body = await request.json().catch(() => null);
      if (body?.reportId) {
        await SIOReport.findByIdAndUpdate(body.reportId, {
          progress: "failed",
          failedAt: "aeo_generation",
          errorMessage: error.message || "Unknown error during AEO generation",
        });
      }
    } catch {}

    const errordb = new ApiError({
      path: "/api/sio-audit/steps/aeo",
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
      { error: "Failed to generate AEO analysis" },
      { status: 500 },
    );
  }
}

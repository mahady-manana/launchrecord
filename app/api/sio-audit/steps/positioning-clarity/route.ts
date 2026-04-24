/**
 * Step 4: Positioning & Clarity Analysis
 *
 * Purpose:
 * - Deep AI analysis of positioning across 6 dimensions
 * - Message clarity analysis across 6 dimensions
 * - Identify unclear sentences with specific fixes
 * - Store results in report document
 * - Update progress to positioning_clarity_complete
 */

import { connectToDatabase } from "@/lib/db";
import { getOpenRouterClient } from "@/lib/openrouter";
import ApiError from "@/models/api-error";
import SIOReport from "@/models/sio-report";
import {
  generalInstructions,
  positioningClarityInstruction,
} from "@/services/sio-audit-instructions/next";
import { positioningClarityModels } from "@/services/sio-report/ai-models";
import { sioV5JsonSchema } from "@/services/sio-v5-json-schema.bkp";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const positioningClaritySchema = z.object({
  reportId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const validation = positioningClaritySchema.safeParse(body);

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

    if (report.progress !== "summary_complete") {
      return NextResponse.json(
        {
          error: "Report is not in summary_complete state",
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

    // Prepare context from previous steps
    const previousContext = {
      // websiteSummary: {
      //   overview: report.websiteSummaryV2?.overview,
      //   problems: report.websiteSummaryV2?.problems,
      //   solutions: report.websiteSummaryV2?.solutions,
      // },
      firstImpression: {
        score: report.scoring?.first_impression,
        statement: report.categoryInsights?.first_impression?.statement,
        summary: report.categoryInsights?.first_impression?.summary,
      },
    };

    // Replace context placeholders in instructions
    const stepInstructions = positioningClarityInstruction
      // .replace(
      //   "{WEBSITE_SUMMARY_CONTEXT}",
      //   JSON.stringify(previousContext.websiteSummary, null, 2),
      // )
      .replace(
        "{FIRST_IMPRESSION_CONTEXT}",
        JSON.stringify(previousContext.firstImpression, null, 2),
      );

    const client = getOpenRouterClient();

    // Call AI for positioning and clarity analysis
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
            content: stepInstructions,
          },
          {
            role: "user",
            content: `Website content to analyze:\n\n${JSON.stringify(cleanContent, null, 2)}`,
          },
          {
            role: "user",
            content: `Analyze this website and generate ONLY the positioning and clarity sections following the JSON schema provided. Be brutally honest and specific.`,
          },
        ],
        responseFormat: {
          type: "json_schema",
          jsonSchema: {
            name: "sio_v5_positioning_clarity",
            strict: true,
            schema: {
              type: "object",
              properties: {
                positioning: sioV5JsonSchema.properties.positioning,
                clarity: sioV5JsonSchema.properties.clarity,
              },
              required: ["positioning", "clarity"],
              additionalProperties: false,
            },
          },
        },
        provider: positioningClarityModels.provider,
        stream: false,
        // reasoning: {
        //   effort: positioningClarityModels.reasoning,
        // },
      },
    });

    const aiContent = aiResponse.choices[0]?.message?.content;
    if (!aiContent) {
      throw new Error("No content returned from AI");
    }

    console.log(
      `[Step 4] AI Usage - Prompt: ${aiResponse.usage?.promptTokens}, Completion: ${aiResponse.usage?.completionTokens}`,
    );

    // Parse AI response
    let aiData;
    try {
      aiData = JSON.parse(aiContent);
    } catch (error) {
      throw new Error("Failed to parse AI response as JSON");
    }

    // Update report with positioning and clarity
    await SIOReport.findByIdAndUpdate(reportId, {
      progress: "positioning_clarity_complete",
      positioning: aiData.positioning,
      clarity: aiData.clarity,
    });

    return NextResponse.json({
      success: true,
      reportId,
      progress: "positioning_clarity_complete",
      positioningScore: aiData.positioning.score,
      clarityScore: aiData.clarity.score,
      unclearSentencesCount: aiData.clarity.unclearSentences?.length || 0,
      nextStep: "/api/sio-audit/steps/aeo",
    });
  } catch (error: any) {
    console.error("SIO Audit Positioning/Clarity Error:", error);

    try {
      const body = await request.json().catch(() => null);
      if (body?.reportId) {
        await SIOReport.findByIdAndUpdate(body.reportId, {
          progress: "failed",
          failedAt: "positioning_clarity_generation",
          errorMessage:
            error.message ||
            "Unknown error during positioning/clarity generation",
        });
      }
    } catch {}

    const errordb = new ApiError({
      path: "/api/sio-audit/steps/positioning-clarity",
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
      { error: "Failed to generate positioning and clarity analysis" },
      { status: 500 },
    );
  }
}

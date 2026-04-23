import { connectToDatabase } from "@/lib/db";
import { getOpenRouterClient } from "@/lib/openrouter";
import SIOReport from "@/models/sio-report";
import {
  aeoAnalysisInstruction,
  generalInstructions,
} from "@/services/sio-audit-instructions/v2";
import {
  aeoAnalysisJsonSchema,
  buildCleanContent,
  buildV2ApiData,
  normalizeIssues,
} from "@/services/sio-audit-v2";
import { summaryModels } from "@/services/sio-report/ai-models";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const aeoAnalysisSchema = z.object({
  reportId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const validation = aeoAnalysisSchema.safeParse(body);

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

    // This step happens after issues_generated
    if (report.progress !== "issues_generated") {
      return NextResponse.json(
        {
          error: "Report is not in issues_generated state",
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
            content: aeoAnalysisInstruction,
          },
          {
            role: "user",
            content: `Website content to analyze:\n\n${JSON.stringify(cleanContent, null, 2)}`,
          },
          {
            role: "user",
            content:
              "Perform the AEO Visibility Readiness analysis. Generate ONLY the payload following the JSON schema provided. Add new issues to the existing ones if needed.",
          },
        ],
        responseFormat: {
          type: "json_schema",
          jsonSchema: {
            name: "sio_v2_aeo_analysis",
            strict: true,
            schema: aeoAnalysisJsonSchema,
          },
        },
        provider: summaryModels.provider,
        stream: false,
        reasoning: {
          effort: summaryModels.reasoning,
        },
      },
    });
    console.log("====================================");
    console.log(aiResponse.usage);
    console.log("====================================");
    const aiContent = aiResponse.choices[0]?.message?.content;
    if (!aiContent) {
      throw new Error("No content returned from AI");
    }

    const aiData = JSON.parse(aiContent);
    const newAeoIssues = normalizeIssues(aiData.issues);

    // Merge existing issues with new AEO issues
    const existingIssues = report.issues || [];
    const mergedIssues = [...existingIssues, ...newAeoIssues];

    // Update AEO category insight
    const categoryInsights = report.categoryInsights || {};
    if (aiData.categoryInsights?.aeo) {
      categoryInsights.aeo = aiData.categoryInsights.aeo;
    }

    await SIOReport.findByIdAndUpdate(reportId, {
      progress: "aeo_complete",
      issues: mergedIssues,
      categoryInsights,
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
    console.error("SIO Audit V2 AEO Analysis Error:", error);

    try {
      const body = await request.json().catch(() => null);
      if (body?.reportId) {
        await SIOReport.findByIdAndUpdate(body.reportId, {
          progress: "failed",
          failedAt: "v2_aeo_analysis",
          errorMessage:
            error.message ||
            "Unknown error during AEO visibility readiness analysis",
        });
      }
    } catch {}

    return NextResponse.json(
      { error: "Failed to perform AEO analysis" },
      { status: 500 },
    );
  }
}

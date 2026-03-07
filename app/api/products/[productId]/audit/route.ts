import { saveAnalysis } from "@/lib/analysis-service";
import { connectToDatabase } from "@/lib/db";
import { getOpenAIClient } from "@/lib/openai";
import { getUserSession } from "@/lib/session";
import Product from "@/models/product";
import Report from "@/models/report";
import { promptMasterGeneralAnalyze } from "@/reports/prompt";
import { responsesFormatter } from "@/reports/responses_formatter";
import type { AuditReportV1 } from "@/types/audit-report-v1";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

const ANALYSIS_USER_PROMPT = `Analyze this SaaS product using the Sovereign Defensibility Framework:

FOUNDER SELF-ASSESSMENT SURVEY:
- Name: {{name}}
- Website: {{website}}
- Founder: {{founder}}
- Team Size: {{teamSize}}
- Revenue Stage: {{revenue}}
- Biggest Challenge: {{challenge}}
- Product Description : {{description}}

Analyze their positioning, AEO visibility, and competitive moat. Be specific and data-driven. Don't give an emotional reports.`;

// POST - Run audit for a specific product
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    await connectToDatabase();
    const { user, response } = await getUserSession({ required: true });
    if (response) {
      return response;
    }

    const { productId } = await params;

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Verify user has access to this product
    const userId = new mongoose.Types.ObjectId(user?.id);
    if (!product.users?.some(u => u.toString() === userId.toString())) {
      return NextResponse.json(
        { error: "Unauthorized access to product" },
        { status: 403 },
      );
    }

    // Check if product already has a recent audit report (within 24 hours)
    const existingReport = await Report.findOne({
      product: productId,
      "overall_assessment.composite_score": { $exists: true },
    })
      .sort({ createdAt: -1 })
      .limit(1);

    if (existingReport) {
      const hoursSinceAudit =
        (Date.now() - existingReport.createdAt.getTime()) / (1000 * 60 * 60);
      if (hoursSinceAudit < 24) {
        // Return existing report if less than 24 hours old
        return NextResponse.json({
          success: true,
          data: {
            report: existingReport,
            analysis: {
              meta: existingReport.meta,
              aeo_index: existingReport.aeo_index,
              positioning_sharpness: existingReport.positioning_sharpness,
              clarity_velocity: existingReport.clarity_velocity,
              momentum_signal: existingReport.momentum_signal,
              founder_proof_vault: existingReport.founder_proof_vault,
              top_competitors: existingReport.top_competitors,
              overall_assessment: existingReport.overall_assessment,
              the_ego_stab: existingReport.the_ego_stab,
              category_weights: existingReport.category_weights,
            },
            existing: true,
          },
        });
      }
    }

    // Get survey data from product
    const surveyData = product.surveyData || {
      email: user?.email || "",
      founderName: user?.name || "Unknown",
      saasName: product.name || "Unknown",
      saasUrl: product.website || "",
      role: "solo-founder",
      teamSize: "just-me",
      revenue: "pre-revenue",
      biggestChallenge: "invisible-llms",
      description: product.description || "Not provided",
      willingToInvest: "49-tier",
    };

    let auditReport: AuditReportV1 | null = null;

    try {
      const client = getOpenAIClient();

      const userPrompt = ANALYSIS_USER_PROMPT.replace(
        "{{name}}",
        surveyData.saasName,
      )
        .replace("{{website}}", surveyData.saasUrl)
        .replace("{{founder}}", surveyData.founderName)
        .replace("{{teamSize}}", surveyData.teamSize)
        .replace("{{revenue}}", surveyData.revenue)
        .replace("{{challenge}}", surveyData.biggestChallenge)
        .replace("{{description}}", surveyData.description);

      const response = await client.chat.completions.create({
        model: "gpt-4o-mini-search-preview",
        messages: [
          {
            role: "system",
            content: promptMasterGeneralAnalyze,
          },
          { role: "user", content: userPrompt },
        ],
      });
      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error("No analysis content returned from OpenAI");
      }

      const formatResponse = await client.chat.completions.create({
        model: "gpt-4.1-nano",
        messages: [
          {
            role: "system",
            content: responsesFormatter,
          },
          { role: "user", content: content },
        ],
        response_format: { type: "json_object" },
      });

      const formattedContent = formatResponse.choices[0]?.message?.content;
      if (!formattedContent) {
        throw new Error("No formatted content returned from OpenAI");
      }

      auditReport = JSON.parse(formattedContent) as AuditReportV1;
    } catch (aiError: any) {
      console.error("AI analysis error:", aiError);

      // Check for capacity errors
      if (
        aiError.message?.includes("capacity") ||
        aiError.message?.includes("rate_limit") ||
        aiError.message?.includes("overloaded")
      ) {
        // Mark product for retry
        product.markModified("surveyData");
        if (!product.surveyData) {
          product.surveyData = {};
        }
        product.surveyData.retryAudit = true;
        product.surveyData.retryReason = "capacity_error";
        product.surveyData.retryAt = new Date(Date.now() + 5 * 60 * 1000);
        await product.save();

        return NextResponse.json(
          {
            error:
              "System is currently at capacity. Audit scheduled for retry.",
            retry: true,
            retryAt: product.surveyData.retryAt,
          },
          { status: 503 },
        );
      }

      throw aiError;
    }

    if (!auditReport) {
      throw new Error("Failed to generate audit report");
    }

    // Save the analysis to database
    const savedReport = await saveAnalysis({
      product,
      report: auditReport,
    });

    // Update product score
    product.score = auditReport.overall_assessment.composite_score;
    await product.save();

    return NextResponse.json({
      success: true,
      data: {
        report: savedReport,
        analysis: auditReport,
        existing: false,
      },
    });
  } catch (error: any) {
    console.error("Product audit API error:", error);

    if (
      error.message?.includes("capacity") ||
      error.message?.includes("rate_limit") ||
      error.message?.includes("overloaded")
    ) {
      return NextResponse.json(
        {
          error:
            "System is currently at capacity. We will rerun the audit automatically when it resumes.",
          retry: true,
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { error: "Failed to generate audit report" },
      { status: 500 },
    );
  }
}

// GET - Fetch latest audit for a specific product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    await connectToDatabase();
    const { user, response } = await getUserSession({ required: true });
    if (response) {
      return response;
    }

    const { productId } = await params;

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Verify user has access to this product
    const userId = new mongoose.Types.ObjectId(user?.id);
    if (!product.users?.some(u => u.toString() === userId.toString())) {
      return NextResponse.json(
        { error: "Unauthorized access to product" },
        { status: 403 },
      );
    }

    // Find latest audit report for this product
    const latestReport = await Report.findOne({
      product: productId,
      "overall_assessment.composite_score": { $exists: true },
    })
      .sort({ createdAt: -1 })
      .limit(1);

    if (!latestReport) {
      return NextResponse.json(
        { success: true, report: null, message: "No audit found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      report: latestReport,
    });
  } catch (error) {
    console.error("Get product audit API error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve audit" },
      { status: 500 },
    );
  }
}

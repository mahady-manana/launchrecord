import { saveAnalysis } from "@/lib/analysis-service";
import { connectToDatabase } from "@/lib/db";
import { getOpenAIClient } from "@/lib/openai";
import Product from "@/models/product";
import Report from "@/models/report";
import { promptMasterGeneralAnalyze } from "@/reports/prompt";
import { responsesFormatter } from "@/reports/responses_formatter";
import type { AuditReportV1 } from "@/types/audit-report-v1";
import { NextRequest, NextResponse } from "next/server";

interface SurveyData {
  email: string;
  founderName: string;
  saasName: string;
  saasUrl: string;
  role: string;
  teamSize: string;
  revenue: string;
  biggestChallenge: string;
  aeoAwareness: string;
  description: string;
  willingToInvest: string;
}

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

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 },
      );
    }

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check if product already has an audit report
    const existingReport = await Report.findOne({
      product: productId,
      "overall_assessment.composite_score": { $exists: true },
    }).sort({ createdAt: -1 });

    if (existingReport) {
      // Return existing report to prevent duplicate audits
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

    // Get survey data from product
    const surveyData: SurveyData = product.surveyData || {
      email: "",
      founderName: product.name || "Unknown",
      saasName: product.name || "Unknown",
      saasUrl: product.website || "",
      role: "solo-founder",
      teamSize: "just-me",
      revenue: "pre-revenue",
      biggestChallenge: "invisible-llms",
      aeoAwareness: "never-heard",
      description: "Not provided",
      willingToInvest: "49-tier",
    };

    // Validate survey data has email
    if (!surveyData.email) {
      return NextResponse.json(
        { error: "Email required. Please complete the survey first." },
        { status: 400 },
      );
    }

    let auditReport: AuditReportV1 | null = null;
    let errorMessage: string | null = null;

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
        errorMessage =
          "System is currently at capacity. We will rerun the audit automatically when it resumes.";

        // Mark product for retry
        product.markModified("surveyData");
        if (!product.surveyData) {
          product.surveyData = {};
        }
        product.surveyData.retryAudit = true;
        product.surveyData.retryReason = "capacity_error";
        product.surveyData.retryAt = new Date(Date.now() + 5 * 60 * 1000); // Retry in 5 minutes
        await product.save();

        return NextResponse.json(
          {
            error: errorMessage,
            retry: true,
            retryAt: product.surveyData.retryAt,
          },
          { status: 503 },
        );
      }

      // For other errors, throw to be caught by outer catch
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

    return NextResponse.json({
      success: true,
      data: {
        report: savedReport,
        analysis: auditReport,
        existing: false,
      },
    });
  } catch (error: any) {
    console.error("Audit API error:", error);

    // Handle capacity errors
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

// GET endpoint to check audit status
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const productId = request.nextUrl.searchParams.get("productId");
    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 },
      );
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check if product has an existing audit
    const existingReport = await Report.findOne({
      product: productId,
      "overall_assessment.composite_score": { $exists: true },
    }).sort({ createdAt: -1 });

    if (existingReport) {
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

    // Check if retry is scheduled
    const retryScheduled = product.surveyData?.retryAudit;
    if (retryScheduled) {
      return NextResponse.json({
        success: true,
        retry: true,
        retryAt: product.surveyData?.retryAt,
        message: "Audit is scheduled for retry",
      });
    }

    return NextResponse.json({
      success: true,
      audited: false,
      message: "No audit found for this product",
    });
  } catch (error) {
    console.error("Get audit API error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve audit" },
      { status: 500 },
    );
  }
}

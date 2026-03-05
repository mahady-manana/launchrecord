import { saveAnalysis } from "@/lib/analysis-service";
import { connectToDatabase } from "@/lib/db";
import { getOpenAIClient } from "@/lib/openai";
import Product from "@/models/product";
import { promptMasterGeneralAnalyze } from "@/reports/prompt";
import { responsesFormatter } from "@/reports/responses_formatter";
import type { AuditReportV1 } from "@/types/audit-report-v1";
import { NextRequest, NextResponse } from "next/server";

const ANALYSIS_USER_PROMPT = (
  data: any,
) => `Analyze this SaaS product using the Sovereign Defensibility Framework:

PRODUCT INFORMATION:
- Name: {{name}}
- Website: {{website}}
- Tagline: {{tagline}}
- Description: {{description}}

VERIFIED PRODUCVT HUNT INFO (Only verified data will be presented here):
- Votes: ${data.votes || "Not provided"}
- Daily rank: ${data.phDayrank || "Not provided"}
- Reviews: ${data.phReviews || "Not provided"}
- Reviews rating: ${data.phRating || "Not provided"}
- Comments count: ${data.phComments || "Not provided"}

Analyze their Positioning, AEO visibility, Product Clarity, Momentum, Founder Proof Vault and Competitive moat. Be specific and data-driven. Don't give emotional reports.`;

// POST - Run audit on existing product by ID
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

    // Run the audit
    let auditReport: AuditReportV1 | null = null;

    try {
      const client = getOpenAIClient();

      const surveyData = product.surveyData || {};
      const userPrompt = ANALYSIS_USER_PROMPT(product.metadata || {})
        .replace("{{name}}", product.name)
        .replace("{{website}}", product.website || "")
        .replace("{{tagline}}", product.tagline || "Not provided")
        .replace(
          "{{description}}",
          product.description || surveyData.description || "Not provided",
        );

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

      if (
        aiError.message?.includes("capacity") ||
        aiError.message?.includes("rate_limit") ||
        aiError.message?.includes("overloaded")
      ) {
        return NextResponse.json(
          {
            error: "System is at capacity. Please try again in a few minutes.",
            retry: true,
          },
          { status: 503 },
        );
      }

      throw aiError;
    }

    if (!auditReport) {
      throw new Error("Failed to generate audit report");
    }

    // Save/update the analysis
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
        productId: product._id,
        report: savedReport,
        analysis: auditReport,
      },
    });
  } catch (error: any) {
    console.error("Audit API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate audit report" },
      { status: 500 },
    );
  }
}

// POST bulk audits - run audits on multiple product IDs sequentially
export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { productIds } = body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { error: "productIds array is required" },
        { status: 400 },
      );
    }

    // Return the list of products to audit (frontend will process queue)
    const products = await Product.find({
      _id: { $in: productIds },
    }).select("_id name website tagline description surveyData");

    return NextResponse.json({
      success: true,
      data: {
        products: products.map((p) => ({
          productId: p._id.toString(),
          name: p.name,
          website: p.website,
          tagline: p.tagline,
          description: p.description || p.surveyData?.description,
        })),
      },
    });
  } catch (error: any) {
    console.error("Bulk audit setup error:", error);
    return NextResponse.json(
      { error: "Failed to setup bulk audit" },
      { status: 500 },
    );
  }
}

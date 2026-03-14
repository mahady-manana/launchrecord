import { saveAnalysis } from "@/lib/analysis-service";
import { connectToDatabase } from "@/lib/db";
import Product from "@/models/product";
import { fullAuditWithOpenAI } from "@/services/full_audit_with_openai";
import type { AuditReportV1 } from "@/types/audit-report-v1";
import { NextRequest, NextResponse } from "next/server";

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

    // Run the audit using fullAuditWithOpenAI service
    let auditReport: AuditReportV1 | null = null;

    try {
      const surveyData = product.surveyData || {};
      
      const response = await fullAuditWithOpenAI({
        description: surveyData.description || product.description || "Not provided",
        tagline: surveyData.tagline || product.tagline || "Not provided",
        name: surveyData.saasName || product.name || "Unknown",
        website: surveyData.saasUrl || product.website || "",
        founder: surveyData.founderName || "Unknown",
        revenueStage: surveyData.revenue || "pre-revenue",
      });

      if (!response) {
        throw new Error("No formatted content returned from OpenAI");
      }

      auditReport = JSON.parse(response) as AuditReportV1;
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

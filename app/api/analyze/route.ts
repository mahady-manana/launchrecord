import { saveAnalysis } from "@/lib/analysis-service";
import { connectToDatabase } from "@/lib/db";
import { analyzeProduct } from "@/lib/product-analysis";
import Product from "@/models/product";
import { NextRequest, NextResponse } from "next/server";

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
    const product = await Product.findById(productId).populate("topics");

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Run the AI analysis (returns AuditReportV1)
    const report = await analyzeProduct(product);

    // Save the analysis to database
    const savedReport = await saveAnalysis({
      product,
      report,
    });

    return NextResponse.json({
      success: true,
      data: {
        report: savedReport,
        analysis: report,
      },
    });
  } catch (error) {
    console.error("Analysis API error:", error);

    if (error instanceof Error) {
      if (error.message.includes("OPENAI_API_KEY")) {
        return NextResponse.json(
          { error: "OpenAI API key not configured" },
          { status: 500 },
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to analyze product" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 },
      );
    }

    const product = await Product.findById(productId).populate("topics");

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Run the AI analysis (returns AuditReportV1)
    const report = await analyzeProduct(product);

    return NextResponse.json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.trace("Analysis API error:", error);
    return NextResponse.json(
      { error: "Failed to analyze product" },
      { status: 500 },
    );
  }
}

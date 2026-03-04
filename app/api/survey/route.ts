import { connectToDatabase } from "@/lib/db";
import Product from "@/models/product";
import { NextRequest, NextResponse } from "next/server";
import normalizeUrl from "normalize-url";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    let { saasName, saasUrl, founderName } = body;

    // Validate required fields
    if (!saasName || !saasUrl) {
      return NextResponse.json(
        { error: "Product name and URL are required" },
        { status: 400 },
      );
    }

    const normalizedUrl = normalizeUrl(saasUrl);
    // Check if product with this domain already exists
    const existingProduct = await Product.findOne({
      website: normalizedUrl,
    });

    if (existingProduct) {
      // Return existing product instead of creating duplicate
      return NextResponse.json({
        message: "Audit already exists for this product",
        productId: existingProduct._id,
        existing: true,
      });
    }

    // Create incomplete product with early access flag
    const product = await Product.create({
      name: saasName,
      website: normalizedUrl, // Store normalized URL
      description: null,
      tagline: null,
      logo: null,
      user: null,
      score: null,
      earlyAccess: true,
      earlyAccessGrantedAt: new Date(),
      surveyData: {
        founderName,
        saasName,
        saasUrl: normalizedUrl,
        ...body,
      },
    });

    return NextResponse.json({
      message: "Survey started successfully",
      productId: product._id,
      existing: false,
    });
  } catch (error) {
    console.error("Survey API error:", error);
    return NextResponse.json(
      { error: "Failed to start survey" },
      { status: 500 },
    );
  }
}

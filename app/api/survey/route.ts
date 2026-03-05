import { connectToDatabase } from "@/lib/db";
import Product from "@/models/product";
import { NextRequest, NextResponse } from "next/server";
import normalizeUrl from "normalize-url";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    let { saasName, saasUrl, founderName, productId } = body;

    // Validate required fields
    if (!saasUrl) {
      return NextResponse.json(
        { error: "Product URL is required" },
        { status: 400 },
      );
    }

    const normalizedUrl = normalizeUrl(saasUrl);

    // If productId is provided (from claim flow), use that product
    if (productId) {
      const existingProduct = await Product.findById(productId);
      if (existingProduct) {
        // Update product with survey data
        existingProduct.surveyData = {
          ...(existingProduct.surveyData || {}),
          founderName: founderName || existingProduct.surveyData?.founderName,
          saasName: saasName || existingProduct.name,
          saasUrl: normalizedUrl,
          ...body,
        };
        existingProduct.markModified("surveyData");
        await existingProduct.save();

        return NextResponse.json({
          message: "Survey started successfully",
          productId: existingProduct._id,
          existing: true,
          requiresClaim: false,
        });
      }
    }

    // Check if product with this domain already exists
    const existingProduct = await Product.findOne({
      website: normalizedUrl,
    });

    if (existingProduct) {
      // Check if it's admin-owned and needs claim
      if (existingProduct.addedByAdmin && !existingProduct.user) {
        return NextResponse.json({
          message: "Product exists and requires claim",
          productId: existingProduct._id,
          existing: true,
          requiresClaim: true,
          productName: existingProduct.name,
          productWebsite: existingProduct.website,
        });
      }

      // Return existing product (already claimed by user)
      return NextResponse.json({
        message: "Audit already exists for this product",
        productId: existingProduct._id,
        existing: true,
        requiresClaim: false,
      });
    }

    // Create incomplete product with early access flag
    const product = await Product.create({
      name: saasName || "Unknown",
      website: normalizedUrl,
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
      requiresClaim: false,
    });
  } catch (error) {
    console.error("Survey API error:", error);
    return NextResponse.json(
      { error: "Failed to start survey" },
      { status: 500 },
    );
  }
}

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

    // Check if product with this domain already exists
    const existingProduct = await Product.findOne({
      website: normalizedUrl,
    });

    if (existingProduct) {
      // Check if it's already claimed by a user (not admin)
      if (existingProduct.user && !existingProduct.addedByAdmin) {
        return NextResponse.json(
          {
            error:
              "This product has already been claimed by another user. You cannot continue with this product URL.",
            alreadyClaimed: true,
            productId: existingProduct._id,
            productName: existingProduct.name,
          },
          { status: 400 },
        );
      }

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

      // Product exists but not claimed (no user, not added by admin) - let them cook
      // Or product exists with user but also added by admin (edge case)
      return NextResponse.json({
        message: "Survey already exists for this product",
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

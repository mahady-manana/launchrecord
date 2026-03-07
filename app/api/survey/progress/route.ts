import { connectToDatabase } from "@/lib/db";
import Product from "@/models/product";
import { NextRequest, NextResponse } from "next/server";
import normalizeUrl from "normalize-url";

// Save survey progress
export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { productId, answers } = body;

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

    // Initialize surveyData if it doesn't exist
    if (!product.surveyData) {
      product.surveyData = {};
    }

    // Merge answers into surveyData
    Object.keys(answers).forEach((key) => {
      product.surveyData![key] = answers[key as keyof typeof answers];
    });

    // Update product fields from survey answers
    if (answers.saasName) {
      product.name = answers.saasName;
    }
    if (answers.saasUrl) {
      product.website = normalizeUrl(answers.saasUrl, {
        forceHttps: true,
        stripWWW: false,
      });
    }
    if (answers.description) {
      product.tagline = answers.description;
      product.description = answers.description;
    }

    // Mark surveyData as modified to ensure Mongoose saves it
    product.markModified("surveyData");

    await product.save();

    return NextResponse.json({
      success: true,
      message: "Progress saved",
    });
  } catch (error) {
    console.error("Error saving progress:", error);
    return NextResponse.json(
      { error: "Failed to save progress" },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Product from "@/models/product";

// Save survey progress
export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { productId, answers } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Update survey data progressively
    product.surveyData = {
      ...(product.surveyData || {}),
      ...answers,
      lastUpdated: new Date(),
    };
    
    await product.save();

    return NextResponse.json({
      success: true,
      message: "Progress saved",
    });
  } catch (error) {
    console.error("Error saving progress:", error);
    return NextResponse.json(
      { error: "Failed to save progress" },
      { status: 500 }
    );
  }
}

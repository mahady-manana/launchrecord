import { connectToDatabase } from "@/lib/db";
import { getUserSession } from "@/lib/session";
import Product from "@/models/product";
import { NextRequest, NextResponse } from "next/server";

// Complete survey with email (called after user signs up/logs in)
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    // Get current user session
    const { user, response } = await getUserSession();

    if (response) {
      return response;
    }
    const userEmail = user?.email;

    const body = await request.json();
    const { productId, email } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 },
      );
    }

    // Use session email if available, otherwise require email parameter
    const finalEmail = userEmail || email;
    if (!finalEmail) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Get survey data from product
    const surveyData = product.surveyData || {};

    // Add user to owners array if not already present
    if (!product.users) {
      product.users = [];
    }
    const isAlreadyOwner = product.users.some((u: any) => u.toString() === user?.id);
    if (!isAlreadyOwner) {
      product.users.push(user?.id as any);
    }
    product.surveyData = {
      ...surveyData,
      email: finalEmail,
      completed: true,
      completedAt: new Date(),
    };
    await product.save();

    return NextResponse.json({
      success: true,
      message: "Survey completed",
      productId: product._id,
      userId: user?._id as any,
    });
  } catch (error) {
    console.error("Error completing survey:", error);
    return NextResponse.json(
      { error: "Failed to complete survey" },
      { status: 500 },
    );
  }
}

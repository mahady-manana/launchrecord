import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/user";
import Product from "@/models/product";

// Complete survey with email
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { productId, email } = body;

    if (!productId || !email) {
      return NextResponse.json(
        { error: "Product ID and email are required" },
        { status: 400 }
      );
    }

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Get survey data from product
    const surveyData = product.surveyData || {};

    // Find or create user with email
    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      // Update existing user
      user.founderName = surveyData.founderName || user.founderName;
      user.saasName = surveyData.saasName || user.saasName;
      user.surveyData = { ...surveyData, email };
      user.whitelisted = true;
      user.earlyAccess = true;
      user.earlyAccessGrantedAt = new Date();
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        email: email.toLowerCase(),
        name: surveyData.founderName || "User",
        founderName: surveyData.founderName,
        saasName: surveyData.saasName,
        surveyData: { ...surveyData, email },
        whitelisted: true,
        earlyAccess: true,
        earlyAccessGrantedAt: new Date(),
        provider: "credentials",
        role: "user",
        password: "",
      });
    }

    // Update product with user reference and email
    product.user = user._id;
    product.surveyData = {
      ...surveyData,
      email,
      completed: true,
      completedAt: new Date(),
    };
    await product.save();

    return NextResponse.json({
      success: true,
      message: "Survey completed",
      productId: product._id,
      userId: user._id,
    });
  } catch (error) {
    console.error("Error completing survey:", error);
    return NextResponse.json(
      { error: "Failed to complete survey" },
      { status: 500 }
    );
  }
}

import { connectToDatabase } from "@/lib/db";
import { generateUniqueSlug } from "@/lib/utils";
import Product from "@/models/product";
import { Types } from "mongoose";
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

    // Update product fields from survey answers

    if (answers.website) {
      product.website = normalizeUrl(answers.website, {
        forceHttps: true,
        stripWWW: false,
        defaultProtocol: "https",
      });
    }
    if (answers.tagline) {
      product.tagline = (answers.tagline as string)?.slice(0, 79);
    }
    if (answers.description) {
      product.description = answers.description;
    }
    if (answers.logo) {
      product.logo = answers.logo;
    }

    // Handle topics - find or create and associate
    if (answers.topics && Array.isArray(answers.topics)) {
      product.topics = answers.topics || [];
    }

    if (answers.name) {
      product.name = answers.name;
    }
    if (answers.name) {
      const slug = await generateUniqueSlug(answers.name, async (slug) => {
        const existing = await Product.findOne({
          slug,
          _id: { $ne: new Types.ObjectId(productId) },
        });
        return !!existing;
      });
      product.slug = slug;
    }
    // Merge surveyData (founder info, etc.)
    if (answers.surveyData) {
      Object.keys(answers.surveyData).forEach((key) => {
        product.surveyData![key] = answers.surveyData[key];
      });
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

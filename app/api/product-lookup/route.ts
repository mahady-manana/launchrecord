import { connectToDatabase } from "@/lib/db";
import { getGrade } from "@/lib/utils";
import Product from "@/models/product";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const website = request.nextUrl.searchParams.get("website");

    if (!website) {
      return NextResponse.json(
        { error: "Website parameter is required" },
        { status: 400 },
      );
    }

    const product = await Product.findOne({
      slug: website,
    })
      .populate("topics")
      .lean();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Get rank
    const scoredProducts = await Product.find({ score: { $ne: null } })
      .sort({ score: -1 })
      .select("_id");

    const rank = scoredProducts.findIndex(
      (p) => p._id.toString() === product._id.toString(),
    );

    const responseData = {
      id: product._id.toString(),
      name: product.name,
      tagline: product.tagline,
      description: product.description,
      logo: product.logo,
      website: product.website,
      score: product.score ?? 0,
      grade: getGrade(product.score),
      topics: product.topics || [],
      slug: product.slug,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      rank: rank >= 0 ? rank + 1 : null,
    };

    return NextResponse.json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error("Product lookup error:", error);
    return NextResponse.json(
      { error: "Failed to lookup product" },
      { status: 500 },
    );
  }
}

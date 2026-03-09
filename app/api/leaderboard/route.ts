import { connectToDatabase } from "@/lib/db";
import Product from "@/models/product";
import Topic from "@/models/topic";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "100");
    const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    const tn = Topic.name;
    // Get products sorted by score (descending), with null scores at the end
    const products = await Product.find({})
      .sort({ score: -1, name: 1 })
      .skip(skip)
      .limit(limit)
      .select("name tagline website score createdAt logo slug")
      .populate("topics");

    // Get total count for pagination
    const total = await Product.countDocuments({});

    // Calculate rank for each product (only for scored products)
    const scoredProducts = await Product.find({ score: { $ne: null } })
      .sort({ score: -1 })
      .select("_id score");

    const rankMap = new Map();
    scoredProducts.forEach((product, index) => {
      rankMap.set(product._id.toString(), index + 1);
    });

    const productsWithRank = products.map((product) => ({
      _id: product._id.toString(),
      name: product.name,
      tagline: product.tagline,
      website: product.website,
      score: product.score,
      logo: product.logo,
      rank: rankMap.get(product._id.toString()) || null,
      topics: product.topics || [],
      slug: product.slug,
    }));

    return NextResponse.json({
      success: true,
      data: {
        products: productsWithRank,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Leaderboard API error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve leaderboard" },
      { status: 500 },
    );
  }
}

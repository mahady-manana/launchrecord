import { connectToDatabase } from "@/lib/db";
import Product from "@/models/product";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    if (query.length < 2) {
      return NextResponse.json({
        success: true,
        products: [],
      });
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { tagline: { $regex: query, $options: "i" } },
      ],
    })
      .limit(20)
      .lean();

    const transformedProducts = products.map((product) => ({
      _id: product._id.toString(),
      id: product._id.toString(),
      name: product.name,
      tagline: product.tagline,
      logo: product.logo,
      slug: product.slug,
      score: product.score,
    }));

    return NextResponse.json({
      success: true,
      products: transformedProducts,
    });
  } catch (error) {
    console.error("Error searching products:", error);
    return NextResponse.json(
      { error: "Failed to search products" },
      { status: 500 },
    );
  }
}

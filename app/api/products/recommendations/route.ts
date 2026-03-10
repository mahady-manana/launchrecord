import { connectToDatabase } from "@/lib/db";
import Product from "@/models/product";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const currentSlug = searchParams.get("slug");

    let products: any[] = [];

    if (type === "similar") {
      // Fetch 30 products, will shuffle and show 10 on client
      products = await Product.find({
        _id: { $ne: currentSlug },
        score: { $ne: null },
      })
        .sort({ score: -1 })
        .limit(30)
        .lean();
    } else if (type === "new") {
      // Fetch 30 newest products
      products = await Product.find({
        _id: { $ne: currentSlug },
        score: { $ne: null },
      })
        .sort({ createdAt: -1 })
        .limit(30)
        .lean();
    } else if (type === "top") {
      // Fetch 30 top products by score
      products = await Product.find({
        _id: { $ne: currentSlug },
        score: { $ne: null },
      })
        .sort({ score: -1 })
        .limit(30)
        .lean();
    }

    // Transform products for client
    const transformedProducts = products.map((product) => ({
      _id: product._id.toString(),
      id: product._id.toString(),
      name: product.name,
      description: product.description,
      tagline: product.tagline,
      logo: product.logo,
      website: product.website,
      score: product.score,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
      slug: product.slug,
    }));

    return NextResponse.json({
      products: transformedProducts,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

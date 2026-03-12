import { connectToDatabase } from "@/lib/db";
import Product from "@/models/product";
import { NextRequest, NextResponse } from "next/server";

/**
 * API endpoint for sitemap product data
 * Optimized for fetching large datasets (10k+ products)
 * Returns only slug and updatedAt for sitemap generation
 * Uses cursor-based pagination for optimal performance
 */
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "0");
    const limit = parseInt(searchParams.get("limit") || "1000");
    const cursor = searchParams.get("cursor");

    // Validate limit to prevent excessive loads
    const validatedLimit = Math.min(Math.max(limit, 1), 5000);

    const query: Record<string, any> = {
      deletedAt: null,
      slug: { $ne: null },
    };

    // Cursor-based pagination (recommended for large datasets)
    if (cursor) {
      query.slug = { $gt: decodeURIComponent(cursor) };
    }

    // Get total count for pagination info (optimized with index)
    const total = await Product.countDocuments(query);

    // Calculate skip value based on page
    const skipValue = page * validatedLimit;

    // Build query with proper pagination: sort -> skip -> limit
    const products = await Product.find(query)
      .select("slug updatedAt")
      .sort({ slug: 1 })
      .skip(skipValue)
      .limit(validatedLimit)
      .lean()
      .maxTimeMS(30000); // 30 second timeout

    const hasMore = products.length === validatedLimit;
    const nextCursor = hasMore ? products[products.length - 1].slug : null;
    const nextPage = hasMore ? page + 1 : null;

    return NextResponse.json({
      success: true,
      data: products.map((p) => ({
        slug: p.slug,
        updatedAt: p.updatedAt?.toISOString() ?? new Date().toISOString(),
      })),
      pagination: {
        page,
        limit: validatedLimit,
        total,
        hasMore,
        nextCursor: nextCursor ? encodeURIComponent(nextCursor) : null,
        nextPage,
      },
    });
  } catch (error) {
    console.error("Error fetching sitemap products:", error);
    return NextResponse.json(
      { error: "Failed to fetch sitemap products", success: false },
      { status: 500 },
    );
  }
}

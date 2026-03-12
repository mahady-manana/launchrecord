import { connectToDatabase } from "@/lib/db";
import Topic from "@/models/topic";
import { NextRequest, NextResponse } from "next/server";

/**
 * API endpoint for sitemap topic data
 * Optimized for fetching large datasets
 * Returns only topic_slug and updatedAt for sitemap generation
 * Uses cursor-based pagination for optimal performance
 */
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "0");
    const limit = parseInt(searchParams.get("limit") || "500");
    const cursor = searchParams.get("cursor");

    // Validate limit to prevent excessive loads
    const validatedLimit = Math.min(Math.max(limit, 1), 2000);

    const query: Record<string, any> = {
      topic_slug: { $ne: null },
    };

    // Cursor-based pagination (recommended for large datasets)
    if (cursor) {
      query.topic_slug = { $gt: decodeURIComponent(cursor) };
    }

    // Get total count for pagination info (optimized with index)
    const total = await Topic.countDocuments(query);

    // Calculate skip value based on page
    const skipValue = page * validatedLimit;

    // Build query with proper pagination: sort -> skip -> limit
    const topics = await Topic.find(query)
      .select("topic_slug updatedAt")
      .sort({ topic_slug: 1 })
      .skip(skipValue)
      .limit(validatedLimit)
      .lean()
      .maxTimeMS(30000); // 30 second timeout

    const hasMore = topics.length === validatedLimit;
    const nextCursor = hasMore ? topics[topics.length - 1].topic_slug : null;
    const nextPage = hasMore ? page + 1 : null;

    return NextResponse.json({
      success: true,
      data: topics.map((t) => ({
        topic_slug: t.topic_slug,
        updatedAt: t.updatedAt?.toISOString() ?? new Date().toISOString(),
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
    console.error("Error fetching sitemap topics:", error);
    return NextResponse.json(
      { error: "Failed to fetch sitemap topics", success: false },
      { status: 500 },
    );
  }
}

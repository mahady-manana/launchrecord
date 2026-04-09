import { connectToDatabase } from "@/lib/db";
import { getGrade } from "@/lib/utils";
import Product from "@/models/product";
import Topic from "@/models/topic";
import { jsonError, jsonSuccess } from "@/utils/response";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  await connectToDatabase();

  // Find topic by slug
  const topic = await Topic.findOne({ topic_slug: slug });

  if (!topic) {
    return jsonError("Category not found", 404);
  }

  const skip = (page - 1) * limit;

  // Get total count using aggregation
  const totalCountResult = await Product.aggregate([
    {
      $match: {
        topics: { $in: [topic._id] },
        deletedAt: null,
      },
    },
    {
      $count: "total",
    },
  ]);

  const totalProducts = totalCountResult[0]?.total || 0;

  // Get products for current page, sorted by score
  const products = await Product.aggregate([
    {
      $match: {
        topics: { $in: [topic._id] },
        deletedAt: null,
      },
    },
    {
      $sort: { score: -1 },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
    {
      $lookup: {
        from: "topics",
        localField: "topics",
        foreignField: "_id",
        as: "topics",
      },
    },
  ]);

  // Calculate total pages
  const totalPages = Math.ceil(totalProducts / limit);

  // Add ranking and grade to each product
  const rankedProducts = products.map((product: any, index: number) => ({
    id: product._id.toString(),
    name: product.name,
    tagline: product.tagline,
    description: product.description,
    logo: product.logo,
    website: product.website,
    score: product.score || 0,
    grade: getGrade(product.score),
    rank: skip + index + 1, // Global rank across all pages
    topics: product.topics,
    createdAt: product.createdAt,
    slug: product.slug,
  }));

  // Get topic stats
  const avgScore =
    totalProducts > 0
      ? Math.round(
          products.reduce((sum: number, p: any) => sum + (p.score || 0), 0) /
            products.length,
        )
      : 0;

  return jsonSuccess({
    data: {
      topic: {
        id: topic._id.toString(),
        name: topic.name,
        slug: topic.topic_slug,
        short_description: topic.short_description,
        description: topic.description,
      },
      stats: {
        totalProducts,
        avgScore,
      },
      products: rankedProducts,
      pagination: {
        page,
        limit,
        pages: totalPages,
        totalProducts,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    },
  });
}

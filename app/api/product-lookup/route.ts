import { connectToDatabase } from "@/lib/db";
import Product from "@/models/product";
import Report from "@/models/report";
import { jsonError, jsonSuccess } from "@/utils/response";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const website = searchParams.get("website");

  if (!website) {
    return jsonError("Website parameter is required", 400);
  }

  await connectToDatabase();

  // Decode the website URL
  const decodedWebsite = decodeURIComponent(website);

  // Find product by website URL
  const product = await Product.findOne({
    slug: decodedWebsite,
    deletedAt: null,
  })
    .populate("topics")
    .lean();

  if (!product) {
    return jsonError("Product not found", 404);
  }

  // Get the latest report for this product
  const latestReport = await Report.findOne({
    productId: product._id,
  })
    .sort({ createdAt: -1 })
    .lean();

  // Get all reports for historical data
  const allReports = await Report.find({
    productId: product._id,
  })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  // Calculate rank in leaderboard
  const totalProducts = await Product.countDocuments({
    deletedAt: null,
    score: { $gte: product.score || 0 },
  });

  // Format the response
  const productData = {
    id: product._id.toString(),
    name: product.name,
    tagline: product.tagline,
    description: product.description,
    logo: product.logo,
    website: product.website,
    score: product.score || 0,
    topics: product.topics || [],
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    latestReport: latestReport || null,
    historicalReports: allReports.map((r: any) => ({
      id: r._id.toString(),
      score: r.overall_assessment?.composite_score || 0,
      createdAt: r.createdAt,
    })),
    rank: totalProducts,
  };

  return jsonSuccess({
    data: productData,
  });
}

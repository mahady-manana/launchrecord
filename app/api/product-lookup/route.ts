import { connectToDatabase } from "@/lib/db";
import Product from "@/models/product";
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
  };

  return jsonSuccess({
    data: productData,
  });
}

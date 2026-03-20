import { connectToDatabase } from "@/lib/db";
import { getUserSession } from "@/lib/session";
import { generateUniqueSlug } from "@/lib/utils";
import Product from "@/models/product";
import Topic from "@/models/topic";
import { NextRequest, NextResponse } from "next/server";
import normalizeUrl from "normalize-url";

// GET - Fetch all products for the current user
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { user, response } = await getUserSession({ required: true });
    if (response) {
      return response;
    }

    // Find all products where user is in the users array
    const products = await Product.find({
      users: user?.id,
    })
      .sort({ createdAt: -1 })
      .populate("topics", "", Topic)
      .lean();

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
      earlyAccess: product.earlyAccess,
      addedByAdmin: product.addedByAdmin,
      surveyData: product.surveyData,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
      topics: product.topics,
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

// POST - Create a new product
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const { user, response } = await getUserSession({ required: true });
    if (response) {
      return response;
    }

    const body = await request.json();
    const { name, website, description, tagline } = body;

    if (!name || !website) {
      return NextResponse.json(
        { error: "Name and website are required" },
        { status: 400 },
      );
    }

    // Check if product already exists with this normalized URL
    const normalizedUrl = normalizeUrl(website);
    const existingProduct = await Product.findOne({
      website: normalizedUrl,
    });

    if (existingProduct) {
      // Product already exists, don't create duplicate
      return NextResponse.json(
        {
          error: "Product with this URL already exists",
          existingProductId: existingProduct._id.toString(),
          existingProductName: existingProduct.name,
        },
        { status: 409 },
      );
    }

    // Generate unique slug from product name
    const slug = await generateUniqueSlug(name, async (slug) => {
      const existing = await Product.findOne({ slug });
      return !!existing;
    });

    const product = await Product.create({
      name,
      website: normalizedUrl,
      description: description || null,
      tagline: tagline || null,
      logo: null,
      users: user?.id ? [user.id] : [],
      score: null,
      earlyAccess: true,
      earlyAccessGrantedAt: new Date(),
      addedByAdmin: false,
      surveyData: null,
      slug,
    });

    return NextResponse.json({
      product: {
        _id: product._id.toString(),
        id: product._id.toString(),
        name: product.name,
        description: product.description,
        tagline: product.tagline,
        logo: product.logo,
        website: product.website,
        score: product.score,
        earlyAccess: product.earlyAccess,
        addedByAdmin: product.addedByAdmin,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}

import { connectToDatabase } from "@/lib/db";
import { getUserSession } from "@/lib/session";
import Product from "@/models/product";
import { NextRequest, NextResponse } from "next/server";

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

    const product = await Product.create({
      name,
      website,
      description: description || null,
      tagline: tagline || null,
      logo: null,
      users: user?.id ? [user.id] : [],
      score: null,
      earlyAccess: true,
      earlyAccessGrantedAt: new Date(),
      addedByAdmin: false,
      surveyData: null,
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

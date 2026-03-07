import { connectToDatabase } from "@/lib/db";
import { getUserSession } from "@/lib/session";
import Product from "@/models/product";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// PUT - Update product information
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    await connectToDatabase();
    const { user, response } = await getUserSession({ required: true });
    if (response) return response;

    const { productId } = await params;
    const updates = await request.json();

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Verify user has access to this product
    const userId = new mongoose.Types.ObjectId(user?.id);
    if (!product.users?.some((u: any) => u.toString() === userId.toString())) {
      return NextResponse.json(
        { error: "Unauthorized access to product" },
        { status: 403 },
      );
    }

    // Update allowed fields
    const allowedFields = ["name", "tagline", "description", "website", "logo"];
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        (product as any)[field] = updates[field];
      }
    }

    await product.save();

    return NextResponse.json({
      success: true,
      product: {
        _id: product._id.toString(),
        id: product._id.toString(),
        name: product.name,
        tagline: product.tagline,
        description: product.description,
        website: product.website,
        logo: product.logo,
        score: product.score,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 },
    );
  }
}

// GET - Get product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    await connectToDatabase();
    const { user, response } = await getUserSession({ required: true });
    if (response) return response;

    const { productId } = await params;

    const product = await Product.findById(productId).lean();
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Verify user has access
    const userId = new mongoose.Types.ObjectId(user?.id);
    if (!product.users?.some((u: any) => u.toString() === userId.toString())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 },
      );
    }

    return NextResponse.json({
      success: true,
      product: {
        _id: product._id.toString(),
        id: product._id.toString(),
        name: product.name,
        tagline: product.tagline,
        description: product.description,
        website: product.website,
        logo: product.logo,
        score: product.score,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 },
    );
  }
}

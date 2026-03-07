import { connectToDatabase } from "@/lib/db";
import { getUserSession } from "@/lib/session";
import Product from "@/models/product";
import Topic from "@/models/topic";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// GET - Fetch product topics
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    await connectToDatabase();
    const { user, response } = await getUserSession({ required: true });
    if (response) return response;

    const { productId } = await params;

    const product = await Product.findById(productId)
      .populate("topics")
      .lean();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const userId = new mongoose.Types.ObjectId(user?.id);
    if (!product.users?.some((u: any) => u.toString() === userId.toString())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 },
      );
    }

    return NextResponse.json({
      success: true,
      topics: product.topics || [],
    });
  } catch (error) {
    console.error("Error fetching product topics:", error);
    return NextResponse.json(
      { error: "Failed to fetch topics" },
      { status: 500 },
    );
  }
}

// POST - Add topic to product
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    await connectToDatabase();
    const { user, response } = await getUserSession({ required: true });
    if (response) return response;

    const { productId } = await params;
    const { topicId } = await request.json();

    if (!topicId) {
      return NextResponse.json(
        { error: "Topic ID is required" },
        { status: 400 },
      );
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const userId = new mongoose.Types.ObjectId(user?.id);
    if (!product.users?.some((u: any) => u.toString() === userId.toString())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 },
      );
    }

    // Check if product already has 3 topics
    if (product.topics && product.topics.length >= 3) {
      return NextResponse.json(
        { error: "Maximum 3 topics allowed" },
        { status: 400 },
      );
    }

    const topic = await Topic.findById(topicId);
    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    // Check if topic already added
    if (product.topics?.some((t: any) => t.toString() === topicId)) {
      return NextResponse.json(
        { error: "Topic already added" },
        { status: 400 },
      );
    }

    product.topics = product.topics || [];
    product.topics.push(topic._id as any);
    await product.save();

    return NextResponse.json({
      success: true,
      topics: await Product.findById(productId).populate("topics").then(p => p?.topics || []),
    });
  } catch (error) {
    console.error("Error adding topic:", error);
    return NextResponse.json(
      { error: "Failed to add topic" },
      { status: 500 },
    );
  }
}

// DELETE - Remove topic from product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    await connectToDatabase();
    const { user, response } = await getUserSession({ required: true });
    if (response) return response;

    const { productId } = await params;
    const { topicId } = await request.json();

    if (!topicId) {
      return NextResponse.json(
        { error: "Topic ID is required" },
        { status: 400 },
      );
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const userId = new mongoose.Types.ObjectId(user?.id);
    if (!product.users?.some((u: any) => u.toString() === userId.toString())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 },
      );
    }

    product.topics = product.topics?.filter(
      (t: any) => t.toString() !== topicId
    );
    await product.save();

    return NextResponse.json({
      success: true,
      topics: await Product.findById(productId).populate("topics").then(p => p?.topics || []),
    });
  } catch (error) {
    console.error("Error removing topic:", error);
    return NextResponse.json(
      { error: "Failed to remove topic" },
      { status: 500 },
    );
  }
}

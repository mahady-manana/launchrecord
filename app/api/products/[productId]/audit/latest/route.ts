import { connectToDatabase } from "@/lib/db";
import { getUserSession } from "@/lib/session";
import Product from "@/models/product";
import Report from "@/models/report";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// GET - Fetch latest audit for a specific product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    await connectToDatabase();
    const { user, response } = await getUserSession({ required: true });
    if (response) {
      return response;
    }

    const { productId } = await params;

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Verify user has access to this product
    const userId = new mongoose.Types.ObjectId(user?.id);
    if (!product.users?.some(u => u.toString() === userId.toString())) {
      return NextResponse.json(
        { error: "Unauthorized access to product" },
        { status: 403 },
      );
    }

    // Find latest audit report for this product
    const latestReport = await Report.findOne({
      product: productId,
      "overall_assessment.composite_score": { $exists: true },
    })
      .sort({ createdAt: -1 })
      .limit(1)
      .lean();

    if (!latestReport) {
      return NextResponse.json(
        { success: true, report: null, message: "No audit found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      report: latestReport,
    });
  } catch (error) {
    console.error("Get product audit API error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve audit" },
      { status: 500 },
    );
  }
}

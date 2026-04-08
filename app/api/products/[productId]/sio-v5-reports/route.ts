import { connectToDatabase } from "@/lib/db";
import { getUserSession } from "@/lib/session";
import Product from "@/models/product";
import SIOReport from "@/models/sio-report";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const paramsSchema = z.object({
  productId: z.string().min(1),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  try {
    const resolvedParams = await params;
    const validation = paramsSchema.safeParse(resolvedParams);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validation.error.errors },
        { status: 400 },
      );
    }

    const { productId } = validation.data;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    await connectToDatabase();
    const { user, response } = await getUserSession({ required: true });
    if (response) return response;

    const product = await Product.findById(productId).lean();
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const userId = new mongoose.Types.ObjectId(user?.id);
    if (!product.users?.some((u: any) => u.toString() === userId.toString())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const reports = await SIOReport.find({ product: productId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      reports: reports || [],
    });
  } catch (error) {
    console.error("Error fetching SIO-V5 reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch SIO-V5 reports" },
      { status: 500 },
    );
  }
}

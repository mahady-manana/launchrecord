import { connectToDatabase } from "@/lib/db";
import { getUserSession } from "@/lib/session";
import Product from "@/models/product";
import SIOReport from "@/models/sio-report";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const paramsSchema = z.object({
  productId: z.string().min(1),
  reportId: z.string().min(1),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string; reportId: string }> },
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

    const { productId, reportId } = validation.data;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(reportId)) {
      return NextResponse.json({ error: "Invalid report ID" }, { status: 400 });
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

    const report = await SIOReport.findById(reportId).lean();
    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error) {
    console.error("Error fetching SIO-V5 report:", error);
    return NextResponse.json(
      { error: "Failed to fetch SIO-V5 report" },
      { status: 500 },
    );
  }
}

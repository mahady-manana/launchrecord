import { connectToDatabase } from "@/lib/db";
import Product from "@/models/product";
import SIOReport from "@/models/sio-report";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const products = await SIOReport.find({
      progress: "complete",
      product: { $exists: true },
    })
      .populate("product", "logo", Product)
      .sort({ createdAt: -1, name: 1 })
      .select("url product")
      .limit(25);

    const count = await SIOReport.countDocuments({
      progress: "complete",
    });

    return NextResponse.json({
      success: true,
      data: {
        logos: products,
        count: count,
      },
    });
  } catch (error) {
    console.error("Leaderboard API error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve logos" },
      { status: 500 },
    );
  }
}

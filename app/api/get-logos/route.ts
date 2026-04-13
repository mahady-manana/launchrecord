import { connectToDatabase } from "@/lib/db";
import Product from "@/models/product";
import SIOReport from "@/models/sio-report";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const products = await SIOReport.find({
      progress: "complete",
    })
      .sort({ createdAt: -1, name: 1 })
      .select("url")
      .limit(30);

    const count = await SIOReport.countDocuments({
      progress: "complete",
    });

    const website = await Product.find({
      website: { $exists: true, $ne: null },
    })
      .sort({ createdAt: -1, name: 1 })
      .select("website")
      .limit(30);

    return NextResponse.json({
      success: true,
      data: {
        logos: products,
        websites: website,
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

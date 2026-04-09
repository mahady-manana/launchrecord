import { connectToDatabase } from "@/lib/db";
import Product from "@/models/product";
import { NextRequest, NextResponse } from "next/server";

// GET - List recent products for public display
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "10");

    // Get most recently updated products
    const products = await Product.find({})
      .sort({ updatedAt: -1 })
      .limit(limit)
      .select("name tagline website score logo slug updatedAt")
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        products,
      },
    });
  } catch (error) {
    console.error("Get recent products API error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve recent products" },
      { status: 500 },
    );
  }
}

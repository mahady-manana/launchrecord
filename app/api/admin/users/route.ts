import { connectToDatabase } from "@/lib/db";
import User from "@/models/user";
import Product from "@/models/product";
import { NextRequest, NextResponse } from "next/server";

// GET - List all users with their products
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "20");
    const search = request.nextUrl.searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(query),
    ]);

    // Fetch products for each user
    const usersWithProducts = await Promise.all(
      users.map(async (user: any) => {
        const userProducts = await Product.find({
          users: user._id,
        })
          .select("name website tagline score logo slug createdAt")
          .sort({ createdAt: -1 })
          .lean();

        return {
          ...user,
          products: userProducts,
          productCount: userProducts.length,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        users: usersWithProducts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Get users API error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve users" },
      { status: 500 },
    );
  }
}

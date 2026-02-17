import { NextResponse } from "next/server";
import Launch from "@/lib/models/launch";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    await connectToDatabase();

    const skip = (page - 1) * limit;

    const [launches, total] = await Promise.all([
      Launch.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("+claimKey")
        .lean(),
      Launch.countDocuments(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      launches,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch launches." },
      { status: 500 },
    );
  }
}

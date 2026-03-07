import { connectToDatabase } from "@/lib/db";
import Topic from "@/models/topic";
import { NextRequest, NextResponse } from "next/server";

// GET - Fetch all topics or search topics
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const limit = parseInt(searchParams.get("limit") || "20");

    let query = {};
    if (search) {
      query = { name: { $regex: search, $options: "i" } };
    }

    const topics = await Topic.find(query)
      .sort({ name: 1 })
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      topics: topics.map((t) => ({
        _id: t._id.toString(),
        name: t.name,
      })),
    });
  } catch (error) {
    console.error("Error fetching topics:", error);
    return NextResponse.json(
      { error: "Failed to fetch topics" },
      { status: 500 },
    );
  }
}

import { connectToDatabase } from "@/lib/db";
import Topic from "@/models/topic";
import Product from "@/models/product";
import { NextRequest, NextResponse } from "next/server";

// GET - Fetch all topics or search topics
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const limit = parseInt(searchParams.get("limit") || "20");
    const top = searchParams.get("top"); // Get top topics by product count

    // If requesting top topics by usage
    if (top) {
      const topLimit = parseInt(top);
      
      // Aggregate to get topics with most products
      const topTopics = await Product.aggregate([
        {
          $match: { deletedAt: null }
        },
        {
          $unwind: "$topics"
        },
        {
          $group: {
            _id: "$topics",
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1 }
        },
        {
          $limit: topLimit
        },
        {
          $lookup: {
            from: "topics",
            localField: "_id",
            foreignField: "_id",
            as: "topic"
          }
        },
        {
          $unwind: "$topic"
        },
        {
          $project: {
            _id: "$topic._id",
            name: "$topic.name",
            topic_slug: "$topic.topic_slug",
            count: 1
          }
        }
      ]);

      return NextResponse.json({
        success: true,
        topics: topTopics.map((t: any) => ({
          _id: t._id.toString(),
          name: t.name,
          slug: t.topic_slug,
          count: t.count,
        })),
      });
    }

    // Regular topic search
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
        topic_slug: t.topic_slug,
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

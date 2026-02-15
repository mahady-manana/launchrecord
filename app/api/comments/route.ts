import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Comment from "@/lib/models/comment";
import { getUserFromSession } from "@/lib/get-user-from-session";
import { serializeMongooseDocument } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const launchId = searchParams.get("launchId");
    const parentId = searchParams.get("parentId"); // For nested replies
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    if (!launchId) {
      return NextResponse.json(
        { success: false, message: "Launch ID is required" },
        { status: 400 }
      );
    }

    // Build query
    const query: any = { 
      launch: launchId, 
      isDeleted: false 
    };

    if (parentId) {
      query.parentComment = parentId;
    } else {
      // Only fetch top-level comments (those without a parent)
      // This creates a flat comment structure with only one level of replies
      query.$or = [
        { parentComment: { $exists: false } },
        { parentComment: null }
      ];
    }

    // Get comments with pagination
    const comments = await Comment.find(query)
      .populate("author", "name avatar email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Serialize the documents to plain objects
    const serializedComments = serializeMongooseDocument(comments);

    // Get total count for pagination
    const totalCount = await Comment.countDocuments(query);

    return NextResponse.json({
      success: true,
      comments: serializedComments,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { content, launchId, parentCommentId } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Comment content is required" },
        { status: 400 }
      );
    }

    if (!launchId) {
      return NextResponse.json(
        { success: false, message: "Launch ID is required" },
        { status: 400 }
      );
    }

    // Create the comment
    const comment = await Comment.create({
      content: content.trim(),
      author: user._id,
      launch: launchId,
      parentComment: parentCommentId || undefined,
    });

    // Populate the author for the response
    const populatedComment = await Comment.findById(comment._id)
      .populate("author", "name avatar email");

    // Increment comment count in the launch document
    const Launch = require("@/lib/models/launch").default;
    await Launch.findByIdAndUpdate(
      launchId,
      { $inc: { commentCount: 1 } },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      comment: serializeMongooseDocument(populatedComment),
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create comment" },
      { status: 500 }
    );
  }
}
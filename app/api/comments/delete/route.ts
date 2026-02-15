import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Comment from "@/lib/models/comment";
import { getUserFromSession } from "@/lib/get-user-from-session";
import { serializeMongooseDocument } from "@/lib/utils";

export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase();

    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get("id");

    if (!commentId) {
      return NextResponse.json(
        { success: false, message: "Comment ID is required" },
        { status: 400 }
      );
    }

    // Find the comment
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return NextResponse.json(
        { success: false, message: "Comment not found" },
        { status: 404 }
      );
    }

    // Check if the user is the author of the comment or an admin
    if (comment.author.toString() !== user._id.toString()) {
      return NextResponse.json(
        { success: false, message: "Not authorized to delete this comment" },
        { status: 403 }
      );
    }

    // Soft delete the comment
    await Comment.findByIdAndUpdate(
      commentId,
      { isDeleted: true },
      { new: true }
    );

    // Decrement comment count in the launch document
    const Launch = require("@/lib/models/launch").default;
    await Launch.findByIdAndUpdate(
      comment.launch,
      { $inc: { commentCount: -1 } },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete comment" },
      { status: 500 }
    );
  }
}
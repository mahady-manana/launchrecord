import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getUserFromSession } from "@/lib/get-user-from-session";
import Placement from "@/lib/models/placement";
import { serializeMongooseDocument } from "@/lib/utils";

export async function GET() {
  try {
    const user = await getUserFromSession();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "You need to sign in first." },
        { status: 401 },
      );
    }

    await connectToDatabase();

    const userPlacements = await Placement.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .lean();

    // Convert to plain objects to remove any potential circular references
    const plainUserPlacements = serializeMongooseDocument(userPlacements);

    return NextResponse.json({ success: true, placements: plainUserPlacements });
  } catch (error) {
    console.error("Error fetching user placements:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch user placements." },
      { status: 500 },
    );
  }
}
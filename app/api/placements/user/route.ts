import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getUserFromSession } from "@/lib/get-user-from-session";
import Placement from "@/lib/models/placement";

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

    return NextResponse.json({ success: true, placements: userPlacements });
  } catch (error) {
    console.error("Error fetching user placements:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch user placements." },
      { status: 500 },
    );
  }
}
import { getUserFromSession } from "@/lib/get-user-from-session";
import Placement from "@/lib/models/placement";
import { connectToDatabase } from "@/lib/mongodb";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIdentifier, isSameOrigin } from "@/lib/security";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!isSameOrigin(request)) {
      return NextResponse.json(
        { success: false, message: "Invalid origin." },
        { status: 403 },
      );
    }

    const identifier = getClientIdentifier(request);
    const limitResult = rateLimit({
      key: `placements:get:${identifier}`,
      limit: 30,
      windowMs: 60 * 60 * 1000,
    });

    if (!limitResult.allowed) {
      return NextResponse.json(
        { success: false, message: "Rate limit exceeded. Try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil(limitResult.retryAfterMs / 1000)),
          },
        },
      );
    }

    const user = await getUserFromSession();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "You need to sign in first." },
        { status: 401 },
      );
    }
    const id = (await params).id;
    // Validate the placement ID format
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid placement ID." },
        { status: 400 },
      );
    }

    await connectToDatabase();

    // Find the placement and ensure it belongs to the user
    const placement = await Placement.findOne({
      _id: id,
      userId: user._id,
    });

    if (!placement) {
      return NextResponse.json(
        { success: false, message: "Placement not found or unauthorized." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      placement: placement.toObject(),
    });
  } catch (error) {
    console.error("Error fetching placement:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch placement." },
      { status: 500 },
    );
  }
}

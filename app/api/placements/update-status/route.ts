import { getUserFromSession } from "@/lib/get-user-from-session";
import Placement from "@/lib/models/placement";
import { connectToDatabase } from "@/lib/mongodb";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIdentifier, isSameOrigin } from "@/lib/security";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    if (!isSameOrigin(request)) {
      return NextResponse.json(
        { success: false, message: "Invalid origin." },
        { status: 403 },
      );
    }

    const identifier = getClientIdentifier(request);
    const limitResult = rateLimit({
      key: `placements:update-status:${identifier}`,
      limit: 20,
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

    const body = await request.json();

    await connectToDatabase();

    // Find placement by ID
    const placement = await Placement.findById(body.id);

    if (!placement) {
      return NextResponse.json(
        { success: false, message: "Placement not found." },
        { status: 404 },
      );
    }

    // Check if the placement belongs to the current user
    if (placement.userId.toString() !== user._id.toString()) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access to this placement." },
        { status: 403 },
      );
    }

    // Validate required fields
    if (!body.status) {
      return NextResponse.json(
        { success: false, message: "Status is required." },
        { status: 400 },
      );
    }

    // Only allow activation if payment has been successfully processed
    if (body.status === "active" && placement.paymentStatus !== "paid") {
      return NextResponse.json(
        { 
          success: false, 
          message: "Cannot activate placement. Payment must be completed first. Current payment status: " + placement.paymentStatus 
        },
        { status: 400 },
      );
    }

    // Update placement status
    placement.status = body.status;

    await placement.save();

    return NextResponse.json({
      success: true,
      placement,
    });
  } catch (error) {
    console.error("Error updating placement status:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update placement status." },
      { status: 500 },
    );
  }
}

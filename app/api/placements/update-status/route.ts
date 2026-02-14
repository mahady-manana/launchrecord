import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getUserFromSession } from "@/lib/get-user-from-session";
import { getClientIdentifier, isSameOrigin } from "@/lib/security";
import { rateLimit } from "@/lib/rate-limit";
import Placement from "@/lib/models/placement";

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
    
    // Validate required fields
    if (!body.paymentIntentId || !body.paymentStatus) {
      return NextResponse.json(
        { success: false, message: "paymentIntentId and paymentStatus are required." },
        { status: 400 },
      );
    }

    await connectToDatabase();

    // Find placement by payment intent ID
    const placement = await Placement.findOne({ 
      paymentIntentId: body.paymentIntentId,
      userId: user._id
    });

    if (!placement) {
      return NextResponse.json(
        { success: false, message: "Placement not found." },
        { status: 404 },
      );
    }

    // Update payment status
    placement.paymentStatus = body.paymentStatus;
    
    // If payment is successful, activate the placement
    if (body.paymentStatus === 'paid') {
      placement.status = 'active';
    } else if (['failed', 'refunded'].includes(body.paymentStatus)) {
      placement.status = 'inactive';
    }

    await placement.save();

    return NextResponse.json({ 
      success: true, 
      placement 
    });
  } catch (error) {
    console.error("Error updating placement status:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update placement status." },
      { status: 500 },
    );
  }
}
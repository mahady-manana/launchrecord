import { getUserFromSession } from "@/lib/get-user-from-session";
import Launch from "@/lib/models/launch";
import { connectToDatabase } from "@/lib/mongodb";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIdentifier, isSameOrigin } from "@/lib/security";
import { NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";

const claimLaunchSchema = z.object({
  slug: z.string().min(1),
  claimKey: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    if (!isSameOrigin(request)) {
      return NextResponse.json(
        { success: false, message: "Invalid origin." },
        { status: 403 },
      );
    }

    const identifier = getClientIdentifier(request);
    const limitResult = rateLimit({
      key: `launches:claim:${identifier}`,
      limit: 10,
      windowMs: 60 * 60 * 1000,
    });

    if (!limitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: "Rate limit exceeded. Try again later.",
        },
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
    const validatedBody = claimLaunchSchema.parse(body);

    await connectToDatabase();

    const launch = await Launch.findOne({ slug: validatedBody.slug }).select(
      "+claimKey",
    );

    if (!launch) {
      return NextResponse.json(
        { success: false, message: "Launch not found." },
        { status: 404 },
      );
    }

    if (launch.claimed) {
      return NextResponse.json(
        { success: false, message: "This launch has already been claimed." },
        { status: 400 },
      );
    }

    if (launch.claimKey !== validatedBody.claimKey) {
      return NextResponse.json(
        { success: false, message: "Invalid claim key." },
        { status: 400 },
      );
    }

    launch.claimed = true;
    launch.submittedBy = new mongoose.Types.ObjectId(user._id);
    launch.claimKey = undefined;
    await launch.save();

    return NextResponse.json({
      success: true,
      message: "Launch claimed successfully!",
      launch: {
        _id: launch._id,
        slug: launch.slug,
        name: launch.name,
        claimed: launch.claimed,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: error.errors[0]?.message || "Invalid payload.",
        },
        { status: 400 },
      );
    }

    console.error("Error claiming launch:", error);
    return NextResponse.json(
      { success: false, message: "Failed to claim launch." },
      { status: 500 },
    );
  }
}

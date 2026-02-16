import { getUserFromSession } from "@/lib/get-user-from-session";
import Placement from "@/lib/models/placement";
import { connectToDatabase } from "@/lib/mongodb";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIdentifier, isSameOrigin } from "@/lib/security";
import { serializeMongooseDocument } from "@/lib/utils";
import { NextResponse } from "next/server";
import { z } from "zod";

const createTempPlacementSchema = z.object({
  title: z.string().min(1).max(150),
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
      key: `placements:create-temp:${identifier}`,
      limit: 10,
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
    const validatedBody = createTempPlacementSchema.parse(body);

    await connectToDatabase();

    // Create a temporary placement record
    const tempPlacement = await Placement.create({
      title: validatedBody.title,
      userId: user._id,
    });

    // Convert to plain object to remove any potential circular references
    const plainPlacement = serializeMongooseDocument(tempPlacement);

    return NextResponse.json(
      { success: true, placement: plainPlacement },
      { status: 201 },
    );
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

    console.error("Error creating temporary placement:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create temporary placement." },
      { status: 500 },
    );
  }
}

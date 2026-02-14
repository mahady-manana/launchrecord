import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import { getUserFromSession } from "@/lib/get-user-from-session";
import { getClientIdentifier, isSameOrigin } from "@/lib/security";
import { rateLimit } from "@/lib/rate-limit";
import Placement from "@/lib/models/placement";
import { PLACEMENT_TYPES, PLACEMENT_POSITIONS } from "@/types/placement";
import { serializeMongooseDocument } from "@/lib/utils";

const createPlacementSchema = z.object({
  title: z.string().min(2).max(100),
  tagline: z.string().min(4).max(140),
  logoUrl: z.string().url().optional().or(z.literal("")),
  backgroundImage: z.string().url().optional().or(z.literal("")),
  website: z.string().url(),
  placementType: z.enum(PLACEMENT_TYPES),
  position: z.enum(PLACEMENT_POSITIONS).optional(),
  startDate: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: "Invalid date format"
  }),
  endDate: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: "Invalid date format"
  }),
  price: z.number().min(0),
  codeName: z.string().min(1).max(50),
  duration: z.number().min(1).max(365),
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
      key: `placements:create:${identifier}`,
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
    const validatedBody = createPlacementSchema.parse(body);

    await connectToDatabase();

    // Check if placement with this codeName already exists
    const existingPlacement = await Placement.findOne({ codeName: validatedBody.codeName });
    if (existingPlacement) {
      return NextResponse.json(
        { success: false, message: "Placement with this code name already exists." },
        { status: 400 },
      );
    }

    // Create the placement
    const placement = await Placement.create({
      ...validatedBody,
      userId: user._id,
      status: "inactive", // Will become active after payment
      paymentStatus: "pending",
    });

    // Convert to plain object to remove any potential circular references
    const plainPlacement = serializeMongooseDocument(placement);

    return NextResponse.json({ success: true, placement: plainPlacement }, { status: 201 });
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

    console.error("Error creating placement:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create placement." },
      { status: 500 },
    );
  }
}
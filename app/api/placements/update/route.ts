import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import { getUserFromSession } from "@/lib/get-user-from-session";
import { getClientIdentifier, isSameOrigin } from "@/lib/security";
import { rateLimit } from "@/lib/rate-limit";
import Placement from "@/lib/models/placement";
import { serializeMongooseDocument } from "@/lib/utils";

const updatePlacementSchema = z.object({
  id: z.string(),
  title: z.string().min(2).max(100).optional(),
  tagline: z.string().min(4).max(140).optional(),
  logoUrl: z.string().url().optional().or(z.literal("")).optional(),
  backgroundImage: z.string().url().optional().or(z.literal("")).optional(),
  website: z.string().url().optional(),
});

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
      key: `placements:update:${identifier}`,
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
    const validatedBody = updatePlacementSchema.parse(body);

    await connectToDatabase();

    // Find the placement and ensure it belongs to the user
    const placement = await Placement.findOne({
      _id: validatedBody.id,
      userId: user._id,
    });

    if (!placement) {
      return NextResponse.json(
        { success: false, message: "Placement not found or unauthorized." },
        { status: 404 },
      );
    }

    // Update the placement with provided fields
    const updateData: any = {};
    if (validatedBody.title !== undefined) updateData.title = validatedBody.title;
    if (validatedBody.tagline !== undefined) updateData.tagline = validatedBody.tagline;
    if (validatedBody.logoUrl !== undefined) updateData.logoUrl = validatedBody.logoUrl;
    if (validatedBody.backgroundImage !== undefined) updateData.backgroundImage = validatedBody.backgroundImage;
    if (validatedBody.website !== undefined) updateData.website = validatedBody.website;

    // Only activate the placement if all required fields are filled
    if (
      updateData.title && 
      updateData.tagline && 
      updateData.website && 
      (updateData.logoUrl || updateData.backgroundImage) &&
      placement.paymentStatus === 'paid'
    ) {
      updateData.status = 'active';
    } else {
      // Keep it inactive until all required fields are filled
      updateData.status = 'inactive';
    }

    const updatedPlacement = await Placement.findByIdAndUpdate(
      validatedBody.id,
      updateData,
      { new: true }
    ).lean();

    // Convert to plain object to remove any potential circular references
    const plainUpdatedPlacement = serializeMongooseDocument(updatedPlacement);

    return NextResponse.json({ success: true, placement: plainUpdatedPlacement });
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

    console.error("Error updating placement:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update placement." },
      { status: 500 },
    );
  }
}
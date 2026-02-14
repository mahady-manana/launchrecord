import { Types } from "mongoose";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  BUSINESS_MODELS,
  LAUNCH_CATEGORIES,
  PRICING_MODELS,
} from "@/types";
import { connectToDatabase } from "@/lib/mongodb";
import { getUserFromSession } from "@/lib/get-user-from-session";
import Launch from "@/lib/models/launch";
import { getClientIdentifier, isSameOrigin } from "@/lib/security";
import { rateLimit } from "@/lib/rate-limit";
import {
  sanitizeOptionalText,
  sanitizeSlugInput,
  sanitizeText,
  slugify,
} from "@/lib/sanitize";

const updateLaunchSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2).max(100).optional(),
  slug: z.string().min(1).max(120).optional(),
  logoUrl: z.string().url().optional().or(z.literal("")),
  tagline: z.string().min(4).max(140).optional(),
  description: z.string().min(10).max(1200).optional(),
  website: z.string().url().optional(),
  category: z.enum(LAUNCH_CATEGORIES).optional().or(z.array(z.enum(LAUNCH_CATEGORIES)).max(3)),
  valueProposition: z.string().max(220).optional(),
  problem: z.string().max(600).optional(),
  audience: z.string().max(220).optional(),
  businessModel: z.enum(BUSINESS_MODELS).optional(),
  pricingModel: z.enum(PRICING_MODELS).optional(),
  authorName: z.string().min(2).max(100).optional(),
  authorX: z.string().max(100).optional(),
  authorLinkedIn: z.string().url().max(200).optional().or(z.literal("")),
});

function randomSlugSuffix() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

async function getUniqueSlug(baseSlug: string, launchId: string) {
  if (!baseSlug) {
    return null;
  }

  let slug = baseSlug;

  while (await Launch.exists({ slug, _id: { $ne: launchId } })) {
    slug = `${baseSlug}-${randomSlugSuffix()}`;
  }

  return slug;
}

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
      key: `launches:update:${identifier}`,
      limit: 60,
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
    const validatedBody = updateLaunchSchema.parse(body);

    if (!Types.ObjectId.isValid(validatedBody.id)) {
      return NextResponse.json(
        { success: false, message: "Invalid launch id." },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const launch = await Launch.findOne({
      _id: validatedBody.id,
      submittedBy: user._id,
      isArchived: false,
    });

    if (!launch) {
      return NextResponse.json(
        { success: false, message: "Launch not found or unauthorized." },
        { status: 404 },
      );
    }

    const updateData: Record<string, string> = {};

    if (validatedBody.name) {
      updateData.name = sanitizeText(validatedBody.name);
    }

    if (validatedBody.slug !== undefined) {
      const cleanedSlug = sanitizeSlugInput(validatedBody.slug);
      const nextSlug = await getUniqueSlug(cleanedSlug, validatedBody.id);

      if (!nextSlug) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Slug must contain letters, numbers, hyphen, or underscore.",
          },
          { status: 400 },
        );
      }

      updateData.slug = nextSlug;
    } else if (validatedBody.name) {
      const generatedSlug = slugify(validatedBody.name);
      const nextSlug = await getUniqueSlug(generatedSlug, validatedBody.id);

      if (!nextSlug) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Launch name contains no valid characters for slug. Use letters, numbers, hyphens, or underscores.",
          },
          { status: 400 },
        );
      }

      updateData.slug = nextSlug;
    }

    if (validatedBody.description) {
      updateData.description = sanitizeText(validatedBody.description);
    }

    if (validatedBody.tagline) {
      updateData.tagline = sanitizeText(validatedBody.tagline);
    }

    if (validatedBody.logoUrl !== undefined) {
      updateData.logoUrl = validatedBody.logoUrl.trim();
    }

    if (validatedBody.website) {
      updateData.website = validatedBody.website.trim();
    }

    if (validatedBody.category) {
      updateData.category = validatedBody.category;
    }

    if (validatedBody.valueProposition !== undefined) {
      updateData.valueProposition = sanitizeText(validatedBody.valueProposition);
    }

    if (validatedBody.problem !== undefined) {
      updateData.problem = sanitizeText(validatedBody.problem);
    }

    if (validatedBody.audience !== undefined) {
      updateData.audience = sanitizeText(validatedBody.audience);
    }

    if (validatedBody.businessModel) {
      updateData.businessModel = validatedBody.businessModel;
    }

    if (validatedBody.pricingModel) {
      updateData.pricingModel = validatedBody.pricingModel;
    }

    if (validatedBody.authorName) {
      updateData.authorName = sanitizeText(validatedBody.authorName);
    }

    if (validatedBody.authorX !== undefined) {
      updateData.authorX = sanitizeOptionalText(validatedBody.authorX) || "";
    }

    if (validatedBody.authorLinkedIn !== undefined) {
      updateData.authorLinkedIn =
        sanitizeOptionalText(validatedBody.authorLinkedIn) || "";
    }

    const updatedLaunch = await Launch.findByIdAndUpdate(
      validatedBody.id,
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );

    return NextResponse.json({ success: true, launch: updatedLaunch });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: error.errors[0]?.message || "Invalid payload." },
        { status: 400 },
      );
    }

    console.error("Error updating launch:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update launch." },
      { status: 500 },
    );
  }
}

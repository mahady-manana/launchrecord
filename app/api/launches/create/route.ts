import { getUserFromSession } from "@/lib/get-user-from-session";
import Launch from "@/lib/models/launch";
import User from "@/lib/models/user";
import { connectToDatabase } from "@/lib/mongodb";
import { rateLimit } from "@/lib/rate-limit";
import { sanitizeText, slugify } from "@/lib/sanitize";
import { getClientIdentifier, isSameOrigin } from "@/lib/security";
import {
  BUSINESS_MODELS,
  LAUNCH_CATEGORIES,
  PRICING_MODELS,
} from "@/types";
import { NextResponse } from "next/server";
import { z } from "zod";
import { serializeMongooseDocument } from "@/lib/utils";

const createLaunchSchema = z.object({
  name: z.string().min(2).max(100),
  logoUrl: z.string().optional().or(z.literal("")),
  tagline: z.string().min(4).max(140),
  description: z.string().min(10).max(1200),
  website: z.string(),
  category: z.enum(LAUNCH_CATEGORIES).or(z.array(z.enum(LAUNCH_CATEGORIES)).max(3)),
  businessModel: z.enum(BUSINESS_MODELS),
  pricingModel: z.enum(PRICING_MODELS),
});

function randomSlugSuffix() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

async function getUniqueSlug(baseSlug: string) {
  if (!baseSlug) {
    return null;
  }

  let slug = baseSlug;

  while (await Launch.exists({ slug })) {
    slug = `${baseSlug}-${randomSlugSuffix()}`;
  }

  return slug;
}

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
      key: `launches:create:${identifier}`,
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

    const body = await request.json();
    const validatedBody = createLaunchSchema.parse(body);

    await connectToDatabase();

    const cleanedName = sanitizeText(validatedBody.name);
    const slugCandidate = slugify(cleanedName);
    const slug = await getUniqueSlug(slugCandidate);

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Launch name contains no valid characters for slug. Use letters, numbers, hyphens, or underscores.",
        },
        { status: 400 },
      );
    }

    // Get user's author information
    const dbUser = await User.findById(user._id).select('name x linkedin').lean();
    
    const launch = await Launch.create({
      name: cleanedName,
      slug,
      logoUrl: validatedBody.logoUrl?.trim() || undefined,
      tagline: sanitizeText(validatedBody.tagline),
      description: sanitizeText(validatedBody.description),
      website: validatedBody.website.trim(),
      category: validatedBody.category,
      valueProposition: "",
      problem: "",
      audience: "",
      businessModel: validatedBody.businessModel,
      pricingModel: validatedBody.pricingModel,
      placement: "none",
      submittedBy: user._id,
    });

    // Convert to plain object to remove any potential circular references
    const plainLaunch = serializeMongooseDocument(launch);

    return NextResponse.json({ success: true, launch: plainLaunch }, { status: 201 });
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

    console.error("Error creating launch:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create launch." },
      { status: 500 },
    );
  }
}

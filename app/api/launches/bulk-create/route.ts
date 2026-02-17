import { getUserFromSession } from "@/lib/get-user-from-session";
import Launch from "@/lib/models/launch";
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
import { initializeClickTracking } from "@/lib/click-tracking";
import crypto from "crypto";

const bulkLaunchSchema = z.object({
  name: z.string().min(2).max(100),
  logoUrl: z.string().optional().or(z.literal("")),
  tagline: z.string().min(4).max(140).optional().or(z.literal("")),
  description: z.string().min(10).max(1200).optional().or(z.literal("")),
  website: z.string().optional().or(z.literal("")),
  category: z
    .enum(LAUNCH_CATEGORIES)
    .or(z.array(z.enum(LAUNCH_CATEGORIES)).max(3))
    .optional(),
  businessModel: z.enum(BUSINESS_MODELS).optional(),
  pricingModel: z.enum(PRICING_MODELS).optional(),
});

const bulkCreateSchema = z.object({
  launches: z.array(bulkLaunchSchema).min(1).max(100),
});

function randomSlugSuffix() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

function generateClaimKey() {
  return "LR_" + crypto.randomBytes(8).toString("hex").toUpperCase();
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
      key: `launches:bulk-create:${identifier}`,
      limit: 5,
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
    const validatedBody = bulkCreateSchema.parse(body);

    await connectToDatabase();

    const createdLaunches = [];
    const errors = [];

    for (let i = 0; i < validatedBody.launches.length; i++) {
      const launchData = validatedBody.launches[i];

      try {
        const cleanedName = sanitizeText(launchData.name);
        const slugCandidate = slugify(cleanedName);
        const slug = await getUniqueSlug(slugCandidate);

        if (!slug) {
          errors.push({
            index: i,
            name: launchData.name,
            error: "Launch name contains no valid characters for slug.",
          });
          continue;
        }

        const claimKey = generateClaimKey();

        const launch = await Launch.create({
          name: cleanedName,
          slug,
          logoUrl: launchData.logoUrl?.trim() || undefined,
          tagline: sanitizeText(launchData.tagline || ""),
          description: sanitizeText(launchData.description || ""),
          website: launchData.website?.trim() || "",
          category: launchData.category || [],
          valueProposition: "",
          problem: "",
          audience: "",
          businessModel: launchData.businessModel || "Other",
          pricingModel: launchData.pricingModel || "free",
          placement: "none",
          submittedBy: user._id,
          claimed: false,
          claimKey,
        });

        await initializeClickTracking(launch._id);

        const plainLaunch = serializeMongooseDocument(launch);
        plainLaunch.claimKey = claimKey;

        createdLaunches.push({
          index: i,
          name: launchData.name,
          launch: plainLaunch,
          claimKey,
        });
      } catch (error) {
        errors.push({
          index: i,
          name: launchData.name,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return NextResponse.json(
      {
        success: true,
        created: createdLaunches,
        errors,
        total: validatedBody.launches.length,
        createdCount: createdLaunches.length,
        errorCount: errors.length,
      },
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

    console.error("Error bulk creating launches:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create launches." },
      { status: 500 },
    );
  }
}

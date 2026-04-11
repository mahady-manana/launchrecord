import { connectToDatabase } from "@/lib/db";
import { getUserSession } from "@/lib/session";
import { generateUniqueSlug } from "@/lib/utils";
import Product from "@/models/product";
import SIOReport from "@/models/sio-report";
import { fetchWebsiteContent } from "@/services/fetchWebsiteContent";
import { parseWebsiteContent } from "@/services/parseWebsiteContent";
import { sanitizeText } from "@/utils/sanitize";
import { NextRequest, NextResponse } from "next/server";
import normalizeUrl from "normalize-url";
import { z } from "zod";

const completeProductSchema = z.object({
  websiteUrl: z.string().min(1),
  name: z.string().optional(),
  description: z.string().optional(),
  tagline: z.string().optional(),
  logo: z.string().optional(),
  preview: z.boolean().optional(),
});

type SuggestedData = {
  website: string;
  name: string;
  description: string;
  tagline: string;
  logo: string;
};

function buildFavicon(url: string) {
  return `https://www.google.com/s2/favicons?domain=${url}`;
}

async function getSuggestedData(
  websiteUrl: string,
  overrides?: Partial<SuggestedData>,
): Promise<SuggestedData> {
  const normalizedUrl = normalizeUrl(websiteUrl, {
    forceHttps: true,
    stripWWW: false,
    defaultProtocol: "https",
    removePath: true,
  });

  const hostname = new URL(normalizedUrl).hostname.replace(/^www\./, "");

  let metaTitle = "";
  let metaDescription = "";
  let productName = "";

  try {
    const page = await fetchWebsiteContent(normalizedUrl);
    const parsed = parseWebsiteContent(page);
    metaTitle = parsed?.meta?.title || "";
    metaDescription = parsed?.meta?.description || "";
    productName = parsed?.meta?.name || "";
  } catch (error) {
    console.error("Failed to preview website content:", error);
  }

  const baseName = hostname || "Unknown";
  const suggested: SuggestedData = {
    website: normalizedUrl,
    name: productName,
    description: metaDescription || "",
    tagline: metaTitle || "",
    logo: buildFavicon(normalizedUrl),
  };

  return {
    website: overrides?.website || suggested.website,
    name: overrides?.name || suggested.name,
    description: overrides?.description || suggested.description,
    tagline: overrides?.tagline || suggested.tagline,
    logo: overrides?.logo || suggested.logo,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = completeProductSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validation.error.errors },
        { status: 400 },
      );
    }

    const { websiteUrl, preview, name, description, tagline, logo } =
      validation.data;

    await connectToDatabase();
    const { user, response } = await getUserSession({ required: true });
    if (response) {
      return response;
    }

    const overrides = {
      name: name ? sanitizeText(name) : undefined,
      description: description ? sanitizeText(description) : undefined,
      tagline: tagline ? sanitizeText(tagline) : undefined,
      logo: logo ? sanitizeText(logo) : undefined,
    };

    const suggested = await getSuggestedData(websiteUrl, overrides);

    if (preview) {
      return NextResponse.json({
        success: true,
        data: suggested,
      });
    }

    if (!suggested.name || !suggested.website) {
      return NextResponse.json(
        { error: "Product name and website are required" },
        { status: 400 },
      );
    }

    const existingProduct = await Product.findOne({
      website: suggested.website,
    });

    const sioreport = await SIOReport.findOne({
      url: suggested.website,
    })
      .sort({ createdAt: -1 })
      .lean();

    if (existingProduct) {
      const isOwner = existingProduct.users?.some(
        (u: any) => u.toString() === user?.id,
      );

      if (isOwner) {
        await SIOReport.updateMany(
          {
            url: suggested.website,
            $or: [{ product: null }, { product: { $exists: false } }],
          },
          { $set: { product: existingProduct._id } },
        );
        return NextResponse.json({
          success: true,
          productId: existingProduct._id,
          existing: true,
        });
      }

      const isClaimedByOthers =
        (existingProduct.users?.length || 0) > 0 &&
        !existingProduct.addedByAdmin;

      if (isClaimedByOthers) {
        return NextResponse.json(
          {
            error:
              "This product has already been claimed by another user. Please use a different URL.",
            alreadyClaimed: true,
            productId: existingProduct._id,
            productName: existingProduct.name,
          },
          { status: 400 },
        );
      }

      existingProduct.users = [
        ...(existingProduct.users || []),
        user?.id as any,
      ];

      if (suggested.name) {
        existingProduct.name = suggested.name;
      }
      if (suggested.description) {
        existingProduct.description = suggested.description;
      }
      if (suggested.tagline) {
        existingProduct.tagline = suggested.tagline;
      }
      if (suggested.logo) {
        existingProduct.logo = suggested.logo;
      }
      if (sioreport?.overallScore) {
        existingProduct.score = sioreport.overallScore;
      }

      existingProduct.earlyAccess = true;
      existingProduct.earlyAccessGrantedAt =
        existingProduct.earlyAccessGrantedAt || new Date();

      await existingProduct.save();
      await SIOReport.updateMany(
        {
          url: suggested.website,
          $or: [{ product: null }, { product: { $exists: false } }],
        },
        { $set: { product: existingProduct._id } },
      );

      return NextResponse.json({
        success: true,
        productId: existingProduct._id,
        existing: true,
      });
    }

    const slug = await generateUniqueSlug(suggested.name, async (candidate) => {
      const existing = await Product.findOne({ slug: candidate });
      return !!existing;
    });
    console.log("====================================");
    console.log(suggested);
    console.log("====================================");
    const product = await Product.create({
      name: suggested.name,
      website: suggested.website,
      description: suggested.description || null,
      tagline: suggested.tagline || null,
      logo: suggested.logo || null,
      users: user?.id ? [user.id] : [],
      score: sioreport?.overallScore || null,
      earlyAccess: true,
      earlyAccessGrantedAt: new Date(),
      addedByAdmin: false,
      surveyData: {
        founderName: user?.name || "",
        saasName: suggested.name,
        saasUrl: suggested.website,
      },
      slug,
    });
    const x = await SIOReport.updateMany(
      {
        url: suggested.website,
        $or: [{ product: null }, { product: { $exists: false } }],
      },
      { $set: { product: product._id } },
    );
    console.log("====================================");
    console.log(x);
    console.log("====================================");
    return NextResponse.json({
      success: true,
      productId: product._id,
      existing: false,
    });
  } catch (error) {
    console.error("Complete product API error:", error);
    return NextResponse.json(
      { error: "Failed to complete product setup" },
      { status: 500 },
    );
  }
}

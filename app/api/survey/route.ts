import { connectToDatabase } from "@/lib/db";
import { getUserSession } from "@/lib/session";
import { generateUniqueSlug } from "@/lib/utils";
import Product from "@/models/product";
import { NextRequest, NextResponse } from "next/server";
import normalizeUrl from "normalize-url";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    let { saasName, saasUrl, founderName } = body;
    const { response, user } = await getUserSession({ required: true });

    // Validate required fields
    if (response) {
      return response;
    }

    if (!saasUrl) {
      return NextResponse.json(
        { error: "Product URL is required" },
        { status: 400 },
      );
    }

    const normalizedUrl = normalizeUrl(saasUrl, {
      forceHttps: true,
      stripWWW: false,
      defaultProtocol: "https",
    });

    // Check if product with this domain already exists
    const existingProduct = await Product.findOne({
      website: normalizedUrl,
    });

    if (existingProduct) {
      // Check if current user is already an owner
      if (existingProduct.users) {
        const isOwner = existingProduct.users.some(
          (u: any) => u.toString() === user?.id,
        );

        if (isOwner) {
          // User is already an owner, return product
          return NextResponse.json({
            message: "Survey already exists for this product",
            productId: existingProduct._id,
            existing: true,
            requiresClaim: false,
          });
        }
      }

      // Product exists but user is not an owner
      // Check if it's already claimed by other users (has users and not added by admin)
      if (
        existingProduct.users &&
        existingProduct.users.length > 0 &&
        !existingProduct.addedByAdmin
      ) {
        return NextResponse.json(
          {
            error:
              "This product has already been claimed by another user. You cannot continue with this product URL.",
            alreadyClaimed: true,
            productId: existingProduct._id,
            productName: existingProduct.name,
          },
          { status: 400 },
        );
      }

      // Check if it's admin-owned and needs claim
      if (
        existingProduct.addedByAdmin &&
        (!existingProduct.users || existingProduct.users.length === 0)
      ) {
        return NextResponse.json({
          message: "Product exists and requires claim",
          productId: existingProduct._id,
          existing: true,
          requiresClaim: true,
          productName: existingProduct.name,
          productWebsite: existingProduct.website,
        });
      }

      // Product exists but no owners - let them claim
      return NextResponse.json({
        message: "Survey already exists for this product",
        productId: existingProduct._id,
        existing: true,
        requiresClaim: true,
      });
    }

    // Generate unique slug from product name
    const slug = await generateUniqueSlug(
      saasName || "Unknown",
      async (slug) => {
        const existing = await Product.findOne({ slug });
        return !!existing;
      },
    );

    // Create incomplete product with early access flag
    const product = await Product.create({
      name: saasName || "Unknown",
      website: normalizedUrl,
      description: null,
      tagline: null,
      logo: `http://www.google.com/s2/favicons?domain=${normalizedUrl}`,
      users: user?._id ? [user._id] : [],
      score: null,
      earlyAccess: true,
      earlyAccessGrantedAt: new Date(),
      surveyData: {
        founderName,
        saasName,
        saasUrl: normalizedUrl,
        ...body,
      },
      slug,
    });

    return NextResponse.json({
      message: "Survey started successfully",
      productId: product._id,
      existing: false,
      requiresClaim: false,
    });
  } catch (error) {
    console.error("Survey API error:", error);
    return NextResponse.json(
      { error: "Failed to start survey" },
      { status: 500 },
    );
  }
}

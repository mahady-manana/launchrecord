import { connectToDatabase } from "@/lib/db";
import Product from "@/models/product";
import { NextRequest, NextResponse } from "next/server";
import normalizeUrl from "normalize-url";

// POST - Bulk save products without running audits
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();

    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: "Request body must be an array of products" },
        { status: 400 },
      );
    }

    const savedProducts = [];
    const errors = [];

    for (const item of body) {
      try {
        const { name, website, tagline, description, logo, metadata, id } =
          item;

        if (!name || !website) {
          errors.push({ item, error: "Name and website are required" });
          continue;
        }

        const normalizedUrl = normalizeUrl(website, {
          forceHttps: true,
          stripWWW: false,
        });

        // Check if product already exists with this normalized URL
        const existingProduct = await Product.findOne({
          website: normalizedUrl,
        });

        if (existingProduct) {
          // Product already exists, skip it (don't update)
          errors.push({
            item,
            error: "Product already exists (skipped)",
            url: normalizedUrl,
            skipped: true,
          });
          continue;
        } else {
          // Create new product
          const product = await Product.create({
            name,
            website: normalizedUrl,
            tagline: tagline || null,
            description: description || null,
            logo: logo || null,
            users: [],
            score: null,
            earlyAccess: false,
            addedByAdmin: true,
            surveyData: null,
            metadata: {
              source: "ph",
              sourceId: id,
              ...metadata,
            },
          });
          savedProducts.push(product);
        }
      } catch (error: any) {
        errors.push({
          item,
          error: error.message || "Failed to save product",
          url: item.website,
        });
      }
    }

    return NextResponse.json({
      success: true,
      savedCount: savedProducts.length,
      errorCount: errors.length,
      errors: errors.length > 0 ? errors : undefined,
      message: `Saved ${savedProducts.length} products${errors.length > 0 ? ` with ${errors.length} errors` : ""}`,
    });
  } catch (error: any) {
    console.error("Bulk save error:", error);
    return NextResponse.json(
      { error: "Failed to save products", details: error.message },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Product from "@/models/product";
import normalizeUrl from "normalize-url";

// GET - Check if product exists by website
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const website = request.nextUrl.searchParams.get("website");

    if (!website) {
      return NextResponse.json(
        { error: "Website parameter is required" },
        { status: 400 }
      );
    }

    try {
      const normalizedWebsite = normalizeUrl(website);
      const product = await Product.findOne({
        website: normalizedWebsite,
      }).populate("user", "name email");

      if (!product) {
        return NextResponse.json({
          exists: false,
        });
      }

      return NextResponse.json({
        exists: true,
        product: {
          id: product._id,
          name: product.name,
          website: product.website,
          tagline: product.tagline,
          description: product.description,
          logo: product.logo,
          addedByAdmin: product.addedByAdmin,
          addedByUser: product.user
            ? {
                id: product.user._id,
                name: product.user.name,
                email: product.user.email,
              }
            : null,
        },
      });
    } catch (error) {
      // If normalization fails, try direct search
      const product = await Product.findOne({
        website: { $regex: website, $options: "i" },
      }).populate("user", "name email");

      if (!product) {
        return NextResponse.json({
          exists: false,
        });
      }

      return NextResponse.json({
        exists: true,
        product: {
          id: product._id,
          name: product.name,
          website: product.website,
          tagline: product.tagline,
          description: product.description,
          logo: product.logo,
          addedByAdmin: product.addedByAdmin,
          addedByUser: product.user
            ? {
                id: product.user._id,
                name: product.user.name,
                email: product.user.email,
              }
            : null,
        },
      });
    }
  } catch (error) {
    console.error("Error checking product existence:", error);
    return NextResponse.json(
      { error: "Failed to check product existence" },
      { status: 500 }
    );
  }
}

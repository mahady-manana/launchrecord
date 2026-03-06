import { connectToDatabase } from "@/lib/db";
import { uploadImageUrlToS3 } from "@/lib/s3-upload";
import Product from "@/models/product";
import Topic from "@/models/topic";
import { NextRequest, NextResponse } from "next/server";
import normalizeUrl from "normalize-url";

// Helper function to create or find topics and return their IDs
async function processTopics(topicNames: string[]): Promise<string[]> {
  const topicIds: string[] = [];

  for (const topicName of topicNames) {
    const trimmedName = topicName.trim();
    if (!trimmedName) continue;

    let topic = await Topic.findOne({
      name: { $regex: new RegExp(`^${trimmedName}$`, "i") },
    });

    if (!topic) {
      topic = await Topic.create({ name: trimmedName });
    }

    topicIds.push(topic._id.toString());
  }

  return topicIds;
}

// Helper function to download and upload logo to S3
async function processLogo(logoUrl: string | null): Promise<string | null> {
  if (!logoUrl) return null;

  try {
    const result = await uploadImageUrlToS3(logoUrl);
    return result.url;
  } catch (error) {
    console.error("Failed to upload logo to S3:", error);
    return null;
  }
}

// POST - Bulk import products (create only, no update, no audit)
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();

    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: "Expected an array of products" },
        { status: 400 },
      );
    }

    const results = [];

    for (const item of body) {
      const { name, website, tagline, topics, metadata, logo, id } = item;
      let normalizedWebsite = normalizeUrl(website, { forceHttps: true });

      if (!name || !website) {
        results.push({
          name: name || "Unknown",
          website: normalizedWebsite || "Unknown",
          success: false,
          error: "Name and website are required",
          logo,
          metadata: {
            source: "ph",
            sourceId: id,
            ...metadata,
          },
        });
        continue;
      }

      try {
        // Check for duplicate based on normalized URL
        let product = await Product.findOne({
          website: normalizedWebsite,
        });

        if (product) {
          // Product already exists with this normalized URL, skip it
          results.push({
            name,
            website: normalizedWebsite,
            success: false,
            existing: true,
            productId: product._id,
            message: "Product already exists (skipped - duplicate URL)",
          });
          continue;
        }

        // Create new product
        const productData: any = {
          name,
          website: normalizedWebsite,
          tagline: tagline || null,
          description: tagline || null,
          addedByAdmin: true,
          surveyData: {
            adminAudit: true,
            adminAuditAt: new Date(),
          },
        };

        // Process logo if provided
        if (logo) {
          const uploadedLogoUrl = await processLogo(logo);
          if (uploadedLogoUrl) {
            productData.logo = uploadedLogoUrl;
          }
        } else {
          productData.logo = `http://www.google.com/s2/favicons?domain=${normalizedWebsite}`;
        }

        if (topics && Array.isArray(topics) && topics.length > 0) {
          const topicIds = await processTopics(topics);
          productData.topics = topicIds;
        }

        if (metadata) {
          productData.metadata = metadata;
        }

        product = await Product.create(productData);

        results.push({
          name,
          website: normalizedWebsite,
          success: true,
          existing: false,
          productId: product._id,
          message: "Product created",
        });
      } catch (error: any) {
        results.push({
          name,
          website: normalizedWebsite,
          success: false,
          error: error.message || "Failed to process product",
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${results.length} products`,
      results,
    });
  } catch (error: any) {
    console.error("Bulk import error:", error);
    return NextResponse.json(
      { error: "Bulk import failed", details: error.message },
      { status: 500 },
    );
  }
}

// GET - List all products
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "20");
    const search = request.nextUrl.searchParams.get("search") || "";
    const adminOnly = request.nextUrl.searchParams.get("adminOnly") === "true";
    const notAudited =
      request.nextUrl.searchParams.get("notAudited") === "true";

    const skip = (page - 1) * limit;

    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { website: { $regex: search, $options: "i" } },
        { tagline: { $regex: search, $options: "i" } },
      ];
    }
    if (adminOnly) {
      query.addedByAdmin = true;
    }

    // Filter for products without audit reports
    if (notAudited) {
      const auditedProductIds = await Product.find({
        reports: { $exists: true, $ne: [], $size: 0 },
      }).distinct("_id");
      query._id = { $nin: auditedProductIds };
    }

    const [products, total] = await Promise.all([
      Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Product.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Get products API error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve products" },
      { status: 500 },
    );
  }
}

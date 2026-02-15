import Launch from "@/lib/models/launch";
import { connectToDatabase } from "@/lib/mongodb";
import { escapeRegex, sanitizeText } from "@/lib/sanitize";
import { LAUNCH_CATEGORIES } from "@/types";
import { NextResponse } from "next/server";
import { z } from "zod";
import { serializeMongooseDocument } from "@/lib/utils";

const getLaunchesSchema = z.object({
  category: z.union([
    z.enum(["all", ...LAUNCH_CATEGORIES]),
    z.array(z.enum(LAUNCH_CATEGORIES)).max(3),
    z.undefined(),
  ]),
  q: z.string().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const parsedQuery = getLaunchesSchema.parse({
      category: searchParams.get("category") || "all",
      q: searchParams.get("q") || "",
      page: searchParams.get("page") || 1,
      limit: searchParams.get("limit") || 20,
    });

    const query: Record<string, unknown> = {
      isArchived: false,
      placement: { $nin: ["left", "right"] },
    };

    if (parsedQuery.category && parsedQuery.category !== "all") {
      // Handle both single category and array of categories
      query.$or = [
        { category: parsedQuery.category },
        { category: { $in: [parsedQuery.category] } },
      ];
    }

    if (parsedQuery.q?.trim()) {
      const cleaned = sanitizeText(parsedQuery.q).slice(0, 100);
      const searchRegex = new RegExp(escapeRegex(cleaned), "i");
      query.$or = [
        { name: searchRegex },
        { tagline: searchRegex },
        { description: searchRegex },
        { valueProposition: searchRegex },
        { problem: searchRegex },
        { audience: searchRegex },
      ];
    }

    const total = await Launch.countDocuments(query);

    // Aggregation pipeline to populate user info for launches
    const populatedLaunches = await Launch.find(query)
      .populate("submittedBy", "name x linkedin")
      .select("-__v") // Exclude version field
      .lean();

    // Convert to plain objects to remove any potential circular references
    const plainLaunches = serializeMongooseDocument(populatedLaunches);
    
    const totalPages = Math.max(Math.ceil(total / parsedQuery.limit), 1);

    return NextResponse.json({
      success: true,
      launches: plainLaunches,
      pagination: {
        page: parsedQuery.page,
        limit: parsedQuery.limit,
        total,
        totalPages,
        hasNextPage: parsedQuery.page < totalPages,
        hasPreviousPage: parsedQuery.page > 1,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: error.errors[0]?.message || "Invalid query.",
        },
        { status: 400 },
      );
    }

    console.error("Error fetching launches:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch launches." },
      { status: 500 },
    );
  }
}

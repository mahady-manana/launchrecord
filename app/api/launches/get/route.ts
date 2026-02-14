import { NextResponse } from "next/server";
import { z } from "zod";
import { LAUNCH_CATEGORIES } from "@/types";
import { connectToDatabase } from "@/lib/mongodb";
import Launch from "@/lib/models/launch";
import { escapeRegex, sanitizeText } from "@/lib/sanitize";

const getLaunchesSchema = z.object({
  category: z.union([
    z.enum(["all", ...LAUNCH_CATEGORIES]), 
    z.array(z.enum(LAUNCH_CATEGORIES)).max(3),
    z.undefined()
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
        { category: { $in: [parsedQuery.category] } }
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

    const skip = (parsedQuery.page - 1) * parsedQuery.limit;

    const [launches, total, leftPlacements, rightPlacements, heroPlacements] =
      await Promise.all([
        Launch.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parsedQuery.limit)
          .lean(),
        Launch.countDocuments(query),
        Launch.find({ isArchived: false, placement: "left" })
          .sort({ createdAt: -1 })
          .limit(10)
          .lean(),
        Launch.find({ isArchived: false, placement: "right" })
          .sort({ createdAt: -1 })
          .limit(10)
          .lean(),
        Launch.find({ isArchived: false, placement: "hero" })
          .sort({ createdAt: -1 })
          .limit(2)
          .lean(),
      ]);

    const totalPages = Math.max(Math.ceil(total / parsedQuery.limit), 1);

    return NextResponse.json({
      success: true,
      launches,
      leftPlacements,
      rightPlacements,
      heroPlacements,
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
        { success: false, message: error.errors[0]?.message || "Invalid query." },
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

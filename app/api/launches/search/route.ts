import Launch from "@/lib/models/launch";
import { connectToDatabase } from "@/lib/mongodb";
import { escapeRegex, sanitizeText } from "@/lib/sanitize";
import { serializeMongooseDocument } from "@/lib/utils";
import { NextResponse } from "next/server";
import { z } from "zod";

const searchSchema = z.object({
  q: z.string().min(3).max(100),
  limit: z.coerce.number().int().min(1).max(20).default(10),
});

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const parsedQuery = searchSchema.parse({
      q: searchParams.get("q"),
      limit: searchParams.get("limit") || 10,
    });

    // Clean and sanitize the search query
    const searchTerm = sanitizeText(parsedQuery.q);
    const searchRegex = new RegExp(escapeRegex(searchTerm), "i");

    // Build optimized query - primarily search by name
    const query: Record<string, unknown> = {
      isArchived: false,
      status: { $in: ["prelaunch", "launched"] },
      $or: [{ name: searchRegex }, { tagline: searchRegex }],
    };

    // Execute search with limit
    const launches = await Launch.find(query)
      .select("name slug tagline logoUrl")
      .limit(parsedQuery.limit)
      .lean();

    // Convert to plain objects
    const plainLaunches = serializeMongooseDocument(launches);

    return NextResponse.json({
      success: true,
      launches: plainLaunches,
      count: plainLaunches.length,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: error.errors[0]?.message || "Invalid search query.",
        },
        { status: 400 },
      );
    }

    console.error("Error searching launches:", error);
    return NextResponse.json(
      { success: false, message: "Failed to search launches." },
      { status: 500 },
    );
  }
}

import {
  aggregateClickStats,
  aggregateOutboundClickStats,
} from "@/lib/click-stats";
import Click from "@/lib/models/click";
import Launch from "@/lib/models/launch";
import User from "@/lib/models/user";
import { connectToDatabase } from "@/lib/mongodb";
import { escapeRegex, sanitizeText } from "@/lib/sanitize";
import { serializeMongooseDocument } from "@/lib/utils";
import { LAUNCH_CATEGORIES } from "@/types";
import { NextResponse } from "next/server";
import { z } from "zod";

const getLaunchesSchema = z.object({
  category: z.union([
    z.enum(["all", ...LAUNCH_CATEGORIES]),
    z.array(z.enum(LAUNCH_CATEGORIES)).max(3),
    z.undefined(),
  ]),
  q: z.string().max(100).optional(),
  timeFilter: z.string().optional(),
  prelaunchOnly: z.string().optional().nullable(),
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
      timeFilter: searchParams.get("timeFilter"),
      prelaunchOnly: searchParams.get("prelaunchOnly"),
      page: searchParams.get("page") || 1,
      limit: searchParams.get("limit") || 20,
    });

    const query: Record<string, unknown> = {
      isArchived: false,
      status: { $in: ["prelaunch", "launched"] }, // Only show prelaunch and launched, exclude drafts
      placement: { $nin: ["left", "right"] },
    };

    // Apply time filter
    if (parsedQuery.timeFilter && parsedQuery.timeFilter !== "all") {
      const now = new Date();
      let startDate: Date;

      switch (parsedQuery.timeFilter) {
        case "today":
          startDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
          );
          break;
        case "week":
          const dayOfWeek = now.getDay();
          const startOfWeek = now.getDate() - dayOfWeek;
          startDate = new Date(now.getFullYear(), now.getMonth(), startOfWeek);
          break;
        case "month":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        default:
          startDate = new Date(0); // Beginning of time if invalid filter
      }

      query.createdAt = { $gte: startDate };
    }

    // Apply prelaunch only filter
    if (parsedQuery.prelaunchOnly === "true") {
      query.status = "prelaunch";
    }

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

    const x = User.name;
    console.log("====================================");
    console.log(x);
    console.log("====================================");
    const total = await Launch.countDocuments(query);

    // Aggregation pipeline to populate user info for launches
    const populatedLaunches = await Launch.find(query)
      .populate("submittedBy", "name x linkedin")
      .select("-__v") // Exclude version field
      .lean();

    // Fetch click stats for all launches in a single query
    const launchIds = populatedLaunches.map((l) => l._id);
    const clickRecords = await Click.find({ launchId: { $in: launchIds } })
      .select(
        "launchId all_time all_time_outbound daily_clicks daily_outbound_clicks",
      )
      .lean();

    // Build a map of click stats by launch ID
    const clickStatsMap = new Map();
    for (const record of clickRecords) {
      const launchIdStr = record.launchId.toString();
      const clickStats = aggregateClickStats(record.daily_clicks);
      const outboundStats = aggregateOutboundClickStats(
        record.daily_outbound_clicks,
      );
      clickStatsMap.set(launchIdStr, {
        all_time: record.all_time,
        all_time_outbound: record.all_time_outbound,
        stats: {
          clicks: clickStats,
          outbound: outboundStats,
        },
      });
    }

    // Convert to plain objects and add click stats
    const plainLaunches = serializeMongooseDocument(populatedLaunches).map(
      (launch: any) => ({
        ...launch,
        clickStats: clickStatsMap.get(launch._id) || {
          all_time: 0,
          all_time_outbound: 0,
          stats: {
            clicks: { today: 0, thisWeek: 0, lastWeek: 0, thisMonth: 0 },
            outbound: { today: 0, thisWeek: 0, lastWeek: 0, thisMonth: 0 },
          },
        },
      }),
    );

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
      console.log("====================================");
      console.log(error);
      console.log("====================================");
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

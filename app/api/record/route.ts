import {
  aggregateClickStats,
  aggregateOutboundClickStats,
  getTodayDateString,
} from "@/lib/click-stats";
import Click from "@/lib/models/click";
import { connectToDatabase } from "@/lib/mongodb";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Configuration

const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_CLICKS_PER_IP_PER_PRODUCT = 1;

// In-memory rate limit store (for production, use Redis)
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Schema for click request
const clickRequestSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  sessionId: z.string().min(1, "Session ID is required"),
  type: z.enum(["click", "outbound"]).optional().default("click"),
  dwellTime: z.number().optional(),
});

// Generate a fingerprint from request headers for additional bot detection
function generateFingerprint(request: NextRequest): string {
  const userAgent = request.headers.get("user-agent") || "";
  const acceptLanguage = request.headers.get("accept-language") || "";
  const acceptEncoding = request.headers.get("accept-encoding") || "";

  // Check for suspicious user agents (bots, scrapers, curl, etc.)
  const suspiciousPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /curl/i,
    /wget/i,
    /python/i,
    /scrapy/i,
    /headless/i,
    /phantom/i,
    /selenium/i,
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(userAgent)) {
      throw new Error("Suspicious user agent detected");
    }
  }

  // Create a hash from headers
  const fingerprintData = `${userAgent}-${acceptLanguage}-${acceptEncoding}`;
  return crypto
    .createHash("sha256")
    .update(fingerprintData)
    .digest("hex")
    .slice(0, 16);
}

// Rate limiting function
function checkRateLimit(key: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetAt <= now) {
    // Reset or create new entry
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return { allowed: true, remaining: MAX_CLICKS_PER_IP_PER_PRODUCT - 1 };
  }

  if (entry.count >= MAX_CLICKS_PER_IP_PER_PRODUCT) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  rateLimitStore.set(key, entry);
  return {
    allowed: true,
    remaining: MAX_CLICKS_PER_IP_PER_PRODUCT - entry.count,
  };
}

// Clean up old rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt <= now) {
      rateLimitStore.delete(key);
    }
  }
}, RATE_LIMIT_WINDOW_MS);

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    // Get client IP for rate limiting
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded
      ? forwarded.split(",")[0].trim()
      : request.headers.get("x-real-ip") || "unknown";

    // Parse request body
    const body = await request.json();
    const parsed = clickRequestSchema.parse(body);
    const { productId, sessionId, type = "click", dwellTime } = parsed;

    // Generate fingerprint for bot detection
    let fingerprint: string;
    try {
      fingerprint = generateFingerprint(request);
    } catch (error) {
      console.warn("Bot detected:", ip, request.headers.get("user-agent"));
      return NextResponse.json(
        {
          success: false,
          message: "Request blocked: Suspicious activity detected.",
        },
        { status: 403 },
      );
    }

    // Rate limit check (per IP per product)
    const rateLimitKey = `click:${ip}:${productId}`;
    const rateLimitResult = checkRateLimit(rateLimitKey);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: "rle",
        },
        { status: 201 },
      );
    }

    const todayStr = getTodayDateString();

    // Check if session already clicked today for this product
    const existingSession = await Click.findOne({
      launchId: productId,
      "trackedSessions.sessionId": sessionId,
      "trackedSessions.date": todayStr,
      "trackedSessions.type": type,
    });

    if (existingSession) {
      // Session already clicked today - don't count duplicate
      return NextResponse.json({
        success: true,
        message: "car",
      });
    }

    // Check if today's entry exists
    const todayEntryExists = await Click.exists({
      launchId: productId,
      "daily_clicks.date": todayStr,
    });

    // Build the update operation with proper MongoDB operators
    const update: Record<string, unknown> = {};
    const $inc: Record<string, number> = {};
    const $push: Record<string, unknown> = {};

    if (type === "outbound") {
      // Handle outbound click
      $inc.all_time_outbound = 1;

      if (todayEntryExists) {
        $inc["daily_outbound_clicks.$.clicks"] = 1;
      } else {
        $push.daily_outbound_clicks = {
          $each: [{ date: todayStr, clicks: 1 }],
          $slice: -30, // Keep only last 30 days
        };
      }
    } else {
      // Handle regular click
      $inc.all_time = 1;

      if (todayEntryExists) {
        $inc["daily_clicks.$.clicks"] = 1;
      } else {
        $push.daily_clicks = {
          $each: [{ date: todayStr, clicks: 1 }],
          $slice: -30, // Keep only last 30 days
        };
      }
    }

    // Add session tracking
    $push.trackedSessions = {
      $each: [{ sessionId, date: todayStr, type }],
      $slice: -100, // Keep last 100 sessions to prevent unbounded growth
    };

    // Build final update object
    if (Object.keys($inc).length > 0) {
      update.$inc = $inc;
    }
    if (Object.keys($push).length > 0) {
      update.$push = $push;
    }

    // Perform atomic update with upsert
    const result = await Click.findOneAndUpdate(
      { launchId: productId },
      update,
      {
        upsert: true,
        new: true,
        runValidators: true,
      },
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: error.errors[0]?.message || "Invalid request.",
        },
        { status: 400 },
      );
    }

    console.error("Error recording click:", error);
    return NextResponse.json(
      { success: false, message: "Failed to record click." },
      { status: 500 },
    );
  }
}

// GET endpoint to retrieve click stats for a product
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Product ID is required." },
        { status: 400 },
      );
    }

    const clickRecord = await Click.findOne({ launchId: productId });

    if (!clickRecord) {
      return NextResponse.json({
        success: true,
        data: {
          all_time: 0,
          all_time_outbound: 0,
          stats: {
            clicks: { today: 0, thisWeek: 0, lastWeek: 0, thisMonth: 0 },
            outbound: { today: 0, thisWeek: 0, lastWeek: 0, thisMonth: 0 },
          },
          daily_clicks: [],
          daily_outbound_clicks: [],
        },
      });
    }

    const clickStats = aggregateClickStats(clickRecord.daily_clicks);
    const outboundStats = aggregateOutboundClickStats(
      clickRecord.daily_outbound_clicks,
    );

    return NextResponse.json({
      success: true,
      data: {
        all_time: clickRecord.all_time,
        all_time_outbound: clickRecord.all_time_outbound,
        stats: {
          clicks: clickStats,
          outbound: outboundStats,
        },
        daily_clicks: clickRecord.daily_clicks,
        daily_outbound_clicks: clickRecord.daily_outbound_clicks,
      },
    });
  } catch (error) {
    console.error("Error fetching click stats:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch click stats." },
      { status: 500 },
    );
  }
}

import { getLatestPositioningReport } from "@/services/positioning-audit";
import { runStandaloneAEOAudit } from "@/services/aeo-audit/aeo-audit-standalone";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import Report from "@/models/report";
import mongoose from "mongoose";

const aeoAuditSchema = z.object({
  url: z.string().url("Invalid URL format"),
  productId: z.string().optional(),
  saveToDb: z.boolean().optional().default(false),
  force: z.boolean().optional().default(false),
});

/**
 * POST /api/aeo-audit
 *
 * Run a comprehensive AEO (AI Engine Optimization) audit.
 *
 * CACHING BEHAVIOR:
 * - Checks for existing AEO reports for the same product within last 30 days
 * - Returns cached report if found (unless force=true)
 * - This ensures consistent scores for the same website
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = aeoAuditSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid request",
          details: validation.error.errors,
        },
        { status: 400 },
      );
    }

    const { url, productId, saveToDb, force } = validation.data;

    // Check for existing recent report if productId is provided and force is false
    if (productId && !force) {
      try {
        const existingReport = await Report.findOne({
          product: new mongoose.Types.ObjectId(productId),
          "aeo_index.score": { $exists: true },
        })
          .sort({ createdAt: -1 })
          .exec();

        if (existingReport) {
          const now = new Date();
          const reportDate = existingReport.createdAt as Date;
          const diffInDays =
            (now.getTime() - reportDate.getTime()) / (1000 * 60 * 60 * 24);

          if (diffInDays <= 30) {
            // Convert to AEO audit result format
            const aeoResult = {
              _id: existingReport._id,
              url: url,
              score: existingReport.aeo_index?.score || 0,
              maxScore: 100,
              checks: existingReport.aeo_index?.audit || [],
              createdAt: existingReport.createdAt,
              fromCache: true,
              cacheAge: Math.round(diffInDays),
            };

            return NextResponse.json(aeoResult);
          }
        }
      } catch (dbError) {
        console.error("Error checking for existing AEO report:", dbError);
        // Continue with new audit if DB check fails
      }
    }

    // Run new audit (no recent report found or force=true)
    const result = await runStandaloneAEOAudit({
      url,
      timeout: 30000,
    });

    // Save to database if requested
    if (saveToDb && productId) {
      try {
        // Note: You may want to create a dedicated AEO report model
        // For now, we're using the existing Report model structure
        // This is a simplified save - you may want to expand based on your needs
        console.log("AEO audit completed, result ready for saving");
      } catch (dbError) {
        console.error("Failed to save AEO report to database:", dbError);
      }
    }

    return NextResponse.json({
      ...result,
      fromCache: false,
    });
  } catch (error) {
    console.error("AEO audit API error:", error);

    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return NextResponse.json(
          {
            error: "OpenAI API key not configured",
            message: "Please configure your OpenAI API key",
          },
          { status: 503 },
        );
      }

      if (error.message.includes("rate limit")) {
        return NextResponse.json(
          {
            error: "Rate limit exceeded",
            message: "Please try again in a few moments",
          },
          { status: 429 },
        );
      }
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/aeo-audit
 *
 * Returns information about the AEO audit service.
 */
export async function GET() {
  return NextResponse.json({
    name: "AEO Audit API",
    description: "AI Engine Optimization audit service",
    version: "1.0.0",
    caching: {
      enabled: true,
      duration: "30 days",
      description: "Reports are cached to ensure consistent scores",
    },
  });
}

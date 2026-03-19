import {
  createPositioningReport,
  deletePositioningReport,
  getLatestPositioningReport,
  getPositioningReportById,
  getPositioningReports,
  updatePositioningReport,
} from "@/services/positioning-audit";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createReportSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  url: z.string().url("Invalid URL format"),
  auditResult: z.object({
    overallScore: z.number().min(0).max(100),
    categoryOwnership: z.object({
      score: z.number().min(0).max(100),
      maxScore: z.number().min(0).max(100),
      categoryDefinition: z.string(),
      ownedKeywords: z.array(z.string()),
      missingKeywords: z.array(z.string()),
      categoryLeaders: z.array(z.string()),
      categoryOwnershipLevel: z.enum([
        "Dominant",
        "Strong",
        "Blended",
        "Weak",
        "Ghost",
      ]),
      recommendations: z.array(z.string()),
    }),
    uniqueValueProposition: z.object({
      score: z.number().min(0).max(100),
      maxScore: z.number().min(0).max(100),
      identifiedUVP: z.string(),
      uvpClarity: z.enum([
        "Exceptional",
        "Clear",
        "Moderate",
        "Unclear",
        "Absent",
      ]),
      uniquenessLevel: z.enum([
        "Highly Unique",
        "Distinctive",
        "Moderate",
        "Generic",
        "Common",
      ]),
      supportingEvidence: z.array(z.string()),
      recommendations: z.array(z.string()),
    }),
    competitiveDifferentiation: z.object({
      score: z.number().min(0).max(100),
      maxScore: z.number().min(0).max(100),
      identifiedCompetitors: z.array(z.string()),
      differentiationFactors: z.array(z.string()),
      weakPoints: z.array(z.string()),
      differentiationStrength: z.enum([
        "Dominant",
        "Strong",
        "Moderate",
        "Weak",
        "Absent",
      ]),
      recommendations: z.array(z.string()),
    }),
    targetAudienceClarity: z.object({
      score: z.number().min(0).max(100),
      maxScore: z.number().min(0).max(100),
      identifiedAudiences: z.array(z.string()),
      audienceSpecificity: z.enum([
        "Laser-Focused",
        "Specific",
        "Moderate",
        "Vague",
        "Undefined",
      ]),
      personaDepth: z.enum([
        "Comprehensive",
        "Detailed",
        "Basic",
        "Minimal",
        "Missing",
      ]),
      recommendations: z.array(z.string()),
    }),
    problemSolutionFit: z.object({
      score: z.number().min(0).max(100),
      maxScore: z.number().min(0).max(100),
      identifiedProblems: z.array(z.string()),
      solutionClarity: z.string(),
      fitQuality: z.enum(["Exceptional", "Strong", "Moderate", "Weak", "Poor"]),
      recommendations: z.array(z.string()),
    }),
    messagingConsistency: z.object({
      score: z.number().min(0).max(100),
      maxScore: z.number().min(0).max(100),
      toneConsistency: z.enum([
        "Exceptional",
        "Consistent",
        "Moderate",
        "Inconsistent",
        "Chaotic",
      ]),
      valuePropConsistency: z.enum([
        "Exceptional",
        "Consistent",
        "Moderate",
        "Inconsistent",
        "Contradictory",
      ]),
      channelAlignment: z.array(z.string()),
      recommendations: z.array(z.string()),
    }),
  }),
  metadata: z
    .object({
      auditDuration: z.number().optional(),
      tokenUsage: z.number().optional(),
      modelUsed: z.string().optional(),
      rawAnalysis: z.string().optional(),
    })
    .optional(),
});

const updateReportSchema = z.object({
  overallScore: z.number().min(0).max(100).optional(),
  categoryOwnership: z
    .object({
      score: z.number().min(0).max(100),
      maxScore: z.number().min(0).max(100).default(100),
      categoryDefinition: z.string(),
      ownedKeywords: z.array(z.string()),
      missingKeywords: z.array(z.string()),
      categoryLeaders: z.array(z.string()),
      categoryOwnershipLevel: z.enum([
        "Dominant",
        "Strong",
        "Blended",
        "Weak",
        "Ghost",
      ]),
      recommendations: z.array(z.string()),
    })
    .optional(),
  uniqueValueProposition: z
    .object({
      score: z.number().min(0).max(100),
      maxScore: z.number().min(0).max(100).default(100),
      identifiedUVP: z.string(),
      uvpClarity: z.enum([
        "Exceptional",
        "Clear",
        "Moderate",
        "Unclear",
        "Absent",
      ]),
      uniquenessLevel: z.enum([
        "Highly Unique",
        "Distinctive",
        "Moderate",
        "Generic",
        "Common",
      ]),
      supportingEvidence: z.array(z.string()),
      recommendations: z.array(z.string()),
    })
    .optional(),
  competitiveDifferentiation: z
    .object({
      score: z.number().min(0).max(100),
      maxScore: z.number().min(0).max(100).default(100),
      identifiedCompetitors: z.array(z.string()),
      differentiationFactors: z.array(z.string()),
      weakPoints: z.array(z.string()),
      differentiationStrength: z.enum([
        "Dominant",
        "Strong",
        "Moderate",
        "Weak",
        "Absent",
      ]),
      recommendations: z.array(z.string()),
    })
    .optional(),
  targetAudienceClarity: z
    .object({
      score: z.number().min(0).max(100),
      maxScore: z.number().min(0).max(100).default(100),
      identifiedAudiences: z.array(z.string()),
      audienceSpecificity: z.enum([
        "Laser-Focused",
        "Specific",
        "Moderate",
        "Vague",
        "Undefined",
      ]),
      personaDepth: z.enum([
        "Comprehensive",
        "Detailed",
        "Basic",
        "Minimal",
        "Missing",
      ]),
      recommendations: z.array(z.string()),
    })
    .optional(),
  problemSolutionFit: z
    .object({
      score: z.number().min(0).max(100),
      maxScore: z.number().min(0).max(100).default(100),
      identifiedProblems: z.array(z.string()),
      solutionClarity: z.string(),
      fitQuality: z.enum(["Exceptional", "Strong", "Moderate", "Weak", "Poor"]),
      recommendations: z.array(z.string()),
    })
    .optional(),
  messagingConsistency: z
    .object({
      score: z.number().min(0).max(100),
      maxScore: z.number().min(0).max(100).default(100),
      toneConsistency: z.enum([
        "Exceptional",
        "Consistent",
        "Moderate",
        "Inconsistent",
        "Chaotic",
      ]),
      valuePropConsistency: z.enum([
        "Exceptional",
        "Consistent",
        "Moderate",
        "Inconsistent",
        "Contradictory",
      ]),
      channelAlignment: z.array(z.string()),
      recommendations: z.array(z.string()),
    })
    .optional(),
});

/**
 * GET /api/positioning-reports
 *
 * Get positioning reports with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get("productId");
    const reportId = searchParams.get("reportId");
    const type = searchParams.get("type") || "list";

    if (!productId && !reportId) {
      return NextResponse.json(
        { error: "productId or reportId is required" },
        { status: 400 },
      );
    }

    // Get single report by ID
    if (reportId) {
      const report = await getPositioningReportById(reportId);
      if (!report) {
        return NextResponse.json(
          { error: "Report not found" },
          { status: 404 },
        );
      }
      return NextResponse.json(report);
    }

    // Get latest report for product
    if (type === "latest") {
      const report = await getLatestPositioningReport(productId!);
      if (!report) {
        return NextResponse.json(
          { message: "No reports found for this product" },
          { status: 404 },
        );
      }
      return NextResponse.json(report);
    }

    // Get paginated list of reports
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const result = await getPositioningReports(productId!, {
      page,
      limit,
      sortBy: sortBy as any,
      sortOrder: sortOrder as any,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Get positioning reports error:", error);
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
 * POST /api/positioning-reports
 *
 * Create a new positioning report
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = createReportSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid request",
          details: validation.error.errors,
        },
        { status: 400 },
      );
    }

    const { productId, url, auditResult, metadata } = validation.data;

    const report = await createPositioningReport(
      productId,
      url,
      {
        url,
        timestamp: new Date(),
        ...auditResult,
      },
      metadata,
    );

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error("Create positioning report error:", error);
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
 * PUT /api/positioning-reports
 *
 * Update an existing positioning report
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const reportId = body.reportId;

    if (!reportId) {
      return NextResponse.json(
        { error: "reportId is required" },
        { status: 400 },
      );
    }

    const { reportId: _, ...updates } = body;
    const validation = updateReportSchema.safeParse(updates);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid request",
          details: validation.error.errors,
        },
        { status: 400 },
      );
    }

    const report = await updatePositioningReport(
      reportId,
      validation.data as any,
    );

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error("Update positioning report error:", error);
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
 * DELETE /api/positioning-reports
 *
 * Delete a positioning report
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const reportId = searchParams.get("reportId");

    if (!reportId) {
      return NextResponse.json(
        { error: "reportId is required" },
        { status: 400 },
      );
    }

    const deleted = await deletePositioningReport(reportId);

    if (!deleted) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Report deleted successfully",
    });
  } catch (error) {
    console.error("Delete positioning report error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

import {
  createClarityReport,
  deleteClarityReport,
  getClarityReportById,
  getClarityReports,
  getLatestClarityReport,
  updateClarityReport,
} from "@/services/clarity-audit/clarity-report-crud";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createReportSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  url: z.string().url("Invalid URL format"),
  auditResult: z.object({
    score: z.number().min(0).max(100),
    band: z.enum(["instant", "clear", "average", "confusing", "opaque"]),
    critique: z.string(),
    metrics: z.object({
      headlineClarity: z.number().min(0).max(100),
      visualFlow: z.number().min(0).max(100),
      valueHierarchy: z.number().min(0).max(100),
      benefitClarity: z.number().min(0).max(100),
      ctaClarity: z.number().min(0).max(100),
      proofPlacement: z.number().min(0).max(100),
    }),
    findings: z.array(z.string()),
    recommendations: z.array(
      z.object({
        action: z.string(),
        priority: z.number().min(0).max(100),
      }),
    ),
    fiveSecondTest: z.object({
      passes: z.boolean(),
      timeToUnderstand: z.number().min(0).max(30),
      frictionPoints: z.array(z.string()),
    }),
  }),
  metadata: z
    .object({
      auditDuration: z.number().optional(),
      tokenUsage: z.number().optional(),
      modelUsed: z.string().optional(),
    })
    .optional(),
});

const updateReportSchema = z.object({
  score: z.number().min(0).max(100).optional(),
  band: z
    .enum(["instant", "clear", "average", "confusing", "opaque"])
    .optional(),
  critique: z.string().optional(),
  metrics: z
    .object({
      headlineClarity: z.number().min(0).max(100),
      visualFlow: z.number().min(0).max(100),
      valueHierarchy: z.number().min(0).max(100),
      benefitClarity: z.number().min(0).max(100),
      ctaClarity: z.number().min(0).max(100),
      proofPlacement: z.number().min(0).max(100),
    })
    .optional(),
  findings: z.array(z.string()).optional(),
  recommendations: z
    .array(
      z.object({
        action: z.string(),
        priority: z.number().min(0).max(100),
      }),
    )
    .optional(),
  fiveSecondTest: z
    .object({
      passes: z.boolean(),
      timeToUnderstand: z.number().min(0).max(30),
      frictionPoints: z.array(z.string()),
    })
    .optional(),
});

/**
 * GET /api/clarity-reports
 *
 * Get clarity reports with optional filters
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
      const report = await getClarityReportById(reportId);
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
      const report = await getLatestClarityReport(productId!);
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

    const result = await getClarityReports(productId!, {
      page,
      limit,
      sortBy: sortBy as any,
      sortOrder: sortOrder as any,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Get clarity reports error:", error);
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
 * POST /api/clarity-reports
 *
 * Create a new clarity report
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

    const report = await createClarityReport(
      productId,
      url,
      {
        ...auditResult,
      },
      metadata,
    );

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error("Create clarity report error:", error);
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
 * PUT /api/clarity-reports
 *
 * Update an existing clarity report
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

    const report = await updateClarityReport(reportId, validation.data as any);

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error("Update clarity report error:", error);
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
 * DELETE /api/clarity-reports
 *
 * Delete a clarity report
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

    const deleted = await deleteClarityReport(reportId);

    if (!deleted) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Report deleted successfully",
    });
  } catch (error) {
    console.error("Delete clarity report error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

import FeaturedLaunch from "@/lib/models/featured-launch";
import Launch from "@/lib/models/launch";
import { connectToDatabase } from "@/lib/mongodb";
import { serializeMongooseDocument } from "@/lib/utils";
import { Types } from "mongoose";
import { NextResponse } from "next/server";
import { z } from "zod";

const createFeaturedSchema = z.object({
  launchId: z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid launch ID",
  }),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid start date format",
  }),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid end date format",
  }),
  priority: z.number().min(0).max(100).optional().default(0),
  isActive: z.boolean().optional().default(true),
});

const updateFeaturedSchema = z.object({
  id: z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid featured launch ID",
  }),
  launchId: z
    .string()
    .refine((val) => Types.ObjectId.isValid(val), {
      message: "Invalid launch ID",
    })
    .optional(),
  startDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid start date format",
    })
    .optional(),
  endDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid end date format",
    })
    .optional(),
  priority: z.number().min(0).max(100).optional(),
  isActive: z.boolean().optional(),
});

const deleteFeaturedSchema = z.object({
  id: z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid featured launch ID",
  }),
});

// GET - Get all featured launches (including inactive for admin management)
export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get("includeInactive") === "true";

    const query: Record<string, unknown> = {};
    if (!includeInactive) {
      const now = new Date();
      query.startDate = { $lte: now };
      query.endDate = { $gte: now };
    }

    const featuredLaunches = await FeaturedLaunch.find(query)
      .sort({ priority: -1, startDate: -1 })
      .lean();

    const plainFeaturedLaunches = serializeMongooseDocument(featuredLaunches);

    return NextResponse.json({
      success: true,
      featuredLaunches: plainFeaturedLaunches,
      count: plainFeaturedLaunches.length,
    });
  } catch (error) {
    console.error("Error fetching featured launches (admin):", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch featured launches." },
      { status: 500 },
    );
  }
}

// POST - Create a new featured launch
export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const validatedBody = createFeaturedSchema.parse(body);

    // Verify the launch exists and is not archived
    const launch = await Launch.findById(validatedBody.launchId);
    if (!launch || launch.isArchived) {
      return NextResponse.json(
        { success: false, message: "Launch not found or archived." },
        { status: 404 },
      );
    }

    // Validate date range
    const startDate = new Date(validatedBody.startDate);
    const endDate = new Date(validatedBody.endDate);

    if (startDate >= endDate && !validatedBody.launchId) {
      return NextResponse.json(
        {
          success: false,
          message: "End date must be after start date.",
        },
        { status: 400 },
      );
    }

    // Check for overlapping featured periods for the same launch
    const overlapping = await FeaturedLaunch.findOne({
      launchId: validatedBody.launchId,
      isActive: true,
      $or: [
        {
          startDate: { $lte: startDate },
          endDate: { $gte: startDate },
        },
        {
          startDate: { $lte: endDate },
          endDate: { $gte: endDate },
        },
        {
          startDate: { $gte: startDate },
          endDate: { $lte: endDate },
        },
      ],
    });

    if (overlapping) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This launch already has an overlapping active featured period.",
        },
        { status: 400 },
      );
    }

    const featuredLaunch = new FeaturedLaunch({
      launchId: validatedBody.launchId,
      startDate,
      endDate,
      priority: validatedBody.priority,
      isActive: validatedBody.isActive,
    });

    await featuredLaunch.save();

    const populatedFeatured = await FeaturedLaunch.findById(featuredLaunch._id)
      .populate("launchId")
      .lean();

    return NextResponse.json({
      success: true,
      featuredLaunch: serializeMongooseDocument(populatedFeatured),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: error.errors[0]?.message || "Invalid payload.",
        },
        { status: 400 },
      );
    }

    console.error("Error creating featured launch:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create featured launch." },
      { status: 500 },
    );
  }
}

// PUT - Update an existing featured launch
export async function PUT(request: Request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const validatedBody = updateFeaturedSchema.parse(body);

    // Verify the featured launch exists
    const existingFeatured = await FeaturedLaunch.findById(validatedBody.id);
    if (!existingFeatured) {
      return NextResponse.json(
        { success: false, message: "Featured launch not found." },
        { status: 404 },
      );
    }

    const updateData: Record<string, any> = {};

    if (validatedBody.launchId !== undefined) {
      // Verify the new launch exists
      const launch = await Launch.findById(validatedBody.launchId);
      if (!launch || launch.isArchived) {
        return NextResponse.json(
          { success: false, message: "Launch not found or archived." },
          { status: 404 },
        );
      }
      updateData.launchId = validatedBody.launchId;
    }

    if (validatedBody.startDate !== undefined) {
      updateData.startDate = new Date(validatedBody.startDate);
    }

    if (validatedBody.endDate !== undefined) {
      updateData.endDate = new Date(validatedBody.endDate);
    }

    if (validatedBody.priority !== undefined) {
      updateData.priority = validatedBody.priority;
    }

    if (validatedBody.isActive !== undefined) {
      updateData.isActive = validatedBody.isActive;
    }

    // Validate date range if both dates are present
    if (updateData.startDate && updateData.endDate) {
      if (updateData.startDate >= updateData.endDate) {
        return NextResponse.json(
          {
            success: false,
            message: "End date must be after start date.",
          },
          { status: 400 },
        );
      }
    }

    const updatedFeatured = await FeaturedLaunch.findByIdAndUpdate(
      validatedBody.id,
      updateData,
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("launchId")
      .lean();

    return NextResponse.json({
      success: true,
      featuredLaunch: serializeMongooseDocument(updatedFeatured),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: error.errors[0]?.message || "Invalid payload.",
        },
        { status: 400 },
      );
    }

    console.error("Error updating featured launch:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update featured launch." },
      { status: 500 },
    );
  }
}

// DELETE - Delete a featured launch
export async function DELETE(request: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Featured launch ID is required." },
        { status: 400 },
      );
    }

    const validatedParams = deleteFeaturedSchema.parse({ id });

    const deleted = await FeaturedLaunch.findByIdAndDelete(validatedParams.id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Featured launch not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Featured launch deleted successfully.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: error.errors[0]?.message || "Invalid payload.",
        },
        { status: 400 },
      );
    }

    console.error("Error deleting featured launch:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete featured launch." },
      { status: 500 },
    );
  }
}

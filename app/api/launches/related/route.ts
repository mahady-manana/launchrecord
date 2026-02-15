import { NextResponse } from "next/server";
import Launch from "@/lib/models/launch";
import { connectToDatabase } from "@/lib/mongodb";
import { serializeMongooseDocument } from "@/lib/utils";

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const launchId = searchParams.get("launchId");
    const category = searchParams.get("category");

    if (!launchId) {
      return NextResponse.json(
        { success: false, message: "Launch ID is required" },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category is required" },
        { status: 400 }
      );
    }

    // Parse the category (it could be a JSON string if it's an array)
    let parsedCategory;
    try {
      parsedCategory = JSON.parse(category);
    } catch {
      parsedCategory = category;
    }

    // Build aggregation pipeline to fetch all related launches in one query
    const pipeline = [
      {
        $match: {
          isArchived: false,
          _id: { $ne: launchId },
        }
      },
      {
        // Add a field to categorize each launch
        $addFields: {
          isSimilar: {
            $cond: {
              if: {
                $or: [
                  { $eq: ["$category", parsedCategory] },
                  { $in: [parsedCategory, "$category"] },
                  { 
                    $and: [
                      { $isArray: ["$category"] },
                      { $isArray: [parsedCategory] },
                      { $gt: [{ $size: { $setIntersection: ["$category", parsedCategory] } }, 0] }
                    ]
                  }
                ]
              },
              then: true,
              else: false
            }
          },
          isNew: true, // All fetched launches are "new" relative to the current one
          isTop: { $in: ["$placement", ["hero", "left", "right"]] }
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        // Split results into different arrays based on the categories
        $group: {
          _id: null,
          allLaunches: { $push: "$$ROOT" },
          total: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          allLaunches: 1,
          total: 1
        }
      }
    ];

    const results = await Launch.aggregate(pipeline);
    
    let similarApps = [];
    let newApps = [];
    let topLaunches = [];

    if (results.length > 0) {
      const allLaunches = results[0].allLaunches;
      
      // Filter similar apps based on category
      similarApps = allLaunches
        .filter(launch => {
          if (Array.isArray(parsedCategory)) {
            return Array.isArray(launch.category) 
              ? parsedCategory.some(cat => launch.category.includes(cat))
              : parsedCategory.includes(launch.category);
          } else {
            return Array.isArray(launch.category) 
              ? launch.category.includes(parsedCategory)
              : launch.category === parsedCategory;
          }
        })
        .slice(0, 6);

      // Get new apps (first 6)
      newApps = allLaunches.slice(0, 6);

      // Get top launches (with special placement)
      topLaunches = allLaunches
        .filter(launch => ["hero", "left", "right"].includes(launch.placement))
        .slice(0, 6);

      // If not enough top launches, fill with others
      if (topLaunches.length < 6) {
        const remainingLaunches = allLaunches
          .filter(launch => !topLaunches.some(tl => tl._id.equals(launch._id)))
          .slice(0, 6 - topLaunches.length);
        topLaunches = [...topLaunches, ...remainingLaunches];
      }
    }

    // Serialize the documents to plain objects
    const serializedSimilarApps = serializeMongooseDocument(similarApps);
    const serializedNewApps = serializeMongooseDocument(newApps);
    const serializedTopLaunches = serializeMongooseDocument(topLaunches);

    return NextResponse.json({
      success: true,
      data: {
        similarApps: serializedSimilarApps,
        newApps: serializedNewApps,
        topLaunches: serializedTopLaunches
      }
    });
  } catch (error) {
    console.error("Error fetching related launches:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch related launches" },
      { status: 500 }
    );
  }
}
import { getUserFromSession } from "@/lib/get-user-from-session";
import Launch from "@/lib/models/launch";
import User from "@/lib/models/user";
import { connectToDatabase } from "@/lib/mongodb";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIdentifier, isSameOrigin } from "@/lib/security";
import { NextResponse } from "next/server";
import { serializeMongooseDocument } from "@/lib/utils";

export async function GET(request: Request) {
  try {
    if (!isSameOrigin(request)) {
      return NextResponse.json(
        { success: false, message: "Invalid origin." },
        { status: 403 },
      );
    }

    const identifier = getClientIdentifier(request);
    const limitResult = rateLimit({
      key: `launches:user:${identifier}`,
      limit: 30,
      windowMs: 60 * 60 * 1000,
    });

    if (!limitResult.allowed) {
      return NextResponse.json(
        { success: false, message: "Rate limit exceeded. Try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil(limitResult.retryAfterMs / 1000)),
          },
        },
      );
    }

    const user = await getUserFromSession();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "You need to sign in first." },
        { status: 401 },
      );
    }

    await connectToDatabase();

    // Find all launches submitted by the user
    const rawUserLaunches = await Launch.find({ submittedBy: user._id })
      .sort({ createdAt: -1 })
      .lean();

    // Populate user information for each launch
    const populatedUserLaunches = await Promise.all(
      rawUserLaunches.map(async (launch) => {
        // Get user information for the launch
        const dbUser = await User.findById(launch.submittedBy)
          .select("name x linkedin")
          .lean();

        // Add user information to the launch object
        return {
          ...launch,
          name: dbUser?.name || "Unknown",
          x: dbUser?.x,
          linkedin: dbUser?.linkedin,
        };
      }),
    );

    // Convert to plain objects to remove any potential circular references
    const plainUserLaunches = serializeMongooseDocument(populatedUserLaunches);

    return NextResponse.json({
      success: true,
      launches: plainUserLaunches,
    });
  } catch (error) {
    console.error("Error fetching user launches:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch user launches." },
      { status: 500 },
    );
  }
}

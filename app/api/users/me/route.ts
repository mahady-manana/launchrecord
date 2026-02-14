import { NextResponse } from "next/server";
import { getUserFromSession } from "@/lib/get-user-from-session";

export async function GET() {
  try {
    const user = await getUserFromSession();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image || null,
      },
    });
  } catch (error) {
    console.error("Error loading current user:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch current user." },
      { status: 500 },
    );
  }
}

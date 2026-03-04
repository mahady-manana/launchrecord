import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey } = body;

    const adminSecretKey = process.env.ADMIN_SECRET_KEY;

    if (!adminSecretKey) {
      console.error("ADMIN_SECRET_KEY is not configured");
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 },
      );
    }

    if (!apiKey || apiKey !== adminSecretKey) {
      return NextResponse.json(
        { success: false, message: "Invalid admin key" },
        { status: 401 },
      );
    }

    // Create a session token (simple UUID-based)
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Store session in memory (for production, use Redis or database)
    // For now, we'll use a simple token that the client stores in sessionStorage
    const response = NextResponse.json({
      success: true,
      message: "Authenticated",
      sessionToken,
      expiresAt: expiresAt.toISOString(),
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { success: false, message: "Authentication failed" },
      { status: 500 },
    );
  }
}

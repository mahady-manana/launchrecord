import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/user";
import crypto from "crypto";

// GET - Verify email with token
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get("token");

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "Invalid or missing verification token" },
        { status: 400 }
      );
    }

    // Hash the token to compare with stored hash
    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      verificationTokenHash: tokenHash,
      deletedAt: null,
    }).select("+verificationTokenHash +verificationTokenExpiresAt");

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (
      !user.verificationTokenExpiresAt ||
      user.verificationTokenExpiresAt < new Date()
    ) {
      return NextResponse.json(
        { error: "Verification token has expired" },
        { status: 400 }
      );
    }

    // Mark email as verified
    user.emailVerified = new Date();
    user.verificationTokenHash = null;
    user.verificationTokenExpiresAt = null;
    await user.save();

    // Redirect to success page
    const callbackUrl = request.nextUrl.searchParams.get("callbackUrl") || "/dashboard";
    const redirectUrl = new URL(callbackUrl, request.url);
    redirectUrl.searchParams.set("verified", "true");

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Error verifying email:", error);
    return NextResponse.json(
      { error: "Failed to verify email" },
      { status: 500 }
    );
  }
}

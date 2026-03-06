import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/user";
import Product from "@/models/product";
import crypto from "crypto";
import { getClientIp, isSameOrigin } from "@/utils/security";
import { rateLimit } from "@/utils/rate-limit";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// POST - Verify claim code and claim product
export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }

  const limiter = rateLimit(`claim-verify:${getClientIp(request)}`, {
    limit: 10,
    windowMs: 60_000,
  });

  if (!limiter.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "You must be logged in to claim a product" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { code } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { error: "Verification code is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({
      email: session.user.email,
      deletedAt: null,
    }).select("+claimTokenHash +claimTokenExpiresAt +claimProductId");

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (
      !user.claimTokenHash ||
      !user.claimTokenExpiresAt ||
      !user.claimProductId
    ) {
      return NextResponse.json(
        { error: "No pending claim found. Please start the claim process again." },
        { status: 400 }
      );
    }

    // Check if code is expired
    if (user.claimTokenExpiresAt < new Date()) {
      user.claimTokenHash = null;
      user.claimTokenExpiresAt = null;
      user.claimProductId = null;
      await user.save();

      return NextResponse.json(
        { error: "Verification code has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Hash the provided code and compare
    const providedCodeHash = crypto
      .createHash("sha256")
      .update(code)
      .digest("hex");

    if (providedCodeHash !== user.claimTokenHash) {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 }
      );
    }

    // Code is valid - claim the product
    const product = await Product.findById(user.claimProductId);
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Add user to owners array (many-to-many)
    if (!product.users) {
      product.users = [];
    }
    const isAlreadyOwner = product.users.some((u: any) => u.toString() === user._id.toString());
    if (!isAlreadyOwner) {
      product.users.push(user._id as any);
    }
    product.addedByAdmin = false;
    await product.save();

    // Clear claim tokens
    user.claimTokenHash = null;
    user.claimTokenExpiresAt = null;
    user.claimProductId = null;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Product claimed successfully",
      product: {
        id: product._id,
        name: product.name,
        website: product.website,
      },
    });
  } catch (error) {
    console.error("Error verifying claim code:", error);
    return NextResponse.json(
      { error: "Failed to verify claim code" },
      { status: 500 }
    );
  }
}

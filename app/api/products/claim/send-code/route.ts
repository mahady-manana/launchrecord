import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/user";
import Product from "@/models/product";
import { sendClaimVerificationCode } from "@/lib/resend-email";
import crypto from "crypto";
import { getClientIp, isSameOrigin } from "@/utils/security";
import { rateLimit } from "@/utils/rate-limit";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// POST - Send claim verification code
export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }

  const limiter = rateLimit(`claim:${getClientIp(request)}`, {
    limit: 5,
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
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({
      email: session.user.email,
      deletedAt: null,
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    if (!product.addedByAdmin && product.user) {
      return NextResponse.json(
        { error: "This product is already claimed" },
        { status: 400 }
      );
    }

    // Generate 6-digit verification code
    const claimCode = Math.floor(100000 + Math.random() * 900000).toString();
    const claimCodeHash = crypto
      .createHash("sha256")
      .update(claimCode)
      .digest("hex");
    const claimCodeExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    user.claimTokenHash = claimCodeHash;
    user.claimTokenExpiresAt = claimCodeExpiresAt;
    user.claimProductId = product._id;
    await user.save();

    // Send verification code email
    await sendClaimVerificationCode(user.email, claimCode, product.name);

    return NextResponse.json({
      success: true,
      message: "Verification code sent to your email",
    });
  } catch (error) {
    console.error("Error sending claim code:", error);
    return NextResponse.json(
      { error: "Failed to send verification code" },
      { status: 500 }
    );
  }
}

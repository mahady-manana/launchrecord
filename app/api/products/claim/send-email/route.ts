import { connectToDatabase } from "@/lib/db";
import { sendClaimVerificationLink } from "@/lib/resend-email";
import Product from "@/models/product";
import { rateLimit } from "@/utils/rate-limit";
import { getClientIp, isSameOrigin } from "@/utils/security";
import crypto from "crypto";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// Claim schema for temporary verification
const ClaimSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  email: { type: String, required: true },
  tokenHash: { type: String, required: true, select: false },
  expiresAt: { type: Date, required: true },
  claimed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Claim = mongoose.models.Claim || mongoose.model("Claim", ClaimSchema);

// POST - Send claim verification email with link
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
      { status: 429 },
    );
  }

  try {
    await connectToDatabase();

    const body = await request.json();
    const { productId, email } = body;

    if (!productId || !email) {
      return NextResponse.json(
        { error: "Product ID and email are required" },
        { status: 400 },
      );
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (!product.addedByAdmin && product.users && product.users.length > 0) {
      return NextResponse.json(
        { error: "This product is already claimed" },
        { status: 400 },
      );
    }

    // Verify email domain matches product website domain
    const emailDomain = email.split("@")[1]?.toLowerCase();
    let productDomain = "";
    try {
      const url = new URL(
        product.website?.startsWith("http")
          ? product.website
          : `https://${product.website}`,
      );
      productDomain = url.hostname.toLowerCase();
    } catch {
      return NextResponse.json(
        { error: "Invalid product website URL" },
        { status: 400 },
      );
    }

    // if (!emailDomain || !productDomain.includes(emailDomain)) {
    //   return NextResponse.json(
    //     { error: "Email domain must match the product website domain" },
    //     { status: 400 },
    //   );
    // }

    // Generate verification token
    const claimToken = crypto.randomBytes(32).toString("hex");
    const claimTokenHash = crypto
      .createHash("sha256")
      .update(claimToken)
      .digest("hex");
    const claimTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Invalidate any existing claims for this product/email
    await Claim.deleteMany({
      productId: product._id,
      email: email.toLowerCase(),
    });

    const claim = await Claim.create({
      productId: product._id,
      email: email.toLowerCase(),
      tokenHash: claimTokenHash,
      expiresAt: claimTokenExpiresAt,
    });

    // Send verification email with link
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-claim?token=${claimToken}`;
    await sendClaimVerificationLink(email, verificationUrl, product.name);

    return NextResponse.json({
      success: true,
      message: "Verification email sent. Please check your inbox.",
    });
  } catch (error: any) {
    console.error("Error sending claim email:", error);
    return NextResponse.json(
      { error: "Failed to send verification email" },
      { status: 500 },
    );
  }
}

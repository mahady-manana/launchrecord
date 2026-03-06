import { connectToDatabase } from "@/lib/db";
import Product from "@/models/product";
import User from "@/models/user";
import crypto from "crypto";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

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

// POST - Verify claim token and complete claim (set user)
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { token } = body;

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "Invalid or missing token" },
        { status: 400 },
      );
    }

    // Hash the token to compare with stored hash
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const claim = await Claim.findOne({
      tokenHash,
    }).select("+tokenHash +productId");

    if (!claim) {
      return NextResponse.json(
        { error: "Invalid verification token" },
        { status: 400 },
      );
    }

    // Check if already claimed
    if (claim.claimed) {
      return NextResponse.json(
        { error: "This claim has already been processed" },
        { status: 400 },
      );
    }

    // Check if expired
    if (claim.expiresAt < new Date()) {
      await Claim.findByIdAndDelete(claim._id);
      return NextResponse.json(
        { error: "Verification link has expired" },
        { status: 400 },
      );
    }

    // Find the product
    const product = await Product.findById(claim.productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Find or create user with this email
    let user = await User.findOne({ email: claim.email.toLowerCase() });
    let isNewUser = false;

    if (!user) {
      user = await User.create({
        name: claim.email.split("@")[0],
        email: claim.email.toLowerCase(),
        role: "user",
        provider: "credentials",
        emailVerified: new Date(),
      });
      isNewUser = true;
    }

    // Add user to product owners (many-to-many)
    const userId = user._id;
    if (!product.users) {
      product.users = [];
    }
    
    // Check if user is already in the array
    const isAlreadyOwner = product.users.some((u: any) => u.toString() === userId.toString());
    if (!isAlreadyOwner) {
      product.users.push(userId as any);
    }
    product.addedByAdmin = false;
    await product.save();

    // Mark claim as completed and delete
    claim.claimed = true;
    await claim.save();
    await Claim.findByIdAndDelete(claim._id);

    return NextResponse.json({
      success: true,
      message: "Claim verified successfully",
      email: claim.email,
      isNewUser,
      productId: product._id.toString(),
    });
  } catch (error) {
    console.error("Error verifying claim:", error);
    return NextResponse.json(
      { error: "Server error during claim verification" },
      { status: 500 },
    );
  }
}

import { connectToDatabase } from "@/lib/db";
import Product from "@/models/product";
import { NextRequest, NextResponse } from "next/server";
import normalizeUrl from "normalize-url";

// PUT - Update product website
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectToDatabase();

    const { id } = await params;
    const body = await request.json();
    const { website } = body;

    if (!website) {
      return NextResponse.json(
        { error: "Website URL is required" },
        { status: 400 },
      );
    }

    const normalizedWebsite = normalizeUrl(website, {
      forceHttps: true,
      stripWWW: false,
      defaultProtocol: "https",
    });

    // Check for duplicate
    const existingProduct = await Product.findOne({
      website: normalizedWebsite,
      _id: { $ne: id },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: "A product with this website URL already exists" },
        { status: 400 },
      );
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { website: normalizedWebsite },
      { new: true },
    );

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: { product },
    });
  } catch (error: any) {
    console.error("Update product website error:", error);
    return NextResponse.json(
      { error: "Failed to update website", details: error.message },
      { status: 500 },
    );
  }
}

// DELETE - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectToDatabase();

    const { id } = await params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { error: "Failed to delete product", details: error.message },
      { status: 500 },
    );
  }
}

import { connectToDatabase } from "@/lib/db";
import { getUserSession } from "@/lib/session";
import Product from "@/models/product";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, url } = body || {};

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 },
      );
    }

    await connectToDatabase();
    const { user, response } = await getUserSession({ required: true });
    if (response) {
      return response;
    }

    let websiteUrl: string | null = url || null;

    if (!websiteUrl) {
      const product = await Product.findOne({
        _id: productId,
        users: user?.id,
        deletedAt: null,
      }).lean();

      if (!product) {
        return NextResponse.json(
          { error: "Product not found or access denied" },
          { status: 404 },
        );
      }

      websiteUrl = product.website || null;
    }

    if (!websiteUrl) {
      return NextResponse.json(
        { error: "Product website is required to run an audit" },
        { status: 400 },
      );
    }

    const auditResponse = await fetch(
      `${request.nextUrl.origin}/api/sio-v5-audit`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          cookie: request.headers.get("cookie") ?? "",
        },
        body: JSON.stringify({ productId, url: websiteUrl }),
      },
    );

    const data = await auditResponse.json();
    return NextResponse.json(data, { status: auditResponse.status });
  } catch (error) {
    console.error("Proxy audit API error:", error);
    return NextResponse.json(
      { error: "Failed to run SIO-V5 audit" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const productId = request.nextUrl.searchParams.get("productId");
    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 },
      );
    }

    const reportResponse = await fetch(
      `${request.nextUrl.origin}/api/products/${productId}/sio-v5-reports/latest`,
      {
        headers: {
          cookie: request.headers.get("cookie") ?? "",
        },
      },
    );

    const data = await reportResponse.json();
    return NextResponse.json(data, { status: reportResponse.status });
  } catch (error) {
    console.error("Proxy audit status error:", error);
    return NextResponse.json(
      { error: "Failed to fetch latest SIO report" },
      { status: 500 },
    );
  }
}

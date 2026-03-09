import { NextRequest, NextResponse } from "next/server";

// GET - Redirect to /api/topics?top endpoint
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = searchParams.get("limit") || "5";

  // Redirect to the existing topics API with top parameter
  return NextResponse.redirect(new URL(`/api/topics?top=${limit}`, request.url));
}

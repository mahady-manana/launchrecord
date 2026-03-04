import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Check admin session for admin routes
  const isAdminRoute =
    request.nextUrl.pathname.startsWith("/admin") ||
    request.nextUrl.pathname.startsWith("/api/admin");

  if (isAdminRoute) {
    // Skip admin auth check for login page and login API
    if (
      request.nextUrl.pathname === "/admin/login" ||
      request.nextUrl.pathname === "/api/admin/login"
    ) {
      return NextResponse.next();
    }

    // Check for admin session in sessionStorage (client-side handled)
    // For API routes, we'll check via a custom header or skip (client handles auth state)
    if (request.nextUrl.pathname.startsWith("/api/admin")) {
      // API routes are protected client-side via auth state
      // Server-side validation happens in the API route itself
      return NextResponse.next();
    }

    // For admin pages, redirect to login if not authenticated
    // Note: sessionStorage is not accessible in middleware,
    // so we rely on client-side redirect in the layout
    return NextResponse.next();
  }

  // Original middleware logic for other routes
  if (!token) {
    if (request.nextUrl.pathname.startsWith("/api")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set(
      "callbackUrl",
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
    );
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/users/:path*",
    "/api/subscriptions/:path*",
    "/api/payments/:path*",
    "/api/uploads/:path*",
    "/api/stripe/checkout/:path*",
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};

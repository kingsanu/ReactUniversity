import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected API routes that require authentication
const protectedApiRoutes = [
  "/api/admin",
  "/api/v1/assessments/me/timeline",
  "/api/v1/assessments/me/timeline/stats",
  "/api/v1/assessments/me/timeline/export",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only check authentication for protected API routes
  if (pathname.startsWith("/api/")) {
    const isProtectedApiRoute = protectedApiRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (isProtectedApiRoute) {
      // Get token from authorization header
      const authHeader = request.headers.get("authorization");

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        );
      }
    }
  }

  // Allow all other requests to pass through
  // Page authentication redirects are handled client-side by AuthWrapper
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)",
  ],
};

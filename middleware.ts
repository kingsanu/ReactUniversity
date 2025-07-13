import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = ['/dashboard'];

// Define auth routes that should redirect to dashboard if user is already authenticated
const authRoutes = ['/login', '/signup'];

// Define public routes that don't require authentication
const publicRoutes = ['/', '/about', '/contact'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token from cookies or check if it exists in the request
  // Since we're using localStorage, we'll check for a custom header or cookie
  const token = request.cookies.get('auth-token')?.value ||
                request.headers.get('authorization')?.replace('Bearer ', '');

  const isAuthenticated = !!token;

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.includes(pathname);

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.includes(pathname) ||
                       pathname.startsWith('/api/') ||
                       pathname.startsWith('/_next/') ||
                       pathname.includes('.');

  // If user is not authenticated and trying to access protected route
  if (!isAuthenticated && isProtectedRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If user is authenticated and trying to access auth routes, redirect to dashboard
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Allow access to public routes and continue
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
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
};
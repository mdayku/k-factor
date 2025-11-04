/**
 * Next.js Middleware for Route Protection
 * Handles authentication and onboarding redirects
 */

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Allow access to auth pages
    if (pathname.startsWith("/auth")) {
      return NextResponse.next();
    }

    // Redirect to onboarding if not completed
    // TEMPORARILY DISABLED FOR TESTING
    // if (
    //   token &&
    //   !token.hasCompletedOnboarding &&
    //   !pathname.startsWith("/onboarding")
    // ) {
    //   return NextResponse.redirect(new URL("/onboarding", req.url));
    // }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;

        // Public routes that don't require auth
        const publicRoutes = [
          "/",
          "/auth/signin",
          "/auth/signup",
          "/auth/error",
          "/auth/verify-request",
          "/auth/parental-consent",
          "/legal/terms",
          "/legal/privacy",
          "/legal/coppa",
          "/results", // For testing Phase 4
          "/challenge", // FVM landing pages (should be public for viral growth)
          "/presence", // For testing Phase 4
        ];

        if (publicRoutes.some((route) => pathname.startsWith(route))) {
          return true;
        }

        // All other routes require authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)",
  ],
};


import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * Next.js 16 proxy (the middleware convention). Clerk activates only when its
 * keys are configured — without them every request passes through untouched,
 * so the storefront never breaks on a missing key.
 *
 * Route protection (wholesale portal, account, admin) is layered on here once
 * roles exist in the DB: createRouteMatcher + auth.protect().
 */

const clerkEnabled =
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && !!process.env.CLERK_SECRET_KEY;

export default clerkEnabled ? clerkMiddleware() : () => NextResponse.next();

export const config = {
  matcher: [
    // Everything except static assets and Next internals…
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // …plus APIs and Clerk's auto-proxy path (required, per Clerk's Next.js rules).
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};

import { NextResponse, type NextRequest } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { clerkEnabled } from "@/lib/clerk";

/**
 * Next.js 16 proxy (the middleware convention), backed by Clerk.
 *
 * The ambassador dashboard and the account area are members-only: `auth.protect()`
 * bounces signed-out visitors to Clerk's sign-in (/sign-in), carrying the intended
 * path so they land back after authenticating. The pages themselves still resolve
 * the session server-side; this only keeps signed-out visitors out of the shells.
 *
 * When Clerk keys are absent, auth is dormant — the middleware becomes a
 * pass-through so the storefront works with nothing configured.
 */
const isProtected = createRouteMatcher(["/account(.*)", "/ambassadors/dashboard(.*)"]);

const withClerk = clerkMiddleware(async (auth, req) => {
  if (isProtected(req)) await auth.protect();
});

export default clerkEnabled
  ? withClerk
  : function proxy(_request: NextRequest) {
      return NextResponse.next();
    };

export const config = {
  matcher: [
    // Skip Next internals and static files unless referenced in search params.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes.
    "/(api|trpc)(.*)",
  ],
};

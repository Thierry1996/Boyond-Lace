import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Next.js 16 proxy (the middleware convention), backed by Better Auth.
 *
 * The ambassador portal and the account area are members-only. We do an
 * optimistic session-cookie check here — Edge-safe, no database call, no Node
 * imports — and redirect to sign-in when it is missing, carrying the intended
 * path in ?redirect. The pages themselves still verify the session server-side
 * (auth.api.getSession) before trusting it; this middleware only keeps
 * signed-out visitors out of the protected shells.
 */
export default function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  if (!sessionCookie) {
    const url = new URL("/sign-in", request.url);
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/ambassadors/dashboard/:path*", "/account/:path*"],
};

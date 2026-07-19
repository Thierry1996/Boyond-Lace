import { createAuthClient } from "@neondatabase/neon-js/auth";

/**
 * Neon Auth client — PARKED, NOT WIRED.
 *
 * ⚠ Clerk is this application's active auth provider (locked stack Phase 2:
 * provider in layout.tsx, proxy guards, /sign-in + /sign-up, keys live).
 * Running two auth systems produces two competing session sources — do not
 * import this module into app code unless the decision is made to REPLACE
 * Clerk with Neon Auth, which also means removing ClerkProvider, the proxy
 * middleware, both auth pages, and re-pointing User.clerkId in the Prisma
 * schema.
 *
 * Adapted from the supplied Vite snippet: Next.js has no import.meta.env and
 * no VITE_ prefix — client-exposed env vars are NEXT_PUBLIC_* on process.env.
 */
export function getNeonAuthClient() {
  const url = process.env.NEXT_PUBLIC_NEON_AUTH_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_NEON_AUTH_URL is not set — see .env.example.");
  }
  return createAuthClient(url);
}

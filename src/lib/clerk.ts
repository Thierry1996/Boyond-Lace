/**
 * Clerk activation flag — the app's auth provider (replaced Better Auth).
 *
 * Clerk is wired throughout but only *activates* when its publishable key is
 * present, mirroring how the storefront treats Supabase and GitHub OAuth: a
 * missing key leaves auth dormant rather than crashing the site. Add
 * NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY + CLERK_SECRET_KEY (from dashboard.clerk.com)
 * to .env.local to turn it on. The NEXT_PUBLIC_ value is inlined at build time,
 * so this constant is safe to read in both server and client components.
 */
export const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

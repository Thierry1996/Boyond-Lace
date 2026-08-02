import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Read-only Supabase client for storefront data (collections, and later
 * products). Deliberately NOT the SSR/cookie client in ./server.ts — that one
 * calls `cookies()` and cannot run in `generateStaticParams` or at build time.
 * This one is a plain client that only reads public, RLS-guarded tables with the
 * publishable key, so it is safe anywhere on the server.
 *
 * Returns null when the env is not configured, so every caller can fall back to
 * the in-code catalogue rather than throw.
 */
let cached: SupabaseClient | null | undefined;

export function getDataClient(): SupabaseClient | null {
  if (cached !== undefined) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  cached =
    url && key
      ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
      : null;
  return cached;
}

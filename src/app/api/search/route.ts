import { NextResponse } from "next/server";
import { commerce } from "@/lib/commerce";
import { searchSite, MIN_QUERY_LENGTH } from "@/lib/search";

/**
 * Live search endpoint for the header field.
 *
 * Runs on the Node runtime because it reads the commerce adapter, which will
 * talk to Prisma/Neon once the catalogue moves off the mock. Short queries
 * return an empty result rather than an error: the client debounces and calls
 * this on every keystroke past the threshold, so a "too short" query is a
 * normal state, not a failure.
 */
export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim();

  if (q.length < MIN_QUERY_LENGTH) {
    return NextResponse.json({ query: q, products: [], docs: [], total: 0 });
  }

  const products = await commerce.getProducts();
  const results = searchSite(q, products, { products: 5, docs: 6 });

  return NextResponse.json(results, {
    // Short cache: the same few queries repeat constantly while typing.
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
  });
}

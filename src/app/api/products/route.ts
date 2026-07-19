import { NextResponse } from "next/server";
import { commerce, type ProductQuery } from "@/lib/commerce";

/**
 * Node runtime product API.
 *
 * The storefront reads the adapter directly from server components, so this
 * endpoint exists for the consumers that cannot: the AR try-on client, the quiz
 * recommender, and eventually the wholesale portal's price-list calls.
 */
export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const query: ProductQuery = {
    line: (searchParams.get("line") as ProductQuery["line"]) ?? undefined,
    avatar: (searchParams.get("avatar") as ProductQuery["avatar"]) ?? undefined,
    sort: (searchParams.get("sort") as ProductQuery["sort"]) ?? "featured",
    limit: searchParams.has("limit") ? Number(searchParams.get("limit")) : undefined,
  };

  if (query.limit != null && (!Number.isFinite(query.limit) || query.limit < 1)) {
    return NextResponse.json({ error: "limit must be a positive number" }, { status: 400 });
  }

  const products = await commerce.getProducts(query);

  return NextResponse.json(
    { count: products.length, products },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" } },
  );
}

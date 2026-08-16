import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

export const runtime = "nodejs";

/**
 * "Vote to restock" intake. Shoppers on an out-of-stock unit ask to be notified
 * when it returns; each vote is a demand signal for marketing and restock
 * prioritisation, persisted to RestockVote (Prisma Postgres). Works for both the
 * retail and wholesale channels — the `channel` field separates them.
 *
 * Votes are upserted on (product, variant, channel, contactType, contact), so a
 * shopper re-voting refreshes their signal rather than inflating the count.
 */
const voteSchema = z
  .object({
    productSlug: z.string().min(1).max(200),
    productTitle: z.string().min(1).max(300),
    channel: z.enum(["RETAIL", "WHOLESALE"]).default("RETAIL"),
    variant: z.string().max(60).default(""),
    contactType: z.enum(["EMAIL", "SMS"]).default("EMAIL"),
    contact: z.string().min(3).max(200),
  })
  .refine(
    (d) =>
      d.contactType === "EMAIL"
        ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.contact)
        : /^[+\d][\d\s()-]{6,}$/.test(d.contact),
    { message: "Enter a valid email or phone number", path: ["contact"] },
  );

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = voteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const d = parsed.data;

  try {
    await db.restockVote.upsert({
      where: {
        productSlug_variant_channel_contactType_contact: {
          productSlug: d.productSlug,
          variant: d.variant,
          channel: d.channel,
          contactType: d.contactType,
          contact: d.contact.trim(),
        },
      },
      create: { ...d, contact: d.contact.trim() },
      update: { createdAt: new Date(), notifiedAt: null },
    });
    const count = await db.restockVote.count({
      where: { productSlug: d.productSlug, channel: d.channel },
    });
    return NextResponse.json({
      ok: true,
      count,
      message: "You're on the list — we'll notify you the moment this unit is back.",
    });
  } catch (e) {
    console.error("[restock-vote] write failed", e);
    return NextResponse.json({ ok: false, error: "Could not record your vote" }, { status: 500 });
  }
}

/**
 * Demand read-out. `?slug=` returns the vote count for one unit; without it,
 * the top-demanded units per channel — the marketing/restock priority list.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug");
  const channel = (url.searchParams.get("channel") as "RETAIL" | "WHOLESALE") ?? undefined;

  try {
    if (slug) {
      const count = await db.restockVote.count({
        where: { productSlug: slug, ...(channel ? { channel } : {}) },
      });
      return NextResponse.json({ ok: true, slug, count });
    }
    const demand = await db.restockVote.groupBy({
      by: ["productSlug", "productTitle", "channel"],
      _count: { _all: true },
      orderBy: { _count: { productSlug: "desc" } },
      take: 100,
    });
    return NextResponse.json({
      ok: true,
      demand: demand.map((d) => ({
        productSlug: d.productSlug,
        productTitle: d.productTitle,
        channel: d.channel,
        votes: d._count._all,
      })),
    });
  } catch (e) {
    console.error("[restock-vote] read failed", e);
    return NextResponse.json({ ok: false, error: "Could not read demand" }, { status: 500 });
  }
}

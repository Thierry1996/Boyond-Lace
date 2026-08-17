import { NextResponse } from "next/server";
import { z } from "zod";
import { completeOrder } from "@/lib/data/checkout";

export const runtime = "nodejs";

/** Finalise a cart into an order after a client-side payment step (e.g. Stripe). */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = z.object({ cartId: z.string().min(1) }).safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "cartId required" }, { status: 400 });
  }
  const result = await completeOrder(parsed.data.cartId);
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { getCheckoutContext, placeOrder } from "@/lib/data/checkout";

export const runtime = "nodejs";

/** Checkout context — the live payment methods + region for the UI. */
export async function GET() {
  try {
    return NextResponse.json({ ok: true, ...(await getCheckoutContext()) });
  } catch (e) {
    console.error("[checkout] context failed", e);
    return NextResponse.json({ ok: false, error: "Could not load checkout" }, { status: 500 });
  }
}

const orderSchema = z.object({
  lines: z
    .array(
      z.object({
        slug: z.string().min(1),
        selections: z.record(z.string(), z.string()).default({}),
        quantity: z.number().int().min(1),
      }),
    )
    .min(1),
  address: z.object({
    email: z.string().email(),
    first_name: z.string().min(1),
    last_name: z.string().min(1),
    address_1: z.string().min(1),
    city: z.string().min(1),
    postal_code: z.string().min(1),
    country_code: z.string().length(2),
    province: z.string().optional(),
    phone: z.string().optional(),
  }),
  providerId: z.string().min(1),
});

/** Build a real Medusa cart and place the order (or hand back a payment step). */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  // Ambassador attribution — the ?ref=CODE cookie set by middleware rides into the order.
  const referralCode = (await cookies()).get("bl_ref")?.value;

  const result = await placeOrder({ ...parsed.data, referralCode });
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}

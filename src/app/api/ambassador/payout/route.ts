import { NextResponse } from "next/server";
import { payoutMethodSchema } from "@/lib/schemas";
import {
  getCurrentAmbassador,
  getDefaultPayoutMethod,
  setPayoutMethod,
} from "@/lib/ambassador-server";

export const runtime = "nodejs";

/**
 * Payout destination for the signed-in ambassador. GET returns the current
 * default method; POST saves a new destination as the default. Actual
 * disbursement is a separate, credential-gated step — this only stores where.
 */
export async function GET() {
  const amb = await getCurrentAmbassador();
  if (!amb) return NextResponse.json({ ok: false, method: null }, { status: 401 });
  return NextResponse.json({ ok: true, method: await getDefaultPayoutMethod(amb.id) });
}

export async function POST(request: Request) {
  const amb = await getCurrentAmbassador();
  if (!amb) {
    return NextResponse.json({ ok: false, error: "Sign in required." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = payoutMethodSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const method = await setPayoutMethod(amb.id, parsed.data);
    return NextResponse.json({ ok: true, method });
  } catch (err) {
    console.error("[ambassador-payout] persistence failed:", err);
    return NextResponse.json(
      { ok: false, error: "We could not save your payout destination. Please try again." },
      { status: 503 },
    );
  }
}

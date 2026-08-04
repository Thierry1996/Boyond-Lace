import { NextResponse } from "next/server";
import { affiliateLinkSchema } from "@/lib/schemas";
import { getCurrentAmbassador, listLinks, createLink } from "@/lib/ambassador-server";

export const runtime = "nodejs";

/**
 * Affiliate links for the signed-in ambassador. Each carries a unique code
 * derived from the ambassador's referral code. GET lists saved links; POST
 * saves a new one for tracking.
 */
export async function GET() {
  const amb = await getCurrentAmbassador();
  if (!amb) return NextResponse.json({ ok: false, links: [] }, { status: 401 });
  return NextResponse.json({
    ok: true,
    referralCode: amb.referralCode,
    links: await listLinks(amb.id),
  });
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

  const parsed = affiliateLinkSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const link = await createLink(amb.id, amb.referralCode, parsed.data);
    return NextResponse.json({ ok: true, link });
  } catch (err) {
    console.error("[ambassador-link] persistence failed:", err);
    return NextResponse.json(
      { ok: false, error: "We could not save your link. Please try again." },
      { status: 503 },
    );
  }
}

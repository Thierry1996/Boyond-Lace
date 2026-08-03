import { NextResponse } from "next/server";
import { campaignLogSchema } from "@/lib/schemas";
import { getCurrentAmbassador, listCampaigns, createCampaign } from "@/lib/ambassador-server";

export const runtime = "nodejs";

/**
 * Campaign / ad log for the signed-in ambassador. Persisted to Prisma Postgres
 * and attached to the resolved Ambassador record — the transparency log tier
 * reviews read from. GET lists the ambassador's campaigns; POST logs one.
 */
export async function GET() {
  const amb = await getCurrentAmbassador();
  if (!amb) return NextResponse.json({ ok: false, campaigns: [] }, { status: 401 });
  return NextResponse.json({ ok: true, campaigns: await listCampaigns(amb.id) });
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

  const parsed = campaignLogSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const campaign = await createCampaign(amb.id, parsed.data);
    return NextResponse.json({ ok: true, campaign, message: "Campaign logged." });
  } catch (err) {
    console.error("[ambassador-campaign] persistence failed:", err);
    return NextResponse.json(
      { ok: false, error: "We could not save your campaign. Please try again." },
      { status: 503 },
    );
  }
}

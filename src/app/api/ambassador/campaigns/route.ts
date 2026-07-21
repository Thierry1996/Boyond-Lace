import { NextResponse } from "next/server";
import { campaignLogSchema } from "@/lib/schemas";

export const runtime = "nodejs";

/**
 * Campaign / ad log intake. Validated here and persisted once an approved
 * Ambassador record exists to attach it to — until then, logged server-side so
 * nothing a creator submits is silently discarded.
 */
export async function POST(request: Request) {
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

  console.log("[ambassador-campaign]", JSON.stringify(parsed.data));

  return NextResponse.json({ ok: true, message: "Campaign logged." });
}

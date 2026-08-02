import { NextResponse } from "next/server";
import { emailCaptureSchema } from "@/lib/schemas";
import { getDataClient } from "@/lib/supabase/data";

export const runtime = "nodejs";

/** The Supabase table the marketing desk reads from the dashboard. */
const TABLE = "Beyond-Lace email-marketing";

/**
 * Spin-wheel marketing capture intake. Validates against the shared schema and
 * writes the lead to Supabase. If the columns are not present yet (the table
 * ships with only id/created_at until supabase/migrations/0002 is applied), the
 * insert fails gracefully: the lead is logged server-side so nothing is lost,
 * and the shopper still gets their prize. Once the migration runs, rows persist
 * with no code change.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = emailCaptureSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const d = parsed.data;
  const row = {
    email: d.email,
    phone: d.phone, // full international string, e.g. "+234 8012345678"
    phone_country: d.phoneCountry ?? null,
    consent_marketing: d.consentMarketing,
    consent_terms: d.consentTerms,
    prize: d.prize ?? null,
    source: d.source ?? "spin-wheel-popup",
    page_path: d.pagePath ?? null,
    user_agent: request.headers.get("user-agent")?.slice(0, 400) ?? null,
  };

  const sb = getDataClient();
  let stored = false;
  if (sb) {
    const { error } = await sb.from(TABLE).insert(row);
    if (error) {
      // Most likely the columns/insert-policy migration has not been applied.
      console.error("[email-capture] Supabase insert failed:", error.message);
      console.log("[email-capture] lead (not persisted):", JSON.stringify(row));
    } else {
      stored = true;
    }
  } else {
    console.log("[email-capture] lead (no Supabase configured):", JSON.stringify(row));
  }

  // The popup should always resolve for the shopper; `stored` tells the client
  // whether it hit the database, without blocking the prize reveal.
  return NextResponse.json({ ok: true, stored });
}

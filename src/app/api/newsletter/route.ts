import { NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/schemas";
import { getDataClient } from "@/lib/supabase/data";

export const runtime = "nodejs";

/** Same marketing table the desk reads; newsletter rows carry source="inner-circle". */
const TABLE = "Beyond-Lace email-marketing";

/**
 * "Join the Beyond Circle" newsletter intake. Validates against the shared
 * schema and writes the subscriber to Supabase. If the insert fails (e.g. a
 * column/policy is missing) the lead is logged server-side so nothing is lost
 * and the shopper still gets a confirmation.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const d = parsed.data;
  const prefs = [
    d.prefEmail && "email",
    d.prefWhatsapp && "whatsapp-sms",
    d.prefPhone && "phone",
    d.prefInstagram && "instagram",
  ].filter(Boolean) as string[];

  const row = {
    first_name: d.firstName,
    last_name: d.lastName,
    email: d.email,
    phone: d.phone || null,
    phone_country: d.country || null,
    role: d.role,
    marketing_prefs: prefs.length ? prefs.join(",") : null,
    // Subscribing is the opt-in; the submit line is the terms acknowledgement.
    consent_marketing: true,
    consent_terms: true,
    source: "inner-circle",
    page_path: "/contact",
    user_agent: request.headers.get("user-agent")?.slice(0, 400) ?? null,
  };

  const sb = getDataClient();
  let stored = false;
  if (sb) {
    const { error } = await sb.from(TABLE).insert(row);
    if (error) {
      console.error("[newsletter] Supabase insert failed:", error.message);
      console.log("[newsletter] lead (not persisted):", JSON.stringify(row));
    } else {
      stored = true;
    }
  } else {
    console.log("[newsletter] lead (no Supabase configured):", JSON.stringify(row));
  }

  return NextResponse.json({ ok: true, stored });
}

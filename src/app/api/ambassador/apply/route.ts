import { NextResponse } from "next/server";
import { ambassadorApplicationSchema } from "@/lib/schemas";

export const runtime = "nodejs";

/**
 * Ambassador programme application intake. Zod-validated, then persisted to
 * Postgres when DATABASE_URL is configured — the record the social marketing
 * division works from when assigning tier and category.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = ambassadorApplicationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  // `consent` is a submit gate (not stored); `preferredTier` is the applicant's
  // preference, whereas the model's tier is assigned by staff at review — so
  // neither is persisted. Empty optional URLs are normalised to null.
  const { consent: _consent, preferredTier: _preferredTier, ...rest } = parsed.data;
  const record = {
    ...rest,
    tiktokUrl: rest.tiktokUrl || null,
    youtubeUrl: rest.youtubeUrl || null,
    portfolioUrl: rest.portfolioUrl || null,
    message: rest.message || null,
  };

  if (process.env.DATABASE_URL) {
    try {
      const { db } = await import("@/lib/db");
      await db.ambassadorApplication.create({ data: record });
    } catch (err) {
      console.error("[ambassador-apply] persistence failed:", err);
      return NextResponse.json(
        { ok: false, error: "We could not save your application. Please try again." },
        { status: 503 },
      );
    }
  } else {
    console.log("[ambassador-apply]", JSON.stringify(record));
  }

  return NextResponse.json({
    ok: true,
    message:
      "Application received. The social marketing division reviews within three business days.",
  });
}

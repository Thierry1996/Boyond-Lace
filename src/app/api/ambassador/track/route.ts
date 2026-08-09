import { NextResponse } from "next/server";
import { recordLinkClick } from "@/lib/ambassador-server";

export const runtime = "nodejs";

/**
 * Referral attribution capture. The storefront calls this once when a visitor
 * lands with `?ref=CODE`: it records a click on that affiliate link and drops a
 * first-party `bl_ref` cookie so the referral survives all the way to checkout,
 * where a paid order is credited back to the ambassador. Unknown codes are a
 * no-op — a mistyped link never fabricates tracking data.
 */
export async function POST(request: Request) {
  let code: string | undefined;
  try {
    const body = (await request.json()) as { code?: unknown };
    if (typeof body.code === "string") code = body.code.trim();
  } catch {
    /* ignore — validated below */
  }

  if (!code || code.length < 4 || code.length > 40) {
    return NextResponse.json({ ok: false, error: "Missing code" }, { status: 400 });
  }

  try {
    const hit = await recordLinkClick(code);
    if (!hit) return NextResponse.json({ ok: false, tracked: false });

    const res = NextResponse.json({ ok: true, tracked: true });
    // 30-day attribution window, first-party, lax so it rides top-level nav.
    res.cookies.set("bl_ref", code, {
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
    return res;
  } catch (err) {
    console.error("[ambassador-track] failed:", err);
    return NextResponse.json({ ok: false, error: "tracking unavailable" }, { status: 503 });
  }
}

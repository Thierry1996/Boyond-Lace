import { NextResponse } from "next/server";
import { wholesaleApplicationSchema } from "@/lib/schemas";

export const runtime = "nodejs";

/**
 * Wholesale partner application intake. Validates against the shared Zod
 * schema and persists to Postgres (Neon) when DATABASE_URL is configured.
 * Without a database the application is logged server-side so nothing is
 * silently dropped in development.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = wholesaleApplicationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  if (process.env.DATABASE_URL) {
    try {
      const { db } = await import("@/lib/db");
      await db.wholesaleApplication.create({ data: parsed.data });
    } catch (err) {
      console.error("[wholesale-application] persistence failed:", err);
      return NextResponse.json(
        { ok: false, error: "We could not save your application. Please try again." },
        { status: 503 },
      );
    }
  } else {
    console.log("[wholesale-application]", JSON.stringify(parsed.data));
  }

  return NextResponse.json({
    ok: true,
    message: "Application received. Reviews complete within two business days.",
  });
}

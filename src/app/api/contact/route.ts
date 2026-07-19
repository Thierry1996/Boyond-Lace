import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/schemas";

export const runtime = "nodejs";

/** Support contact intake — Zod-validated, persisted to Postgres when configured. */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  if (process.env.DATABASE_URL) {
    try {
      const { db } = await import("@/lib/db");
      const { message, ...rest } = parsed.data;
      await db.contactMessage.create({ data: { ...rest, body: message } });
    } catch (err) {
      console.error("[contact] persistence failed:", err);
      return NextResponse.json(
        { ok: false, error: "We could not save your message. Please try again." },
        { status: 503 },
      );
    }
  } else {
    console.log("[contact]", JSON.stringify(parsed.data));
  }

  return NextResponse.json({
    ok: true,
    message: "Received. We reply within one business day.",
  });
}

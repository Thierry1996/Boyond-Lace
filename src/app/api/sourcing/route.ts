import { NextResponse } from "next/server";
import { sourcingSchema } from "@/lib/schemas";

export const runtime = "nodejs";

/**
 * "Source it for me" intake. Zod-validated and persisted to the shared
 * ContactMessage table (topic="sourcing") so no separate model is needed — the
 * sourcing desk reads the same queue. The reply promises a notification when the
 * unit is found and ready to ship.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = sourcingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const d = parsed.data;
  const record = {
    name: `Sourcing request (${d.useCase})`,
    email: d.email,
    topic: "sourcing",
    subject: "sourcing",
    customerType: d.useCase,
    phone: d.phone || null,
    body: d.description,
  };

  if (process.env.DATABASE_URL) {
    try {
      const { db } = await import("@/lib/db");
      await db.contactMessage.create({ data: record });
    } catch (err) {
      console.error("[sourcing] persistence failed:", err);
      return NextResponse.json(
        { ok: false, error: "We could not save your request. Please try again." },
        { status: 503 },
      );
    }
  } else {
    console.log("[sourcing]", JSON.stringify(record));
  }

  return NextResponse.json({
    ok: true,
    message: "Received. We’ll email you the moment we find it and it’s ready to ship.",
  });
}

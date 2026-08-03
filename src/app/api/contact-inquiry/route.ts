import { NextResponse } from "next/server";
import { contactInquirySchema } from "@/lib/schemas";

export const runtime = "nodejs";

/**
 * "Get in Touch" enquiry intake from the /contact page. Zod-validated and
 * persisted to the shared ContactMessage table (Prisma Postgres). The legacy
 * name/topic/body columns are derived so both contact forms coexist.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = contactInquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const d = parsed.data;
  const record = {
    name: `${d.firstName} ${d.lastName}`.trim(),
    email: d.email,
    topic: d.subject,
    body: d.message,
    firstName: d.firstName,
    lastName: d.lastName,
    phone: d.phone || null,
    country: d.country,
    customerType: d.customerType,
    subject: d.subject,
  };

  if (process.env.DATABASE_URL) {
    try {
      const { db } = await import("@/lib/db");
      await db.contactMessage.create({ data: record });
    } catch (err) {
      console.error("[contact-inquiry] persistence failed:", err);
      return NextResponse.json(
        { ok: false, error: "We could not save your message. Please try again." },
        { status: 503 },
      );
    }
  } else {
    console.log("[contact-inquiry]", JSON.stringify(record));
  }

  return NextResponse.json({
    ok: true,
    message: "Received. We reply within one business day.",
  });
}

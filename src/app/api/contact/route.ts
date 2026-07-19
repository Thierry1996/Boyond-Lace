import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/schemas";

export const runtime = "nodejs";

/** Support contact intake. Zod-validated; ticketing lands with Gorgias/DB phase. */
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

  console.log("[contact]", JSON.stringify(parsed.data));
  return NextResponse.json({
    ok: true,
    message: "Received. We reply within one business day.",
  });
}

import { NextResponse } from "next/server";
import { quizLeadSchema } from "@/lib/schemas";

export const runtime = "nodejs";

/**
 * Zero-party data capture from the quiz (Pillar 4). Consent is required by
 * schema — no consent, no store. Klaviyo/DB piping lands with Phase 2 keys.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = quizLeadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  console.log("[quiz-lead]", JSON.stringify(parsed.data));
  return NextResponse.json({ ok: true, message: "Match sheet on its way." });
}

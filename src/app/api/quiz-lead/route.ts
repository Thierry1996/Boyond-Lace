import { NextResponse } from "next/server";
import { quizLeadSchema } from "@/lib/schemas";

export const runtime = "nodejs";

/**
 * Zero-party data capture from the quiz (Pillar 4). Consent is required by
 * schema — no consent, no store. Persisted to Postgres when configured;
 * Klaviyo piping layers on in the marketing phase.
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

  if (process.env.DATABASE_URL) {
    try {
      const { db } = await import("@/lib/db");
      await db.quizLead.create({
        data: { email: parsed.data.email, answers: parsed.data.answers },
      });
    } catch (err) {
      console.error("[quiz-lead] persistence failed:", err);
      return NextResponse.json(
        { ok: false, error: "We could not save your results. Please try again." },
        { status: 503 },
      );
    }
  } else {
    console.log("[quiz-lead]", JSON.stringify(parsed.data));
  }

  return NextResponse.json({ ok: true, message: "Match sheet on its way." });
}

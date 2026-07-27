import { NextResponse } from "next/server";
import { wholesaleSurveySchema } from "@/lib/schemas";

export const runtime = "nodejs";

/**
 * Wholesale buyer survey intake. A lighter qualifying questionnaire than the
 * full partner application — it feeds the same partner team so a lead can be
 * priced and prioritised before the formal application.
 *
 * Validated against the shared Zod schema and logged server-side so nothing is
 * dropped. It shares the application's intake rather than a dedicated table:
 * persistence lands with the survey model, so leads are recorded to the server
 * log until then.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = wholesaleSurveySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  console.log("[wholesale-survey]", JSON.stringify(parsed.data));

  return NextResponse.json({
    ok: true,
    message: "Survey received. A partner manager will reach out with matched pricing.",
  });
}

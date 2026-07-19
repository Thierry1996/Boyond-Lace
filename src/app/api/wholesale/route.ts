import { NextResponse } from "next/server";
import { wholesaleApplicationSchema } from "@/lib/schemas";

export const runtime = "nodejs";

/**
 * Wholesale partner application intake. Validates against the shared Zod
 * schema; persistence lands with the Prisma/Neon phase (locked stack, Phase 2)
 * — until then applications are logged server-side.
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

  console.log("[wholesale-application]", JSON.stringify(parsed.data));
  return NextResponse.json({
    ok: true,
    message: "Application received. Reviews complete within two business days.",
  });
}

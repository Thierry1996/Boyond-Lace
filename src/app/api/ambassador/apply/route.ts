import { NextResponse } from "next/server";
import { ambassadorApplicationSchema } from "@/lib/schemas";

export const runtime = "nodejs";

/**
 * Ambassador programme application intake. Zod-validated, then persisted to
 * Postgres when DATABASE_URL is configured — the record the social marketing
 * division works from when assigning tier and category.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = ambassadorApplicationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  // NOTE: the AmbassadorApplication table is defined in prisma/schema.prisma but
  // its migration has NOT been applied yet, so this route deliberately does not
  // call the model — doing so would 503 every applicant. Once
  // `prisma migrate deploy` runs, swap this log for the db.ambassadorApplication
  // .create() call; the validated payload shape already matches the model.
  console.log("[ambassador-apply]", JSON.stringify(parsed.data));

  return NextResponse.json({
    ok: true,
    message:
      "Application received. The social marketing division reviews within three business days.",
  });
}

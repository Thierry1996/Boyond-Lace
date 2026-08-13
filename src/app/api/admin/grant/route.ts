import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/admin-server";

export const runtime = "nodejs";

/**
 * Admin access control — the secure, in-console equivalent of make-admin.ts.
 *
 * Guarded to an existing ADMIN session: only a current admin may grant or revoke
 * admin. Granting upserts the user's role to ADMIN by email (works even before
 * they first sign in). Revoking demotes to CONSUMER, but a self-revoke and
 * removing the last admin are both blocked so no one can lock the team out.
 */
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ ok: false, error: "Admin session required." }, { status: 403 });
  }

  let body: { email?: unknown; action?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const action = body.action === "revoke" ? "revoke" : "grant";
  if (!EMAIL.test(email)) {
    return NextResponse.json({ ok: false, error: "Enter a valid email." }, { status: 400 });
  }

  try {
    if (action === "revoke") {
      const target = await db.user.findUnique({ where: { email } });
      if (!target || target.role !== "ADMIN") {
        return NextResponse.json(
          { ok: false, error: "That user is not an admin." },
          { status: 404 },
        );
      }
      if (target.id === admin.id) {
        return NextResponse.json(
          { ok: false, error: "You can’t revoke your own admin access." },
          { status: 400 },
        );
      }
      const adminCount = await db.user.count({ where: { role: "ADMIN" } });
      if (adminCount <= 1) {
        return NextResponse.json(
          { ok: false, error: "Can’t remove the last remaining admin." },
          { status: 400 },
        );
      }
      await db.user.update({ where: { email }, data: { role: "CONSUMER" } });
      return NextResponse.json({ ok: true, action: "revoke", email });
    }

    // grant
    const user = await db.user.upsert({
      where: { email },
      update: { role: "ADMIN" },
      create: { email, role: "ADMIN" },
      select: { id: true, email: true, role: true },
    });
    return NextResponse.json({ ok: true, action: "grant", user });
  } catch (err) {
    console.error("[admin-grant] failed:", err);
    return NextResponse.json({ ok: false, error: "Could not update access." }, { status: 503 });
  }
}

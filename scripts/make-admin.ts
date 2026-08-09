/**
 * Grant (or revoke) Beyond Lace admin-console access.
 *
 *   npx tsx scripts/make-admin.ts you@beyondlace.com          → make ADMIN
 *   npx tsx scripts/make-admin.ts you@beyondlace.com CONSUMER → revoke
 *
 * ADMIN is the only role that can read the /admin console. There is no in-app
 * way to self-promote — access is granted here, deliberately, by someone with
 * database credentials. The account manager must have signed in at least once so
 * a User row exists (this upserts one either way).
 */
import { readFileSync } from "node:fs";
import { PrismaClient, type UserRole } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Load DATABASE_URL from the environment, falling back to a manual .env parse so
// this runs the same way `next dev` does without extra flags.
function resolveDatabaseUrl(): string {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  try {
    for (const line of readFileSync(".env", "utf8").split("\n")) {
      const m = line.match(/^\s*DATABASE_URL\s*=\s*"?([^"\n]+)"?\s*$/);
      if (m) return m[1];
    }
  } catch {
    /* no .env */
  }
  throw new Error("DATABASE_URL is not set (env or .env).");
}

async function main() {
  const email = process.argv[2];
  const role = (process.argv[3] ?? "ADMIN").toUpperCase() as UserRole;
  if (!email) {
    console.error("Usage: npx tsx scripts/make-admin.ts <email> [ROLE=ADMIN]");
    process.exit(1);
  }

  const db = new PrismaClient({
    adapter: new PrismaPg({ connectionString: resolveDatabaseUrl() }),
  });
  try {
    const user = await db.user.upsert({
      where: { email },
      update: { role },
      create: { email, role },
    });
    console.log(`✓ ${user.email} is now ${user.role}.`);
  } finally {
    await db.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

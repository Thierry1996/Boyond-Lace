import "dotenv/config";
import { prisma } from "../src/lib/prisma";

/**
 * Connectivity check: one read against the Prisma Postgres database. Prints a
 * clear ✅ on success, and surfaces the exact error on failure.
 * Run: npx tsx scripts/verify-prisma.ts
 */
async function main() {
  const count = await prisma.contactMessage.count();
  console.log(`✅ Connected to Prisma Postgres — ContactMessage rows: ${count}`);
  process.exit(0);
}

main().catch((e) => {
  console.error("❌ Prisma verify failed:", e?.message ?? e);
  process.exit(1);
});

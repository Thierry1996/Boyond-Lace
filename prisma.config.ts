import "dotenv/config";
import { defineConfig } from "prisma/config";

/**
 * Prisma 7 config. Runtime connections use the Neon adapter in src/lib/db.ts;
 * this file gives the CLI (migrate/studio) its URLs.
 *
 * DATABASE_URL — pooled Neon connection string (…-pooler.…neon.tech)
 * DIRECT_URL   — direct (non-pooler) string, required for migrations
 * Both come from Neon dashboard → Connect. The Data API REST endpoint is not
 * a connection string and will not work here.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  // The CLI (migrate/studio) should use the DIRECT connection — Neon's pooler
  // does not support migrations. Runtime queries use the pooled string via the
  // adapter in src/lib/db.ts. Prisma 7's config takes a single `url`.
  datasource: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
  },
});

import { config as loadEnv } from "dotenv";
import { defineConfig } from "prisma/config";

// Next.js loads .env.local natively at runtime; the Prisma CLI does not, so
// load it here. `.env` holds DATABASE_URL for the Prisma Postgres database
// (written by `prisma postgres link`); `.env.local` holds app secrets. First
// match wins per variable, and DATABASE_URL lives only in `.env`.
loadEnv({ path: [".env.local", ".env"] });

/**
 * Prisma 7 config. Runtime connections use the node-postgres (pg) driver
 * adapter in src/lib/db.ts; this file gives the CLI (migrate/studio/seed) its
 * URL. Prisma Postgres uses a single connection string — no separate direct URL.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL ?? "",
  },
});

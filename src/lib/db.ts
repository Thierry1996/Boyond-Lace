import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Prisma 7 client over the node-postgres (pg) driver adapter, pointed at the
 * Prisma Postgres database (DATABASE_URL, written by `prisma postgres link`
 * into .env). This is the app's single relational client.
 *
 * Import { db } from "@/lib/db" (or { prisma } from "@/lib/prisma") only in
 * server code — never in a client component.
 */

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Run `npx prisma postgres link` to write it into .env — see .env.example.",
    );
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

/** Lazy proxy: nothing throws until a query is actually attempted without a URL. */
export const db: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = (globalForPrisma.prisma ??= createClient());
    const value = client[prop as keyof PrismaClient];
    return typeof value === "function"
      ? (value as (...a: unknown[]) => unknown).bind(client)
      : value;
  },
});

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

/**
 * Prisma 7 client over the Neon serverless driver adapter — the correct
 * pairing for Vercel + Neon (HTTP/WebSocket, no TCP pool exhaustion).
 *
 * Requires DATABASE_URL (pooled Neon connection string). The Neon Data API
 * REST endpoint is NOT a connection string — use dashboard → Connect.
 * Import { db } from "@/lib/db" only in server code.
 */

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Paste the pooled Neon connection string into .env.local — see .env.example.",
    );
  }
  const adapter = new PrismaNeon({ connectionString });
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
    return typeof value === "function" ? (value as (...a: unknown[]) => unknown).bind(client) : value;
  },
});

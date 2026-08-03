/**
 * Prisma Postgres client singleton (node-postgres driver adapter).
 *
 * The client is defined once in ./db.ts as a lazy, global-cached singleton;
 * this module re-exports it under the conventional `prisma` name so server code
 * and scripts can `import { prisma } from "@/lib/prisma"`. Server-only.
 */
export { db as prisma } from "./db";
export type { PrismaClient } from "@prisma/client";

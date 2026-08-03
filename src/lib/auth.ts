import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { Pool } from "pg";

/**
 * Better Auth server instance — the replacement for Clerk.
 *
 * The user, session, account and verification tables live on their own Neon
 * Postgres (BETTER_AUTH_DATABASE_URL), kept separate from the app's relational
 * database (DATABASE_URL → Prisma Postgres) so the two schema managers never
 * fight. Better Auth manages its tables via its own Kysely layer, so we hand it
 * a pg Pool. Run `npx @better-auth/cli migrate` to create/update them.
 *
 * GitHub OAuth is wired but only registered when its credentials are present,
 * so a missing key never breaks email/password sign-in. `nextCookies()` is last
 * so it can attach Set-Cookie headers from server actions.
 */

const github =
  process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
    ? {
        github: {
          clientId: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
        },
      }
    : {};

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,
  database: new Pool({
    connectionString: process.env.BETTER_AUTH_DATABASE_URL ?? process.env.DATABASE_URL,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    ...github,
  },
  plugins: [nextCookies()],
});

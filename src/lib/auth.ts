import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { Pool } from "pg";

/**
 * Better Auth server instance — the replacement for Clerk.
 *
 * The user, session, account and verification tables live in Postgres
 * (DATABASE_URL → Neon); Better Auth manages that schema via its own Kysely
 * layer, so we hand it a pg Pool and let it own the tables. Run
 * `npx @better-auth/cli migrate` to create/update them.
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
  database: new Pool({ connectionString: process.env.DATABASE_URL }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    ...github,
  },
  plugins: [nextCookies()],
});

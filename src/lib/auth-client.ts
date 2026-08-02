import { createAuthClient } from "better-auth/react";

/**
 * Better Auth browser client. baseURL is inferred from the current origin when
 * omitted; we set it explicitly from env so it also works behind a proxy or in
 * previews. Re-exports the common methods so components import from one place.
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL ?? undefined,
});

export const { signIn, signUp, signOut, useSession } = authClient;

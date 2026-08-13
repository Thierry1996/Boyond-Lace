"use client";

import Link from "next/link";
import { useAuth, SignOutButton } from "@clerk/nextjs";
import { clerkEnabled } from "@/lib/clerk";

/**
 * Header auth controls, backed by Clerk. Shows a Sign in link when signed out,
 * and Account + Sign out when signed in. We render nothing until Clerk resolves
 * (isLoaded) so there is no flash of the wrong state.
 *
 * When Clerk is not configured, auth is dormant: we render the static Sign in
 * link and mount no Clerk hook (which would require the provider).
 */
const signInClasses =
  "inline-flex items-center rounded-full bg-plum-600 px-4 py-1.5 text-[0.6875rem] font-semibold tracking-[0.1em] text-paper uppercase shadow-[0_2px_12px_-3px_rgba(90,45,103,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-plum-500 hover:shadow-[0_5px_18px_-4px_rgba(137,88,152,0.75)] active:translate-y-0 active:scale-95";

function SignInLink() {
  return (
    <Link href="/sign-in" className={signInClasses}>
      Sign in
    </Link>
  );
}

/** Uses Clerk's hook — only mounted when the provider is present (clerkEnabled). */
function ClerkControls() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <span className="eyebrow text-neutral-500" aria-hidden="true" />;
  }
  if (!isSignedIn) {
    return <SignInLink />;
  }
  return (
    <span className="flex items-center gap-4">
      <Link href="/account" className="eyebrow transition-colors hover:text-blush-300">
        Account
      </Link>
      <SignOutButton>
        <button
          type="button"
          className="eyebrow text-neutral-400 transition-colors hover:text-blush-300"
        >
          Sign out
        </button>
      </SignOutButton>
    </span>
  );
}

export function AuthControls() {
  if (!clerkEnabled) return <SignInLink />;
  return <ClerkControls />;
}

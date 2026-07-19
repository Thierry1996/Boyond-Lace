"use client";

import Link from "next/link";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";

/**
 * Header auth controls. NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is inlined at build
 * time — when absent, Clerk components would throw, so we fall back to the
 * plain Account link until keys are configured and the app is rebuilt.
 */
const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export function AuthControls() {
  if (!clerkEnabled) {
    return (
      <Link href="/account" className="eyebrow transition-colors hover:text-blush-300">
        Account
      </Link>
    );
  }

  return (
    <span className="flex items-center gap-4">
      <Show when="signed-out">
        <SignInButton mode="modal">
          <button className="eyebrow transition-colors hover:text-blush-300">Sign in</button>
        </SignInButton>
      </Show>
      <Show when="signed-in">
        <Link href="/account" className="eyebrow transition-colors hover:text-blush-300">
          Account
        </Link>
        <UserButton
          appearance={{
            elements: { avatarBox: { width: "1.375rem", height: "1.375rem" } },
          }}
        />
      </Show>
    </span>
  );
}

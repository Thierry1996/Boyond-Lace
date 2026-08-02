"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";

/**
 * Header auth controls, backed by Better Auth. Shows a Sign in link when signed
 * out, and Account + Sign out when signed in. The session is read from the
 * Better Auth cookie via useSession(); until it resolves we render nothing to
 * avoid a flash of the wrong state.
 */
export function AuthControls() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  if (isPending) {
    return <span className="eyebrow text-neutral-500" aria-hidden="true" />;
  }

  if (!session) {
    return (
      <Link href="/sign-in" className="eyebrow transition-colors hover:text-blush-300">
        Sign in
      </Link>
    );
  }

  return (
    <span className="flex items-center gap-4">
      <Link href="/account" className="eyebrow transition-colors hover:text-blush-300">
        Account
      </Link>
      <button
        type="button"
        onClick={async () => {
          await signOut();
          router.refresh();
        }}
        className="eyebrow text-neutral-400 transition-colors hover:text-blush-300"
      >
        Sign out
      </button>
    </span>
  );
}

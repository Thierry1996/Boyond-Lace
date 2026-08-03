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
      <Link
        href="/sign-in"
        className="inline-flex items-center rounded-full bg-plum-600 px-4 py-1.5 text-[0.6875rem] font-semibold tracking-[0.1em] text-paper uppercase shadow-[0_2px_12px_-3px_rgba(90,45,103,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-plum-500 hover:shadow-[0_5px_18px_-4px_rgba(137,88,152,0.75)] active:translate-y-0 active:scale-95"
      >
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

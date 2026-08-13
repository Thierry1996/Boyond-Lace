"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { clerkEnabled } from "@/lib/clerk";

const buttonClasses =
  "flex items-center gap-2 rounded-lg border border-white/[0.09] px-3 py-2 text-[0.75rem] tracking-[0.06em] text-neutral-300 uppercase transition-colors hover:border-rose-500/50 hover:text-rose-300 disabled:opacity-60";

/** Uses Clerk's hook — only mounted when the provider is present (clerkEnabled). */
function ClerkSignOut() {
  const { signOut } = useClerk();
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      disabled={busy}
      onClick={() => {
        setBusy(true);
        void signOut({ redirectUrl: "/admin-login" });
      }}
      className={buttonClasses}
    >
      <LogOut size={14} strokeWidth={1.75} />
      {busy ? "Signing out…" : "Sign out"}
    </button>
  );
}

/** Sign the admin out of the control centre (Clerk) and return to its front door. */
export function AdminSignOut() {
  // Auth dormant → the console is unreachable anyway; keep a plain exit link and
  // mount no Clerk hook (which would need the provider).
  if (!clerkEnabled) {
    return (
      <a href="/admin-login" className={buttonClasses}>
        <LogOut size={14} strokeWidth={1.75} />
        Sign out
      </a>
    );
  }
  return <ClerkSignOut />;
}

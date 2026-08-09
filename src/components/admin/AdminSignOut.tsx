"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { signOut } from "@/lib/auth-client";

/** Sign the admin out of the control centre and return to its front door. */
export function AdminSignOut() {
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          await signOut();
        } finally {
          window.location.href = "/admin-login";
        }
      }}
      className="flex items-center gap-2 rounded-lg border border-white/[0.09] px-3 py-2 text-[0.75rem] tracking-[0.06em] text-neutral-300 uppercase transition-colors hover:border-rose-500/50 hover:text-rose-300 disabled:opacity-60"
    >
      <LogOut size={14} strokeWidth={1.75} />
      {busy ? "Signing out…" : "Sign out"}
    </button>
  );
}

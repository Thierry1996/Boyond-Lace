import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";
import { ShieldCheck } from "lucide-react";
import { clerkEnabled } from "@/lib/clerk";
import { AuthUnconfigured } from "@/components/auth/AuthUnconfigured";

export const metadata: Metadata = {
  title: "Admin Sign-in — Beyond Lace Control Centre",
  robots: { index: false, follow: false },
};

/**
 * The control-centre's own front door. Deliberately not under `/admin` (which is
 * gated), and rendered with no storefront chrome (see ChromeGate), so the admin
 * app stands alone. Clerk handles the credentials; the `/admin` gate then
 * confirms the ADMIN role (a signed-in non-admin gets a 404, never the console).
 *
 * Hash routing is used because this route isn't a Clerk catch-all, and the
 * self-serve sign-up link is hidden — admins are provisioned, never self-made.
 */
export default function AdminLoginPage() {
  return (
    <div className="clerk-admin flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#1a0b16] via-plum-900 to-ink px-[6vw] py-16">
      {clerkEnabled ? (
        <>
          <div className="mb-8 text-center">
            <span className="mx-auto mb-5 grid size-12 place-items-center rounded-full border border-gold/40 bg-gold/[0.06]">
              <ShieldCheck size={22} className="text-gold" strokeWidth={1.6} />
            </span>
            <p className="eyebrow text-gold">Beyond Lace · Control Centre</p>
            <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-paper">
              Admin sign-in.
            </h1>
            <p className="mt-2 text-[0.8125rem] text-neutral-400">
              Restricted to assigned account managers. Staff access only.
            </p>
          </div>
          <SignIn routing="hash" forceRedirectUrl="/admin" />
        </>
      ) : (
        <AuthUnconfigured context="admin" />
      )}
    </div>
  );
}

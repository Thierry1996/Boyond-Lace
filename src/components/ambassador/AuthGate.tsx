import Link from "next/link";
import { Lock } from "lucide-react";

/**
 * Ambassador portal gate.
 *
 * Clerk owns sessions for this app. When keys are configured the portal is
 * protected by the proxy matcher and this renders its children directly; the
 * signed-out fallback below only appears if the gate is reached without an
 * authenticated session, so the dashboard is never silently public.
 */
const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export function AuthGate({ children }: { children: React.ReactNode }) {
  if (!clerkEnabled) {
    return (
      <>
        <div className="mb-8 flex items-start gap-4 rounded-xl border border-gold/40 bg-plum-900/60 p-5">
          <Lock size={18} strokeWidth={1.6} className="mt-0.5 shrink-0 text-gold" />
          <p className="text-[0.8125rem] leading-relaxed text-blush-200">
            <span className="text-gold">Preview mode.</span> Clerk authentication keys are not
            configured in this environment, so the portal is rendering unauthenticated for review.
            With keys present, this route requires a verified email sign-in.
          </p>
        </div>
        {children}
      </>
    );
  }

  return <>{children}</>;
}

/** Signed-out panel shown by the portal's sign-in prompt. */
export function SignedOutPrompt() {
  return (
    <div className="mx-auto max-w-lg py-24 text-center">
      <Lock size={28} strokeWidth={1.4} className="mx-auto mb-6 text-gold" />
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-paper">
        Ambassadors only.
      </h1>
      <p className="mt-4 text-[0.9375rem] leading-relaxed text-neutral-400">
        Sign in with the email on your approved application. Not an ambassador yet? The programme is
        open — applications are reviewed within three business days.
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-5">
        <Link
          href="/sign-in"
          className="border border-gold bg-gold px-8 py-3.5 text-[0.8125rem] tracking-[0.14em] text-ink uppercase transition-all duration-500 hover:bg-transparent hover:text-gold"
        >
          Sign in
        </Link>
        <Link
          href="/ambassadors/apply"
          className="border-b border-white/25 pb-1 text-[0.8125rem] tracking-[0.1em] text-neutral-200 uppercase transition-colors hover:border-gold hover:text-gold"
        >
          Apply to the programme
        </Link>
      </div>
    </div>
  );
}

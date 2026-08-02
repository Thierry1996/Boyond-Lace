import Link from "next/link";
import { Lock } from "lucide-react";

/**
 * Ambassador portal gate.
 *
 * Better Auth owns sessions. The /ambassadors/dashboard route is protected by
 * the proxy middleware, which redirects signed-out visitors to sign-in before
 * they reach here — so this wrapper renders its children directly. It is kept as
 * the server-side seam for a future approved-ambassador role check.
 */
export function AuthGate({ children }: { children: React.ReactNode }) {
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
          className="cta-primary px-8 py-3.5 text-[0.8125rem] tracking-[0.14em] uppercase"
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

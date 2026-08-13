import Link from "next/link";
import { KeyRound } from "lucide-react";

/**
 * Shown on auth pages while Clerk keys are absent — auth is dormant, not broken.
 * Keeps the routes rendering a clear, on-brand message instead of a crash until
 * NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY + CLERK_SECRET_KEY are set in .env.local.
 */
export function AuthUnconfigured({ context = "storefront" }: { context?: "storefront" | "admin" }) {
  return (
    <div className="mx-auto w-full max-w-md text-center">
      <span className="mx-auto mb-5 grid size-12 place-items-center rounded-full border border-gold/40 bg-gold/[0.06]">
        <KeyRound size={20} className="text-gold" strokeWidth={1.6} />
      </span>
      <p className="eyebrow text-gold">Sign-in coming online</p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-paper">
        Authentication is being configured.
      </h1>
      <p className="mt-3 text-[0.875rem] leading-relaxed text-neutral-400">
        {context === "admin"
          ? "The control-centre sign-in activates the moment Clerk credentials are added to the environment."
          : "Accounts activate the moment Clerk credentials are added to the environment. In the meantime, the store is fully browsable."}
      </p>
      <Link
        href="/"
        className="mt-6 inline-block border-b border-gold pb-1 text-[0.75rem] tracking-[0.12em] text-gold uppercase"
      >
        Return to the store
      </Link>
    </div>
  );
}

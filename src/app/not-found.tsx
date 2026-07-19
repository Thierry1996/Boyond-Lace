import Link from "next/link";
import { MonogramAurora } from "@/components/brand/Logo";

export default function NotFound() {
  return (
    <div className="surface-velvet flex min-h-[80vh] items-center">
      <div className="mx-auto max-w-2xl px-[4vw] py-32 text-center">
        <MonogramAurora size={64} />
        <p className="eyebrow mt-10 text-gold">404</p>
        <h1 className="mt-5 text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] text-paper">
          This one went
          <span className="block italic">beyond the page.</span>
        </h1>
        <p className="mt-7 text-[1.0625rem] leading-relaxed text-neutral-400">
          Capsule runs are never restocked, so the unit you were looking for may simply be finished.
          Everything still available is one link away.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-6">
          <Link
            href="/shop"
            className="border border-gold px-8 py-4 text-[0.8125rem] tracking-[0.14em] text-gold uppercase transition-all duration-500 hover:bg-gold hover:text-ink"
          >
            The collection
          </Link>
          <Link
            href="/"
            className="border-b border-white/25 pb-1 text-[0.8125rem] tracking-[0.1em] text-neutral-200 uppercase transition-colors hover:border-gold hover:text-gold"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}

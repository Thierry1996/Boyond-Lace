import Link from "next/link";

/**
 * "Wholesale Rewards" — the volume incentive that drives repeat trade orders,
 * cloned in layout from the reference and rendered in the Beyond Lace system.
 * Pure promotional structure (the brand's own offer) — no customer data involved.
 */
const REWARDS: { big: string; small?: string; cond: string }[] = [
  { big: "Free Hair", cond: "Over $1,000 in one order" },
  { big: "2%", small: "Next-month discount", cond: "Over $2,000 in a month" },
  { big: "3%", small: "Next-month discount", cond: "Over $3,000 in a month" },
  { big: "5%", small: "Next-month discount", cond: "Over $10,000 in a month" },
];

const RULES: [string, string][] = [
  ["Over $1,000 in one order", "get free hair (8–14 inch) added to your shipment"],
  ["Over $2,000 in a month", "get 2% off everything you buy the next month"],
  ["Over $3,000 in a month", "get 3% off everything you buy the next month"],
  ["Over $10,000 in a month", "get 5% off everything you buy the next month"],
];

export function WholesaleRewards() {
  return (
    <section className="border-t border-white/[0.06] bg-plum-900 py-24">
      <div className="mx-auto max-w-[1440px] px-[4vw]">
        <div className="text-center">
          <p className="eyebrow text-gold">Volume incentive</p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(2rem,4vw,3.25rem)] tracking-[0.02em] text-paper uppercase">
            Wholesale Rewards
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[0.9375rem] leading-relaxed text-blush-200/70">
            The more your shelf moves, the more you keep. Order rewards on the spot, spend rewards on
            your next run.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {REWARDS.map((r) => (
            <div
              key={r.cond}
              className="flex flex-col items-center rounded-xl border border-gold/25 bg-gradient-to-b from-gold/[0.08] to-transparent p-8 text-center"
            >
              <div className="flex min-h-[4.5rem] items-center justify-center">
                <span className="font-[family-name:var(--font-display)] text-[2.75rem] leading-none text-gold">
                  {r.big}
                </span>
                {r.small && (
                  <span className="ml-2 max-w-[5.5rem] text-left text-[0.6875rem] leading-tight tracking-[0.06em] text-neutral-200 uppercase">
                    {r.small}
                  </span>
                )}
              </div>
              <span className="mt-4 border-t border-white/[0.1] pt-4 text-[0.8125rem] tracking-[0.04em] text-neutral-300 uppercase">
                {r.cond}
              </span>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-3xl rounded-xl border border-white/[0.08] bg-ink/30 p-7">
          <ol className="space-y-3">
            {RULES.map(([cond, reward], i) => (
              <li key={cond} className="flex gap-3 text-[0.9375rem] leading-relaxed text-neutral-300">
                <span className="text-gold tabular-nums">{i + 1}.</span>
                <span>
                  <span className="text-gold">{cond}</span> — {reward}.
                </span>
              </li>
            ))}
          </ol>
          <Link
            href="#apply"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3 text-[0.75rem] font-medium tracking-[0.12em] text-ink uppercase transition-colors hover:bg-paper"
          >
            Start earning rewards
          </Link>
        </div>
      </div>
    </section>
  );
}

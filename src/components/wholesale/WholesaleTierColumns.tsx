import { Money } from "@/components/ui/Money";
import { WHOLESALE_MOQ } from "@/lib/channel";
import type { WholesalePricing } from "@/lib/commerce";

/**
 * Volume-price columns — the wholesale stats header, laid out like a trade
 * marketplace: each tier is a column showing its per-unit price above the
 * quantity range it applies to. The deepest tier the trade minimum reaches is
 * marked, since that is the price a real order actually pays.
 */
export function WholesaleTierColumns({ pricing }: { pricing: WholesalePricing }) {
  const tiers = [...pricing.tiers].sort((a, b) => a.minQty - b.minQty);

  // Turn each tier's floor into a readable range using the next tier's floor.
  const ranges = tiers.map((t, i) => {
    const next = tiers[i + 1];
    const label = next ? `${t.minQty}–${next.minQty - 1} pcs` : `≥ ${t.minQty} pcs`;
    return { ...t, label };
  });
  const deepestReached = Math.max(
    ...tiers.filter((t) => WHOLESALE_MOQ >= t.minQty).map((t) => t.minQty),
  );

  return (
    <div className="grid grid-cols-3 divide-x divide-white/[0.08] border-y border-white/[0.08]">
      {ranges.map((t) => {
        const active = t.minQty === deepestReached;
        return (
          <div key={t.label} className={`px-4 py-4 ${active ? "bg-gold/[0.06]" : ""}`}>
            <Money
              usd={t.unitPrice}
              className="font-[family-name:var(--font-display)] text-[clamp(1.25rem,2.4vw,1.75rem)] text-paper tabular-nums"
            />
            <p className="mt-1 text-[0.75rem] text-neutral-400">{t.label}</p>
            {active && (
              <p className="mt-1 text-[0.625rem] tracking-[0.12em] text-gold uppercase">
                Your tier
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

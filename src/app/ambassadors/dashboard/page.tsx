import Link from "next/link";
import { TrendingUp, MousePointerClick, DollarSign, Users } from "lucide-react";
import { LiveProductCarousel } from "@/components/ambassador/LiveProductCarousel";
import { PROMOTABLE_CATEGORIES } from "@/lib/ambassador";
import { Money } from "@/components/ui/Money";
import { AuthGate } from "@/components/ambassador/AuthGate";

/**
 * Ambassador dashboard overview.
 *
 * Figures below are seeded demonstration values, clearly labelled as such —
 * real numbers populate from CommissionEntry/AffiliateLink once an approved
 * ambassador record exists and orders start attributing.
 */

const STATS = [
  { label: "Commission this month", value: 128450, money: true, delta: "+18%", icon: DollarSign },
  { label: "Tracked clicks", value: 4820, money: false, delta: "+9%", icon: MousePointerClick },
  { label: "Conversions", value: 63, money: false, delta: "+12%", icon: TrendingUp },
  { label: "Audience reached", value: 214000, money: false, delta: "+6%", icon: Users },
];

export default function AmbassadorDashboard() {
  return (
    <AuthGate>
      {/* Header */}
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow mb-2 text-gold">Tier 3 · Micro Affiliate · 20% commission</p>
          <h1 className="font-[family-name:var(--font-display)] text-[clamp(2rem,4vw,3rem)] text-paper">
            Your dashboard.
          </h1>
        </div>
        <Link
          href="/ambassadors/dashboard/links"
          className="cta-primary px-7 py-3.5 text-[0.75rem] tracking-[0.12em] uppercase"
        >
          Generate affiliate link
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="group rounded-xl border border-white/[0.07] p-6 transition-colors duration-400 hover:border-gold/50"
          >
            <div className="flex items-center justify-between">
              <s.icon
                size={18}
                strokeWidth={1.6}
                className="text-neutral-400 transition-colors duration-300 group-hover:text-gold"
              />
              <span className="text-[0.6875rem] text-gold tabular-nums">{s.delta}</span>
            </div>
            <p className="mt-5 font-[family-name:var(--font-display)] text-3xl text-paper tabular-nums">
              {s.money ? <Money usd={s.value} /> : s.value.toLocaleString()}
            </p>
            <p className="eyebrow mt-1.5">{s.label}</p>
          </div>
        ))}
      </div>
      <p className="mb-14 text-[0.75rem] text-neutral-400">
        Demonstration figures. Live values populate from your tracked links once your first order
        attributes.
      </p>

      {/* Live carousels — one per promotable category */}
      <div className="mb-4">
        <p className="eyebrow mb-1.5 text-gold">Live catalog</p>
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-paper">
          Choose what to promote.
        </h2>
        <p className="mt-2 max-w-2xl text-[0.875rem] leading-relaxed text-neutral-400">
          Six products at a time, rotating every fifteen seconds. Hover any card for a quick view
          and the commission you earn on it.
        </p>
      </div>

      <div className="mt-10">
        {PROMOTABLE_CATEGORIES.map((c) => (
          <LiveProductCarousel key={c.id} category={c} />
        ))}
      </div>
    </AuthGate>
  );
}

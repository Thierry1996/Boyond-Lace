import type { Metadata } from "next";
import { Trophy, MapPin } from "lucide-react";
import { AuthGate } from "@/components/ambassador/AuthGate";
import { Money } from "@/components/ui/Money";

export const metadata: Metadata = { title: "Leaderboard" };

/**
 * Ambassador leaderboard by creator and by location. Demonstration standings
 * until commission entries accumulate; the shape matches what CommissionEntry
 * aggregation will return.
 */

const CREATORS = [
  {
    rank: 1,
    name: "A. Okonkwo",
    city: "Lagos",
    tier: "Tier 2",
    sales: 1842000,
    format: "Long-form tutorial",
  },
  {
    rank: 2,
    name: "M. Delacroix",
    city: "Paris",
    tier: "Tier 2",
    sales: 1516000,
    format: "Before / after",
  },
  {
    rank: 3,
    name: "J. Whitfield",
    city: "Atlanta",
    tier: "Tier 3",
    sales: 1204000,
    format: "UGC reel",
  },
  {
    rank: 4,
    name: "S. Adeyemi",
    city: "London",
    tier: "Tier 3",
    sales: 986000,
    format: "UGC reel",
  },
  {
    rank: 5,
    name: "R. Castillo",
    city: "Los Angeles",
    tier: "Tier 1",
    sales: 874000,
    format: "Editorial placement",
  },
  {
    rank: 6,
    name: "T. Nakamura",
    city: "Tokyo",
    tier: "Tier 3",
    sales: 655000,
    format: "Static post",
  },
];

const LOCATIONS = [
  { city: "Atlanta", creators: 42, sales: 4820000 },
  { city: "Lagos", creators: 31, sales: 4110000 },
  { city: "London", creators: 28, sales: 3640000 },
  { city: "Los Angeles", creators: 24, sales: 3180000 },
  { city: "Paris", creators: 19, sales: 2470000 },
];

const RANK_TONE: Record<number, string> = {
  1: "text-gold",
  2: "text-blush-300",
  3: "text-rose-400",
};

export default function LeaderboardPage() {
  return (
    <AuthGate>
      <p className="eyebrow mb-2 text-gold">This quarter</p>
      <h1 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,3.5vw,2.5rem)] text-paper">
        Leaderboard.
      </h1>
      <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-neutral-400">
        Ranked on tracked sales, not follower count. Reach opens the door; conversion decides the
        standings — which is why Tier 3 creators regularly outrank Tier 2 here.
      </p>

      {/* Creators */}
      <div className="mt-12">
        <p className="eyebrow mb-4 flex items-center gap-2 text-gold">
          <Trophy size={13} strokeWidth={1.6} />
          By creator
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[44rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-gold/25">
                {["#", "Creator", "Location", "Tier", "Top format", "Tracked sales"].map((h) => (
                  <th key={h} className="eyebrow py-3 pr-6 text-gold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CREATORS.map((c) => (
                <tr
                  key={c.rank}
                  className="border-b border-white/[0.07] transition-colors duration-300 hover:bg-white/[0.02]"
                >
                  <td
                    className={`py-4 pr-6 font-[family-name:var(--font-display)] text-xl tabular-nums ${
                      RANK_TONE[c.rank] ?? "text-neutral-400"
                    }`}
                  >
                    {c.rank}
                  </td>
                  <td className="py-4 pr-6 text-[0.9375rem] text-paper">{c.name}</td>
                  <td className="py-4 pr-6 text-[0.8125rem] text-neutral-400">{c.city}</td>
                  <td className="py-4 pr-6 text-[0.8125rem] text-neutral-200">{c.tier}</td>
                  <td className="py-4 pr-6 text-[0.8125rem] text-neutral-400">{c.format}</td>
                  <td className="py-4 pr-6">
                    <Money usd={c.sales} className="text-[0.9375rem] text-gold tabular-nums" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Locations */}
      <div className="mt-14">
        <p className="eyebrow mb-4 flex items-center gap-2 text-gold">
          <MapPin size={13} strokeWidth={1.6} />
          By location
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {LOCATIONS.map((l) => (
            <div
              key={l.city}
              className="rounded-xl border border-white/[0.07] p-5 transition-colors duration-400 hover:border-gold/50"
            >
              <p className="text-[1.0625rem] text-paper">{l.city}</p>
              <p className="mt-1 text-[0.75rem] text-neutral-400 tabular-nums">
                {l.creators} creators
              </p>
              <Money
                usd={l.sales}
                className="mt-4 block font-[family-name:var(--font-display)] text-xl text-gold tabular-nums"
              />
            </div>
          ))}
        </div>
      </div>

      <p className="mt-10 text-[0.75rem] text-neutral-400">
        Demonstration standings. Live rankings populate from tracked commission entries.
      </p>
    </AuthGate>
  );
}

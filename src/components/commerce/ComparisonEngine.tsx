"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Minus, Info, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/primitives";

/**
 * Comparison engine.
 *
 * IMPORTANT — why there are no competitor brand names in here.
 *
 * A comparison table that makes specific factual claims about a *named* rival
 * is comparative advertising. It is lawful in most markets only where every
 * claim is truthful and substantiated, and the burden of proof sits with the
 * publisher. We hold no audited data on any competitor, so naming one and
 * asserting "they use dipped knots" would be an unsubstantiated claim about an
 * identifiable business — a real legal exposure and, frankly, a bad look for a
 * brand whose whole position is honesty.
 *
 * So the comparison runs against the *category norm*: characteristics that are
 * broadly documented across the mass-market wig trade. Every Beyond Lace column
 * entry is a claim we can actually evidence from our own operations.
 *
 * To compare against named vendors, populate `sourcedRivals` with claims you
 * can cite, keep the citation, and have counsel review before publishing.
 */

type Verdict = "yes" | "no" | "partial";

interface Row {
  dimension: string;
  detail: string;
  us: { verdict: Verdict; note: string };
  norm: { verdict: Verdict; note: string };
}

const DIMENSIONS: Record<string, Row[]> = {
  Construction: [
    {
      dimension: "Knot treatment",
      detail: "How the knots at the hairline are lightened.",
      us: { verdict: "yes", note: "Individually bleached" },
      norm: { verdict: "partial", note: "Commonly dip-bleached in batches" },
    },
    {
      dimension: "Cap build",
      detail: "Hand-tied versus machine-wefted through the parting.",
      us: { verdict: "yes", note: "Hand-tied through the parting" },
      norm: { verdict: "partial", note: "Often machine-wefted throughout" },
    },
    {
      dimension: "Hairline",
      detail: "Pre-plucked with graduated density.",
      us: { verdict: "yes", note: "Pre-plucked, graduated" },
      norm: { verdict: "partial", note: "Varies widely by run" },
    },
  ],
  "Hair & consistency": [
    {
      dimension: "Cuticle alignment",
      detail: "Whether cuticles run one direction — what stops matting at the nape.",
      us: { verdict: "yes", note: "Cuticle-aligned virgin Remy" },
      norm: { verdict: "partial", note: "Frequently mixed-direction" },
    },
    {
      dimension: "Batch consistency",
      detail: "Whether a reorder matches the unit you already own.",
      us: { verdict: "yes", note: "Measured against a reference batch" },
      norm: { verdict: "no", note: "Grade label only (10A/12A)" },
    },
    {
      dimension: "Single-donor sourcing",
      detail: "One head of hair per unit where specified.",
      us: { verdict: "yes", note: "Single-donor on signature line" },
      norm: { verdict: "no", note: "Typically pooled" },
    },
  ],
  "Buying with certainty": [
    {
      dimension: "Shade proofing",
      detail: "Testing lace against your own skin before you commit.",
      us: { verdict: "yes", note: "$5 Lace Test, credited in full" },
      norm: { verdict: "no", note: "Product photography only" },
    },
    {
      dimension: "Returns window",
      detail: "How long you have, and on what condition.",
      us: { verdict: "yes", note: "30 days, lace uncut" },
      norm: { verdict: "partial", note: "Often final sale once shipped" },
    },
    {
      dimension: "Discreet delivery",
      detail: "Unbranded outer packaging as a standard option.",
      us: { verdict: "yes", note: "Available on every order" },
      norm: { verdict: "partial", note: "Rarely offered" },
    },
  ],
  "Price & partnership": [
    {
      dimension: "Entry price",
      detail: "What the cheapest comparable unit costs.",
      us: { verdict: "no", note: "We are not the cheapest — $500+" },
      norm: { verdict: "yes", note: "Mass-market entry is far lower" },
    },
    {
      dimension: "Expected lifespan",
      detail: "How long a maintained unit lasts.",
      us: { verdict: "yes", note: "18–36 months maintained" },
      norm: { verdict: "partial", note: "Commonly 6–12 months" },
    },
    {
      dimension: "Wholesale MAP protection",
      detail: "Whether your retail margin is contractually defended.",
      us: { verdict: "yes", note: "Enforced, both directions" },
      norm: { verdict: "no", note: "Rarely enforced" },
    },
  ],
};

const VERDICT_STYLE: Record<Verdict, { icon: typeof Check; cls: string; label: string }> = {
  yes: { icon: Check, cls: "text-gold", label: "Yes" },
  partial: { icon: Minus, cls: "text-rose-400", label: "Varies" },
  no: { icon: Minus, cls: "text-neutral-400", label: "No" },
};

export function ComparisonEngine() {
  const tabs = Object.keys(DIMENSIONS);
  const [active, setActive] = useState(tabs[0]);
  const rows = DIMENSIONS[active];

  return (
    <div>
      {/* Tabs */}
      <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Comparison dimensions">
        {tabs.map((t) => {
          const on = t === active;
          return (
            <button
              key={t}
              role="tab"
              aria-selected={on}
              onClick={() => setActive(t)}
              className={`relative rounded-full border px-5 py-2.5 text-[0.75rem] tracking-[0.08em] uppercase transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                on
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-white/15 text-neutral-400 hover:border-gold/50 hover:text-paper"
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-white/[0.07]">
        <table className="w-full min-w-[46rem] border-collapse text-left">
          <thead>
            <tr className="border-b border-gold/25">
              <th className="eyebrow px-6 py-4 text-gold">What differs</th>
              <th className="eyebrow px-6 py-4 text-gold">Beyond Lace</th>
              <th className="eyebrow px-6 py-4 text-neutral-400">Mass-market norm</th>
            </tr>
          </thead>
          <tbody key={active}>
            {rows.map((r, i) => {
              const Us = VERDICT_STYLE[r.us.verdict];
              const Norm = VERDICT_STYLE[r.norm.verdict];
              return (
                <tr
                  key={r.dimension}
                  className="border-b border-white/[0.07] align-top transition-colors duration-300 last:border-0 hover:bg-white/[0.02]"
                  style={{ animation: `blFade 520ms cubic-bezier(0.16,1,0.3,1) ${i * 70}ms both` }}
                >
                  <td className="px-6 py-5">
                    <p className="text-[0.9375rem] text-paper">{r.dimension}</p>
                    <p className="mt-1 max-w-xs text-[0.8125rem] leading-relaxed text-neutral-400">
                      {r.detail}
                    </p>
                  </td>
                  <td className="px-6 py-5">
                    <span className="flex items-start gap-2.5">
                      <Us.icon size={15} strokeWidth={2} className={`mt-0.5 shrink-0 ${Us.cls}`} />
                      <span className="text-[0.875rem] text-neutral-200">{r.us.note}</span>
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="flex items-start gap-2.5">
                      <Norm.icon
                        size={15}
                        strokeWidth={2}
                        className={`mt-0.5 shrink-0 ${Norm.cls}`}
                      />
                      <span className="text-[0.875rem] text-neutral-400">{r.norm.note}</span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Methodology — stated plainly rather than buried */}
      <Reveal delay={0.15}>
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-gold/25 bg-plum-900/40 p-5">
          <Info size={16} strokeWidth={1.6} className="mt-0.5 shrink-0 text-gold" />
          <p className="text-[0.8125rem] leading-relaxed text-neutral-400">
            <span className="text-gold">How to read this.</span> The right column describes the
            mass-market norm, not any single named brand — we do not hold audited data on other
            companies and will not assert claims about them we cannot evidence. Every Beyond Lace
            entry is verifiable from our own construction and policy documents, including the row
            where we lose: we are not the cheapest, and we do not pretend to be.
          </p>
        </div>
      </Reveal>

      <div className="mt-8 flex flex-wrap gap-5">
        <Link
          href="/product/lace-test-kit"
          className="cta-primary group inline-flex items-center gap-2 px-8 py-3.5 text-[0.75rem] tracking-[0.14em] uppercase transition-colors duration-500"
        >
          Test the shade for $5
          <ArrowUpRight
            size={13}
            strokeWidth={1.6}
            className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
        <Link
          href="/wholesale#sourcing"
          className="inline-flex items-center border-b border-gold pb-1 text-[0.75rem] tracking-[0.1em] text-gold uppercase"
        >
          Read the sourcing standard
        </Link>
      </div>
    </div>
  );
}

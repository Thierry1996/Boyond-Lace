import type { Metadata } from "next";
import Link from "next/link";
import { ResourceHero } from "@/components/ui/ResourceHero";
import { Section, SectionHeading } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Wholesale Pricing — Tier Sheet & Download",
  description:
    "Beyond Lace wholesale pricing tiers for salons, resellers and distributors: Bronze, Silver and Gold, 50-unit MOQ, MAP-protected margins.",
};

const TIERS = [
  {
    name: "Bronze",
    volume: "50–149 units / yr",
    terms: "Net 15 after first order",
    margin: "Standard partner pricing",
  },
  {
    name: "Silver",
    volume: "150–499 units / yr",
    terms: "Net 30",
    margin: "Improved tier pricing",
  },
  { name: "Gold", volume: "500+ units / yr", terms: "Net 45", margin: "Best available pricing" },
];

export default function WholesalePricingPage() {
  return (
    <>
      <ResourceHero
        eyebrow="B2B resources"
        title="Wholesale pricing."
        italic="Released on verification."
        body="Unit pricing is commercially sensitive and MAP-protected, so the full sheet goes to verified businesses only. That verification is exactly what makes the price floor enforceable for every partner already in the programme."
        image="b2bResources"
        cta={{ label: "Apply for access", href: "/wholesale#apply" }}
      />

      <Section
        className="py-20"
        eyebrowLeft="Tiers"
        eyebrowCenter="Volume-based"
        eyebrowRight="MOQ 50"
      >
        <SectionHeading
          title="Three tiers, reviewed quarterly."
          body="Tier is set by trailing twelve-month volume. Moving up is automatic — we do not make partners renegotiate for pricing they have already earned."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {TIERS.map((t) => (
            <div
              key={t.name}
              className="border border-white/[0.07] p-8 transition-colors duration-300 hover:border-gold/50"
            >
              <h3 className="font-[family-name:var(--font-display)] text-3xl text-paper">
                {t.name}
              </h3>
              <p className="mt-2 text-[0.875rem] text-neutral-400 tabular-nums">{t.volume}</p>
              <div className="rule-gilded my-6" />
              <p className="text-[0.875rem] text-gold">{t.margin}</p>
              <p className="mt-2 text-[0.875rem] text-neutral-400">{t.terms}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 border border-gold/30 bg-plum-900/50 p-8">
          <p className="eyebrow mb-3 text-gold">The pricing sheet</p>
          <h3 className="text-2xl text-paper">Gated on purpose, not to be difficult.</h3>
          <p className="mt-4 max-w-2xl text-[0.9375rem] leading-relaxed text-neutral-400">
            The PDF contains per-SKU landed cost and recommended retail across all three tiers.
            Published openly, it would let anyone undercut the partners who have committed to our
            MAP agreement. Approved partners receive it by email within two business days, and it
            lives permanently in the partner portal thereafter.
          </p>
          <div className="mt-7 flex flex-wrap gap-5">
            <Link
              href="/wholesale#apply"
              className="cta-primary px-8 py-3.5 text-[0.8125rem] tracking-[0.14em] uppercase"
            >
              Request the sheet
            </Link>
            <Link
              href="/legal/wholesale-terms"
              className="border-b border-white/25 pb-1 text-[0.8125rem] tracking-[0.1em] text-neutral-200 uppercase transition-colors hover:border-gold hover:text-gold"
            >
              Read the MAP policy
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}

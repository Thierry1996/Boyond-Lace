import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ResourceHero } from "@/components/ui/ResourceHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { BrandImage } from "@/components/ui/BrandImage";
import { TIERS, PROMOTABLE_CATEGORIES } from "@/lib/ambassador";

export const metadata: Metadata = {
  title: "Beyond Ambassadors — Three-Tier Creator Programme",
  description:
    "The Beyond Lace ambassador programme: 15–20% affiliate commission for micro creators, contracted exclusivity for macro creators, equity and retainer for celebrity stylists.",
};

export default function AmbassadorsPage() {
  return (
    <>
      <ResourceHero
        eyebrow="Beyond Ambassadors"
        title="Not gifting."
        italic="Partnership."
        body="Three tiers, each a different commercial relationship. Every one trades real value both directions, every one is capped, and every one is reviewed quarterly so you move up on your numbers rather than on your negotiation."
        image="educationPartnership"
        breadcrumb={{ label: "The Beyond Circle", href: "/circle" }}
        cta={{ label: "Apply to join", href: "/ambassadors/apply" }}
      />

      {/* Tiers */}
      <Section
        className="py-20"
        eyebrowLeft="The structure"
        eyebrowCenter="Three tiers"
        eyebrowRight="Quarterly review"
      >
        <SectionHeading
          title="Where you start, and how you climb."
          body="Tier is assigned by our social marketing division at review — never self-selected. Reach opens the door; tracked sales decide how fast you move through it."
        />
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {TIERS.map((tier) => (
            <article
              key={tier.slug}
              className="group flex flex-col overflow-hidden rounded-lg border border-white/[0.07] transition-colors duration-500 hover:border-gold/60"
            >
              <div className="overflow-hidden">
                <BrandImage
                  name={tier.image}
                  ratio="4 / 3"
                  width={800}
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  imgClassName="transition-transform duration-[900ms] ease-[var(--ease-editorial)] group-hover:scale-[1.06]"
                />
              </div>
              <div className="flex flex-1 flex-col p-7">
                <p className="eyebrow text-gold">{tier.reach}</p>
                <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl text-paper">
                  {tier.name}
                </h3>
                <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-neutral-400">
                  {tier.summary}
                </p>
                <p className="mt-5 border-t border-gold/20 pt-4 text-[0.875rem] text-gold">
                  {tier.reward}
                </p>
                <Link
                  href={`/ambassadors/apply/${tier.slug}`}
                  className="mt-5 inline-flex items-center gap-1.5 border-b border-gold pb-1 text-[0.75rem] tracking-[0.1em] text-gold uppercase transition-opacity hover:opacity-75"
                >
                  Apply for this tier
                  <ArrowUpRight size={12} strokeWidth={1.5} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* Promotable categories */}
      <section className="border-t border-white/[0.07] bg-plum-900 py-20">
        <div className="mx-auto max-w-[1440px] px-[4vw]">
          <p className="eyebrow mb-4 text-gold">What you promote</p>
          <h2 className="max-w-2xl text-[clamp(1.75rem,4vw,3rem)] text-paper">
            Three categories. Different economics.
          </h2>
          <p className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-blush-200/70">
            Promote across all three or specialise in one. Aftercare pays a lower rate on a lower
            ticket — but it recurs every month, which is why our highest earners never ignore it.
          </p>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {PROMOTABLE_CATEGORIES.map((c) => (
              <Link
                key={c.id}
                href={c.href}
                className="group block overflow-hidden rounded-lg border border-gold/20 transition-colors duration-500 hover:border-gold"
              >
                <div className="overflow-hidden">
                  <BrandImage
                    name={c.image}
                    ratio="16 / 10"
                    width={800}
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    imgClassName="transition-transform duration-[900ms] ease-[var(--ease-editorial)] group-hover:scale-[1.06]"
                  />
                </div>
                <div className="p-7">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-xl text-paper transition-colors group-hover:text-gold">
                      {c.name}
                    </h3>
                    <span className="shrink-0 text-[0.8125rem] text-gold tabular-nums">
                      {(c.baseCommissionBps / 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="mt-3 text-[0.875rem] leading-relaxed text-blush-200/70">
                    {c.blurb}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How payouts work */}
      <Section
        className="py-20"
        eyebrowLeft="Getting paid"
        eyebrowCenter="Monthly"
        eyebrowRight="Your choice of rail"
      >
        <div className="grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading
              title="Paid the way you want."
              body="Commission accrues against your own affiliate links in real time. Request a payout whenever your balance clears the minimum — there is no ninety-day hold and no rolling reserve."
            />
            <ul className="mt-8 space-y-3">
              {[
                "PayPal — fastest, most countries",
                "CashApp — US only, $cashtag",
                "Bank transfer — for contracted Tier 2 and Tier 1",
                "USDC, BTC or ETH wallet — for creators outside easy banking",
              ].map((p) => (
                <li key={p} className="flex items-start gap-3 text-[0.9375rem] text-neutral-400">
                  <span className="mt-2 inline-block h-1 w-1 shrink-0 rotate-45 bg-gold" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-gold/25 p-8">
            <p className="eyebrow mb-3 text-gold">The dashboard</p>
            <h3 className="font-[family-name:var(--font-display)] text-2xl text-paper">
              Everything visible, both directions.
            </h3>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-neutral-400">
              Link your Instagram and TikTok, log the content you run, and watch commission accrue
              against tracked links. You see your numbers; we see the same numbers. Transparency is
              the point — it is what lets us pay quickly without an audit every month.
            </p>
            <div className="mt-7 flex flex-wrap gap-5">
              <Link
                href="/ambassadors/apply"
                className="cta-primary px-8 py-3.5 text-[0.8125rem] tracking-[0.14em] uppercase"
              >
                Apply now
              </Link>
              <Link
                href="/ambassadors/dashboard"
                className="border-b border-white/25 pb-1 text-[0.8125rem] tracking-[0.1em] text-neutral-200 uppercase transition-colors hover:border-gold hover:text-gold"
              >
                Ambassador sign-in
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

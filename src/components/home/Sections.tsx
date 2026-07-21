"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Marquee, CountUp, Magnetic, Tilt } from "@/components/motion/interactions";
import { Reveal, Stagger, StaggerItem, SplitText } from "@/components/motion/primitives";
import { BrandImage } from "@/components/ui/BrandImage";

/**
 * Homepage editorial sections.
 *
 * The brief was to kill the generated feel. The three culprits, addressed here:
 *
 *  · Uniform grids — the pillar section below is a broken 12-column bento where
 *    tiles differ in span and weight. Equal tiles are the loudest tell.
 *  · Simultaneous animation — everything staggers on the same curve instead.
 *  · Inert bands — the marquee and count-ups give the page a pulse between
 *    static blocks, which is what separates an editorial site from a template.
 */

/** Gilded statement ticker. Sits between dark sections as a palate cleanser. */
export function BrandMarquee() {
  const phrases = [
    "Hand-tied HD Swiss lace",
    "Batch-consistency guaranteed",
    "Individually bleached knots",
    "Single-donor virgin Remy",
    "Pre-plucked hairlines",
    "Beyond Lace. Beyond Beautiful.",
  ];

  return (
    <div className="grain relative overflow-hidden border-y border-gold/20 bg-plum-900 py-5">
      <Marquee speed={46}>
        {phrases.map((p, i) => (
          <span key={`${p}-${i}`} className="flex items-center whitespace-nowrap">
            <span className="px-8 font-[family-name:var(--font-display)] text-[clamp(1rem,1.8vw,1.5rem)] text-blush-200/80 italic">
              {p}
            </span>
            <span aria-hidden="true" className="h-1 w-1 rotate-45 bg-gold" />
          </span>
        ))}
      </Marquee>
    </div>
  );
}

/** Figures that resolve on scroll. Static numbers read as filler. */
export function ProofBand() {
  const stats = [
    { to: 36, suffix: " mo", label: "Unit lifespan, maintained", decimals: 0 },
    { to: 20, suffix: "%", label: "Capacity held for trend runs", decimals: 0 },
    { to: 100, suffix: "%", label: "Batch consistency guarantee", decimals: 0 },
    { to: 5, prefix: "$", label: "To be certain of your shade", decimals: 0 },
  ];

  return (
    <section className="section-rhythm relative mx-auto max-w-[1440px] px-[4vw]">
      <Stagger className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4" gap={0.09}>
        {stats.map((s) => (
          <StaggerItem key={s.label}>
            <div className="border-t border-gold/25 pt-6">
              <p className="text-gilded font-[family-name:var(--font-display)] text-[clamp(2.75rem,5vw,4rem)] leading-none tabular-nums">
                <CountUp
                  to={s.to}
                  prefix={s.prefix}
                  suffix={s.suffix}
                  decimals={s.decimals}
                  duration={1700}
                />
              </p>
              <p className="mt-4 max-w-[14rem] text-[0.875rem] leading-relaxed text-neutral-400">
                {s.label}
              </p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

/**
 * Broken-grid pillar section. Tile spans differ deliberately: the first and
 * last are wide anchors, the middle four are narrow. An even 3×2 grid is what
 * makes a page look generated.
 */
export function PillarBento() {
  const pillars = [
    {
      n: "01",
      title: "Supply chain mastery",
      body: "Exclusive single-donor contracts and a batch guarantee measured against a reference run — not a grade label argued over in a listing.",
      span: "lg:col-span-7",
      tall: true,
      image: "navWholesale" as const,
    },
    {
      n: "02",
      title: "White-label agility",
      body: "Fifty units is the whole minimum. Custom packaging and a turnkey asset kit from the first order.",
      span: "lg:col-span-5",
      tall: false,
    },
    {
      n: "03",
      title: "Dual revenue",
      body: "Retail proves the product. Wholesale steadies the year. Neither undercuts the other.",
      span: "lg:col-span-4",
      tall: false,
    },
    {
      n: "04",
      title: "Data-first advertising",
      body: "The same unit on four skin tones, because that is the objection that actually stops the sale.",
      span: "lg:col-span-4",
      tall: false,
    },
    {
      n: "05",
      title: "Tiered partnership",
      body: "Three tiers, micro-affiliate to celebrity stylist. We court the stylists first.",
      span: "lg:col-span-4",
      tall: false,
    },
    {
      n: "06",
      title: "Retention engineering",
      body: "A five-dollar test kit, a monthly ritual, a private community. This category loses a third of its revenue to returns. We designed that out.",
      span: "lg:col-span-12",
      tall: false,
      wide: true,
    },
  ];

  return (
    <section className="section-rhythm mx-auto max-w-[1440px] px-[4vw]">
      <div className="mb-16 flex flex-wrap items-end justify-between gap-8">
        <div className="max-w-2xl">
          <Reveal duration={0.7}>
            <p className="eyebrow mb-4 text-gold">Why this brand charges what it charges</p>
          </Reveal>
          <SplitText
            as="h2"
            text="An empire, not a storefront."
            italicFrom={2}
            className="text-[clamp(2rem,5vw,4rem)] leading-[1.02] text-paper"
          />
        </div>
        <Reveal delay={0.3} className="shrink-0">
          <Link
            href="/brand#pillars"
            className="group inline-flex items-center gap-2 border-b border-gold pb-1 text-[0.75rem] tracking-[0.12em] text-gold uppercase"
          >
            All six pillars
            <ArrowUpRight
              size={13}
              strokeWidth={1.5}
              className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </Reveal>
      </div>

      <Stagger className="grid grid-cols-1 gap-4 lg:grid-cols-12" gap={0.08}>
        {pillars.map((p) => (
          <StaggerItem key={p.n} className={p.span}>
            <article
              className={`card-lift group relative h-full overflow-hidden rounded-xl border border-white/[0.07] hover:border-gold/50 ${
                p.tall ? "min-h-[22rem]" : "min-h-[15rem]"
              }`}
            >
              {p.image && (
                <>
                  <BrandImage
                    name={p.image}
                    ratio="auto"
                    width={1200}
                    sizes="60vw"
                    overlay={false}
                    className="absolute inset-0 h-full w-full"
                    imgClassName="transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(120deg, rgb(9 9 9 / 0.94) 0%, rgb(50 21 40 / 0.82) 55%, rgb(90 45 103 / 0.5) 100%)",
                    }}
                  />
                </>
              )}

              <div
                className={`relative flex h-full flex-col p-7 sm:p-8 ${
                  p.wide ? "lg:flex-row lg:items-end lg:justify-between lg:gap-12" : ""
                }`}
              >
                <div className={p.wide ? "lg:max-w-md" : ""}>
                  <span className="text-gilded font-[family-name:var(--font-display)] text-2xl tabular-nums">
                    {p.n}
                  </span>
                  <h3 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(1.25rem,2vw,1.75rem)] text-paper">
                    {p.title}
                  </h3>
                </div>
                <p
                  className={`mt-4 text-[0.9375rem] leading-relaxed text-neutral-400 ${
                    p.wide ? "lg:mt-0 lg:max-w-xl" : p.tall ? "mt-auto pt-8" : ""
                  }`}
                >
                  {p.body}
                </p>
              </div>

              {/* Interior gold edge, drawn on hover */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gold transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
              />
            </article>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

/**
 * Asymmetric editorial split. Offset columns and a parallax-ish image beat two
 * equal halves, which is the default every template reaches for.
 */
export function EditorialSplit() {
  return (
    <section className="section-rhythm relative overflow-hidden">
      <div className="mx-auto grid max-w-[1440px] items-center gap-14 px-[4vw] lg:grid-cols-12">
        <Reveal direction="right" className="lg:col-span-5 lg:col-start-1">
          <Tilt className="overflow-hidden rounded-xl">
            <BrandImage name="laceDetail" ratio="4 / 5" width={900} sizes="45vw" />
          </Tilt>
        </Reveal>

        <div className="lg:col-span-6 lg:col-start-7">
          <Reveal duration={0.7}>
            <p className="eyebrow mb-5 text-gold">The five-dollar answer</p>
          </Reveal>
          <SplitText
            as="h2"
            text="Certainty costs five dollars."
            italicFrom={1}
            className="text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.04] text-paper"
          />
          <Reveal delay={0.3}>
            <p className="mt-6 max-w-lg text-[1.0625rem] leading-relaxed text-neutral-400">
              A third of this industry&apos;s units go back in the box, and almost all of it is
              shade — lace that looked right under a ringlight and wrong in daylight. So we send six
              swatches and five shade cards for five dollars, redeemable in full.
            </p>
          </Reveal>
          <Reveal delay={0.42}>
            <p className="mt-4 max-w-lg text-[1.0625rem] leading-relaxed text-neutral-400">
              We would rather spend five dollars than have you return eight hundred.
            </p>
          </Reveal>
          <Reveal delay={0.54}>
            <Magnetic className="mt-10 inline-block">
              <Link
                href="/product/lace-test-kit"
                className="group inline-flex items-center gap-3 border border-gold px-9 py-4 text-[0.8125rem] tracking-[0.14em] text-gold uppercase transition-colors duration-500 hover:bg-gold hover:text-ink"
              >
                Order the Lace Test
                <ArrowUpRight
                  size={14}
                  strokeWidth={1.5}
                  className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </Magnetic>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

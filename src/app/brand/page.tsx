import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ProductImage } from "@/components/ui/ProductImage";
import { MonogramAurora } from "@/components/brand/Logo";

export const metadata: Metadata = {
  title: "Manifesto — Why Beyond Lace Exists",
  description:
    "Beyond Lace makes luxury human hair wigs for reinvention, restoration, and quiet confidence. The philosophy, the six pillars, and the manufacturing behind them.",
};

const PILLARS = [
  {
    n: "01",
    title: "Supply Chain & Manufacturing Mastery",
    body: "Most brands buy whatever the container held that month, then argue about grade labels to cover the variance. We hold exclusive single-donor contracts and guarantee batch consistency instead — the unit you reorder in eighteen months matches the one in your hand today. That is a harder promise than 12A, and a more useful one.",
  },
  {
    n: "02",
    title: "White-Label & Private Label Agility",
    body: "Fifty-unit minimums, custom packaging, branded combs, and a turnkey asset kit. Boutique salons get the terms that used to require a container order, which turns small buyers into long-term partners rather than one-time customers.",
  },
  {
    n: "03",
    title: "Hybrid Wholesale & Direct Revenue",
    body: "Retail proves the product and absorbs the experiments. Wholesale steadies the year against retail's seasonality. Neither is permitted to undercut the other: MAP is contractually enforced, and our full wholesale catalogue never appears at retail.",
  },
  {
    n: "04",
    title: "Data-First Performance Advertising",
    body: "Real transformation footage outperforms studio work by an order of magnitude, so that is what we run. And we show the same unit on four skin tones, because 'will this match me' is the objection that actually stops the sale.",
  },
  {
    n: "05",
    title: "Tiered Partnership Ecosystem",
    body: "Three tiers, from micro-affiliate to celebrity stylist. We court the stylists before the talent — they are the ones deciding what walks a red carpet, and that decision is made months before anyone sees it.",
  },
  {
    n: "06",
    title: "Post-Purchase Logistics & Retention",
    body: "This category loses fifteen to forty percent of revenue to returns. A five-dollar test kit, a monthly care ritual, and a private community are not perks — they are the three systems that engineer that number down.",
  },
];

export default function BrandPage() {
  return (
    <>
      <section className="surface-velvet relative flex min-h-[80vh] items-center overflow-hidden">
        <div
          className="pointer-events-none absolute top-1/3 -left-[10%] h-[50vh] w-[50vh] rounded-full opacity-[0.12] blur-[130px]"
          style={{ background: "var(--grad-aurora)" }}
        />
        <div className="relative mx-auto w-full max-w-[1440px] px-[4vw] py-32">
          <div className="flex items-center justify-between border-t border-white/[0.07] pt-4">
            <span className="eyebrow">Our brand</span>
            <span className="eyebrow hidden md:block">Manifesto</span>
            <span className="eyebrow">Beyond Beautiful</span>
          </div>
          <div className="mt-24 max-w-4xl">
            <p className="eyebrow mb-8 text-gold">The why</p>
            <h1 className="text-[clamp(2.75rem,7.5vw,6.5rem)] leading-[0.95] text-paper">
              Nobody has ever
              <span className="block italic">wanted a wig.</span>
            </h1>
            <p className="mt-10 max-w-2xl text-lg leading-relaxed text-neutral-400">
              They wanted the morning it gave back. The photograph they did not flinch at. The
              meeting where their hair was the last thing on their mind. We built a company around
              that distinction, and it changed every decision downstream.
            </p>
          </div>
        </div>
      </section>

      {/* Manifesto */}
      <Section
        className="py-28"
        eyebrowLeft="Manifesto"
        eyebrowCenter="The distinction"
        eyebrowRight="01"
      >
        <div className="mx-auto max-w-3xl">
          <div className="space-y-7 text-[1.125rem] leading-[1.75] text-neutral-200">
            <p className="font-[family-name:var(--font-display)] text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.3] text-paper italic">
              We don&apos;t sell hair. We sell the version of you that exists beyond the wig.
            </p>
            <p>
              Every brand in this category sells the same four specifications back to you. HD lace.
              Twelve A. Pre-plucked. Bleached knots. They are true, they are table stakes, and none
              of them are the reason anyone buys.
            </p>
            <p>
              The reason is quieter than that. It is the woman who has spent three years explaining
              her hairline to people who did not ask. The one whose treatment ended and whose
              reflection has not caught up yet. The executive who cannot spend forty minutes on a
              blowout and refuses to look like she didn&apos;t. The man who is not going to say a
              word about it to anyone, ever.
            </p>
            <p>
              &ldquo;Beyond&rdquo; is a promise about where the journey ends. Not another entry
              point, not another unit that photographs well and betrays you in daylight — the last
              one. The point at which the question stops being asked, including by you.
            </p>
            <p>
              That promise is expensive to keep. It requires manufacturing discipline most brands
              have no interest in, a return system that costs us money up front, and a refusal to
              sell anything we would not wear ourselves. We think that is what a luxury brand
              actually is. Not the price. The refusal.
            </p>
          </div>
        </div>
      </Section>

      {/* Mission */}
      <section id="mission" className="scroll-mt-32 border-t border-white/[0.07] py-24">
        <div className="mx-auto max-w-[1440px] px-[4vw]">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <p className="eyebrow mb-4 text-gold">Mission</p>
              <p className="font-[family-name:var(--font-display)] text-[clamp(1.375rem,2.5vw,1.875rem)] leading-[1.35] text-paper">
                To make invisible, batch-consistent human hair the standard — for reinvention and
                for restoration, at the same table, to the same specification.
              </p>
            </div>
            <div>
              <p className="eyebrow mb-4 text-gold">Vision</p>
              <p className="font-[family-name:var(--font-display)] text-[clamp(1.375rem,2.5vw,1.875rem)] leading-[1.35] text-paper">
                In five years, when this industry says &ldquo;quiet luxury,&rdquo; it means one
                brand — in a Lagos salon, a Los Angeles studio, and your own bathroom mirror.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dual promise */}
      <Section
        className="py-28"
        eyebrowLeft="Who this is for"
        eyebrowCenter="Two truths"
        eyebrowRight="02"
      >
        <SectionHeading
          eyebrow="One brand, two emotional registers"
          title="Elevation and restoration are the same engineering."
          body="Most hair brands pick one. They sell glamour, or they sell dignity. We refuse the choice, because the woman rebuilding after chemotherapy and the woman walking into her own wedding need the identical thing: a unit nobody notices."
        />
        <div className="mt-16 grid gap-10 md:grid-cols-2">
          <div className="border-t border-white/[0.07] pt-8">
            <p className="eyebrow mb-4 text-gold">Elevation</p>
            <h3 className="text-2xl text-paper">For reinvention</h3>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-neutral-400">
              The occasion buyer who needs one perfect unit, not a collection. The professional
              buying four hours a week back. The Gen Z stylist who wants the trend without the tell.
              Camera-ready, daylight-proof, and engineered to survive the second look.
            </p>
          </div>
          <div className="border-t border-white/[0.07] pt-8">
            <p className="eyebrow mb-4 text-amethyst-400">Restoration</p>
            <h3 className="text-2xl text-paper">For dignity</h3>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-neutral-400">
              Silk-top caps with no lace against sensitive skin. Three cap sizes and no adhesive
              required. Unbranded outer packaging as standard, a private fitting call, and copy that
              never once calls this a treat. It is not a treat. It is normalcy, and we treat it that
              way.
            </p>
          </div>
        </div>
      </Section>

      {/* Pillars */}
      <Section
        className="py-28"
        eyebrowLeft="The architecture"
        eyebrowCenter="Six Pillars"
        eyebrowRight="03"
      >
        <div id="pillars" className="scroll-mt-32">
          <SectionHeading
            eyebrow="How the promise is actually kept"
            title="Six systems, each one feeding the next."
            body="A philosophy with nothing underneath it is a tagline. These are the six load-bearing systems, and they are deliberately circular — each one lowers the cost or raises the credibility of the one after it."
          />
          <div className="mt-16 space-y-0 border-t border-white/[0.07]">
            {PILLARS.map((pillar) => (
              <div
                key={pillar.n}
                className="grid gap-6 border-b border-white/[0.07] py-10 md:grid-cols-[80px_280px_1fr]"
              >
                <span className="font-[family-name:var(--font-display)] text-3xl text-gold tabular-nums">
                  {pillar.n}
                </span>
                <h3 className="text-xl leading-snug text-paper">{pillar.title}</h3>
                <p className="text-[0.9375rem] leading-relaxed text-neutral-400">{pillar.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Facility */}
      <section id="facility" className="scroll-mt-32 bg-plum-900 py-28">
        <div className="mx-auto grid max-w-[1440px] gap-16 px-[4vw] lg:grid-cols-2 lg:items-center">
          <div className="grid grid-cols-2 gap-5">
            <ProductImage
              src="plum"
              alt="Hand-tying station on the Beyond Lace manufacturing floor"
            />
            <ProductImage
              src="velvet"
              alt="Knot bleaching and hairline plucking detail"
              className="mt-12"
            />
          </div>
          <div>
            <p className="eyebrow mb-5 text-gold">Behind the scenes</p>
            <h2 className="text-[clamp(2rem,4.5vw,3.5rem)] text-paper">
              Twenty percent of the floor sits idle on purpose.
            </h2>
            <p className="mt-6 text-[1.0625rem] leading-relaxed text-blush-200/70">
              It looks like waste on a spreadsheet. It is the single reason we can answer a
              silhouette that trends on a Tuesday with a cut sample by Friday, while brands running
              at full capacity are still waiting on a container.
            </p>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-blush-200/70">
              The rest of the floor runs on one rule: every production batch must match the last on
              texture, tone, and density. Not approximately. Measurably. It is the least glamorous
              commitment we make and the one customers feel most.
            </p>
            <Link
              href="/wholesale#sourcing"
              className="mt-8 inline-block border-b border-gold pb-1 text-[0.8125rem] tracking-[0.1em] text-gold uppercase"
            >
              Sourcing standards
            </Link>
          </div>
        </div>
      </section>

      {/* Identity kit / press / assets */}
      <Section
        className="py-28"
        eyebrowLeft="The look"
        eyebrowCenter="Visual identity"
        eyebrowRight="Kit v2"
      >
        <div id="identity" className="scroll-mt-32">
          <SectionHeading
            eyebrow="Brand visual identity kit"
            title="The kit is a price justification tool."
            body="Velvet Plum, Gilded Gold, and a serif that behaves like print — the visual system is engineered to make $600 read as honest. The full kit covers logos, palette, typography, packaging, and usage rules."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="border border-white/[0.07] p-7">
              <p className="eyebrow mb-3 text-gold">The palette</p>
              <div className="flex gap-2">
                {["#090909", "#F8F5F1", "#5A2D67", "#EECAD5", "#C9A66B"].map((hex) => (
                  <span
                    key={hex}
                    className="h-10 flex-1 border border-white/10"
                    style={{ background: hex }}
                    title={hex}
                  />
                ))}
              </div>
              <p className="mt-3 text-[0.8125rem] text-neutral-400">
                Infinite Black · Luminous White · Velvet Plum · Blush Aura · Gilded Gold
              </p>
            </div>
            <div id="press" className="scroll-mt-32 border border-white/[0.07] p-7">
              <p className="eyebrow mb-3 text-gold">Press kit</p>
              <p className="text-[0.875rem] leading-relaxed text-neutral-400">
                Logos, founder imagery, product photography, and fact sheet for media and
                ambassadors. Ships as a download with the asset pipeline; until then, request it
                through the contact form and it arrives by email.
              </p>
            </div>
            <div id="assets" className="scroll-mt-32 border border-white/[0.07] p-7">
              <p className="eyebrow mb-3 text-gold">Brand asset requests</p>
              <p className="text-[0.875rem] leading-relaxed text-neutral-400">
                Partners and press can request specific assets — packaging renders, campaign
                imagery, wordmark files — via{" "}
                <Link
                  href="/support#contact"
                  className="text-gold underline-offset-4 hover:underline"
                >
                  the contact form
                </Link>{" "}
                with topic &ldquo;Press & partnerships&rdquo;.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Gallery */}
      <section id="gallery" className="scroll-mt-32 border-t border-white/[0.07] py-24">
        <div className="mx-auto max-w-[1440px] px-[4vw]">
          <SectionHeading
            eyebrow="Editorial brand gallery"
            title="The mood, before the photography lands."
            body="The photographic system is locked to hair: lace-melt macro, hairline close-ups, transformation portraits, product on stands in plum and gold. These fields hold the palette until the shoot delivers."
          />
          <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-4">
            <ProductImage src="aurora" alt="Editorial gradient study — aurora" ratio="3 / 4" />
            <ProductImage src="plum" alt="Editorial gradient study — velvet plum" ratio="3 / 4" />
            <ProductImage src="blush" alt="Editorial gradient study — blush aura" ratio="3 / 4" />
            <ProductImage src="gold" alt="Editorial gradient study — gilded gold" ratio="3 / 4" />
          </div>
        </div>
      </section>

      {/* Founder */}
      <Section className="py-28" eyebrowLeft="Founder" eyebrowCenter="The origin" eyebrowRight="04">
        <div id="founder" className="mx-auto max-w-3xl scroll-mt-32 text-center">
          <MonogramAurora size={64} />
          <blockquote className="mt-10 font-[family-name:var(--font-display)] text-[clamp(1.5rem,3.5vw,2.5rem)] leading-[1.3] text-paper italic">
            &ldquo;I spent eleven years buying hair that photographed beautifully and humiliated me
            in daylight. Beyond Lace started as a spite project. It became a manufacturing
            standard.&rdquo;
          </blockquote>
          <p className="eyebrow mt-8">Founder, Beyond Lace</p>
          <div className="rule-gilded mx-auto my-14 max-w-md" />
          <p className="text-[1.0625rem] leading-relaxed text-neutral-400">
            We are building toward one thing: that in five years, &ldquo;quiet luxury&rdquo; in
            human hair means a single brand, and that a salon in Lagos, a stylist in Los Angeles,
            and a woman in her own bathroom mirror all mean the same standard when they say it.
          </p>
          <Link
            href="/shop"
            className="mt-10 inline-block border border-gold px-9 py-4 text-[0.8125rem] tracking-[0.14em] text-gold uppercase transition-all duration-500 hover:bg-gold hover:text-ink"
          >
            See the collection
          </Link>
        </div>
      </Section>
    </>
  );
}

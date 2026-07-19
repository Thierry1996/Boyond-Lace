import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ProductImage } from "@/components/ui/ProductImage";

export const metadata: Metadata = {
  title: "Learn — Wig Education, Styling & Fit Guides",
  description:
    "Lace melting, hairline plucking, shade matching, cap sizing, and hair-grade education for luxury human hair wigs. Everything that removes the guesswork.",
};

const TUTORIALS = [
  {
    id: "melting",
    title: "Lace Melting",
    body: "The difference between lace that disappears and lace that photographs is technique, not product. The full sequence: skin prep, adhesive layering, tension, and the two minutes under a scarf that most tutorials skip.",
    length: "12 min",
  },
  {
    id: "plucking",
    title: "Hairline Plucking",
    body: "Our units arrive pre-plucked, so this guide is about restraint — how to customise a hairline to your face without thinning it past the point of return. Includes the tweezers angle nobody teaches.",
    length: "9 min",
  },
  {
    id: "maintenance",
    title: "Daily Maintenance",
    body: "The nightly two-minute ritual that decides whether a unit lasts twelve months or thirty. Wrapping, brushing order, wash-day cadence, and what silk pillowcases actually do.",
    length: "7 min",
  },
];

const FAQS = [
  {
    q: "How do I know my lace shade before buying?",
    a: "Order The Lace Test — six swatches and five shade cards for $5, credited back in full against any unit. Judge them against your skin in your own light, not a showroom's.",
  },
  {
    q: "What cap size am I?",
    a: 'Measure from your front hairline, over the crown, to your nape. Under 21.5" is Petite, 21.5–23" is Average, over 23" is Large. Silk-top units come in all three; most others adjust across the middle two.',
  },
  {
    q: "Do you take returns?",
    a: "Thirty days, provided the lace is uncut. Units that used a Lace Test kit first almost never come back — which is the point of the kit.",
  },
  {
    q: "What does 'batch consistency' actually mean?",
    a: "Every production run is measured against a reference batch for texture, tone, and density. The unit you reorder in eighteen months matches the one you own today. Grade labels can't promise that; measurement can.",
  },
  {
    q: "Is the men's line really discreet?",
    a: "Unmarked outer carton, plain invoice, no brand name on anything visible, and a private fitting call if you want one. Nobody is told anything.",
  },
  {
    q: "Can I sleep, swim, or work out in a unit?",
    a: "Sleep yes (wrapped), workouts yes, swimming with reservations — chlorine shortens the life of any human hair. The maintenance guide covers all three honestly.",
  },
];

export default function LearnPage() {
  return (
    <>
      <section className="surface-velvet border-b border-white/[0.07] pt-20 pb-20">
        <div className="mx-auto max-w-[1440px] px-[4vw]">
          <div className="flex items-center justify-between border-t border-white/[0.07] pt-4">
            <span className="eyebrow">Learn</span>
            <span className="eyebrow hidden md:block">Education & Styling</span>
            <span className="eyebrow">No gatekeeping</span>
          </div>
          <div className="mt-20 max-w-3xl">
            <h1 className="text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] text-paper">
              The guesswork,
              <span className="block italic">removed.</span>
            </h1>
            <p className="mt-7 max-w-xl text-[1.0625rem] leading-relaxed text-neutral-400">
              Most of this industry profits from confusion — grade myths, shade roulette, technique
              gatekeeping. Everything on this page exists to make your first unit feel like your
              fifth.
            </p>
            <Link
              href="/learn/quiz"
              className="mt-10 inline-block border border-gold px-9 py-4 text-[0.8125rem] tracking-[0.14em] text-gold uppercase transition-all duration-500 hover:bg-gold hover:text-ink"
            >
              Find your unit — 90 second quiz
            </Link>
          </div>
        </div>
      </section>

      {/* Tutorials */}
      <Section
        className="py-24"
        eyebrowLeft="Tutorials"
        eyebrowCenter="Technique"
        eyebrowRight="Video library"
      >
        <div id="tutorials" className="scroll-mt-32">
          <SectionHeading
            title="Styling tutorials."
            body="Filmed on real heads in real bathrooms, not studio sets. Video embeds land with the CMS phase; the written guides below are complete."
          />
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {TUTORIALS.map((t) => (
              <article
                key={t.id}
                id={t.id}
                className="scroll-mt-32 border-t border-white/[0.07] pt-6"
              >
                <div className="mb-5">
                  <ProductImage src="velvet" alt={`${t.title} tutorial`} ratio="16 / 10" />
                </div>
                <p className="eyebrow text-gold">{t.length} read</p>
                <h3 className="mt-2 text-xl text-paper">{t.title}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-neutral-400">{t.body}</p>
              </article>
            ))}
          </div>
        </div>
      </Section>

      {/* Shade matching */}
      <section id="shade" className="scroll-mt-32 bg-plum-900 py-24">
        <div className="mx-auto grid max-w-[1440px] gap-14 px-[4vw] lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow mb-5 text-gold">The #1 friction point</p>
            <h2 className="text-[clamp(2rem,4.5vw,3.25rem)] text-paper">
              Lace colour matching, solved for five dollars.
            </h2>
            <p className="mt-6 text-[1.0625rem] leading-relaxed text-blush-200/70">
              Screens lie. A shade that looks perfect on a phone is two tones off in daylight, and
              that mismatch is the single largest cause of returns in this category. The fix is not
              a better photo — it is lace against your own skin, in your own light.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Transparent lace suits fair to light-medium skin",
                "Natural beige suits medium to olive",
                "Warm brown suits deep skin — and tints down, never up",
                "When between two shades, take the lighter: tinting darker is easy, lifting is not",
              ].map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-3 text-[0.9375rem] text-blush-200/70"
                >
                  <span className="mt-1.5 inline-block h-1 w-1 shrink-0 rotate-45 bg-gold" />
                  {line}
                </li>
              ))}
            </ul>
            <Link
              href="/product/lace-test-kit"
              className="mt-8 inline-block border-b border-gold pb-1 text-[0.8125rem] tracking-[0.1em] text-gold uppercase"
            >
              Order The Lace Test
            </Link>
          </div>
          <ProductImage
            src="blush"
            alt="Lace shade cards against different skin tones"
            ratio="4 / 3"
          />
        </div>
      </section>

      {/* Sizing + grades */}
      <Section
        className="py-24"
        eyebrowLeft="Fit"
        eyebrowCenter="Sizing & grades"
        eyebrowRight="Reference"
      >
        <div className="grid gap-16 lg:grid-cols-2">
          <div id="sizing" className="scroll-mt-32">
            <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] text-paper">Size & cap guide.</h2>
            <dl className="mt-8 divide-y divide-white/[0.07] border-t border-white/[0.07]">
              {[
                ["Petite", 'Under 21.5" circumference'],
                ["Average", '21.5" – 23" — fits roughly 80% of adults'],
                ["Large", 'Over 23" circumference'],
                ["How to measure", "Front hairline → over the crown → nape, with a soft tape"],
                ["Between sizes?", "Take the smaller — every cap adjusts outward, none adjust in"],
              ].map(([t, d]) => (
                <div key={t} className="grid grid-cols-[130px_1fr] gap-6 py-4">
                  <dt className="eyebrow pt-0.5">{t}</dt>
                  <dd className="text-[0.9375rem] text-neutral-200">{d}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div id="grades" className="scroll-mt-32">
            <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] text-paper">
              Hair grades, honestly.
            </h2>
            <p className="mt-6 text-[0.9375rem] leading-relaxed text-neutral-400">
              10A, 12A, 15A — there is no governing body behind any of these numbers. Ask two
              suppliers what 12A means and you will get two answers, which is precisely why we
              stopped competing on them.
            </p>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-neutral-400">
              What is verifiable: whether the hair is virgin (never chemically processed), whether
              it is Remy (cuticles intact and aligned), whether it came from one donor, and whether
              this batch matches the last one. Those four facts are on every product page, and the
              batch claim is measured, not asserted.
            </p>
            <Link
              href="/wholesale#sourcing"
              className="mt-6 inline-block border-b border-gold pb-1 text-[0.8125rem] tracking-[0.1em] text-gold uppercase"
            >
              The full sourcing standard
            </Link>
          </div>
        </div>
      </Section>

      {/* Masterclasses */}
      <section id="masterclasses" className="scroll-mt-32 border-t border-white/[0.07] py-24">
        <div className="mx-auto max-w-[1440px] px-[4vw]">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow mb-4 text-gold">Tier 2 ambassador content</p>
            <h2 className="text-[clamp(2rem,4.5vw,3.25rem)] text-paper">
              Long-form masterclasses.
            </h2>
            <p className="mt-6 text-[1.0625rem] leading-relaxed text-neutral-400">
              Our macro ambassadors film full-length styling masterclasses — colour theory for
              units, occasion styling, texture blending. Streams live inside the Beyond Circle
              first, then lands here.
            </p>
            <Link
              href="/circle#events"
              className="mt-8 inline-block border border-gold px-8 py-3.5 text-[0.8125rem] tracking-[0.14em] text-gold uppercase transition-all duration-500 hover:bg-gold hover:text-ink"
            >
              See upcoming sessions
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <Section
        className="py-24"
        eyebrowLeft="FAQ"
        eyebrowCenter="Straight answers"
        eyebrowRight={`${FAQS.length} questions`}
      >
        <div id="faq" className="scroll-mt-32">
          <SectionHeading title="Asked constantly, answered honestly." />
          <div className="mt-12 divide-y divide-white/[0.07] border-t border-white/[0.07]">
            {FAQS.map((f) => (
              <details key={f.q} className="group py-6">
                <summary className="flex cursor-pointer items-center justify-between text-[1.0625rem] text-paper [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="ml-6 shrink-0 text-gold transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-3xl text-[0.9375rem] leading-relaxed text-neutral-400">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}

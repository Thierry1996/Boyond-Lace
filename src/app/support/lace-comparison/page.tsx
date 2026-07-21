import type { Metadata } from "next";
import Link from "next/link";
import { ResourceHero } from "@/components/ui/ResourceHero";
import { Section, SectionHeading } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Lace Comparison Chart — Constructions & Shades",
  description:
    "Compare Beyond Lace constructions — full HD Swiss lace, 13x6 and 13x4 frontals, glueless caps, silk tops — plus lace shade matching for every skin tone.",
};

const CONSTRUCTIONS = [
  {
    name: "Full HD Swiss Lace",
    parting: "Anywhere",
    install: "Adhesive recommended",
    best: "Total freedom, updos, the invisible standard",
    life: "18–36 months",
  },
  {
    name: "13x6 HD Frontal",
    parting: "6 inches deep",
    install: "Adhesive recommended",
    best: "Deep parting without full-lace pricing",
    life: "12–24 months",
  },
  {
    name: "13x4 HD Frontal",
    parting: "4 inches deep",
    install: "Adhesive or band",
    best: "Everyday wear, closure-and-bundle builds",
    life: "12–24 months",
  },
  {
    name: "Glueless Cap",
    parting: "Pre-set",
    install: "None — band + silicone grip",
    best: "Beginners, four-minute mornings",
    life: "12–18 months",
  },
  {
    name: "Silk Top",
    parting: "Pre-set",
    install: "None — no lace on skin",
    best: "Sensitive scalps, post-treatment wear",
    life: "18–30 months",
  },
];

const SHADES = [
  {
    tone: "Fair → light-medium",
    lace: "Transparent",
    note: "Tints down easily; never start darker.",
  },
  { tone: "Medium → olive", lace: "Natural beige", note: "The most forgiving across lighting." },
  { tone: "Deep", lace: "Warm brown", note: "Pre-tinted; avoids the grey cast pale lace leaves." },
];

export default function LaceComparisonPage() {
  return (
    <>
      <ResourceHero
        eyebrow="Fit & product guides"
        title="Lace comparison chart."
        italic="Which construction, and which shade."
        body="Every cap here uses the same HD Swiss lace and the same bleached-knot standard. What differs is how much parting freedom you get, and how much work the install asks of you."
        image="laceDetail"
        cta={{ label: "Order the $5 Lace Test", href: "/product/lace-test-kit" }}
      />

      <Section
        className="py-20"
        eyebrowLeft="Construction"
        eyebrowCenter="Side by side"
        eyebrowRight="Five caps"
      >
        <SectionHeading
          title="Constructions, compared honestly."
          body="There is no single best cap — there is the one that matches your parting habits and how much time you will actually spend installing it."
        />
        <div className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[52rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-gold/25">
                {["Construction", "Parting", "Install", "Best for", "Lifespan"].map((h) => (
                  <th key={h} className="eyebrow py-4 pr-6 text-gold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CONSTRUCTIONS.map((c) => (
                <tr key={c.name} className="border-b border-white/[0.07] align-top">
                  <td className="py-5 pr-6 text-[1.0625rem] text-paper">{c.name}</td>
                  <td className="py-5 pr-6 text-[0.875rem] text-neutral-200">{c.parting}</td>
                  <td className="py-5 pr-6 text-[0.875rem] text-neutral-400">{c.install}</td>
                  <td className="py-5 pr-6 text-[0.875rem] text-neutral-400">{c.best}</td>
                  <td className="py-5 pr-6 text-[0.875rem] text-neutral-400">{c.life}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <section className="border-t border-white/[0.07] bg-plum-900 py-20">
        <div className="mx-auto max-w-[1440px] px-[4vw]">
          <p className="eyebrow mb-4 text-gold">Shade matching</p>
          <h2 className="max-w-2xl text-[clamp(1.75rem,4vw,3rem)] text-paper">
            Screens lie. Skin does not.
          </h2>
          <p className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-blush-200/70">
            Shade mismatch causes more returns in this category than every other factor combined.
            The chart below is a starting point — the $5 Lace Test settles it against your own skin,
            in your own light, and credits back in full.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {SHADES.map((s) => (
              <div key={s.tone} className="border border-gold/25 p-7">
                <p className="eyebrow mb-3 text-gold">{s.tone}</p>
                <p className="font-[family-name:var(--font-display)] text-2xl text-paper">
                  {s.lace}
                </p>
                <p className="mt-3 text-[0.875rem] leading-relaxed text-blush-200/70">{s.note}</p>
              </div>
            ))}
          </div>
          <Link
            href="/product/lace-test-kit"
            className="mt-10 inline-block border border-gold px-8 py-3.5 text-[0.8125rem] tracking-[0.14em] text-gold uppercase transition-all duration-500 hover:bg-gold hover:text-ink"
          >
            Order the Lace Test
          </Link>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ResourceHero } from "@/components/ui/ResourceHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { OfficialWordmark, MonogramAurora, MonogramFlat, CrownWave } from "@/components/brand/Logo";

export const metadata: Metadata = {
  title: "Brand Kit — Logos, Palette & Typography",
  description:
    "The Beyond Lace brand kit: wordmark and monogram assets, the Velvet Plum and Gilded Gold palette, typography, and usage rules for partners and press.",
};

const PALETTE = [
  { name: "Infinite Black", hex: "#090909" },
  { name: "Luminous White", hex: "#F8F5F1" },
  { name: "Velvet Plum", hex: "#5A2D67" },
  { name: "Blush Aura", hex: "#EECAD5" },
  { name: "Gilded Gold", hex: "#C9A66B" },
  { name: "Deep Aubergine", hex: "#321528" },
  { name: "Dust Rose", hex: "#DCA8B7" },
  { name: "Warm Ivory", hex: "#FBF8F4" },
];

const RULES = [
  "Clear space equals the cap-height of the B on every side.",
  "Minimum sizes: wordmark 120px wide, aurora monogram 48px, flat gold monogram 24px.",
  "Below 48px always use the flat gold monogram — the gradient muddies at small sizes.",
  "Never stretch, recolour outside the palette, or apply drop shadows to any mark.",
  "The aurora monogram never sits on a light background.",
];

export default function BrandKitPage() {
  return (
    <>
      <ResourceHero
        eyebrow="Brand & press"
        title="Brand kit."
        italic="The rules that hold the price."
        body="The visual system is a price-justification tool, not decoration. Everything here is the licensed, correct version — please use it rather than recreating marks by eye."
        image="brandPress"
      />

      <Section
        className="py-20"
        eyebrowLeft="Logo suite"
        eyebrowCenter="Four assets"
        eyebrowRight="Gold on any ground"
      >
        <SectionHeading
          title="The marks."
          body="One wordmark, two monograms, one icon. Each has a job; using the wrong one at the wrong size is the most common misuse we see."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Primary wordmark", node: <OfficialWordmark size="1.5rem" tagline={false} /> },
            { label: "Aurora monogram", node: <MonogramAurora size={56} /> },
            { label: "Flat gold monogram", node: <MonogramFlat size={44} /> },
            { label: "Crown / hair-wave", node: <CrownWave size={44} className="text-gold" /> },
          ].map((a) => (
            <div
              key={a.label}
              className="flex min-h-[11rem] flex-col items-center justify-center gap-6 border border-white/[0.07] bg-ink p-7 transition-colors duration-300 hover:border-gold/50"
            >
              {a.node}
              <p className="eyebrow">{a.label}</p>
            </div>
          ))}
        </div>
      </Section>

      <section className="border-t border-white/[0.07] bg-plum-900 py-20">
        <div className="mx-auto max-w-[1440px] px-[4vw]">
          <p className="eyebrow mb-4 text-gold">Palette</p>
          <h2 className="text-[clamp(1.75rem,4vw,3rem)] text-paper">Eight colours. No others.</h2>
          <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-4">
            {PALETTE.map((c) => (
              <div key={c.hex}>
                <div
                  className="h-24 w-full rounded-lg border border-white/10 transition-transform duration-500 hover:scale-[1.04]"
                  style={{ background: c.hex }}
                />
                <p className="mt-3 text-[0.875rem] text-paper">{c.name}</p>
                <p className="text-[0.75rem] text-blush-200/60 tabular-nums">{c.hex}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Section className="py-20" eyebrowLeft="Typography" eyebrowRight="Usage">
        <div className="grid gap-14 lg:grid-cols-2">
          <div>
            <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] text-paper">Typography.</h2>
            <dl className="mt-8 divide-y divide-white/[0.07] border-t border-white/[0.07]">
              {[
                ["Display", "Canela — headlines, wordmark, hero statements"],
                ["Headline", "Cormorant Garamond — section headings, editorial"],
                ["Body", "Neue Haas Grotesk — everything else"],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[100px_1fr] gap-5 py-4">
                  <dt className="eyebrow pt-1 text-gold">{k}</dt>
                  <dd className="text-[0.9375rem] text-neutral-200">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-[0.875rem] leading-relaxed text-neutral-400">
              Canela and Neue Haas Grotesk are commercially licensed — partners must hold their own
              licence or use Cormorant Garamond, which is open (SIL OFL).
            </p>
          </div>

          <div>
            <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] text-paper">Usage rules.</h2>
            <ul className="mt-8 space-y-4">
              {RULES.map((r) => (
                <li key={r} className="flex items-start gap-3 text-[0.9375rem] text-neutral-400">
                  <span className="mt-2 inline-block h-1 w-1 shrink-0 rotate-45 bg-gold" />
                  {r}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-[0.875rem] leading-relaxed text-neutral-400">
              Need a specific asset — packaging render, campaign imagery, vector wordmark? Request
              it through the{" "}
              <Link
                href="/support/contact-hq"
                className="text-gold underline-offset-4 hover:underline"
              >
                headquarters contact
              </Link>{" "}
              and it arrives by email.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}

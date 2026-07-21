import type { Metadata } from "next";
import Link from "next/link";
import { ResourceHero } from "@/components/ui/ResourceHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { BrandImage } from "@/components/ui/BrandImage";

export const metadata: Metadata = {
  title: "Press Kit — For Influencers & Media",
  description:
    "Beyond Lace press kit: brand facts, founder background, product imagery, approved language, and the fastest route to a media or ambassador response.",
};

const FACTS = [
  ["Category", "Luxury human hair wigs and lace units"],
  ["Founded", "2026"],
  ["Manufacturing", "Xuchang, China — the wig capital"],
  ["Standard", "Virgin Remy, cuticle-aligned, batch-consistency guaranteed"],
  ["Signature range", "$500 – $1,200 per unit"],
  ["Channels", "Direct-to-consumer and salon wholesale / private label"],
];

const LANGUAGE = [
  {
    ok: true,
    text: "“Beyond Lace makes luxury human hair wigs and HD Swiss lace units.”",
  },
  {
    ok: true,
    text: "“A transformation brand — Beyond Lace. Beyond Beautiful.”",
  },
  {
    ok: false,
    text: "“Beyond Lace, the lingerie label…” — we are a hair brand. This one matters to us.",
  },
  {
    ok: false,
    text: "“Cheap” or “budget” — the brand competes on construction, never on price.",
  },
];

export default function PressKitPage() {
  return (
    <>
      <ResourceHero
        eyebrow="Brand & press"
        title="Press kit."
        italic="Everything, correctly stated."
        body="For journalists, stylists and ambassadors covering Beyond Lace. Please use the approved language below — the category confusion the name invites is the one thing we ask you to help us avoid."
        image="brandPress"
        cta={{ label: "Media contact", href: "/support/contact-hq" }}
      />

      <Section
        className="py-20"
        eyebrowLeft="Fact sheet"
        eyebrowCenter="Verified"
        eyebrowRight="Quotable"
      >
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <SectionHeading title="Brand facts." />
            <dl className="mt-8 divide-y divide-white/[0.07] border-t border-white/[0.07]">
              {FACTS.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[130px_1fr] gap-5 py-4">
                  <dt className="eyebrow pt-1 text-gold">{k}</dt>
                  <dd className="text-[0.9375rem] text-neutral-200">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <BrandImage
              name="navBrand"
              ratio="3 / 4"
              width={700}
              className="rounded-lg"
              sizes="25vw"
            />
            <BrandImage
              name="tier1"
              ratio="3 / 4"
              width={700}
              className="mt-10 rounded-lg"
              sizes="25vw"
            />
          </div>
        </div>
      </Section>

      <section className="border-t border-white/[0.07] bg-plum-900 py-20">
        <div className="mx-auto max-w-[1440px] px-[4vw]">
          <p className="eyebrow mb-4 text-gold">Approved language</p>
          <h2 className="max-w-2xl text-[clamp(1.75rem,4vw,3rem)] text-paper">
            How to describe us.
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {LANGUAGE.map((l) => (
              <div
                key={l.text}
                className={`border p-6 ${l.ok ? "border-gold/40" : "border-white/10"}`}
              >
                <p className={`eyebrow mb-3 ${l.ok ? "text-gold" : "text-blush-200/60"}`}>
                  {l.ok ? "Use this" : "Please avoid"}
                </p>
                <p className="text-[0.9375rem] leading-relaxed text-blush-200/85">{l.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Section className="py-20" eyebrowLeft="Assets" eyebrowRight="On request">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              t: "Logo & brand assets",
              b: "Vector wordmark, monograms, palette and typography rules.",
              href: "/support/brand-kit",
              cta: "Open the brand kit",
            },
            {
              t: "Product photography",
              b: "High-resolution unit imagery, lace-melt macro detail, packaging renders.",
              href: "/support/contact-hq",
              cta: "Request imagery",
            },
            {
              t: "Ambassador enquiries",
              b: "Three-tier partnership programme for creators and stylists.",
              href: "/ambassadors",
              cta: "See the programme",
            },
          ].map((c) => (
            <div
              key={c.t}
              className="flex flex-col border border-white/[0.07] p-7 transition-colors duration-300 hover:border-gold/50"
            >
              <h3 className="text-xl text-paper">{c.t}</h3>
              <p className="mt-3 flex-1 text-[0.875rem] leading-relaxed text-neutral-400">{c.b}</p>
              <Link
                href={c.href}
                className="mt-6 inline-block border-b border-gold pb-1 text-[0.75rem] tracking-[0.1em] text-gold uppercase"
              >
                {c.cta}
              </Link>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}

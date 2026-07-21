import type { Metadata } from "next";
import Link from "next/link";
import { ResourceHero } from "@/components/ui/ResourceHero";
import { Section, SectionHeading } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Size Guide — Cap Measurement & Fit",
  description:
    "How to measure your head for a Beyond Lace human hair unit: cap circumference, front-to-nape, ear-to-ear, and which size to take when you fall between two.",
};

const SIZES = [
  { name: "Petite", circumference: 'Under 21.5"', frontToNape: '13.5"', earToEar: '11.5"' },
  { name: "Average", circumference: '21.5" – 23"', frontToNape: '14.5"', earToEar: '12.5"' },
  { name: "Large", circumference: 'Over 23"', frontToNape: '15.5"', earToEar: '13.5"' },
];

const STEPS = [
  {
    n: "01",
    title: "Circumference",
    body: "Start at your front hairline, run the tape behind your ear, around the nape, past the other ear, and back to the start. Keep it flat against the scalp — not tight. This single number decides your size.",
  },
  {
    n: "02",
    title: "Front to nape",
    body: "From the centre of your front hairline, straight over the crown, down to the base of your nape. This tells us whether a standard cap length will sit correctly on you.",
  },
  {
    n: "03",
    title: "Ear to ear",
    body: "Over the top of the head, from the top of one ear to the other. Useful mainly for full lace and silk-top units where the parting space matters.",
  },
];

export default function SizeGuidePage() {
  return (
    <>
      <ResourceHero
        eyebrow="Fit & product guides"
        title="Size guide."
        italic="Measure once, wear it for years."
        body="Three measurements, two minutes, and a tape measure. Cap size is the single most common cause of a unit that photographs beautifully and feels wrong by lunchtime."
        image="fitGuides"
      />

      <Section
        className="py-20"
        eyebrowLeft="How to measure"
        eyebrowCenter="Three numbers"
        eyebrowRight="Two minutes"
      >
        <SectionHeading
          title="Take these three measurements."
          body="Use a soft tailoring tape. If you only take one, take the circumference — every cap adjusts a little, but none adjusts far."
        />
        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="border-t border-gold/20 pt-6">
              <span className="font-[family-name:var(--font-display)] text-3xl text-gold tabular-nums">
                {s.n}
              </span>
              <h3 className="mt-3 text-xl text-paper">{s.title}</h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-neutral-400">{s.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="pb-20" eyebrowLeft="Size chart" eyebrowRight="Inches">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[38rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-gold/25">
                {["Size", "Circumference", "Front to nape", "Ear to ear"].map((h) => (
                  <th key={h} className="eyebrow py-4 pr-6 text-gold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SIZES.map((s) => (
                <tr key={s.name} className="border-b border-white/[0.07]">
                  <td className="py-5 pr-6 text-[1.0625rem] text-paper">{s.name}</td>
                  <td className="py-5 pr-6 text-[0.9375rem] text-neutral-200 tabular-nums">
                    {s.circumference}
                  </td>
                  <td className="py-5 pr-6 text-[0.9375rem] text-neutral-400 tabular-nums">
                    {s.frontToNape}
                  </td>
                  <td className="py-5 pr-6 text-[0.9375rem] text-neutral-400 tabular-nums">
                    {s.earToEar}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="border border-gold/25 p-7">
            <p className="eyebrow mb-3 text-gold">Between two sizes?</p>
            <p className="text-[0.9375rem] leading-relaxed text-neutral-400">
              Take the smaller. Every Beyond Lace cap adjusts outward with the internal straps; none
              of them adjusts inward. A cap that starts slightly snug settles correctly — one that
              starts loose never does.
            </p>
          </div>
          <div className="border border-white/[0.07] p-7">
            <p className="eyebrow mb-3">Silk-top and medical fits</p>
            <p className="text-[0.9375rem] leading-relaxed text-neutral-400">
              The Restoration line ships in all three sizes with a seam-flat interior and no
              adhesive requirement.{" "}
              <Link
                href="/product/the-restoration-silk-top"
                className="text-gold underline-offset-4 hover:underline"
              >
                See the silk-top unit
              </Link>
              .
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}

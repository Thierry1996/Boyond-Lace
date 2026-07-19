import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ProductImage } from "@/components/ui/ProductImage";

export const metadata: Metadata = {
  title: "Virtual Try-On — See It On You Before It Ships",
  description:
    "Beyond Lace AR virtual try-on for human hair wigs. Runs entirely on your device — your face never leaves your browser. The return-rate killer.",
};

export default function TryOnPage() {
  return (
    <>
      <section className="surface-velvet border-b border-white/[0.07] pt-20 pb-20">
        <div className="mx-auto max-w-[1440px] px-[4vw]">
          <div className="flex items-center justify-between border-t border-white/[0.07] pt-4">
            <span className="eyebrow">Virtual try-on</span>
            <span className="eyebrow hidden md:block">On-device AR</span>
            <span className="eyebrow">Private by design</span>
          </div>
          <div className="mt-20 grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <h1 className="text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] text-paper">
                See it on you
                <span className="block italic">before it ships.</span>
              </h1>
              <p className="mt-7 max-w-xl text-[1.0625rem] leading-relaxed text-neutral-400">
                Thirty percent of this industry&apos;s units go back in the box. Try-on kills that
                number: length against your shoulders, texture against your face shape, shade
                against your skin — live, in your camera, before a dollar moves.
              </p>
              <div className="mt-8 border border-gold/40 bg-plum-900/60 p-5">
                <p className="text-[0.875rem] leading-relaxed text-blush-200">
                  <span className="text-gold">Your face never leaves your browser.</span> The try-on
                  runs entirely on your device — no upload, no cloud processing, no stored
                  biometrics. This is a design commitment, not a settings toggle.
                </p>
              </div>
              <div className="mt-9 flex flex-wrap items-center gap-6">
                <span className="border border-white/15 px-8 py-4 text-[0.8125rem] tracking-[0.14em] text-neutral-400 uppercase">
                  Camera experience — in development
                </span>
                <Link
                  href="/product/lace-test-kit"
                  className="border-b border-gold pb-1 text-[0.8125rem] tracking-[0.1em] text-gold uppercase"
                >
                  Until then: The Lace Test, $5
                </Link>
              </div>
            </div>
            <ProductImage src="aurora" alt="Virtual try-on preview visual" ratio="4 / 5" />
          </div>
        </div>
      </section>

      <Section
        className="py-24"
        eyebrowLeft="How it will work"
        eyebrowCenter="Three steps"
        eyebrowRight="No app download"
      >
        <SectionHeading title="Built like the rest of the brand: quietly." />
        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {[
            ["01", "Open your camera", "Browser-native — no app, no account required to look."],
            [
              "02",
              "Try any unit",
              "Length, texture, density and shade render live on your head, with honest physics.",
            ],
            [
              "03",
              "Save your presets",
              "Looks save to your account, and your shade result links straight to the matching lace.",
            ],
          ].map(([n, t, d]) => (
            <div key={n} className="border-t border-white/[0.07] pt-6">
              <span className="font-[family-name:var(--font-display)] text-2xl text-gold tabular-nums">
                {n}
              </span>
              <h3 className="mt-3 text-xl text-paper">{t}</h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-neutral-400">{d}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}

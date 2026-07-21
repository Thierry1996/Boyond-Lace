import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ResourceHero } from "@/components/ui/ResourceHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { BrandImage } from "@/components/ui/BrandImage";
import { AmbassadorApplyForm } from "@/components/ambassador/AmbassadorApplyForm";
import { TIERS } from "@/lib/ambassador";

export const metadata: Metadata = {
  title: "Influencer Partnership Application",
  description:
    "Apply to the Beyond Lace ambassador programme. Share your Instagram and TikTok, and our social marketing division assigns your tier at review.",
};

export default function ApplyPage() {
  return (
    <>
      <ResourceHero
        eyebrow="Education & partnership"
        title="Partnership application."
        italic="One form, three tiers."
        body="Apply once. Our social marketing division reviews your reach, your content, and your audience fit, then assigns the tier — you never have to guess which one you belong in."
        image="educationPartnership"
      />

      <Section
        className="py-20"
        eyebrowLeft="Choose a route"
        eyebrowCenter="Or apply generally"
        eyebrowRight="Reviewed in 3 days"
      >
        <SectionHeading
          title="Know your tier already?"
          body="If your reach clearly places you, go straight to that tier's page for the specifics. Otherwise the general form below works for all three."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {TIERS.map((t) => (
            <Link
              key={t.slug}
              href={`/ambassadors/apply/${t.slug}`}
              className="group block overflow-hidden rounded-lg border border-white/[0.07] transition-colors duration-500 hover:border-gold/60"
            >
              <div className="overflow-hidden">
                <BrandImage
                  name={t.image}
                  ratio="16 / 9"
                  width={700}
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  imgClassName="transition-transform duration-[900ms] ease-[var(--ease-editorial)] group-hover:scale-[1.06]"
                />
              </div>
              <div className="p-6">
                <p className="eyebrow text-gold">{t.reach}</p>
                <h3 className="mt-2 text-lg text-paper transition-colors group-hover:text-gold">
                  {t.name}
                </h3>
                <p className="mt-2 text-[0.8125rem] text-neutral-400">{t.reward}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[0.75rem] tracking-[0.1em] text-gold uppercase">
                  Details
                  <ArrowUpRight size={12} strokeWidth={1.5} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <section id="form" className="scroll-mt-32 border-t border-white/[0.07] bg-plum-900 py-20">
        <div className="mx-auto max-w-3xl px-[4vw]">
          <div className="text-center">
            <p className="eyebrow mb-4 text-gold">Application</p>
            <h2 className="text-[clamp(1.75rem,4vw,3rem)] text-paper">
              Tell us about your audience.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[0.9375rem] leading-relaxed text-blush-200/70">
              Your social links are how the marketing division classifies your tier and category, so
              make sure they are public and current.
            </p>
          </div>
          <div className="mt-12">
            <AmbassadorApplyForm />
          </div>
        </div>
      </section>
    </>
  );
}

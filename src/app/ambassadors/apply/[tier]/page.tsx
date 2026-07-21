import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ResourceHero } from "@/components/ui/ResourceHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { AmbassadorApplyForm } from "@/components/ambassador/AmbassadorApplyForm";
import { TIERS, getTier, type TierSlug } from "@/lib/ambassador";

export function generateStaticParams() {
  return TIERS.map((t) => ({ tier: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tier: string }>;
}): Promise<Metadata> {
  const { tier } = await params;
  const t = getTier(tier);
  if (!t) return { title: "Not found" };
  return {
    title: `${t.name} — Ambassador Application`,
    description: t.summary,
  };
}

export default async function TierPage({ params }: { params: Promise<{ tier: string }> }) {
  const { tier } = await params;
  const t = getTier(tier);
  if (!t) notFound();

  const others = TIERS.filter((x) => x.slug !== t.slug);

  return (
    <>
      <ResourceHero
        eyebrow={`${t.audience} · ${t.reach}`}
        title={t.headline}
        italic={t.italic}
        body={t.summary}
        image={t.image}
        breadcrumb={{ label: "Ambassador programme", href: "/ambassadors" }}
        cta={{ label: "Apply for this tier", href: "#apply" }}
      />

      <Section
        className="py-20"
        eyebrowLeft={t.name}
        eyebrowCenter="What you get"
        eyebrowRight={t.reward}
      >
        <div className="grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading title="What you get." />
            <ul className="mt-8 space-y-4">
              {t.benefits.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-3 text-[0.9375rem] leading-relaxed text-neutral-200"
                >
                  <span className="mt-2 inline-block h-1 w-1 shrink-0 rotate-45 bg-gold" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading title="What we ask." />
            <ul className="mt-8 space-y-4">
              {t.expectations.map((e) => (
                <li
                  key={e}
                  className="flex items-start gap-3 text-[0.9375rem] leading-relaxed text-neutral-400"
                >
                  <span className="mt-2 inline-block h-1 w-1 shrink-0 rotate-45 bg-blush-400" />
                  {e}
                </li>
              ))}
            </ul>
            <div className="mt-10 border border-gold/25 p-6">
              <p className="eyebrow mb-2 text-gold">Moving up</p>
              <p className="text-[0.9375rem] leading-relaxed text-neutral-400">{t.upgrade}</p>
            </div>
          </div>
        </div>
      </Section>

      <section id="apply" className="scroll-mt-32 border-t border-white/[0.07] bg-plum-900 py-20">
        <div className="mx-auto max-w-3xl px-[4vw]">
          <div className="text-center">
            <p className="eyebrow mb-4 text-gold">{t.name}</p>
            <h2 className="text-[clamp(1.75rem,4vw,3rem)] text-paper">Apply.</h2>
            <p className="mx-auto mt-5 max-w-xl text-[0.9375rem] leading-relaxed text-blush-200/70">
              Your tier preference is pre-filled. The social marketing division still makes the
              final classification — if your numbers place you higher, we will tell you.
            </p>
          </div>
          <div className="mt-12">
            <AmbassadorApplyForm preferredTier={t.slug as TierSlug} />
          </div>
        </div>
      </section>

      <Section className="py-16" eyebrowLeft="Other tiers">
        <div className="grid gap-6 sm:grid-cols-2">
          {others.map((o) => (
            <Link
              key={o.slug}
              href={`/ambassadors/apply/${o.slug}`}
              className="group flex items-baseline justify-between gap-6 border border-white/[0.07] p-6 transition-colors duration-300 hover:border-gold/60"
            >
              <span>
                <span className="block text-lg text-paper transition-colors group-hover:text-gold">
                  {o.name}
                </span>
                <span className="mt-1 block text-[0.8125rem] text-neutral-400">{o.reach}</span>
              </span>
              <span className="shrink-0 text-[0.75rem] tracking-[0.1em] text-gold uppercase">
                View
              </span>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}

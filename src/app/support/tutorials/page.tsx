import type { Metadata } from "next";
import Link from "next/link";
import { Play } from "lucide-react";
import { ResourceHero } from "@/components/ui/ResourceHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { BrandImage } from "@/components/ui/BrandImage";
import type { ImageryKey } from "@/lib/imagery";

export const metadata: Metadata = {
  title: "Tutorial Video Library — Install, Style & Maintain",
  description:
    "The full Beyond Lace tutorial library: lace melting, hairline plucking, glueless installs, colour care, and daily maintenance for human hair units.",
};

interface Tutorial {
  title: string;
  minutes: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  body: string;
  image: ImageryKey;
}

const TUTORIALS: Tutorial[] = [
  {
    title: "Lace Melting, Start to Finish",
    minutes: "12 min",
    level: "Intermediate",
    body: "Skin prep, adhesive layering, tension, and the two minutes under a scarf that most tutorials skip entirely.",
    image: "laceDetail",
  },
  {
    title: "Hairline Plucking Without Overdoing It",
    minutes: "9 min",
    level: "Advanced",
    body: "Our units arrive pre-plucked. This is about restraint — customising to your face without thinning past the point of return.",
    image: "navLearn",
  },
  {
    title: "The Four-Minute Glueless Install",
    minutes: "6 min",
    level: "Beginner",
    body: "Band, grip, placement. The morning routine that made The Standard our most re-ordered unit.",
    image: "fitGuides",
  },
  {
    title: "Wash Day for Human Hair Units",
    minutes: "11 min",
    level: "Beginner",
    body: "Cadence, water temperature, product order, and how to dry without matting the nape.",
    image: "ordersLogistics",
  },
  {
    title: "Blending Textured Leave-Out",
    minutes: "10 min",
    level: "Intermediate",
    body: "Matching a coily or kinky-straight unit to your own texture so the blend disappears at the parting.",
    image: "educationPartnership",
  },
  {
    title: "Toning & Maintaining Platinum",
    minutes: "14 min",
    level: "Advanced",
    body: "Keeping cool blonde cool, and why our nine-day staged lift means you tone less often than you expect.",
    image: "navBrand",
  },
];

const LEVEL_TONE: Record<Tutorial["level"], string> = {
  Beginner: "text-gold",
  Intermediate: "text-blush-300",
  Advanced: "text-rose-400",
};

export default function TutorialsPage() {
  return (
    <>
      <ResourceHero
        eyebrow="Education & partnership"
        title="Tutorial library."
        italic="Filmed on real heads."
        body="Every technique we expect a unit to survive, taught properly. Written guides are complete now; video embeds land as each session is filmed — no placeholder players pretending otherwise."
        image="navLearn"
        cta={{ label: "Take the fit quiz", href: "/learn/quiz" }}
      />

      <Section
        className="py-20"
        eyebrowLeft="Library"
        eyebrowCenter={`${TUTORIALS.length} tutorials`}
        eyebrowRight="Beginner → advanced"
      >
        <SectionHeading
          title="Learn the craft."
          body="Ordered by the sequence most people actually need them: install first, then maintenance, then the advanced work that makes a unit last thirty months instead of twelve."
        />

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {TUTORIALS.map((t) => (
            <article key={t.title} className="group">
              <div className="relative overflow-hidden rounded-lg">
                <BrandImage
                  name={t.image}
                  ratio="16 / 10"
                  width={800}
                  sizes="(max-width: 640px) 100vw, 33vw"
                  imgClassName="transition-transform duration-[900ms] ease-[var(--ease-editorial)] group-hover:scale-[1.06]"
                />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/60 bg-ink/60 text-gold backdrop-blur-sm transition-all duration-500 group-hover:scale-110 group-hover:bg-gold group-hover:text-ink">
                    <Play size={18} strokeWidth={1.75} className="ml-0.5" />
                  </span>
                </span>
                <span className="absolute top-4 left-4 border border-gold/40 bg-ink/70 px-2.5 py-1 text-[0.625rem] tracking-[0.14em] text-gold uppercase backdrop-blur-sm">
                  {t.minutes}
                </span>
              </div>
              <p className={`eyebrow mt-4 ${LEVEL_TONE[t.level]}`}>{t.level}</p>
              <h3 className="mt-1.5 text-xl text-paper transition-colors group-hover:text-blush-300">
                {t.title}
              </h3>
              <p className="mt-2 text-[0.875rem] leading-relaxed text-neutral-400">{t.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-16 border border-gold/25 p-8 text-center">
          <p className="eyebrow mb-3 text-gold">Want to teach one of these?</p>
          <p className="mx-auto max-w-xl text-[0.9375rem] leading-relaxed text-neutral-400">
            Tier 2 ambassadors film long-form masterclasses for this library — paid, credited, and
            promoted across our channels.
          </p>
          <Link
            href="/ambassadors/apply/tier-2"
            className="mt-7 inline-block border border-gold px-8 py-3.5 text-[0.8125rem] tracking-[0.14em] text-gold uppercase transition-all duration-500 hover:bg-gold hover:text-ink"
          >
            Tier 2 enquiry
          </Link>
        </div>
      </Section>
    </>
  );
}

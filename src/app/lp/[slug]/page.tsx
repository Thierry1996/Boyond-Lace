import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductImage } from "@/components/ui/ProductImage";

/**
 * Hidden conversion landing pages — ad-driven, deliberately absent from all
 * navigation (sitemap: "Hidden Conversion & Marketing Landing Pages").
 * All noindex: these exist for paid traffic, not organic discovery.
 */

interface Campaign {
  title: string;
  eyebrow: string;
  h1a: string;
  h1b: string;
  body: string[];
  cta: { label: string; href: string };
  secondary?: { label: string; href: string };
  image: string;
}

const CAMPAIGNS: Record<string, Campaign> = {
  "influencer-affiliates": {
    title: "Become a Beyond Ambassador",
    eyebrow: "Tier 3 · Micro creators · 10k–50k",
    h1a: "Your lace-melt journey",
    h1b: "is worth 15–20%.",
    body: [
      "We don't do gifting-for-exposure. Tier 3 of the Beyond Ambassador programme is a straight affiliate partnership: 15–20% commission on every sale your content drives, tracked properly, paid monthly.",
      "What we want is the honest version — the struggle, the fix, the reveal. Raw transformation content outperforms studio footage ten to one, and we would rather pay you for it than fake it.",
    ],
    cta: { label: "Apply through the contact form", href: "/support#contact" },
    secondary: { label: "The full ambassador programme", href: "/circle#ambassadors" },
    image: "aurora",
  },
  "salon-onboarding": {
    title: "Beyond Lace for Salons",
    eyebrow: "Wholesale · MOQ 50 · MAP-protected",
    h1a: "Stock the brand",
    h1b: "your clients ask about.",
    body: [
      "Fifty units is the whole minimum. Bronze tier opens the full collection, the turnkey asset kit — photography, spec sheets, launch copy — and a margin we defend contractually through MAP enforcement.",
      "Your first order ships with everything needed to sell it the week it lands. Most salons reorder inside sixty days; the batch guarantee means their reorder matches their first order exactly.",
    ],
    cta: { label: "Apply as a partner", href: "/wholesale#apply" },
    secondary: { label: "Request samples first", href: "/wholesale#samples" },
    image: "plum",
  },
  quiz: {
    title: "Find Your Perfect Unit",
    eyebrow: "90 seconds · 5 questions",
    h1a: "Stop guessing",
    h1b: "with $800.",
    body: [
      "Five questions. Three units ranked for your texture, your skill level, your budget, and the moment you're buying for. Plus a match sheet by email with per-unit shade guidance.",
      "No account required, no spam — one email with your results, and an unsubscribe that actually works.",
    ],
    cta: { label: "Start the quiz", href: "/learn/quiz" },
    image: "blush",
  },
  comeback: {
    title: "Your Bag Is Waiting",
    eyebrow: "Right where you left it",
    h1a: "Still thinking",
    h1b: "it over?",
    body: [
      "Your bag is saved, exactly as you left it. If what's stopping you is shade doubt — the thing that stops most people — the Lace Test kit answers it for five dollars, credited back in full when you buy.",
      "And if the price is the pause: units on this site are built to outlast three of the cheaper kind. The maths favours patience, not compromise.",
    ],
    cta: { label: "Return to your bag", href: "/cart" },
    secondary: { label: "Order the $5 Lace Test", href: "/product/lace-test-kit" },
    image: "velvet",
  },
  "drop-vip": {
    title: "Capsule Drop — Early Access",
    eyebrow: "200 units · Numbered · Never restocked",
    h1a: "You're on the list",
    h1b: "the list matters.",
    body: [
      "Capsule drops run two hundred numbered units and are never repeated. Circle members and care subscribers see every drop before the public does — this link is that door.",
      "When the edition sells through, the mould is broken. That is not scarcity theatre; it is how the trend-reserve manufacturing actually works.",
    ],
    cta: { label: "See the live drop", href: "/drops" },
    secondary: { label: "Join the Circle for early access", href: "/circle" },
    image: "gold",
  },
};

export function generateStaticParams() {
  return Object.keys(CAMPAIGNS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = CAMPAIGNS[slug];
  if (!c) return { title: "Not found" };
  return { title: c.title, robots: { index: false, follow: false } };
}

export default async function CampaignPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = CAMPAIGNS[slug];
  if (!c) notFound();

  return (
    <section className="surface-velvet min-h-[85vh] border-b border-white/[0.07] pt-16 pb-24">
      <div className="mx-auto grid max-w-[1440px] gap-16 px-[4vw] lg:grid-cols-2 lg:items-center">
        <div>
          <p className="eyebrow mb-6 text-gold">{c.eyebrow}</p>
          <h1 className="text-[clamp(2.5rem,6.5vw,5.5rem)] leading-[0.95] text-paper">
            {c.h1a}
            <span className="block italic">{c.h1b}</span>
          </h1>
          {c.body.map((p, i) => (
            <p key={i} className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-neutral-400">
              {p}
            </p>
          ))}
          <div className="mt-10 flex flex-wrap items-center gap-7">
            <Link
              href={c.cta.href}
              className="cta-primary px-9 py-4 text-[0.8125rem] tracking-[0.14em] uppercase"
            >
              {c.cta.label}
            </Link>
            {c.secondary && (
              <Link
                href={c.secondary.href}
                className="border-b border-white/25 pb-1 text-[0.8125rem] tracking-[0.1em] text-neutral-200 uppercase transition-colors hover:border-gold hover:text-gold"
              >
                {c.secondary.label}
              </Link>
            )}
          </div>
        </div>
        <ProductImage src={c.image} alt={c.title} ratio="4 / 5" />
      </div>
    </section>
  );
}

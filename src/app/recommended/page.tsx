import type { Metadata } from "next";
import Link from "next/link";
import { Flame, ArrowUpRight } from "lucide-react";
import { commerce } from "@/lib/commerce";
import { ResourceHero } from "@/components/ui/ResourceHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ProductCard } from "@/components/ui/ProductCard";
import { BrandImage } from "@/components/ui/BrandImage";
import { ComparisonEngine } from "@/components/commerce/ComparisonEngine";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/primitives";
import type { ImageryKey } from "@/lib/imagery";

export const metadata: Metadata = {
  title: "Recommended — Top Picks & Category Guide",
  description:
    "Beyond Lace's most-reordered units, every wig category explained, and an honest comparison against the mass-market norm. Glueless, HD lace, bob, colored, medical and care.",
};

interface Cat {
  id: string;
  name: string;
  body: string;
  href: string;
  image: ImageryKey;
}

/** Every anchor referenced from the Recommended mega menu resolves here. */
const CONSTRUCTION: Cat[] = [
  {
    id: "v-u-part",
    name: "V / U Part Wigs",
    body: "An opening at the crown so your own hair blends at the leave-out. No adhesive, no lace to match — the fastest honest install there is.",
    href: "/shop?lace=glueless",
    image: "fitGuides",
  },
  {
    id: "headband",
    name: "Headband Wigs",
    body: "A fabric band replaces the lace entirely. Under a minute, nothing on the skin, and no hairline to get right.",
    href: "/shop?lace=glueless",
    image: "navLearn",
  },
  {
    id: "drawstring-360",
    name: "Drawstring & 360 Wigs",
    body: "Perimeter lace so you can wear it up. Adjustable drawstring at the nape holds a high ponytail without lifting at the front.",
    href: "/shop?lace=hd-swiss-13x4",
    image: "navShop",
  },
];

const SILHOUETTE: Cat[] = [
  {
    id: "bob-short",
    name: "Bob & Short Wigs",
    body: "Blunt, graduated or chin-length. The cut that photographs hardest, because there is nowhere for a bad hairline to hide.",
    href: "/shop?texture=straight",
    image: "navBrand",
  },
  {
    id: "layer-cut",
    name: "Layer Cut Wigs",
    body: "Movement built in at the factory rather than cut in afterwards, so the layers sit where the density supports them.",
    href: "/shop?texture=body-wave",
    image: "tier2",
  },
  {
    id: "bangs",
    name: "Wigs With Bangs",
    body: "A fringe removes the hairline question altogether. The most forgiving construction we sell, and not by accident.",
    href: "/shop?texture=straight",
    image: "tier3",
  },
  {
    id: "crochet",
    name: "Crochet Wigs",
    body: "Pre-looped texture on a breathable cap. Protective wear that does not ask your own hair to carry the weight.",
    href: "/shop?texture=curly",
    image: "educationPartnership",
  },
  {
    id: "half-wig",
    name: "3-in-1 Half Wigs",
    body: "Three wearing positions from one piece — full, half, and pulled back. Built for the person who wants range from a single purchase.",
    href: "/shop?lace=glueless",
    image: "navCircle",
  },
  {
    id: "4c-edge",
    name: "4C Edge Hairline",
    body: "A coily, textured edge at the perimeter rather than a straight one, so the hairline matches the hair it sits against.",
    href: "/shop?texture=curly",
    image: "brandPress",
  },
];

const CARE: Cat[] = [
  {
    id: "treatment-oils",
    name: "Treatment & Scalp Oils",
    body: "Lightweight oils for the hair, and separate formulations for the scalp underneath. They are not the same job.",
    href: "/shop?line=care",
    image: "fitGuides",
  },
  {
    id: "edge-control",
    name: "Edge Control & Restoration",
    body: "Hold without the flake, plus restoration serum for edges that have carried tension for years.",
    href: "/shop?line=care",
    image: "ordersLogistics",
  },
  {
    id: "bonnets",
    name: "Bonnets & Wig Stands",
    body: "The nightly two minutes that decide whether a unit lasts twelve months or thirty. Satin-lined, and a stand that holds the cap shape.",
    href: "/shop?line=care",
    image: "company",
  },
];

function CategoryGrid({ items }: { items: Cat[] }) {
  return (
    <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" gap={0.07}>
      {items.map((c) => (
        <StaggerItem key={c.id}>
          <Link
            href={c.href}
            id={c.id}
            className="card-lift group block h-full scroll-mt-40 overflow-hidden rounded-xl border border-white/[0.07] hover:border-gold/60"
          >
            <div className="overflow-hidden">
              <BrandImage
                name={c.image}
                ratio="16 / 10"
                width={800}
                sizes="(max-width: 640px) 100vw, 33vw"
                imgClassName="transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07]"
              />
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-[family-name:var(--font-display)] text-xl text-paper transition-colors duration-400 group-hover:text-gold">
                  {c.name}
                </h3>
                <ArrowUpRight
                  size={15}
                  strokeWidth={1.5}
                  className="mt-1 shrink-0 -translate-x-1 translate-y-1 text-gold opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
                />
              </div>
              <p className="mt-2.5 text-[0.875rem] leading-relaxed text-neutral-400">{c.body}</p>
            </div>
          </Link>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

export default async function RecommendedPage() {
  const [top, care] = await Promise.all([
    commerce.getProducts({ line: "luxe", sort: "featured", limit: 8 }),
    commerce.getProducts({ line: "care", limit: 4 }),
  ]);

  return (
    <>
      <ResourceHero
        eyebrow="Recommended"
        title="Start here."
        italic="The ones people actually reorder."
        body="Ranked by repeat purchase rather than by what we would like to move, then every category explained plainly — including an honest comparison against the mass-market norm."
        image="navShop"
        breadcrumb={{ label: "Shop", href: "/shop" }}
        cta={{ label: "Compare us honestly", href: "#compare" }}
      />

      {/* Top picks */}
      <Section
        className="section-rhythm"
        eyebrowLeft="Hottest now"
        eyebrowCenter="Ranked by reorders"
        eyebrowRight="Updated weekly"
      >
        <div id="top-picks" className="scroll-mt-40">
          <div className="mb-14 flex flex-wrap items-end justify-between gap-8">
            <SectionHeading
              eyebrow="Top picks"
              title="What comes back to the basket."
              italicFrom={3}
            />
            <Reveal delay={0.3}>
              <Link
                href="/shop/bestsellers"
                className="group inline-flex items-center gap-2 border-b border-gold pb-1 text-[0.75rem] tracking-[0.12em] text-gold uppercase"
              >
                <Flame size={13} strokeWidth={1.6} />
                All bestsellers
              </Link>
            </Reveal>
          </div>
          <Stagger className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4" gap={0.07}>
            {top.map((p) => (
              <StaggerItem key={p.id}>
                <ProductCard product={p} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Section>

      {/* Comparison engine */}
      <section id="compare" className="grain section-rhythm scroll-mt-40 border-y border-gold/20 bg-plum-900">
        <div className="mx-auto max-w-[1440px] px-[4vw]">
          <div className="mb-12 max-w-3xl">
            <SectionHeading
              eyebrow="Before you decide"
              title="Compare us honestly."
              italicFrom={2}
              body="Four dimensions that actually change what you receive. One of them is a row we lose — kept in on purpose, because a comparison with no losses is an advertisement."
            />
          </div>
          <ComparisonEngine />
        </div>
      </section>

      {/* Construction */}
      <Section
        className="section-rhythm"
        eyebrowLeft="By construction"
        eyebrowCenter="How it is built"
        eyebrowRight="Fit first"
      >
        <div className="mb-12">
          <SectionHeading
            title="Construction decides the morning."
            italicFrom={2}
            body="Not the texture, not the length — how the cap is built is what determines whether an install takes four minutes or forty."
          />
        </div>
        <CategoryGrid items={CONSTRUCTION} />
      </Section>

      {/* Silhouette */}
      <Section
        className="section-rhythm"
        eyebrowLeft="By silhouette"
        eyebrowCenter="The shape"
        eyebrowRight="Asked for by name"
      >
        <div className="mb-12">
          <SectionHeading title="The cuts people ask for." italicFrom={3} />
        </div>
        <CategoryGrid items={SILHOUETTE} />
      </Section>

      {/* Care */}
      <Section
        className="section-rhythm"
        eyebrowLeft="Beyond Care"
        eyebrowCenter="Aftercare"
        eyebrowRight="Recurring"
      >
        <div className="mb-12">
          <SectionHeading
            title="A unit lasts as long as the hands that keep it."
            italicFrom={5}
            body="Human hair does not renew itself. Everything it will ever be, it already is — this is how you keep it that way."
          />
        </div>
        <CategoryGrid items={CARE} />

        {care.length > 0 && (
          <Stagger className="mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4" gap={0.07}>
            {care.map((p) => (
              <StaggerItem key={p.id}>
                <ProductCard product={p} />
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </Section>
    </>
  );
}

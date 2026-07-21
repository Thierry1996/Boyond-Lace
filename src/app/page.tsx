import Link from "next/link";
import { commerce } from "@/lib/commerce";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProductImage } from "@/components/ui/ProductImage";
import { MonogramAurora, CrownWave } from "@/components/brand/Logo";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { BrandMarquee, ProofBand, EditorialSplit, PillarBento } from "@/components/home/Sections";

export default async function HomePage() {
  // Scoped to the signature line on purpose. An unscoped "featured" sort ranks
  // by review volume, which floats the $5 test kit and the $34 adhesive to the
  // top — accessories always out-review units. That is the wrong first
  // impression for a brand justifying $600.
  const [bestsellers, capsule] = await Promise.all([
    commerce.getProducts({ line: "luxe", sort: "featured", limit: 4 }),
    commerce.getProducts({ avatar: "editorial", limit: 2 }),
  ]);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────────
          Six-slide pillar carousel with gilded centred type, per the reference
          direction. The h1 is visually part of slide 1's composition but kept
          for document semantics and SEO. */}
      <h1 className="sr-only">
        Beyond Lace — luxury HD Swiss lace human hair wigs. We don&apos;t sell hair; we sell
        what&apos;s beyond it.
      </h1>
      <HeroCarousel />

      {/* Gilded statement ticker — a pulse between two dark blocks. */}
      <BrandMarquee />

      {/* Figures that resolve on scroll, before any sales copy. */}
      <ProofBand />

      {/* Asymmetric editorial split, replacing the old equal-halves layout. */}
      <EditorialSplit />

      {/* ── Bestsellers ──────────────────────────────────────────────────── */}
      <Section
        className="py-28"
        eyebrowLeft="The collection"
        eyebrowCenter="Signature units"
        eyebrowRight="Hand-tied"
      >
        <div className="mb-14 flex items-end justify-between gap-8">
          <SectionHeading title="What people come back for." />
          <Link
            href="/shop"
            className="hidden shrink-0 border-b border-gold pb-1 text-[0.8125rem] tracking-[0.1em] text-gold uppercase md:block"
          >
            All units
          </Link>
        </div>
        <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {bestsellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Section>

      {/* ── Six Pillars — broken bento, not a uniform 3×2 ─────────────────── */}
      <PillarBento />

      {/* ── Capsule ──────────────────────────────────────────────────────── */}
      <Section
        className="py-28"
        eyebrowLeft="Trend agility"
        eyebrowCenter="Capsule drops"
        eyebrowRight="Never restocked"
      >
        <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Twenty percent held in reserve"
              title="Cut Tuesday. Shipped Friday. Then gone."
              body="Our floor keeps a fifth of its capacity idle on purpose. When a silhouette moves, we are not waiting on a container — we are already cutting. Two hundred units, numbered, and the mould is broken."
            />
            <Link
              href="/shop?sort=newest"
              className="mt-8 inline-block border-b border-gold pb-1 text-[0.8125rem] tracking-[0.1em] text-gold uppercase"
            >
              See what&apos;s live
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {capsule.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </Section>

      {/* ── Wholesale teaser ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-plum-900 py-28">
        <div className="mx-auto grid max-w-[1440px] gap-16 px-[4vw] lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow mb-5 text-gold">For salons & resellers</p>
            <h2 className="text-[clamp(2rem,4.5vw,3.5rem)] text-paper">
              Your name on our manufacturing floor.
            </h2>
            <p className="mt-6 text-[1.0625rem] leading-relaxed text-blush-200/70">
              Beyond Lace Pro is the private-label line: our cap construction and batch guarantee,
              your branding on the box. Fifty-unit minimum. Turnkey photography and spec sheets so
              you can sell it the day it lands.
            </p>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-blush-200/70">
              MAP is enforced, not suggested. Your margin is contractually defended — no partner
              undercuts another, and none of them undercut us.
            </p>
            <div className="mt-9 flex flex-wrap gap-6">
              <Link
                href="/wholesale"
                className="border border-gold px-8 py-3.5 text-[0.8125rem] tracking-[0.14em] text-gold uppercase transition-all duration-500 hover:bg-gold hover:text-ink"
              >
                The programme
              </Link>
              <Link
                href="/wholesale#apply"
                className="border-b border-white/25 pb-1 text-[0.8125rem] tracking-[0.1em] text-blush-200 uppercase transition-colors hover:border-gold hover:text-gold"
              >
                Apply as a partner
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <ProductImage src="plum" alt="Beyond Lace Pro private label packaging" />
            <ProductImage
              src="gold"
              alt="Custom branded comb and hang tag detail"
              className="mt-12"
            />
          </div>
        </div>
      </section>

      {/* ── The Beyond Circle ────────────────────────────────────────────── */}
      <Section
        className="py-28"
        eyebrowLeft="Retention"
        eyebrowCenter="The Beyond Circle"
        eyebrowRight="Members only"
      >
        <div className="mx-auto max-w-3xl text-center">
          <CrownWave size={40} className="mx-auto mb-8 text-gold" />
          <h2 className="text-[clamp(2rem,4.5vw,3.5rem)] text-paper">
            The proof arrives before the parcel does.
          </h2>
          <p className="mt-6 text-[1.0625rem] leading-relaxed text-neutral-400">
            Members post their transformations inside the Circle while their unit is still in
            transit. By the time the box lands, they have already seen twenty women with their hair
            type wearing it. Buyer&apos;s remorse does not survive that.
          </p>
          <Link
            href="/circle"
            className="mt-10 inline-block border border-gold px-9 py-4 text-[0.8125rem] tracking-[0.14em] text-gold uppercase transition-all duration-500 hover:bg-gold hover:text-ink"
          >
            Join the Circle
          </Link>
        </div>
      </Section>

      {/* ── Manifesto close ──────────────────────────────────────────────── */}
      <section className="surface-velvet border-t border-white/[0.07] py-32">
        <div className="mx-auto max-w-[1440px] px-[4vw]">
          <div className="mx-auto max-w-3xl text-center">
            <MonogramAurora size={72} />
            <blockquote className="mt-10 font-[family-name:var(--font-display)] text-[clamp(1.5rem,3.5vw,2.75rem)] leading-[1.25] text-paper italic">
              &ldquo;Every wig I owned looked incredible in videos and fake in daylight. I stopped
              buying hair and started buying the eight hours I spent not thinking about it.&rdquo;
            </blockquote>
            <p className="eyebrow mt-8">Beyond Circle member · Atlanta</p>
          </div>
        </div>
      </section>
    </>
  );
}

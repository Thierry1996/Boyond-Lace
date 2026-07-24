import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  commerce,
  getRatingBreakdown,
  getReviews,
  getReviewFacets,
  getQuestions,
} from "@/lib/commerce";
import { Money } from "@/components/ui/Money";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchase } from "@/components/product/ProductPurchase";
import { ProductInformation } from "@/components/product/ProductInformation";
import { ProductReviews } from "@/components/product/ProductReviews";
import { ProductQA } from "@/components/product/ProductQA";
import { SellerGuarantees } from "@/components/product/SellerGuarantees";
import { TutorialCarousel } from "@/components/product/TutorialCarousel";
import { getTutorials } from "@/lib/tutorials";
import { Section } from "@/components/ui/Section";
import { Reveal, SplitText, DrawRule } from "@/components/motion/primitives";

export async function generateStaticParams() {
  const products = await commerce.getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await commerce.getProduct(slug);
  if (!product) return { title: "Not found" };

  return {
    title: `${product.title} — ${product.tagline}`,
    description: product.description.slice(0, 155),
    openGraph: { title: product.title, description: product.tagline },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await commerce.getProduct(slug);
  if (!product) notFound();

  const related = await commerce.getRelated(slug, 4);
  const attachments = await commerce.getAttachments(slug);
  const breakdown = getRatingBreakdown(product);
  const reviews = getReviews(product);
  const reviewFacets = getReviewFacets(product);
  const questions = getQuestions(product);
  const tutorials = getTutorials(product.texture);

  // Explicit product typing so search engines never file this under intimates.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.title} — Human Hair Wig`,
    category: "Human Hair Wigs",
    description: product.description,
    brand: { "@type": "Brand", name: "Beyond Lace" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
    ...(product.price > 0 && {
      offers: {
        "@type": "Offer",
        price: (product.price / 100).toFixed(2),
        priceCurrency: product.currency,
        availability: product.inStock
          ? "https://schema.org/InStock"
          : "https://schema.org/PreOrder",
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-[1440px] px-[4vw] pt-12 pb-24">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[0.75rem] text-neutral-400">
            <a href="/shop" className="hover:text-paper">
              Collection
            </a>
            <span aria-hidden="true">/</span>
            <span className="text-neutral-200">{product.title}</span>
          </div>
          {/* Same unit, trade view — the channel cross-link. Only for SKUs
              actually stocked wholesale, so it never points at a dead page. */}
          {product.wholesale && (
            <a
              href={`/wholesale/product/${product.slug}`}
              className="text-[0.75rem] tracking-[0.08em] text-gold uppercase underline-offset-4 hover:underline"
            >
              Buying for a salon or store? See trade pricing →
            </a>
          )}
        </div>

        {/* Two columns: a sticky gallery on the left, and a scrolling column on
            the right that holds the buy panel, the specification and the full
            product information. The gallery sticks through all of it and only
            releases when this grid ends — just before the reviews. */}
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-start lg:gap-14">
          {/* Left — sticky media */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Reveal direction="up" duration={1.05}>
              <ProductGallery images={product.images} title={product.title} />
            </Reveal>
          </div>

          {/* Right — scrollable stats: buy, spec, product information */}
          <div>
            {product.badges.length > 0 && (
              <Reveal duration={0.7}>
                <div className="mb-5 flex flex-wrap gap-2">
                  {product.badges.map((badge) => (
                    <span
                      key={badge}
                      className="border border-gold/40 px-2.5 py-1 text-[0.625rem] tracking-[0.14em] text-gold uppercase"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </Reveal>
            )}

            <SplitText
              as="h1"
              text={product.title}
              delay={0.06}
              className="text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.02] text-paper"
            />

            <Reveal delay={0.22} duration={0.8}>
              <p className="mt-3 font-[family-name:var(--font-display)] text-xl text-blush-300 italic">
                {product.tagline}
              </p>
            </Reveal>

            <Reveal delay={0.3} duration={0.8}>
              <div className="mt-5 flex items-center gap-2 text-[0.8125rem] text-neutral-400">
                <span className="text-gold" aria-hidden="true">
                  {"★".repeat(Math.round(product.rating))}
                </span>
                <span className="tabular-nums">
                  {product.rating.toFixed(1)} · {product.reviewCount.toLocaleString()} reviews
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.38} duration={0.85}>
              <p className="mt-7 text-[1.0625rem] leading-relaxed text-neutral-400">
                {product.description}
              </p>
            </Reveal>

            <DrawRule className="my-9" delay={0.45} />

            <Reveal delay={0.5} duration={0.85}>
              <ProductPurchase product={product} />
            </Reveal>

            {/* Specification — the load-bearing construction */}
            <div className="mt-16 border-t border-white/[0.07] pt-12">
              <div className="flex items-baseline justify-between">
                <span className="eyebrow text-gold">Specification</span>
                <span className="eyebrow">Batch-guaranteed</span>
              </div>
              <h2 className="mt-6 text-[clamp(1.75rem,3.5vw,2.5rem)] leading-tight text-paper">
                What it&apos;s actually made of.
              </h2>
              <p className="mt-4 max-w-xl text-[0.9375rem] leading-relaxed text-neutral-400">
                Competitors argue over grade labels. We publish the construction, because the grade
                was never the thing that failed you.
              </p>
              <dl className="mt-8 divide-y divide-white/[0.07] border-t border-white/[0.07]">
                {product.specs.map((spec) => (
                  <div key={spec.label} className="grid grid-cols-[130px_1fr] gap-5 py-4">
                    <dt className="eyebrow pt-0.5">{spec.label}</dt>
                    <dd className="text-[0.9375rem] leading-relaxed text-neutral-200">
                      {spec.value}
                    </dd>
                  </div>
                ))}
                {product.origin && (
                  <div className="grid grid-cols-[130px_1fr] gap-5 py-4">
                    <dt className="eyebrow pt-0.5">Origin</dt>
                    <dd className="text-[0.9375rem] leading-relaxed text-neutral-200">
                      {product.origin}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Product information — Description, Product details, etc. */}
            <div className="mt-16 border-t border-white/[0.07] pt-12">
              <div className="mb-6 flex items-baseline justify-between">
                <span className="eyebrow text-gold">Product information</span>
                <span className="eyebrow">The full sheet</span>
              </div>
              <ProductInformation product={product} />
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="border-t border-white/[0.07] py-20">
        <div className="mx-auto max-w-[1440px] px-[4vw]">
          <div className="mb-10 flex items-center justify-between">
            <span className="eyebrow">Reviews</span>
            <span className="eyebrow tabular-nums">
              {breakdown.overall.toFixed(1)} · {breakdown.count.toLocaleString()}
            </span>
          </div>
        </div>
        <ProductReviews
          product={product}
          breakdown={breakdown}
          reviews={reviews}
          facets={reviewFacets}
          photoCount={Math.max(12, Math.round(breakdown.count * 0.26))}
        />
      </section>

      {/* Tutorials */}
      <section className="border-t border-white/[0.07] py-20">
        <TutorialCarousel tutorials={tutorials} />
      </section>

      {/* Seller guarantees */}
      <section className="border-t border-white/[0.07] py-20">
        <SellerGuarantees product={product} />
      </section>

      {/* Q&A */}
      <section className="border-t border-white/[0.07] py-20">
        <ProductQA
          questions={questions}
          supportHref={`/support?unit=${encodeURIComponent(product.slug)}#contact`}
        />
      </section>

      {/* Default attachments.
          The buying directive treats the Install Kit and Care Bundle as default
          cross-sell rather than an optional add-on: the margin lives here while
          the units themselves compete on price, and a first install that fails
          for want of $40 of tape becomes a return. Presented as what the order
          already includes, with an explicit opt-out, rather than an upsell. */}
      {attachments.length > 0 && (
        <Section
          className="py-20"
          eyebrowLeft="Included by default"
          eyebrowRight="Remove at checkout"
        >
          <h2 className="mb-4 text-[clamp(1.75rem,3.5vw,2.75rem)] text-paper">
            Your order ships complete.
          </h2>
          <p className="mb-12 max-w-2xl text-[1.0625rem] leading-relaxed text-neutral-400">
            Most first installs fail for want of something small — the right tape, a stand to keep
            the unit in shape. These are added to every unit as standard. Remove either at checkout
            if you already have them.
          </p>
          <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {attachments.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </Section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <Section className="py-24" eyebrowLeft="Also consider" eyebrowRight="Matched to this unit">
          <h2 className="mb-12 text-[clamp(1.75rem,3.5vw,2.75rem)] text-paper">
            Chosen alongside {product.title}.
          </h2>
          <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </Section>
      )}

      {/* Return-reduction cross-sell */}
      {product.slug !== "lace-test-kit" && product.price > 0 && (
        <section className="border-t border-white/[0.07] bg-plum-900 py-20">
          <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-8 px-[4vw] md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="eyebrow mb-3 text-gold">Before you commit</p>
              <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] text-paper">
                <Money usd={product.price} /> is a lot to guess with.
              </h2>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-blush-200/70">
                Order The Lace Test for $5 first. Six swatches, five shade cards, credited back in
                full when you buy this unit.
              </p>
            </div>
            <a
              href="/product/lace-test-kit"
              className="shrink-0 border border-gold px-8 py-4 text-[0.8125rem] tracking-[0.14em] text-gold uppercase transition-all duration-500 hover:bg-gold hover:text-ink"
            >
              Order the kit
            </a>
          </div>
        </section>
      )}
    </>
  );
}

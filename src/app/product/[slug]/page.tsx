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
import { ProductImage } from "@/components/ui/ProductImage";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProductPurchase } from "@/components/product/ProductPurchase";
import { ProductInformation } from "@/components/product/ProductInformation";
import { ProductReviews } from "@/components/product/ProductReviews";
import { ProductQA } from "@/components/product/ProductQA";
import { SellerGuarantees } from "@/components/product/SellerGuarantees";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal, Stagger, StaggerItem, SplitText, DrawRule } from "@/components/motion/primitives";
import { Tilt } from "@/components/motion/interactions";

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

        <div className="mt-10 grid gap-16 lg:grid-cols-[1.1fr_1fr]">
          {/* Gallery — hero frame rises first, supporting shots follow staggered */}
          <div className="space-y-5">
            <Reveal direction="up" duration={1.05}>
              <div className="overflow-hidden rounded-lg">
                <Tilt max={4}>
                  <ProductImage
                    src={product.images[0].src}
                    alt={product.images[0].alt}
                    ratio="4 / 5"
                  />
                </Tilt>
              </div>
            </Reveal>
            {product.images.length > 1 && (
              <Stagger className="grid grid-cols-2 gap-5" gap={0.09} delay={0.15}>
                {product.images.slice(1).map((img, i) => (
                  <StaggerItem key={i}>
                    <div className="group overflow-hidden rounded-lg">
                      <ProductImage
                        src={img.src}
                        alt={img.alt}
                        className="transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                      />
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            )}
          </div>

          {/* Buy column — the sequence that carries a $600 decision */}
          <div className="lg:sticky lg:top-32 lg:self-start">
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
          </div>
        </div>
      </div>

      {/* Specifications */}
      <Section
        className="py-24"
        eyebrowLeft="The engineering"
        eyebrowCenter="Specification"
        eyebrowRight="Batch-guaranteed"
      >
        <div className="grid gap-16 lg:grid-cols-[1fr_1.3fr]">
          <SectionHeading
            title="What it's actually made of."
            body="Competitors argue over grade labels. We publish the construction, because the grade was never the thing that failed you."
          />
          {/* Specs arrive row by row — a construction record being read out,
              rather than a table that was simply already there. Reveal wraps
              each row individually so the <dl>/<dt>/<dd> semantics survive. */}
          <dl className="divide-y divide-white/[0.07] border-t border-white/[0.07]">
            {product.specs.map((spec, i) => (
              <Reveal key={spec.label} direction="left" delay={i * 0.06} duration={0.8}>
                <div className="grid grid-cols-[140px_1fr] gap-6 py-5">
                  <dt className="eyebrow pt-0.5">{spec.label}</dt>
                  <dd className="text-[0.9375rem] leading-relaxed text-neutral-200">
                    {spec.value}
                  </dd>
                </div>
              </Reveal>
            ))}
            {product.origin && (
              <Reveal direction="left" delay={product.specs.length * 0.06} duration={0.8}>
                <div className="grid grid-cols-[140px_1fr] gap-6 py-5">
                  <dt className="eyebrow pt-0.5">Origin</dt>
                  <dd className="text-[0.9375rem] leading-relaxed text-neutral-200">
                    {product.origin}
                  </dd>
                </div>
              </Reveal>
            )}
          </dl>
        </div>
      </Section>

      {/* Description + Product details, as expandable panels. */}
      <Section className="py-16" eyebrowLeft="Product information" eyebrowRight="The full sheet">
        <div className="mx-auto max-w-3xl">
          <ProductInformation product={product} />
        </div>
      </Section>

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

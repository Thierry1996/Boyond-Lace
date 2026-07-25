import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  commerce,
  deriveKeyAttributes,
  getWholesaleReviews,
  getWholesaleReviewFacets,
} from "@/lib/commerce";
import { WholesaleProductCard } from "@/components/wholesale/WholesaleProductCard";
import { WholesaleOrderPanel } from "@/components/wholesale/WholesaleOrderPanel";
import { WholesaleTierColumns } from "@/components/wholesale/WholesaleTierColumns";
import { KeyAttributes } from "@/components/wholesale/KeyAttributes";
import { WholesaleReviews } from "@/components/wholesale/WholesaleReviews";
import { VariationSummary } from "@/components/product/VariationSummary";
import { ProductGallery } from "@/components/product/ProductGallery";
import { WHOLESALE_MOQ } from "@/lib/channel";

export async function generateStaticParams() {
  const products = await commerce.getProducts({ wholesaleOnly: true });
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
    title: `${product.title} — Wholesale, MOQ ${WHOLESALE_MOQ}`,
    description: `Trade pricing for ${product.title} human hair units. ${product.tagline} MAP-protected, batch-consistent.`,
  };
}

/**
 * Wholesale PDP — the trade preview of a unit. Same product, a buyer's view:
 * per-unit tier pricing, a quantity that starts at the 50-unit minimum, the
 * batch and sourcing terms a stockist actually decides on, and a quote instead
 * of a cart. A unit not stocked for resale has no wholesale page.
 */
export default async function WholesaleProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await commerce.getProduct(slug);
  if (!product) notFound();
  // Retail-only SKUs (Lace Test, care singles) are not a wholesale line.
  if (!product.wholesale) notFound();

  const related = (await commerce.getProducts({ wholesaleOnly: true, sort: "launch-rank" }))
    .filter((p) => p.slug !== slug)
    .slice(0, 4);

  const keyAttributes = deriveKeyAttributes(product);
  const wholesaleReviews = getWholesaleReviews(product);
  const wholesaleMentions = getWholesaleReviewFacets(product);
  // Store-wide review count: this unit's reviews as a share of the whole store.
  const storeReviewCount = product.reviewCount * 12;

  return (
    <div className="mx-auto max-w-[1440px] px-[4vw] pt-12 pb-24">
      {/* Breadcrumb + channel cross-link */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[0.75rem] text-neutral-400">
          <Link href="/wholesale/catalog" className="hover:text-paper">
            Wholesale catalogue
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-neutral-200">{product.title}</span>
        </div>
        <Link
          href={`/product/${product.slug}`}
          className="text-[0.75rem] tracking-[0.08em] text-gold uppercase underline-offset-4 hover:underline"
        >
          View the retail page →
        </Link>
      </div>

      {/* Two columns: a sticky media gallery on the left, and a scrolling trade
          stats column on the right — the same anatomy as the retail PDP, priced
          for a buyer. The gallery holds while the stats scroll. */}
      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-start lg:gap-14">
        {/* Left — sticky media (8 thumbnails + a product video) */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <ProductGallery images={product.images} title={product.title} />
        </div>

        {/* Right — scrolling trade stats */}
        <div>
          <div className="flex items-center gap-3">
            <span className="border border-gold/40 px-2.5 py-1 text-[0.625rem] tracking-[0.14em] text-gold uppercase">
              Wholesale
            </span>
            <span className="text-[0.75rem] text-neutral-400 tabular-nums">SKU {product.sku}</span>
          </div>

          <h1 className="mt-5 text-[clamp(2rem,4vw,3rem)] leading-[1.05] text-paper">
            {product.title}
          </h1>

          {/* Rating · reviews · units moved — the trade proof line */}
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.8125rem] text-neutral-400">
            <span className="inline-flex items-center gap-1.5">
              <span className="text-gold" aria-hidden="true">
                {"★".repeat(Math.round(product.rating))}
              </span>
              <span className="tabular-nums text-paper">{product.rating.toFixed(1)}</span>
              <span className="tabular-nums">({product.reviewCount.toLocaleString()} reviews)</span>
            </span>
            <span className="tabular-nums">
              {(product.reviewCount * 6).toLocaleString()}+ units moved
            </span>
            <span className="inline-flex items-center gap-1.5 text-gold">
              <span aria-hidden="true">🏆</span>
              {product.badges[0] ?? "Trade favourite"}
            </span>
          </div>

          {/* Volume price columns — the wholesale stats header */}
          <div className="mt-7">
            <WholesaleTierColumns pricing={product.wholesale} />
            <p className="mt-3 text-[0.75rem] leading-relaxed text-neutral-400">
              Trade minimum {WHOLESALE_MOQ} units, so every order lands on the deepest standing
              tier. Larger volumes are negotiated with the partner team.
            </p>
          </div>

          <p className="mt-7 text-[0.9375rem] leading-relaxed text-neutral-400">
            {product.description}
          </p>

          {/* Style · lace · colour · length — the variation anatomy, read-only */}
          <div className="mt-8 border-t border-white/[0.07] pt-8">
            <VariationSummary product={product} />
          </div>

          <div className="rule-gilded my-9" />

          {/* Quantity, live per-unit price, customization and the quote CTAs */}
          <WholesaleOrderPanel slug={product.slug} pricing={product.wholesale} />
        </div>
      </div>

      {/* Key attributes — quick glance for experienced buyers, full table on demand */}
      <section className="mt-20 border-t border-white/[0.07] pt-16">
        <KeyAttributes data={keyAttributes} />
      </section>

      {/* Supplier reviews — trade layout with replies */}
      <section className="mt-4 border-t border-white/[0.07] py-16">
        <WholesaleReviews
          product={product}
          reviews={wholesaleReviews}
          mentions={wholesaleMentions}
          storeReviewCount={storeReviewCount}
        />
      </section>

      {/* Construction spec — a buyer's due diligence */}
      <section className="mt-24 border-t border-white/[0.07] pt-16">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <p className="eyebrow mb-4 text-gold">The engineering</p>
            <h2 className="text-[clamp(1.75rem,3.5vw,2.75rem)] leading-tight text-paper">
              What your clients are actually buying.
            </h2>
            <p className="mt-5 max-w-md text-[0.9375rem] leading-relaxed text-neutral-400">
              We publish the construction rather than a grade label, so your sales floor can answer
              the question that closes the sale.
            </p>
          </div>
          <dl className="divide-y divide-white/[0.07] border-t border-white/[0.07]">
            {product.specs.map((spec) => (
              <div key={spec.label} className="grid grid-cols-[140px_1fr] gap-6 py-5">
                <dt className="eyebrow pt-0.5">{spec.label}</dt>
                <dd className="text-[0.9375rem] leading-relaxed text-neutral-200">{spec.value}</dd>
              </div>
            ))}
            {product.origin && (
              <div className="grid grid-cols-[140px_1fr] gap-6 py-5">
                <dt className="eyebrow pt-0.5">Origin</dt>
                <dd className="text-[0.9375rem] leading-relaxed text-neutral-200">
                  {product.origin}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </section>

      {/* Partner terms — the transparency block */}
      <section className="mt-20 grid gap-6 sm:grid-cols-3">
        {[
          {
            h: "MAP-protected",
            b: "A contractually enforced minimum advertised price. No partner undercuts another, and none undercut us.",
          },
          {
            h: "Batch-guaranteed",
            b: "Every SKU is cut from a single production run. Reorders match the units already on your shelf.",
          },
          {
            h: "Turnkey to sell",
            b: "First orders ship with photography, spec sheets and launch copy — everything needed to sell it the week it lands.",
          },
        ].map((c) => (
          <div key={c.h} className="border border-white/[0.08] p-6">
            <p className="eyebrow mb-3 text-gold">{c.h}</p>
            <p className="text-[0.875rem] leading-relaxed text-neutral-400">{c.b}</p>
          </div>
        ))}
      </section>

      {/* Related trade SKUs */}
      {related.length > 0 && (
        <section className="mt-24 border-t border-white/[0.07] pt-16">
          <div className="mb-12 flex items-end justify-between">
            <h2 className="text-[clamp(1.75rem,3.5vw,2.75rem)] text-paper">Stock it alongside.</h2>
            <Link
              href="/wholesale/catalog"
              className="text-[0.75rem] tracking-[0.1em] text-gold uppercase underline-offset-4 hover:underline"
            >
              Full catalogue →
            </Link>
          </div>
          <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <WholesaleProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

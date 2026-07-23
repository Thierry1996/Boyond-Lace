import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { commerce } from "@/lib/commerce";
import { Money } from "@/components/ui/Money";
import { ProductImage } from "@/components/ui/ProductImage";
import { WholesaleProductCard } from "@/components/wholesale/WholesaleProductCard";
import { WholesaleQuote } from "@/components/wholesale/WholesaleQuote";
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

  const orderedTiers = [...product.wholesale.tiers].sort((a, b) => a.minQty - b.minQty);

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

      <div className="mt-10 grid gap-16 lg:grid-cols-[1.1fr_1fr]">
        {/* Gallery */}
        <div className="space-y-5">
          <div className="overflow-hidden rounded-lg">
            <ProductImage src={product.images[0].src} alt={product.images[0].alt} ratio="4 / 5" />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-2 gap-5">
              {product.images.slice(1).map((img, i) => (
                <div key={i} className="overflow-hidden rounded-lg">
                  <ProductImage src={img.src} alt={img.alt} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Trade buy column */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <div className="flex items-center gap-3">
            <span className="border border-gold/40 px-2.5 py-1 text-[0.625rem] tracking-[0.14em] text-gold uppercase">
              Wholesale
            </span>
            <span className="text-[0.75rem] text-neutral-400 tabular-nums">SKU {product.sku}</span>
          </div>

          <h1 className="mt-5 text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.02] text-paper">
            {product.title}
          </h1>
          <p className="mt-3 font-[family-name:var(--font-display)] text-xl text-blush-300 italic">
            {product.tagline}
          </p>

          <p className="mt-7 text-[1.0625rem] leading-relaxed text-neutral-400">
            {product.description}
          </p>

          <div className="rule-gilded my-9" />

          <WholesaleQuote slug={product.slug} pricing={product.wholesale} />

          {/* Price break ladder */}
          <div className="mt-8">
            <p className="eyebrow mb-4">Volume price breaks</p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[0.875rem]">
                <thead>
                  <tr className="border-b border-white/[0.12] text-left">
                    <th className="py-3 font-normal text-neutral-400">Tier</th>
                    <th className="py-3 font-normal text-neutral-400">From</th>
                    <th className="py-3 text-right font-normal text-neutral-400">Per unit</th>
                  </tr>
                </thead>
                <tbody>
                  {orderedTiers.map((t) => {
                    // The trade floor is 50, so the tier a real order lands in.
                    const active = WHOLESALE_MOQ >= t.minQty;
                    return (
                      <tr
                        key={t.label}
                        className={`border-b border-white/[0.06] ${active ? "text-paper" : "text-neutral-400"}`}
                      >
                        <td className="py-3">
                          {t.label}
                          {active &&
                            t.minQty === Math.max(...orderedTiers.map((x) => x.minQty)) && (
                              <span className="ml-2 text-[0.625rem] tracking-[0.12em] text-gold uppercase">
                                Your tier
                              </span>
                            )}
                        </td>
                        <td className="py-3 tabular-nums">{t.minQty} units</td>
                        <td className="py-3 text-right tabular-nums">
                          <Money usd={t.unitPrice} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-[0.75rem] leading-relaxed text-neutral-400">
              The trade minimum is {WHOLESALE_MOQ} units, so every order lands on the deepest
              standing tier. Lower rows show how the ladder is structured; larger volumes are
              negotiated with the partner team.
            </p>
          </div>
        </div>
      </div>

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

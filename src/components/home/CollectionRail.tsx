import Link from "next/link";
import { ProductImage } from "@/components/ui/ProductImage";
import { homeCollections } from "@/lib/collections";

/**
 * Home collection rail — the shop-by-collection row that sits directly under the
 * hero. A horizontal, scroll-snapped strip of collection cards, each routing to
 * its /collections/[slug] page. Server-rendered: the scroll is pure CSS, so it
 * works without hydration. Imagery is the on-brand gradient placeholder until
 * the shoot lands (the brand's photographic system is hair-only).
 */
export function CollectionRail() {
  return (
    <section aria-label="Shop by collection" className="border-b border-white/[0.07] bg-ink py-10">
      <div className="mx-auto max-w-[1560px] px-[3vw]">
        <div className="mb-6 flex items-baseline justify-between px-1">
          <p className="eyebrow text-gold">Shop by collection</p>
          <Link
            href="/collections"
            className="text-[0.75rem] tracking-[0.1em] text-neutral-400 uppercase underline-offset-4 transition-colors hover:text-gold"
          >
            View all →
          </Link>
        </div>

        <ul
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [scrollbar-width:thin] sm:gap-5"
          style={{ scrollbarColor: "rgba(201,166,107,0.4) transparent" }}
        >
          {homeCollections.map((c) => (
            <li key={c.slug} className="shrink-0 snap-start">
              <Link
                href={`/collections/${c.slug}`}
                className="group block w-[8.5rem] sm:w-[10rem] lg:w-[11rem]"
              >
                <div className="relative overflow-hidden rounded-xl bg-plum-900 ring-1 ring-white/[0.06] transition-all duration-500 group-hover:ring-gold/50">
                  <ProductImage
                    src={c.cardImage}
                    alt={c.label}
                    ratio="4 / 5"
                    className="transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                  />
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/70 to-transparent" />
                  <span className="absolute bottom-2.5 left-3 text-[0.625rem] tracking-[0.14em] text-paper/90 uppercase">
                    {c.eyebrow}
                  </span>
                </div>
                <p className="mt-3 text-center text-[0.8125rem] font-medium text-neutral-200 transition-colors duration-300 group-hover:text-gold">
                  {c.label}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

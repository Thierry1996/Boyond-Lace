import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * "Product Categories" — a bento showcase of the catalogue's headline
 * collections, each card a real hero image over a scrim with the collection
 * name, linking straight into the shop filtered to that collection. Cloned in
 * layout from the reference, rendered in the Beyond Lace dark/gold system.
 *
 * `cards` arrive in a fixed bento order (0..5). Card 1 is the tall hero.
 */
export interface CategoryCard {
  label: string;
  href: string;
  image?: string;
  alt: string;
}

const PLUM = "linear-gradient(160deg, #5A2D67 0%, #321528 60%, #090909 100%)";

function Card({ card, className = "" }: { card: CategoryCard; className?: string }) {
  return (
    <Link
      href={card.href}
      className={`group relative block overflow-hidden rounded-lg ${className}`}
    >
      <div aria-hidden="true" className="absolute inset-0" style={{ background: PLUM }} />
      {card.image && (
        <div
          role="img"
          aria-label={card.alt}
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
          style={{ backgroundImage: `url("${card.image}")` }}
        />
      )}
      {/* Scrim keeps the label legible over any image */}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/35 to-ink/10 transition-opacity duration-500 group-hover:from-ink/90"
      />
      {/* Framed-board motif — the reference's connector line, in gold on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-3 border border-white/0 transition-colors duration-500 group-hover:border-gold/70"
      />
      <span className="absolute inset-0 flex items-center justify-center p-5 text-center">
        <span className="font-[family-name:var(--font-display)] text-[clamp(1.05rem,1.5vw,1.5rem)] leading-tight tracking-[0.01em] text-paper uppercase italic drop-shadow-[0_2px_14px_rgba(0,0,0,0.65)] transition-colors duration-500 group-hover:text-gold">
          {card.label}
        </span>
      </span>
    </Link>
  );
}

export function ProductCategoriesShowcase({ cards }: { cards: CategoryCard[] }) {
  if (cards.length < 6) return null;
  return (
    <section className="bg-plum-900 py-24">
      <div className="mx-auto max-w-[1440px] px-[4vw]">
        <div className="grid gap-5 lg:grid-cols-3 lg:items-start">
          {/* Column 1 — heading + two cards */}
          <div className="flex flex-col gap-5">
            <div>
              <p className="eyebrow mb-4 text-gold">The catalogue</p>
              <h2 className="font-[family-name:var(--font-display)] text-[clamp(2.25rem,3.6vw,3.25rem)] leading-[0.92] text-paper">
                Product
                <span className="block">Categories</span>
              </h2>
              <p className="mt-5 text-[0.75rem] leading-relaxed tracking-[0.05em] text-neutral-400 uppercase">
                Beyond Lace&apos;s line grows every week — new textures, colours and constructions
                across wigs, closures, frontals, bundles and extensions. One catalogue for the whole
                business.
              </p>
            </div>
            <Card card={cards[0]} className="aspect-[4/5]" />
            <Card card={cards[3]} className="aspect-[5/4]" />
          </div>

          {/* Column 2 — tall hero + one card */}
          <div className="flex flex-col gap-5">
            <Card card={cards[1]} className="aspect-[4/5] lg:aspect-[3/4.4]" />
            <Card card={cards[4]} className="aspect-[5/4]" />
          </div>

          {/* Column 3 — two cards + the manufacturer blurb */}
          <div className="flex flex-col gap-5">
            <Card card={cards[2]} className="aspect-[5/4]" />
            <Card card={cards[5]} className="aspect-[4/5]" />
            <div className="flex flex-col gap-5 border-t border-gold/25 pt-6">
              <p className="text-[0.875rem] leading-relaxed text-neutral-400">
                Beyond Lace — a decade sourcing single-donor virgin hair from Xuchang. We help
                partners build their own brand, from first trial to a full shelf.
              </p>
              <Link
                href="#catalog"
                className="inline-flex items-center gap-2 self-start rounded-full bg-gold px-6 py-3 text-[0.75rem] font-medium tracking-[0.12em] text-ink uppercase transition-all duration-300 hover:gap-3 hover:bg-paper"
              >
                View the catalogue
                <ArrowRight size={15} strokeWidth={2} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

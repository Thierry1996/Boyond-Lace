import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { type Product } from "@/lib/commerce";
import { ProductImage } from "@/components/ui/ProductImage";
import { WholesaleTile } from "./WholesaleTile";

/**
 * A wholesale category section — a banner (title + hero, "View more") over a
 * compact tile grid, cloned in layout from the reference categories and rendered
 * in the Beyond Lace system. `flip` mirrors the banner so alternating rows read
 * like the reference. Products come pre-filtered to the wholesale channel.
 */
export function WholesaleCategoryRow({
  title,
  subtitle,
  href,
  heroImage,
  products,
  flip = false,
}: {
  title: string;
  subtitle?: string;
  href: string;
  heroImage?: string;
  products: Product[];
  flip?: boolean;
}) {
  if (!products.length) return null;
  return (
    <section className="border-t border-white/[0.06] py-14">
      <div className="mx-auto max-w-[1440px] px-[4vw]">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-xl bg-plum-800">
          {/* diagonal accents echoing the reference */}
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.12]" style={{ backgroundImage: "repeating-linear-gradient(115deg, transparent 0 60px, var(--color-gold) 60px 62px)" }} />
          <div className={`relative flex flex-col items-center gap-6 p-6 sm:p-8 md:flex-row md:gap-10 ${flip ? "md:flex-row-reverse" : ""}`}>
            <div className="flex-1">
              <p className="eyebrow mb-3 text-gold/80">Professional wig manufacturer</p>
              <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,3.2vw,2.75rem)] leading-[0.98] text-paper uppercase">
                {title}
              </h2>
              {subtitle && <p className="mt-3 max-w-sm text-[0.875rem] leading-relaxed text-blush-200/70">{subtitle}</p>}
              <Link
                href={href}
                className="mt-6 inline-flex items-center gap-2 text-[0.8125rem] tracking-[0.12em] text-gold uppercase underline-offset-4 transition-all hover:gap-3 hover:underline"
              >
                View more <ArrowRight size={15} strokeWidth={2} />
              </Link>
            </div>
            <div className="w-full max-w-sm shrink-0 overflow-hidden rounded-lg md:w-[42%]">
              <ProductImage src={heroImage ?? products[0]?.images[0]?.src ?? "aurora"} alt={title} ratio="16 / 10" />
            </div>
          </div>
        </div>

        {/* Compact tile grid */}
        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 lg:grid-cols-4">
          {products.slice(0, 8).map((p) => (
            <WholesaleTile key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

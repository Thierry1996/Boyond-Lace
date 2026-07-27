"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";
import { Money } from "@/components/ui/Money";

/**
 * Category-tabbed wholesale catalogue. Every trade-relevant SKU across the
 * build — wigs, extensions & bundles, crochet & braiding, accessories — is
 * pre-classified and priced server-side into plain items, so this component
 * only switches tabs and renders. Items carry their own href (wholesale PDP for
 * trade-priced units, retail PDP for accessories), which keeps the channels
 * honest and guarantees no dead links.
 *
 * A category with no SKUs yet renders a tasteful "expanding line" card rather
 * than an empty grid, so the catalogue stays flexible as the range grows.
 */

export interface CatalogItem {
  id: string;
  title: string;
  tagline: string;
  href: string;
  imgSrc: string;
  imgAlt: string;
  priceUsd: number;
  pricePrefix?: string;
  unitLabel?: string;
  badge?: string;
}

export interface CatalogCategory {
  key: string;
  label: string;
  items: CatalogItem[];
}

export function WholesaleCatalog({ categories }: { categories: CatalogCategory[] }) {
  const [active, setActive] = useState(categories[0]?.key ?? "");
  const current = categories.find((c) => c.key === active) ?? categories[0];

  return (
    <div>
      {/* Tabs */}
      <div className="flex flex-wrap gap-x-8 gap-y-3 border-b border-white/[0.1]">
        {categories.map((cat) => {
          const on = cat.key === active;
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => setActive(cat.key)}
              aria-pressed={on}
              className={`relative -mb-px pb-4 text-[0.8125rem] tracking-[0.12em] uppercase transition-colors duration-300 ${
                on ? "text-gold" : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              {cat.label}
              <span className="ml-1.5 text-[0.6875rem] tabular-nums opacity-70">
                {cat.items.length}
              </span>
              {on && <span className="absolute inset-x-0 -bottom-px h-px bg-gold" />}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {current && current.items.length > 0 ? (
        <div className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {current.items.map((item) => (
            <Link key={item.id} href={item.href} className="group block">
              <div className="relative overflow-hidden rounded-lg bg-plum-900">
                <ProductImage
                  src={item.imgSrc}
                  alt={item.imgAlt}
                  className="transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07]"
                />
                {item.badge && (
                  <span className="absolute top-4 left-4 z-[2] border border-gold/40 bg-ink/70 px-2.5 py-1 text-[0.625rem] tracking-[0.14em] text-gold uppercase backdrop-blur-sm">
                    {item.badge}
                  </span>
                )}
              </div>
              <div className="pt-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-[1.0625rem] text-paper transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:text-gold">
                    {item.title}
                  </h3>
                  <ArrowUpRight
                    size={15}
                    strokeWidth={1.5}
                    aria-hidden="true"
                    className="mt-1 shrink-0 -translate-x-1.5 translate-y-1.5 text-gold opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
                  />
                </div>
                <p className="mt-1 text-[0.8125rem] leading-snug text-neutral-400">
                  {item.tagline}
                </p>
                <div className="mt-3 flex items-baseline gap-2">
                  {item.pricePrefix && (
                    <span className="text-[0.75rem] text-neutral-400">{item.pricePrefix}</span>
                  )}
                  <Money usd={item.priceUsd} className="text-[0.9375rem] text-paper tabular-nums" />
                  {item.unitLabel && (
                    <span className="text-[0.75rem] text-neutral-400">{item.unitLabel}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-12 border border-gold/25 p-10 text-center">
          <p className="eyebrow mb-3 text-gold">Expanding line</p>
          <h3 className="mx-auto max-w-xl text-[clamp(1.25rem,2.5vw,1.75rem)] leading-tight text-paper">
            {current?.label} joins the trade catalogue as the range grows.
          </h3>
          <p className="mx-auto mt-4 max-w-md text-[0.9375rem] leading-relaxed text-neutral-400">
            Already sourcing this category? Tell us on your application and we&apos;ll scope it with
            your account manager — early partners shape what we stock next.
          </p>
          <Link
            href="#apply"
            className="mt-7 inline-flex items-center gap-2 border-b border-gold pb-1 text-[0.8125rem] tracking-[0.1em] text-gold uppercase transition-colors hover:text-paper"
          >
            Request early access
            <ArrowRight size={15} strokeWidth={1.75} />
          </Link>
        </div>
      )}

      <div className="mt-12 flex justify-center">
        <Link
          href="/wholesale/catalog"
          className="inline-flex items-center gap-2 border-b border-gold pb-1 text-[0.8125rem] tracking-[0.1em] text-gold uppercase transition-colors hover:text-paper"
        >
          See the full wholesale catalogue
          <ArrowRight size={15} strokeWidth={1.75} />
        </Link>
      </div>
    </div>
  );
}

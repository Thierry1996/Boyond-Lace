"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/lib/commerce";
import { WholesaleProductCard } from "./WholesaleProductCard";

/**
 * Wholesale catalogue preview — a texture-filtered taste of the trade range that
 * links through to the full listing at /wholesale/catalog. The tabs read the
 * textures actually present in the passed units, so a tab never renders empty.
 */

const TEXTURE_LABELS: Record<string, string> = {
  "body-wave": "Body Wave",
  straight: "Straight",
  "deep-wave": "Deep Wave",
  "kinky-straight": "Kinky Straight",
  "kinky-curly": "Kinky Curly",
  "jerry-curl": "Jerry Curl",
};

function labelFor(texture: string): string {
  return (
    TEXTURE_LABELS[texture] ??
    texture.replace(/(^|-)(\w)/g, (_, sep, c) => (sep ? " " : "") + c.toUpperCase())
  );
}

export function WholesaleCatalogPreview({ products }: { products: Product[] }) {
  const textures = useMemo(() => {
    const seen = new Map<string, number>();
    for (const p of products) {
      if (!p.texture) continue;
      seen.set(p.texture, (seen.get(p.texture) ?? 0) + 1);
    }
    return [...seen.keys()];
  }, [products]);

  const [active, setActive] = useState<string>("all");

  const shown = useMemo(() => {
    const list = active === "all" ? products : products.filter((p) => p.texture === active);
    return list.slice(0, 8);
  }, [products, active]);

  return (
    <div>
      {/* Texture tabs */}
      <div className="flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={() => setActive("all")}
          aria-pressed={active === "all"}
          className={`rounded-full border px-4 py-2 text-[0.8125rem] transition-colors duration-300 ${
            active === "all"
              ? "border-gold text-gold"
              : "border-white/15 text-neutral-400 hover:border-white/40 hover:text-neutral-200"
          }`}
        >
          All textures
          <span className="ml-1.5 text-[0.6875rem] tabular-nums opacity-70">{products.length}</span>
        </button>
        {textures.map((t) => {
          const count = products.filter((p) => p.texture === t).length;
          const on = active === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setActive(t)}
              aria-pressed={on}
              className={`rounded-full border px-4 py-2 text-[0.8125rem] transition-colors duration-300 ${
                on
                  ? "border-gold text-gold"
                  : "border-white/15 text-neutral-400 hover:border-white/40 hover:text-neutral-200"
              }`}
            >
              {labelFor(t)}
              <span className="ml-1.5 text-[0.6875rem] tabular-nums opacity-70">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Cards */}
      <div className="mt-10 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {shown.map((p) => (
          <WholesaleProductCard key={p.id} product={p} />
        ))}
      </div>

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

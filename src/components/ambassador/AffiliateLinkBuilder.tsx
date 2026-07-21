"use client";

import { useMemo, useState } from "react";
import { Copy, Check, Link2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@/lib/commerce";
import { PROMOTABLE_CATEGORIES, commissionOn } from "@/lib/ambassador";
import { Money } from "@/components/ui/Money";

/**
 * Affiliate link generator. Builds a shareable URL carrying the ambassador's
 * referral code against any storefront destination, and shows the commission
 * that destination pays before the link is even created.
 */

// Populated from the signed-in ambassador record once approvals are live.
const REFERRAL_CODE = "BL-DEMO24";
const ORIGIN = "https://beyondlace.com";

interface GeneratedLink {
  label: string;
  url: string;
  commission?: number;
}

export function AffiliateLinkBuilder() {
  const [copied, setCopied] = useState<string | null>(null);
  const [customPath, setCustomPath] = useState("");

  const { data: products = [] } = useQuery({
    queryKey: ["ambassador-catalog"],
    queryFn: async (): Promise<Product[]> => {
      const res = await fetch("/api/products?limit=50");
      const json = await res.json();
      return json.products ?? [];
    },
    staleTime: 60_000,
  });

  const links = useMemo<GeneratedLink[]>(() => {
    const categoryLinks = PROMOTABLE_CATEGORIES.map((c) => ({
      label: c.name,
      url: `${ORIGIN}${c.href}${c.href.includes("?") ? "&" : "?"}ref=${REFERRAL_CODE}`,
    }));

    const topProducts = products
      .filter((p) => p.price > 0)
      .sort((a, b) => b.reviewCount - a.reviewCount)
      .slice(0, 6)
      .map((p) => {
        const category = PROMOTABLE_CATEGORIES.find((c) => c.lines.includes(p.line));
        return {
          label: p.title,
          url: `${ORIGIN}/product/${p.slug}?ref=${REFERRAL_CODE}`,
          commission: commissionOn(p.price, category?.baseCommissionBps ?? 1500),
        };
      });

    return [...categoryLinks, ...topProducts];
  }, [products]);

  async function copy(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // Clipboard blocked — the URL is selectable on screen regardless.
    }
  }

  const customUrl = customPath
    ? `${ORIGIN}${customPath.startsWith("/") ? "" : "/"}${customPath}${
        customPath.includes("?") ? "&" : "?"
      }ref=${REFERRAL_CODE}`
    : "";

  return (
    <div className="space-y-10">
      {/* Referral code */}
      <div className="rounded-xl border border-gold/30 bg-plum-900/50 p-6">
        <p className="eyebrow mb-2 text-gold">Your referral code</p>
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-[family-name:var(--font-display)] text-3xl text-paper tabular-nums">
            {REFERRAL_CODE}
          </span>
          <button
            onClick={() => copy(REFERRAL_CODE)}
            className="flex items-center gap-1.5 rounded-full border border-gold/50 px-4 py-1.5 text-[0.6875rem] tracking-[0.1em] text-gold uppercase transition-colors hover:bg-gold hover:text-ink"
          >
            {copied === REFERRAL_CODE ? <Check size={12} /> : <Copy size={12} />}
            {copied === REFERRAL_CODE ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* Custom builder */}
      <div>
        <p className="eyebrow mb-3 text-gold">Build a custom link</p>
        <div className="flex flex-wrap gap-3">
          <input
            value={customPath}
            onChange={(e) => setCustomPath(e.target.value)}
            placeholder="/shop?texture=curly"
            className="min-w-[16rem] flex-1 border border-white/15 bg-transparent px-4 py-3 text-[0.875rem] text-paper placeholder:text-neutral-400/50 focus:border-gold focus:outline-none"
          />
          <button
            onClick={() => customUrl && copy(customUrl)}
            disabled={!customUrl}
            className="flex items-center gap-2 border border-gold px-6 py-3 text-[0.75rem] tracking-[0.12em] text-gold uppercase transition-all duration-300 hover:bg-gold hover:text-ink disabled:opacity-40"
          >
            <Link2 size={13} strokeWidth={1.75} />
            {copied === customUrl ? "Copied" : "Copy link"}
          </button>
        </div>
        {customUrl && (
          <p className="mt-3 truncate font-mono text-[0.75rem] text-neutral-400">{customUrl}</p>
        )}
      </div>

      {/* Ready-made */}
      <div>
        <p className="eyebrow mb-4 text-gold">Ready-made links</p>
        <div className="divide-y divide-white/[0.07] border-t border-white/[0.07]">
          {links.map((l) => (
            <div
              key={l.url}
              className="flex flex-wrap items-center justify-between gap-4 py-4 transition-colors duration-300 hover:bg-white/[0.02]"
            >
              <div className="min-w-0 flex-1">
                <p className="text-[0.9375rem] text-paper">{l.label}</p>
                <p className="truncate font-mono text-[0.6875rem] text-neutral-400">{l.url}</p>
              </div>
              <div className="flex items-center gap-4">
                {l.commission != null && (
                  <span className="text-[0.75rem] text-gold tabular-nums">
                    +<Money usd={l.commission} />
                  </span>
                )}
                <button
                  onClick={() => copy(l.url)}
                  aria-label={`Copy link for ${l.label}`}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-neutral-400 transition-colors duration-300 hover:border-gold hover:text-gold"
                >
                  {copied === l.url ? <Check size={13} /> : <Copy size={13} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

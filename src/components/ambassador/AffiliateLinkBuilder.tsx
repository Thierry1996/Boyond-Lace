"use client";

import { useMemo, useState } from "react";
import { Copy, Check, Save } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@/lib/commerce";
import { PROMOTABLE_CATEGORIES, commissionOn } from "@/lib/ambassador";
import { Money } from "@/components/ui/Money";

/**
 * Affiliate link generator. Builds shareable URLs carrying the ambassador's own
 * referral code, shows the commission a destination pays, and — for custom
 * links — saves them to the ambassador's record (each gets a unique tracking
 * code) so clicks and conversions can be attributed.
 */

const ORIGIN = "https://beyondlace.com";

export interface SavedLink {
  id: string;
  label: string;
  code: string;
  targetPath: string;
  clicks: number;
  conversions: number;
}

interface ReadyLink {
  label: string;
  url: string;
  commission?: number;
}

export function AffiliateLinkBuilder({
  referralCode,
  initialLinks = [],
}: {
  referralCode: string;
  initialLinks?: SavedLink[];
}) {
  const [copied, setCopied] = useState<string | null>(null);
  const [label, setLabel] = useState("");
  const [customPath, setCustomPath] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<SavedLink[]>(initialLinks);

  const { data: products = [] } = useQuery({
    queryKey: ["ambassador-catalog"],
    queryFn: async (): Promise<Product[]> => {
      const res = await fetch("/api/products?limit=50");
      const json = await res.json();
      return json.products ?? [];
    },
    staleTime: 60_000,
  });

  const readyLinks = useMemo<ReadyLink[]>(() => {
    const categoryLinks = PROMOTABLE_CATEGORIES.map((c) => ({
      label: c.name,
      url: `${ORIGIN}${c.href}${c.href.includes("?") ? "&" : "?"}ref=${referralCode}`,
    }));
    const topProducts = products
      .filter((p) => p.price > 0)
      .sort((a, b) => b.reviewCount - a.reviewCount)
      .slice(0, 6)
      .map((p) => {
        const category = PROMOTABLE_CATEGORIES.find((c) => c.lines.includes(p.line));
        return {
          label: p.title,
          url: `${ORIGIN}/product/${p.slug}?ref=${referralCode}`,
          commission: commissionOn(p.price, category?.baseCommissionBps ?? 1500),
        };
      });
    return [...categoryLinks, ...topProducts];
  }, [products, referralCode]);

  async function copy(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      /* clipboard blocked — URL is on screen regardless */
    }
  }

  const linkUrl = (l: SavedLink) => `${ORIGIN}${l.targetPath}?ref=${l.code}`;

  async function saveLink() {
    if (!label.trim() || !customPath.trim() || saving) return;
    setSaving(true);
    try {
      const res = await fetch("/api/ambassador/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: label.trim(), targetPath: customPath.trim() }),
      });
      const json = await res.json();
      if (res.ok && json.link) {
        setSaved((s) => [json.link, ...s]);
        setLabel("");
        setCustomPath("");
        copy(linkUrl(json.link));
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-10">
      {/* Referral code */}
      <div className="rounded-xl border border-gold/30 bg-plum-900/50 p-6">
        <p className="eyebrow mb-2 text-gold">Your referral code</p>
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-[family-name:var(--font-display)] text-3xl text-paper tabular-nums">
            {referralCode}
          </span>
          <button
            onClick={() => copy(referralCode)}
            className="flex items-center gap-1.5 rounded-full border border-gold/50 px-4 py-1.5 text-[0.6875rem] tracking-[0.1em] text-gold uppercase transition-colors hover:bg-gold hover:text-ink"
          >
            {copied === referralCode ? <Check size={12} /> : <Copy size={12} />}
            {copied === referralCode ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* Custom builder — saves to your record */}
      <div>
        <p className="eyebrow mb-3 text-gold">Build &amp; save a tracked link</p>
        <div className="grid gap-3 sm:grid-cols-[1fr_1.4fr_auto]">
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Label (e.g. TikTok bio)"
            className="border border-white/15 bg-transparent px-4 py-3 text-[0.875rem] text-paper placeholder:text-neutral-400/50 focus:border-gold focus:outline-none"
          />
          <input
            value={customPath}
            onChange={(e) => setCustomPath(e.target.value)}
            placeholder="/shop?texture=curly"
            className="border border-white/15 bg-transparent px-4 py-3 text-[0.875rem] text-paper placeholder:text-neutral-400/50 focus:border-gold focus:outline-none"
          />
          <button
            onClick={saveLink}
            disabled={!label.trim() || !customPath.trim() || saving}
            className="flex items-center justify-center gap-2 border border-gold px-6 py-3 text-[0.75rem] tracking-[0.12em] text-gold uppercase transition-all duration-300 hover:bg-gold hover:text-ink disabled:opacity-40"
          >
            <Save size={13} strokeWidth={1.75} />
            {saving ? "Saving…" : "Save & copy"}
          </button>
        </div>
      </div>

      {/* Saved links */}
      {saved.length > 0 && (
        <div>
          <p className="eyebrow mb-4 text-gold">Your saved links</p>
          <div className="divide-y divide-white/[0.07] border-t border-white/[0.07]">
            {saved.map((l) => (
              <div
                key={l.id}
                className="flex flex-wrap items-center justify-between gap-4 py-4 transition-colors duration-300 hover:bg-white/[0.02]"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[0.9375rem] text-paper">{l.label}</p>
                  <p className="truncate font-mono text-[0.6875rem] text-neutral-400">
                    {linkUrl(l)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[0.6875rem] text-neutral-400 tabular-nums">
                    {l.clicks} clicks · {l.conversions} sales
                  </span>
                  <button
                    onClick={() => copy(linkUrl(l))}
                    aria-label={`Copy link for ${l.label}`}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-neutral-400 transition-colors duration-300 hover:border-gold hover:text-gold"
                  >
                    {copied === linkUrl(l) ? <Check size={13} /> : <Copy size={13} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ready-made */}
      <div>
        <p className="eyebrow mb-4 text-gold">Ready-made links</p>
        <div className="divide-y divide-white/[0.07] border-t border-white/[0.07]">
          {readyLinks.map((l) => (
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

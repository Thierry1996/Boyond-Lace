"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";
import { WhatsAppGlyph, PinterestGlyph } from "@/components/brand/SocialIcons";

/**
 * Share row. Opens the platform's share intent with the live article URL, so
 * readers can push the post out to external networks (WhatsApp, Facebook, X,
 * Pinterest) or copy the link.
 */
export function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const url = () => (typeof window !== "undefined" ? window.location.href : "");

  const open = (href: string) =>
    window.open(href, "_blank", "noopener,noreferrer,width=600,height=520");

  const enc = (s: string) => encodeURIComponent(s);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — no-op */
    }
  }

  const btn =
    "flex h-10 w-10 items-center justify-center rounded-full text-white transition-transform duration-300 hover:-translate-y-0.5 active:scale-95";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-[0.8125rem] font-semibold text-plum-900">Share this article:</span>
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          aria-label="Share on WhatsApp"
          onClick={() => open(`https://wa.me/?text=${enc(`${title} ${url()}`)}`)}
          className={`${btn} bg-[#25D366]`}
        >
          <WhatsAppGlyph size={17} className="text-white" />
        </button>
        <button
          type="button"
          aria-label="Share on Facebook"
          onClick={() => open(`https://www.facebook.com/sharer/sharer.php?u=${enc(url())}`)}
          className={`${btn} bg-[#1877F2] font-semibold`}
        >
          f
        </button>
        <button
          type="button"
          aria-label="Share on X"
          onClick={() => open(`https://twitter.com/intent/tweet?url=${enc(url())}&text=${enc(title)}`)}
          className={`${btn} bg-black text-[0.8125rem] font-bold`}
        >
          X
        </button>
        <button
          type="button"
          aria-label="Share on Pinterest"
          onClick={() =>
            open(`https://pinterest.com/pin/create/button/?url=${enc(url())}&description=${enc(title)}`)
          }
          className={`${btn} bg-[#E60023]`}
        >
          <PinterestGlyph size={17} className="text-white" />
        </button>
        <button
          type="button"
          aria-label="Copy link"
          onClick={copy}
          className={`${btn} bg-plum-700`}
        >
          {copied ? <Check size={16} strokeWidth={2} /> : <Link2 size={16} strokeWidth={1.75} />}
        </button>
      </div>
    </div>
  );
}

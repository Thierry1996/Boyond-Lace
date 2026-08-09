"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { Megaphone, Copy, Check, X, ExternalLink } from "lucide-react";
import type { Product } from "@/lib/commerce";

/**
 * "Promote" — the ambassador's one-tap action to push a product into their
 * account and get a trackable sales link.
 *
 * Previously this was just a link to the product page (it behaved like a browse
 * button). Now it POSTs to /api/ambassador/links, which persists an AffiliateLink
 * under the signed-in ambassador (so it appears in their dashboard) with a unique
 * tracking code. We surface the shareable `?ref=CODE` URL with copy + one-tap
 * social shares. Every click and sale on that link is attributed back to the
 * ambassador, so admins can confirm which creator sourced a sold unit.
 */

type LinkResult = { code: string; targetPath: string; label: string };

export function PromoteButton({
  product,
  className = "",
  children,
}: {
  product: Pick<Product, "slug" | "title">;
  className?: string;
  children?: React.ReactNode;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [link, setLink] = useState<LinkResult | null>(null);
  const [copied, setCopied] = useState(false);

  const shareUrl = link
    ? `${typeof window !== "undefined" ? window.location.origin : "https://beyondlace.com"}${link.targetPath}?ref=${link.code}`
    : "";

  async function promote() {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/ambassador/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: product.title, targetPath: `/product/${product.slug}` }),
      });
      if (res.status === 401) {
        setError("Sign in to your ambassador account to promote this product.");
        return;
      }
      const json = await res.json();
      if (res.ok && json.link) {
        setLink(json.link as LinkResult);
      } else {
        setError(json.error ?? "Could not create your link. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* URL is on screen regardless */
    }
  }

  const shareText = encodeURIComponent(`${product.title} — shop it here:`);
  const encUrl = encodeURIComponent(shareUrl);

  return (
    <>
      <button
        type="button"
        onClick={promote}
        disabled={busy}
        aria-label={`Promote ${product.title}`}
        className={className}
      >
        <Megaphone size={12} strokeWidth={1.75} />
        {children ?? (busy ? "Creating…" : "Promote")}
      </button>

      {(link || error) &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[95] flex items-center justify-center bg-ink/80 p-[5vw] backdrop-blur-sm"
            style={{ animation: "blFade 250ms var(--ease-editorial)" }}
            onClick={() => {
              setLink(null);
              setError(null);
            }}
          >
            <div
              role="dialog"
              aria-label="Share your promotion link"
              className="relative w-full max-w-md rounded-2xl border border-gold/30 bg-neutral-900 p-7"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  setLink(null);
                  setError(null);
                }}
                aria-label="Close"
                className="absolute top-4 right-4 text-neutral-400 transition-colors hover:text-gold"
              >
                <X size={18} />
              </button>

              {error ? (
                <>
                  <p className="eyebrow text-gold">Promote</p>
                  <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl text-paper">
                    {error}
                  </h3>
                  <a
                    href="/ambassadors/apply"
                    className="mt-5 inline-flex items-center gap-1.5 border-b border-gold pb-0.5 text-[0.75rem] tracking-[0.1em] text-gold uppercase"
                  >
                    Become an ambassador
                  </a>
                </>
              ) : (
                <>
                  <p className="eyebrow text-gold">Added to your account · trackable link</p>
                  <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl text-paper">
                    Share &amp; earn on {product.title}
                  </h3>
                  <p className="mt-1 text-[0.8125rem] text-neutral-400">
                    Every click and sale on this link is credited to you.
                  </p>

                  <div className="mt-5 flex items-center gap-2 rounded-lg border border-white/15 bg-black/30 p-2">
                    <span className="min-w-0 flex-1 truncate px-2 font-mono text-[0.75rem] text-neutral-200">
                      {shareUrl}
                    </span>
                    <button
                      onClick={copy}
                      className="flex shrink-0 items-center gap-1.5 rounded-md bg-gold px-3 py-2 text-[0.6875rem] font-semibold tracking-[0.1em] text-ink uppercase"
                    >
                      {copied ? <Check size={13} /> : <Copy size={13} />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {[
                      { name: "WhatsApp", href: `https://wa.me/?text=${shareText}%20${encUrl}` },
                      {
                        name: "X",
                        href: `https://twitter.com/intent/tweet?text=${shareText}&url=${encUrl}`,
                      },
                      {
                        name: "Facebook",
                        href: `https://www.facebook.com/sharer/sharer.php?u=${encUrl}`,
                      },
                      {
                        name: "Pinterest",
                        href: `https://pinterest.com/pin/create/button/?url=${encUrl}&description=${shareText}`,
                      },
                    ].map((s) => (
                      <a
                        key={s.name}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-2 text-[0.6875rem] tracking-[0.08em] text-neutral-200 uppercase transition-colors hover:border-gold hover:text-gold"
                      >
                        {s.name}
                        <ExternalLink size={11} strokeWidth={1.75} />
                      </a>
                    ))}
                  </div>

                  <a
                    href="/ambassadors/dashboard/links"
                    className="mt-6 inline-block text-[0.75rem] tracking-[0.1em] text-gold uppercase underline-offset-4 hover:underline"
                  >
                    Manage all links in your dashboard →
                  </a>
                </>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

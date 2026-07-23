"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { type Product, deriveVariations } from "@/lib/commerce";
import { useCart } from "@/lib/stores/cart";
import { useWishlist } from "@/lib/stores/wishlist";
import { Money } from "@/components/ui/Money";
import { Heart } from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";

export function ProductPurchase({ product }: { product: Product }) {
  const { add } = useCart();
  const wishlist = useWishlist();
  const saved = wishlist.hydrated && wishlist.slugs.includes(product.slug);

  // The sticky bar appears once the inline buy button scrolls out of view, so
  // the price and the action stay reachable through the long PDP below.
  const atcRef = useRef<HTMLButtonElement>(null);
  const [showSticky, setShowSticky] = useState(false);
  // Portalled to <body>: the Reveal wrapper around this component keeps a
  // transform, which would make a `fixed` child resolve against it instead of
  // the viewport. Mount-gated so SSR and first client paint agree.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const el = atcRef.current;
    if (!el) return;
    // Show only once the inline button has scrolled ABOVE the viewport — i.e.
    // the shopper has moved past the buy area into the content below. A button
    // still below the fold on load keeps the bar hidden.
    const io = new IntersectionObserver(
      ([entry]) => setShowSticky(entry.boundingClientRect.top < 0),
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const [selections, setSelections] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      product.options.map((opt) => [
        opt.name,
        opt.values.find((v) => v.available !== false)?.value ?? opt.values[0]?.value ?? "",
      ]),
    ),
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  /** Base price plus every selected option's delta. */
  const unitPrice = useMemo(() => {
    return product.options.reduce((total, opt) => {
      const chosen = opt.values.find((v) => v.value === selections[opt.name]);
      return total + (chosen?.priceDelta ?? 0);
    }, product.price);
  }, [product, selections]);

  const isApplication = product.price === 0;

  // Normalise every listing onto the same five axes so the storefront reads
  // consistently: fixed attributes become chips, priced ranges stay interactive,
  // and colour always carries a swatch.
  const { options, attributes } = useMemo(() => deriveVariations(product), [product]);

  function handleAdd() {
    // Store display labels, not raw values — the cart renders these verbatim
    // and "Shade: platinum" is not a sentence this brand writes.
    const labelled = Object.fromEntries(
      product.options.map((opt) => [
        opt.name,
        opt.values.find((v) => v.value === selections[opt.name])?.label ?? selections[opt.name],
      ]),
    );

    add({
      productId: product.id,
      slug: product.slug,
      title: product.title,
      selections: labelled,
      unitPrice,
      quantity,
      image: product.images[0].src,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2600);
  }

  if (isApplication) {
    return (
      <div className="border border-gold/30 p-8">
        <p className="eyebrow mb-3 text-gold">By application</p>
        <p className="text-[0.9375rem] leading-relaxed text-neutral-400">
          Beyond Lace Pro is not sold at retail. Tiered pricing is released after your salon or
          store is verified — this protects the margin of every partner already in the programme.
        </p>
        <Link
          href="/wholesale#apply"
          className="mt-6 inline-block w-full border border-gold px-8 py-4 text-center text-[0.8125rem] tracking-[0.14em] text-gold uppercase transition-all duration-500 hover:bg-gold hover:text-ink"
        >
          Apply as a partner
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-baseline gap-4">
        <Money
          usd={unitPrice}
          className="font-[family-name:var(--font-display)] text-3xl text-paper tabular-nums"
        />
        {product.compareAtPrice && (
          <Money
            usd={product.compareAtPrice}
            className="text-[0.9375rem] text-neutral-400 line-through tabular-nums"
          />
        )}
      </div>

      {/* Fixed axes the unit does not vary, shown so every listing presents the
          same anatomy — style, lace, colour, length, density — even when some
          are set. */}
      {attributes.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {attributes.map((attr) => (
            <span
              key={attr.axis}
              className="inline-flex items-center gap-2 border border-white/[0.12] px-3 py-1.5 text-[0.8125rem] text-neutral-200"
            >
              <span className="text-neutral-400">{attr.label}:</span>
              {attr.swatch && (
                <span
                  aria-hidden="true"
                  className="inline-block h-3.5 w-3.5 rounded-full border border-white/25"
                  style={{ background: attr.swatch }}
                />
              )}
              {attr.value}
            </span>
          ))}
        </div>
      )}

      {options.map((option) => {
        const isColor = option.axis === "color";
        return (
          <fieldset key={option.name} className="mt-9">
            <legend className="eyebrow mb-4">
              {option.name}
              <span className="ml-2 text-neutral-200 normal-case tracking-normal">
                {option.values.find((v) => v.value === selections[option.name])?.label}
              </span>
            </legend>
            <div className="flex flex-wrap gap-2.5">
              {option.values.map((value) => {
                const active = selections[option.name] === value.value;
                const disabled = value.available === false;

                // Colour renders as a swatch tile so the axis is scannable at a
                // glance; every other axis is a text pill.
                if (isColor && value.swatch) {
                  return (
                    <button
                      key={value.value}
                      type="button"
                      disabled={disabled}
                      aria-pressed={active}
                      aria-label={value.label}
                      title={value.label}
                      onClick={() =>
                        setSelections((prev) => ({ ...prev, [option.name]: value.value }))
                      }
                      className={`relative h-9 w-9 rounded-full border-2 transition-all duration-300 ${
                        disabled
                          ? "cursor-not-allowed opacity-30"
                          : active
                            ? "border-gold"
                            : "border-white/20 hover:border-white/50"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className="absolute inset-1 rounded-full"
                        style={{ background: value.swatch }}
                      />
                    </button>
                  );
                }

                return (
                  <button
                    key={value.value}
                    type="button"
                    disabled={disabled}
                    aria-pressed={active}
                    onClick={() =>
                      setSelections((prev) => ({ ...prev, [option.name]: value.value }))
                    }
                    className={`flex items-center gap-2 border px-4 py-2.5 text-[0.8125rem] transition-all duration-300 ${
                      disabled
                        ? "cursor-not-allowed border-white/[0.07] text-neutral-400/40 line-through"
                        : active
                          ? "border-gold text-gold"
                          : "border-white/15 text-neutral-200 hover:border-white/40"
                    }`}
                  >
                    {value.swatch && (
                      <span
                        aria-hidden="true"
                        className="inline-block h-3.5 w-3.5 rounded-full border border-white/20"
                        style={{ background: value.swatch }}
                      />
                    )}
                    {value.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        );
      })}

      <div className="mt-10 flex items-stretch gap-4">
        <div className="flex items-center border border-white/15">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-4 py-4 text-neutral-200 transition-colors hover:text-gold"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span
            className="w-8 text-center text-[0.9375rem] text-paper tabular-nums"
            aria-live="polite"
          >
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="px-4 py-4 text-neutral-200 transition-colors hover:text-gold"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <button
          ref={atcRef}
          type="button"
          onClick={handleAdd}
          disabled={!product.inStock}
          className="cta-primary flex-1 px-8 py-4 text-[0.8125rem] tracking-[0.14em] uppercase"
        >
          {!product.inStock ? "Join the waitlist" : added ? "Added ✓" : "Add to bag"}
        </button>

        <button
          type="button"
          onClick={() => wishlist.toggle(product.slug)}
          aria-pressed={saved}
          aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
          className={`flex items-center justify-center border px-4 transition-colors duration-300 ${
            saved
              ? "border-gold text-gold"
              : "border-white/15 text-neutral-400 hover:border-gold hover:text-gold"
          }`}
        >
          <Heart size={18} strokeWidth={1.5} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>

      {product.subscribable && (
        <p className="mt-4 text-[0.8125rem] text-neutral-400">
          Subscriptions pause, skip, or cancel from your account. No phone call, no retention
          script.
        </p>
      )}

      <div className="mt-8 space-y-2.5 border-t border-white/[0.07] pt-8">
        {[
          "Free worldwide shipping over $400",
          "30-day returns — Lace Test credit applied automatically",
          "Unbranded outer packaging available at checkout",
        ].map((line) => (
          <p key={line} className="flex items-start gap-3 text-[0.8125rem] text-neutral-400">
            <span className="mt-1.5 inline-block h-1 w-1 shrink-0 rotate-45 bg-gold" />
            {line}
          </p>
        ))}
      </div>

      {/* Sticky purchase bar. Slides up once the inline button leaves view and
          carries the same live price and action, so a shopper reading reviews,
          Q&A or the guarantees can still add to bag without scrolling back.
          Only for real retail units, not application-priced products. */}
      {mounted &&
        !isApplication &&
        createPortal(
          <div
            className={`dark-island fixed inset-x-0 bottom-0 z-[70] border-t border-gold/25 bg-neutral-900/95 backdrop-blur-md transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              showSticky ? "translate-y-0" : "translate-y-full"
            }`}
            aria-hidden={!showSticky}
          >
            <div className="mx-auto flex max-w-[1440px] items-center gap-4 px-[4vw] py-3">
              <span className="hidden w-12 shrink-0 sm:block">
                <ProductImage src={product.images[0].src} alt={product.title} ratio="1 / 1" />
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[0.875rem] text-paper">{product.title}</p>
                <p className="truncate text-[0.75rem] text-neutral-400">
                  {options
                    .map((o) => o.values.find((v) => v.value === selections[o.name])?.label)
                    .filter(Boolean)
                    .join(" · ") || product.tagline}
                </p>
              </div>

              <div className="hidden text-right sm:block">
                <Money usd={unitPrice} className="text-[1.0625rem] text-paper tabular-nums" />
                {product.compareAtPrice && product.compareAtPrice > unitPrice && (
                  <span className="ml-2 text-[0.75rem] text-gold">
                    save <Money usd={product.compareAtPrice - unitPrice} />
                  </span>
                )}
              </div>

              {/* Compact quantity, so the sticky bar is a full mini-purchase. */}
              <div className="hidden items-center border border-white/15 md:flex">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2.5 text-neutral-200 transition-colors hover:text-gold"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-7 text-center text-[0.8125rem] text-paper tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-2.5 text-neutral-200 transition-colors hover:text-gold"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                disabled={!product.inStock}
                // Not focusable while hidden, so keyboard users never land on an
                // off-screen control.
                tabIndex={showSticky ? 0 : -1}
                className="cta-primary shrink-0 px-6 py-3.5 text-[0.75rem] tracking-[0.14em] uppercase sm:px-9"
              >
                {!product.inStock ? "Join the waitlist" : added ? "Added ✓" : "Add to bag"}
              </button>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

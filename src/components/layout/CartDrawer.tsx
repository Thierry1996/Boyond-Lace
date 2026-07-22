"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, Trash2 } from "lucide-react";
import { useCart } from "@/lib/stores/cart";
import { Money } from "@/components/ui/Money";
import { ProductImage } from "@/components/ui/ProductImage";

/**
 * Cart drawer.
 *
 * Slides in from the right when a unit is added or the bag icon is pressed, and
 * back out on close — the store already flips `isOpen` inside `add`, so adding
 * to bag opens this without any extra wiring. Rendered once, globally, from the
 * root layout.
 *
 * The panel is always mounted so both the enter and the exit are animated; a
 * conditionally-mounted drawer can only animate its entrance. `translate-x`
 * drives the slide and the backdrop cross-fades with it. While closed the whole
 * thing is `pointer-events-none` and `aria-hidden`, so it never intercepts
 * clicks or reaches the tab order.
 */
export function CartDrawer() {
  const router = useRouter();
  const { lines, subtotal, count, setQuantity, remove, isOpen, setOpen, hydrated } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Esc closes; body scroll locks while open so the page behind stays put.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Move focus into the drawer for keyboard and screen-reader users.
    closeRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, setOpen]);

  // Only the persisted store knows the real bag; render nothing meaningful until
  // it has rehydrated, so the count never flashes from 0.
  const showEmpty = hydrated && lines.length === 0;

  function goToCart() {
    setOpen(false);
    router.push("/cart");
  }
  function goToCheckout() {
    setOpen(false);
    router.push("/checkout");
  }

  return (
    <div
      className={`fixed inset-0 z-[100] ${isOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`absolute inset-0 bg-ink/60 backdrop-blur-[2px] transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel */}
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Your bag"
        className={`dark-island absolute inset-y-0 right-0 flex h-full w-full max-w-[30rem] flex-col border-l border-gold/20 bg-neutral-900 shadow-[-30px_0_80px_-24px_rgb(0_0_0/0.7)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-5">
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-paper">
            Your bag
            <span className="ml-2 align-middle text-[0.9375rem] text-neutral-400 tabular-nums">
              {hydrated ? count : 0}
            </span>
          </h2>
          <button
            ref={closeRef}
            onClick={() => setOpen(false)}
            aria-label="Close bag"
            className="grid size-9 place-items-center rounded-full text-neutral-400 transition-colors hover:bg-white/10 hover:text-gold"
          >
            <X size={18} strokeWidth={1.75} />
          </button>
        </div>

        {/* Lines */}
        {showEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <p className="font-[family-name:var(--font-display)] text-2xl text-paper">
              Your bag is empty.
            </p>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-neutral-400">
              If you are deciding between shades, start with The Lace Test — five dollars, credited
              back in full. It is the cheapest way to be certain before an $800 decision.
            </p>
            <Link
              href="/product/lace-test-kit"
              onClick={() => setOpen(false)}
              className="cta-secondary mt-8 px-8 py-3.5 text-[0.75rem] tracking-[0.14em] uppercase"
            >
              Order The Lace Test
            </Link>
            <Link
              href="/shop"
              onClick={() => setOpen(false)}
              className="mt-5 border-b border-white/25 pb-1 text-[0.75rem] tracking-[0.1em] text-neutral-200 uppercase transition-colors hover:border-gold hover:text-gold"
            >
              View the collection
            </Link>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-6">
            <ul className="divide-y divide-white/[0.07]">
              {lines.map((line) => (
                <li key={line.id} className="flex gap-4 py-6">
                  <Link
                    href={`/product/${line.slug}`}
                    onClick={() => setOpen(false)}
                    className="w-20 shrink-0"
                  >
                    <ProductImage src={line.image} alt={line.title} ratio="3 / 4" />
                  </Link>

                  <div className="flex flex-1 flex-col justify-between gap-3">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <Link
                          href={`/product/${line.slug}`}
                          onClick={() => setOpen(false)}
                          className="text-[0.9375rem] leading-snug text-paper transition-colors hover:text-blush-300"
                        >
                          {line.title}
                        </Link>
                        <Money
                          usd={line.unitPrice * line.quantity}
                          className="shrink-0 text-[0.875rem] text-paper tabular-nums"
                        />
                      </div>
                      {Object.keys(line.selections).length > 0 && (
                        <p className="mt-1.5 text-[0.75rem] text-neutral-400">
                          {Object.entries(line.selections)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join("  ·  ")}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center border border-white/15">
                        <button
                          onClick={() => setQuantity(line.id, line.quantity - 1)}
                          aria-label={`Decrease quantity of ${line.title}`}
                          className="px-2.5 py-1.5 text-neutral-200 transition-colors hover:text-gold"
                        >
                          −
                        </button>
                        <span className="w-7 text-center text-[0.8125rem] text-paper tabular-nums">
                          {line.quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(line.id, line.quantity + 1)}
                          aria-label={`Increase quantity of ${line.title}`}
                          className="px-2.5 py-1.5 text-neutral-200 transition-colors hover:text-gold"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => remove(line.id)}
                        aria-label={`Remove ${line.title}`}
                        className="grid size-8 place-items-center rounded-full text-neutral-400 transition-colors hover:bg-white/10 hover:text-blush-300"
                      >
                        <Trash2 size={15} strokeWidth={1.6} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer */}
        {!showEmpty && (
          <div className="border-t border-white/[0.08] px-6 py-6">
            <div className="flex items-center justify-between">
              <span className="text-[0.9375rem] text-neutral-400">Subtotal</span>
              <Money
                usd={subtotal}
                className="font-[family-name:var(--font-display)] text-2xl text-paper tabular-nums"
              />
            </div>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-neutral-400">
              Shipping and taxes are settled at checkout. Orders over $400 ship complimentary,
              worldwide, in unbranded packaging.
            </p>

            <button
              onClick={goToCheckout}
              className="cta-primary mt-6 w-full px-8 py-4 text-[0.8125rem] tracking-[0.14em] uppercase"
            >
              Checkout
            </button>
            <button
              onClick={goToCart}
              className="mt-3 w-full border border-white/15 px-8 py-3.5 text-[0.75rem] tracking-[0.14em] text-neutral-200 uppercase transition-colors hover:border-gold hover:text-gold"
            >
              View my bag
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, ChevronDown, X, Zap } from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";
import { Money } from "@/components/ui/Money";
import { useCart } from "@/lib/stores/cart";

/**
 * "Real Looks, Real Confidence" — four powerful UGC video impulse cards (image
 * 1). Each card plays the unit in action with the product bar over it and an
 * Add-To-Cart bar with a ▼ that opens the Quick View (image 2) — the same card,
 * expanded, with Size/Closure pickers. A Buy Now CTA shortens the path: it adds
 * the chosen variant and jumps straight to checkout. The rail auto-advances
 * every six seconds (spotlight card scales up, no distortion) with chevrons.
 */

export interface ShowcaseProduct {
  id: string;
  slug: string;
  title: string;
  image: string;
  price: number;
  compareAtPrice?: number;
  video?: string;
  options: { name: string; values: { label: string; value: string; priceDelta?: number }[] }[];
}

const VISIBLE = 4;
const DWELL = 6000;

function Media({ p, className = "" }: { p: ShowcaseProduct; className?: string }) {
  if (p.video) {
    return (
      <video
        src={p.video}
        autoPlay
        muted
        loop
        playsInline
        aria-label={p.title}
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }
  return <ProductImage src={p.image} alt={p.title} ratio="3 / 4" className={className} />;
}

/** Default (first-value) variant — used by the card's one-tap Add To Cart. */
function defaultVariant(p: ShowcaseProduct) {
  const labels: Record<string, string> = {};
  let delta = 0;
  for (const o of p.options) {
    const v = o.values[0];
    if (v) {
      labels[o.name] = v.label;
      delta += v.priceDelta ?? 0;
    }
  }
  return { labels, unitPrice: p.price + delta };
}

/* -------------------------------------------------- Quick view (image 2) --- */

export function QuickView({ product, onClose }: { product: ShowcaseProduct; onClose: () => void }) {
  const router = useRouter();
  const { add, setOpen: setCartOpen } = useCart();
  const [sel, setSel] = useState<Record<string, string>>(() =>
    Object.fromEntries(product.options.map((o) => [o.name, o.values[0]?.value ?? ""])),
  );

  const delta = product.options.reduce((sum, o) => {
    const v = o.values.find((x) => x.value === sel[o.name]);
    return sum + (v?.priceDelta ?? 0);
  }, 0);
  const unitPrice = product.price + delta;
  const labels = Object.fromEntries(
    product.options.map((o) => [
      o.name,
      o.values.find((x) => x.value === sel[o.name])?.label ?? "",
    ]),
  );

  function line() {
    return {
      productId: product.id,
      slug: product.slug,
      title: product.title,
      selections: labels,
      unitPrice,
      quantity: 1,
      image: product.image,
    };
  }
  function buyNow() {
    add(line());
    router.push("/checkout");
  }
  function addToCart() {
    add(line());
    setCartOpen(true);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-ink/60 backdrop-blur-[2px]"
      />
      <div
        role="dialog"
        aria-label={product.title}
        className="relative grid max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-[0_30px_90px_-24px_rgba(0,0,0,0.7)] sm:grid-cols-2"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 grid size-9 place-items-center rounded-full bg-white/80 text-plum-900 transition-colors hover:bg-plum-900 hover:text-white"
        >
          <X size={18} strokeWidth={1.75} />
        </button>

        <div className="relative min-h-[280px] bg-plum-900">
          <Media p={product} />
        </div>

        <div className="flex flex-col overflow-y-auto p-6 sm:p-8">
          <h2 className="font-[family-name:var(--font-display)] text-2xl leading-tight text-plum-900">
            {product.title}
          </h2>

          {/* Product row */}
          <div className="mt-4 flex items-center gap-3 border-b border-plum-900/10 pb-4">
            <span className="h-14 w-14 shrink-0 overflow-hidden rounded-lg">
              <ProductImage src={product.image} alt={product.title} ratio="1 / 1" />
            </span>
            <div>
              <p className="text-[0.875rem] font-medium text-plum-900">{product.title}</p>
              <div className="mt-0.5 flex items-baseline gap-2">
                <Money usd={unitPrice} className="text-[0.9375rem] font-bold text-plum-700" />
                {product.compareAtPrice && (
                  <Money
                    usd={product.compareAtPrice}
                    className="text-[0.75rem] text-plum-900/40 line-through"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {product.options.map((o) => (
              <label key={o.name} className="block">
                <span className="mb-1.5 block text-[0.6875rem] font-semibold tracking-[0.1em] text-plum-900/60 uppercase">
                  {o.name}
                </span>
                <select
                  value={sel[o.name]}
                  onChange={(e) => setSel((s) => ({ ...s, [o.name]: e.target.value }))}
                  className="w-full rounded-md border border-plum-900/15 bg-white px-4 py-3 text-[0.9375rem] text-plum-900 focus:border-plum-600 focus:outline-none"
                >
                  {o.values.map((v) => (
                    <option key={v.value} value={v.value}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>

          {/* Buy Now shortens the path; Add To Cart keeps browsing */}
          <button
            type="button"
            onClick={buyNow}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-plum-900 px-8 py-4 text-[0.8125rem] font-semibold tracking-[0.14em] text-blush-200 uppercase transition-all duration-300 hover:-translate-y-0.5 hover:bg-plum-800"
          >
            <Zap size={15} className="fill-blush-200" />
            Buy Now
          </button>
          <button
            type="button"
            onClick={addToCart}
            className="mt-2.5 w-full rounded-md border border-plum-900/20 px-8 py-3 text-[0.75rem] font-semibold tracking-[0.12em] text-plum-900 uppercase transition-colors hover:border-plum-700 hover:bg-plum-900/[0.04]"
          >
            Add To Cart
          </button>
          <p className="mt-2.5 text-center text-[0.6875rem] text-plum-900/45">
            Secure checkout · ships in 24h · 30-day returns
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------- Card (image 1) ---- */

function Card({ p, active, onOpen }: { p: ShowcaseProduct; active: boolean; onOpen: () => void }) {
  const { add, setOpen: setCartOpen } = useCart();

  function quickAdd() {
    const { labels, unitPrice } = defaultVariant(p);
    add({
      productId: p.id,
      slug: p.slug,
      title: p.title,
      selections: labels,
      unitPrice,
      quantity: 1,
      image: p.image,
    });
    setCartOpen(true);
  }

  return (
    <div
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl bg-ink shadow-[0_20px_50px_-24px_rgba(90,45,103,0.6)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        active ? "z-10 scale-[1.03] ring-2 ring-gold/60" : "scale-100"
      }`}
    >
      {/* UGC video — click opens the quick view */}
      <button type="button" onClick={onOpen} className="relative block aspect-[3/4] w-full">
        <Media p={p} className="transition-transform duration-[1200ms] group-hover:scale-[1.05]" />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent"
        />
        <span className="absolute inset-x-2.5 bottom-2.5 flex items-center gap-2 text-left">
          <span className="h-9 w-9 shrink-0 overflow-hidden rounded-md ring-1 ring-white/30">
            <ProductImage src={p.image} alt={p.title} ratio="1 / 1" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[0.75rem] font-semibold text-white">
              {p.title}
            </span>
            <Money usd={p.price} className="text-[0.6875rem] text-blush-200 tabular-nums" />
          </span>
        </span>
      </button>

      {/* Action bar — Add To Cart + ▼ quick view (image 1) */}
      <div className="flex items-stretch">
        <button
          type="button"
          onClick={quickAdd}
          className="flex-1 bg-ink py-3.5 text-[0.6875rem] font-semibold tracking-[0.12em] text-white uppercase transition-colors hover:bg-plum-800"
        >
          Add To Cart
        </button>
        <button
          type="button"
          onClick={onOpen}
          aria-label="Quick view"
          className="grid w-11 place-items-center border-l border-white/15 bg-ink text-white transition-colors hover:bg-plum-800"
        >
          <ChevronDown size={16} />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Rail --- */

export function RealLooks({ products }: { products: ShowcaseProduct[] }) {
  const reduced = useReducedMotion();
  const [base, setBase] = useState(0);
  const [paused, setPaused] = useState(false);
  const [qv, setQv] = useState<ShowcaseProduct | null>(null);
  const len = products.length;

  useEffect(() => {
    if (paused || qv || len <= VISIBLE) return;
    const t = setInterval(() => setBase((b) => (b + 1) % len), DWELL);
    return () => clearInterval(t);
  }, [paused, qv, len]);

  if (len === 0) return null;
  const count = Math.min(VISIBLE, len);
  const visible = Array.from({ length: count }, (_, i) => products[(base + i) % len]);
  const step = (d: number) => setBase((b) => (b + d + len) % len);

  return (
    <section className="bg-gradient-to-br from-plum-900 via-plum-800 to-[#2a1122] py-16">
      <div className="mx-auto max-w-[1600px] px-[3vw]">
        <h2 className="text-center font-[family-name:var(--font-display)] text-[clamp(1.75rem,4vw,2.75rem)] text-paper">
          Real Looks, Real Confidence
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-[0.9375rem] text-blush-200/70">
          See the unit in motion — then picture it on you. This is the version of you that walks in
          and owns the room.
        </p>

        <div
          className="mt-10 flex items-center gap-2"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <button
            type="button"
            aria-label="Previous"
            onClick={() => step(-1)}
            className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 text-blush-200 transition-colors hover:border-gold hover:bg-gold hover:text-ink sm:flex"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex flex-1 items-stretch gap-4 overflow-hidden py-4 sm:gap-5">
            <AnimatePresence initial={false} mode="popLayout">
              {visible.map((p, i) => (
                <motion.div
                  key={p.slug}
                  layout
                  initial={reduced ? { opacity: 0 } : { opacity: 0, x: 80 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, x: -80 }}
                  transition={{
                    layout: { duration: reduced ? 0.2 : 0.6, ease: [0.16, 1, 0.3, 1] },
                    duration: reduced ? 0.2 : 0.55,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{ flexGrow: 1, flexBasis: 0 }}
                  className="min-w-0"
                >
                  <Card p={p} active={i === 0} onOpen={() => setQv(p)} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <button
            type="button"
            aria-label="Next"
            onClick={() => step(1)}
            className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 text-blush-200 transition-colors hover:border-gold hover:bg-gold hover:text-ink sm:flex"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {qv && <QuickView product={qv} onClose={() => setQv(null)} />}
    </section>
  );
}

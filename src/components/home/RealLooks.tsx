"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Zap } from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";
import { Money } from "@/components/ui/Money";
import { useCart } from "@/lib/stores/cart";

/**
 * "Real Looks, Real Confidence" — the fantasy-selling impulse carousel. Bold,
 * tall product-in-action cards auto-advance every six seconds (a fresh card
 * slides in and scales up as the spotlight; the outgoing one shrinks and slides
 * away). Chevrons let a shopper browse freely. Any card opens a Quick View that
 * shortens the path to purchase: pick the variations and Buy Now goes straight
 * to checkout.
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

/* ------------------------------------------------------- Quick view (img 2) */

function QuickView({ product, onClose }: { product: ShowcaseProduct; onClose: () => void }) {
  const router = useRouter();
  const { add } = useCart();
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

  function buyNow() {
    add({
      productId: product.id,
      slug: product.slug,
      title: product.title,
      selections: labels,
      unitPrice,
      quantity: 1,
      image: product.image,
    });
    router.push("/checkout");
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

        <div className="relative bg-plum-900">
          <Media p={product} />
        </div>

        <div className="flex flex-col overflow-y-auto p-6 sm:p-8">
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-plum-900">
            {product.title}
          </h2>
          <div className="mt-2 flex items-baseline gap-2">
            <Money usd={unitPrice} className="text-xl font-bold text-plum-700 tabular-nums" />
            {product.compareAtPrice && (
              <Money
                usd={product.compareAtPrice}
                className="text-[0.875rem] text-plum-900/40 line-through tabular-nums"
              />
            )}
          </div>

          <div className="mt-6 space-y-4">
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

          <button
            type="button"
            onClick={buyNow}
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-md bg-plum-900 px-8 py-4 text-[0.8125rem] font-semibold tracking-[0.14em] text-blush-200 uppercase transition-all duration-300 hover:-translate-y-0.5 hover:bg-plum-800"
          >
            <Zap size={15} className="fill-blush-200" />
            Buy Now
          </button>
          <p className="mt-2.5 text-center text-[0.6875rem] text-plum-900/45">
            Secure checkout · ships in 24h · 30-day returns
          </p>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------- Card + rail --- */

function Card({ p, active, onOpen }: { p: ShowcaseProduct; active: boolean; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`group relative block overflow-hidden rounded-2xl text-left shadow-[0_20px_50px_-24px_rgba(90,45,103,0.6)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        active ? "scale-[1.04] ring-2 ring-gold/60" : "scale-100"
      }`}
    >
      <div className="aspect-[3/4]">
        <Media p={p} className="transition-transform duration-[1200ms] group-hover:scale-[1.06]" />
      </div>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-plum-900/90 via-plum-900/10 to-transparent"
      />
      <div className="absolute inset-x-0 bottom-0 p-3">
        <div className="flex items-center gap-2">
          <span className="h-9 w-9 shrink-0 overflow-hidden rounded-md">
            <ProductImage src={p.image} alt={p.title} ratio="1 / 1" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[0.75rem] font-semibold text-white">
              {p.title}
            </span>
            <Money usd={p.price} className="text-[0.75rem] text-blush-200 tabular-nums" />
          </span>
        </div>
        <span className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-md bg-white/95 py-2.5 text-[0.6875rem] font-bold tracking-[0.1em] text-plum-900 uppercase transition-colors group-hover:bg-gold">
          <Zap size={12} className="fill-plum-900" /> Buy Now
        </span>
      </div>
    </button>
  );
}

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
    <section className="bg-white py-16">
      <div className="mx-auto max-w-[1600px] px-[3vw]">
        <h2 className="text-center font-[family-name:var(--font-display)] text-[clamp(1.75rem,4vw,2.75rem)] text-plum-900">
          Real Looks, Real Confidence
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-[0.9375rem] text-plum-900/55">
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
            className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-plum-900/15 text-plum-700 transition-colors hover:bg-plum-700 hover:text-white sm:flex"
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
            className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-plum-900/15 text-plum-700 transition-colors hover:bg-plum-700 hover:text-white sm:flex"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {qv && <QuickView product={qv} onClose={() => setQv(null)} />}
    </section>
  );
}

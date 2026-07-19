"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/stores/cart";
import { formatPrice } from "@/lib/commerce";
import { ProductImage } from "@/components/ui/ProductImage";

const FREE_SHIPPING_THRESHOLD = 40000;

export default function CartPage() {
  const router = useRouter();
  const { lines, subtotal, setQuantity, remove, hydrated } = useCart();
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;

  // Persisted store rehydrates on the client — render nothing until it has,
  // so the server-rendered empty state never flashes over a full bag.
  if (!hydrated) return <div className="min-h-[60vh]" aria-busy="true" />;

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-[1440px] px-[4vw] py-32">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-[clamp(2rem,4vw,3rem)] text-paper">Your bag is empty.</h1>
          <p className="mt-5 text-[1.0625rem] leading-relaxed text-neutral-400">
            If you are deciding between shades, start with The Lace Test. Five dollars, credited
            back in full — it is the cheapest way to be certain.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-6">
            <Link
              href="/shop"
              className="border border-gold px-8 py-4 text-[0.8125rem] tracking-[0.14em] text-gold uppercase transition-all duration-500 hover:bg-gold hover:text-ink"
            >
              View the collection
            </Link>
            <Link
              href="/product/lace-test-kit"
              className="border-b border-white/25 pb-1 text-[0.8125rem] tracking-[0.1em] text-neutral-200 uppercase transition-colors hover:border-gold hover:text-gold"
            >
              Order The Lace Test
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] px-[4vw] py-20">
      <div className="flex items-center justify-between border-t border-white/[0.07] pt-4">
        <span className="eyebrow">Your bag</span>
        <span className="eyebrow tabular-nums">
          {lines.length} {lines.length === 1 ? "item" : "items"}
        </span>
      </div>

      <h1 className="mt-12 mb-14 text-[clamp(2.5rem,5vw,4rem)] text-paper">Your bag</h1>

      <div className="grid gap-16 lg:grid-cols-[1fr_380px]">
        <div className="divide-y divide-white/[0.07] border-t border-white/[0.07]">
          {lines.map((line) => (
            <div key={line.id} className="flex gap-6 py-8">
              <Link href={`/product/${line.slug}`} className="w-28 shrink-0">
                <ProductImage src={line.image} alt={line.title} />
              </Link>

              <div className="flex flex-1 flex-col justify-between gap-4">
                <div>
                  <div className="flex items-start justify-between gap-6">
                    <Link
                      href={`/product/${line.slug}`}
                      className="text-lg text-paper transition-colors hover:text-blush-300"
                    >
                      {line.title}
                    </Link>
                    <span className="text-[0.9375rem] text-paper tabular-nums">
                      {formatPrice(line.unitPrice * line.quantity)}
                    </span>
                  </div>
                  {Object.keys(line.selections).length > 0 && (
                    <p className="mt-2 text-[0.8125rem] text-neutral-400">
                      {Object.entries(line.selections)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join("  ·  ")}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center border border-white/15">
                    <button
                      onClick={() => setQuantity(line.id, line.quantity - 1)}
                      className="px-3 py-2 text-neutral-200 transition-colors hover:text-gold"
                      aria-label={`Decrease quantity of ${line.title}`}
                    >
                      −
                    </button>
                    <span className="w-7 text-center text-[0.875rem] text-paper tabular-nums">
                      {line.quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(line.id, line.quantity + 1)}
                      className="px-3 py-2 text-neutral-200 transition-colors hover:text-gold"
                      aria-label={`Increase quantity of ${line.title}`}
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => remove(line.id)}
                    className="text-[0.75rem] tracking-[0.08em] text-neutral-400 uppercase underline-offset-4 transition-colors hover:text-blush-300 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-32 lg:self-start">
          <div className="border border-white/[0.07] p-8">
            <p className="eyebrow mb-6">Summary</p>

            <div className="flex justify-between border-b border-white/[0.07] pb-4">
              <span className="text-[0.9375rem] text-neutral-400">Subtotal</span>
              <span className="text-[0.9375rem] text-paper tabular-nums">
                {formatPrice(subtotal)}
              </span>
            </div>
            <div className="flex justify-between border-b border-white/[0.07] py-4">
              <span className="text-[0.9375rem] text-neutral-400">Shipping</span>
              <span className="text-[0.9375rem] text-paper">
                {remaining <= 0 ? "Complimentary" : "Calculated at checkout"}
              </span>
            </div>

            {remaining > 0 && (
              <div className="mt-5">
                <p className="text-[0.8125rem] text-neutral-400">
                  {formatPrice(remaining)} from complimentary worldwide shipping.
                </p>
                <div className="mt-2.5 h-px w-full bg-white/10">
                  <div
                    className="h-px bg-gold transition-all duration-700"
                    style={{
                      width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}

            <div className="mt-7 flex justify-between">
              <span className="text-[1.0625rem] text-paper">Total</span>
              <span className="font-[family-name:var(--font-display)] text-2xl text-paper tabular-nums">
                {formatPrice(subtotal)}
              </span>
            </div>

            <button
              className="mt-8 w-full border border-gold bg-gold px-8 py-4 text-[0.8125rem] tracking-[0.14em] text-ink uppercase transition-all duration-500 hover:bg-transparent hover:text-gold"
              onClick={() => router.push("/checkout")}
            >
              Proceed to checkout
            </button>

            <p className="mt-5 text-center text-[0.75rem] text-neutral-400">
              Unbranded outer packaging available at checkout.
            </p>
          </div>

          <div className="mt-6 border border-gold/25 p-6">
            <p className="eyebrow mb-3 text-gold">Add the ritual</p>
            <p className="text-[0.875rem] leading-relaxed text-neutral-400">
              Human hair does not renew itself. The Care Ritual is what decides whether your unit
              lasts twelve months or thirty.
            </p>
            <Link
              href="/product/beyond-care-ritual-box"
              className="mt-4 inline-block border-b border-gold pb-0.5 text-[0.75rem] tracking-[0.1em] text-gold uppercase"
            >
              Add for $68/mo
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User, Package, Heart, Crown, RefreshCcw, CreditCard, Camera } from "lucide-react";
import { useWishlist } from "@/lib/stores/wishlist";
import { Money } from "@/components/ui/Money";

interface DemoOrder {
  ref: string;
  placedAt: string;
  lines: Array<{ title: string; quantity: number; unitPrice: number }>;
  total: number;
}

/**
 * Account dashboard shell. Real authentication is Clerk (locked stack, Phase 2)
 * and activates when keys are configured; until then the dashboard shows
 * local demo orders and wishlist state so the full journey stays testable.
 */
export default function AccountPage() {
  const { slugs, hydrated } = useWishlist();
  const [orders, setOrders] = useState<DemoOrder[]>([]);

  useEffect(() => {
    try {
      setOrders(JSON.parse(localStorage.getItem("bl.orders.v1") ?? "[]"));
    } catch {
      setOrders([]);
    }
  }, []);

  return (
    <div className="mx-auto max-w-[1440px] px-[4vw] py-20">
      <div className="flex items-center justify-between border-t border-white/[0.07] pt-4">
        <span className="eyebrow">Account</span>
        <span className="eyebrow hidden md:block">Dashboard</span>
        <span className="eyebrow">Preview</span>
      </div>

      <div className="mt-12 flex flex-wrap items-end justify-between gap-6">
        <h1 className="text-[clamp(2.5rem,5vw,4rem)] text-paper">Your account.</h1>
        <p className="max-w-sm border border-gold/40 bg-plum-900/60 p-4 text-[0.8125rem] leading-relaxed text-blush-200">
          <User size={14} className="mr-2 inline text-gold" />
          Sign-in (Clerk — customer accounts and salon partner SSO) activates with the auth phase.
          This dashboard currently reflects this browser only.
        </p>
      </div>

      <div className="mt-14 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        {/* Orders */}
        <section className="border border-white/[0.07] p-8">
          <div className="mb-6 flex items-center gap-3">
            <Package size={20} strokeWidth={1.5} className="text-gold" />
            <h2 className="text-xl text-paper">Order history</h2>
          </div>
          {orders.length === 0 ? (
            <p className="text-[0.9375rem] leading-relaxed text-neutral-400">
              No orders in this browser yet. Orders placed through{" "}
              <Link href="/checkout" className="text-gold underline-offset-4 hover:underline">
                checkout
              </Link>{" "}
              appear here with their reference and status.
            </p>
          ) : (
            <div className="divide-y divide-white/[0.07]">
              {orders.map((o) => (
                <div key={o.ref} className="py-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <span className="text-[0.9375rem] text-paper tabular-nums">{o.ref}</span>
                    <span className="eyebrow">
                      {new Date(o.placedAt).toLocaleDateString()} · Demo
                    </span>
                    <Money usd={o.total} className="text-[0.9375rem] text-paper tabular-nums" />
                  </div>
                  <p className="mt-2 text-[0.8125rem] text-neutral-400">
                    {o.lines.map((l) => `${l.title} × ${l.quantity}`).join(" · ")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Side stack */}
        <div className="space-y-8">
          <section id="wishlist" className="border border-white/[0.07] p-8">
            <div className="mb-4 flex items-center gap-3">
              <Heart size={20} strokeWidth={1.5} className="text-gold" />
              <h2 className="text-xl text-paper">Wishlist</h2>
            </div>
            <p className="text-[0.9375rem] text-neutral-400">
              <span className="text-paper tabular-nums">{hydrated ? slugs.length : 0}</span> saved{" "}
              {slugs.length === 1 ? "unit" : "units"}.
            </p>
            <Link
              href="/wishlist"
              className="mt-4 inline-block border-b border-gold pb-1 text-[0.8125rem] tracking-[0.1em] text-gold uppercase"
            >
              View wishlist
            </Link>
          </section>

          <section className="border border-white/[0.07] p-8">
            <div className="mb-4 flex items-center gap-3">
              <Crown size={20} strokeWidth={1.5} className="text-gold" />
              <h2 className="text-xl text-paper">Loyalty points</h2>
            </div>
            <p className="text-[0.9375rem] leading-relaxed text-neutral-400">
              The points ledger activates with accounts — one point per dollar, 100 points = $5, no
              expiry games.{" "}
              <Link href="/circle#loyalty" className="text-gold underline-offset-4 hover:underline">
                Programme details
              </Link>
            </p>
          </section>

          {[
            {
              icon: RefreshCcw,
              title: "Subscriptions",
              body: "Pause, skip, or cancel the Care Ritual from here once billing activates. No phone call, no retention script.",
            },
            {
              icon: CreditCard,
              title: "Payment & shipping",
              body: "Saved addresses and payment methods arrive with Stripe + Clerk. Nothing is stored until then.",
            },
            {
              icon: Camera,
              title: "Try-on presets",
              body: "Saved AR try-on looks land with the virtual try-on feature. On-device only — your face never leaves the browser.",
            },
          ].map((s) => (
            <section key={s.title} className="border border-white/[0.07] p-8">
              <div className="mb-4 flex items-center gap-3">
                <s.icon size={20} strokeWidth={1.5} className="text-gold" />
                <h2 className="text-xl text-paper">{s.title}</h2>
              </div>
              <p className="text-[0.9375rem] leading-relaxed text-neutral-400">{s.body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

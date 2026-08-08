"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Plus } from "lucide-react";

/**
 * Wholesale Special — the B2B teaser on the home page. Left: the offer, a
 * six-point perks checklist and the wholesale CTAs. Right: a compact (~12px)
 * collapsible accordion answering the value questions a reseller actually asks.
 * Sits on the brand's plum ground (a bg-* utility, so it stays legible in both
 * light and dark modes). Copy is brand-owned — no third-party names or claims.
 */

const PERKS = [
  "100% Virgin Human Hair",
  "1-on-1 Consultation & Professional Service",
  "USA, UK & Africa Warehouses",
  "Factory Price & Promotions",
  "Expedited Shipping",
  "Drop Shipping & Customization",
];

const FAQS = [
  {
    q: "Wholesale Wigs & Bundles Manufacturer",
    a: "As a top manufacturer with two decades of hair experience, we own senior wig-makers and craft masters with deep industry expertise. Every wig passes 20 quality-control inspections, so we guarantee a consistent supply at the highest quality.",
  },
  {
    q: "Enjoy Competitive Wholesale Pricing",
    a: "Factory-direct pricing — no third-party markup and no $500-plus minimum order. We accept 1–2 unit orders to support small hair businesses getting started.",
  },
  {
    q: "Massive Stock & Free Fast Shipping",
    a: "Over 6,000 hair products are in stock and ready to ship within 24 hours (excluding weekends and holidays). Insured shipping is added to every order, with 1-on-1 follow-up until it is delivered.",
  },
  {
    q: "Fashion-Forward, Unique Variety",
    a: "Our in-house R&D team designs every style with a Beyond Lace master stylist. We launch new styles and colours monthly to meet evolving demand and set the latest trends.",
  },
  {
    q: "Drop Shipping & Customization",
    a: "We drop-ship to help you build your business, and we can customise your brand logo — shipping the package under your own label.",
  },
];

function Accordion() {
  const [open, setOpen] = useState(0);
  return (
    <ul className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
      {FAQS.map((item, i) => {
        const isOpen = open === i;
        return (
          <li key={item.q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 py-3 text-left"
            >
              <span
                className={`text-[0.8125rem] font-semibold transition-colors ${
                  isOpen ? "text-gold" : "text-paper"
                }`}
              >
                {item.q}
              </span>
              <Plus
                size={14}
                strokeWidth={1.75}
                className={`shrink-0 text-gold transition-transform duration-300 ${
                  isOpen ? "rotate-45" : ""
                }`}
              />
            </button>
            <div
              className="grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="pb-4 text-[0.75rem] leading-relaxed text-blush-200/70">{item.a}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function WholesaleSpecial() {
  return (
    <section className="relative overflow-hidden bg-plum-900 py-28">
      <div className="mx-auto grid max-w-[1440px] gap-16 px-[4vw] lg:grid-cols-2 lg:items-start">
        {/* Offer + perks + CTAs */}
        <div>
          <p className="eyebrow mb-5 text-gold">For salons &amp; resellers</p>
          <h2 className="text-[clamp(2rem,4.5vw,3.5rem)] text-paper">Wholesale Special</h2>
          <p className="mt-6 text-[1.0625rem] leading-relaxed text-blush-200/70">
            Super-affordable factory pricing, 20 years as a professional hair vendor — your reliable
            hair-business partner.
          </p>

          <ul className="mt-8 grid gap-x-6 gap-y-3.5 sm:grid-cols-2">
            {PERKS.map((perk) => (
              <li key={perk} className="flex items-start gap-2.5">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-gold/15 ring-1 ring-gold/40">
                  <Check size={12} strokeWidth={2.5} className="text-gold" />
                </span>
                <span className="text-[0.875rem] leading-snug text-paper/90">{perk}</span>
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-wrap gap-6">
            <Link
              href="/wholesale"
              className="border border-gold px-8 py-3.5 text-[0.8125rem] tracking-[0.14em] text-gold uppercase transition-all duration-500 hover:bg-gold hover:text-ink"
            >
              The programme
            </Link>
            <Link
              href="/wholesale#apply"
              className="border-b border-white/25 pb-1 text-[0.8125rem] tracking-[0.1em] text-blush-200 uppercase transition-colors hover:border-gold hover:text-gold"
            >
              Apply as a partner
            </Link>
          </div>
        </div>

        {/* Compact value accordion, immediately next to the perks */}
        <div className="lg:pt-2">
          <p className="mb-4 text-[0.6875rem] font-semibold tracking-[0.18em] text-gold uppercase">
            What value does Beyond Lace bring you?
          </p>
          <Accordion />
        </div>
      </div>
    </section>
  );
}

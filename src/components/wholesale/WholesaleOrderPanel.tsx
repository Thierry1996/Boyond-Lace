"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Money } from "@/components/ui/Money";
import { WHOLESALE_MOQ, WHOLESALE_STEP } from "@/lib/channel";
import type { WholesalePricing, WholesaleTier } from "@/lib/commerce";

/**
 * Wholesale order panel — quote plus customization, in one place.
 *
 * The retail side sells a fixed unit; the trade side sells a manufacturing run,
 * so this is where a partner specifies quantity AND the private-label details a
 * factory needs: lace cut, care label, packaging, hang tag, and anything freeform.
 * Both the quantity and the customization ride into the application through the
 * "Request this quote" link, so the enquiry the partner team receives is already
 * a brief. Retail never sees any of this — customization is wholesale-only.
 */

interface CustomChoice {
  key: string;
  label: string;
  /** First option is always the no-op default and is never carried through. */
  options: string[];
  note?: string;
}

const CUSTOMIZATIONS: CustomChoice[] = [
  {
    key: "lace",
    label: "Lace cut",
    options: ["As listed", "13×4", "13×6", "4×4", "5×5", "6×6", "360"],
    note: "We can cut a different lace size for a run.",
  },
  {
    key: "care-label",
    label: "Care label",
    options: ["None", "Woven satin", "Printed nylon", "Your own label"],
    note: "Min. 200 units for a custom woven label.",
  },
  {
    key: "packaging",
    label: "Packaging",
    options: ["Unbranded", "Branded box", "Branded poly mailer", "Your own packaging"],
    note: "Min. 20 units for branded packaging.",
  },
  {
    key: "hang-tag",
    label: "Hang tag",
    options: ["None", "Kraft", "Foil-stamped", "Your own tag"],
  },
];

export function WholesaleOrderPanel({
  slug,
  pricing,
}: {
  slug: string;
  pricing: WholesalePricing;
}) {
  const [qty, setQty] = useState(WHOLESALE_MOQ);
  const [choices, setChoices] = useState<Record<string, string>>(
    Object.fromEntries(CUSTOMIZATIONS.map((c) => [c.key, c.options[0]])),
  );
  const [notes, setNotes] = useState("");

  const tier: WholesaleTier = [...pricing.tiers]
    .sort((a, b) => a.minQty - b.minQty)
    .reduce((match, t) => (qty >= t.minQty ? t : match), pricing.tiers[0]);

  const subtotal = tier.unitPrice * qty;
  const clamp = (n: number) =>
    Math.max(WHOLESALE_MOQ, Math.round(n / WHOLESALE_STEP) * WHOLESALE_STEP);

  // Only non-default customization is carried; a default-everything order sends
  // no custom brief at all.
  const customSummary = useMemo(() => {
    const parts = CUSTOMIZATIONS.filter((c) => choices[c.key] !== c.options[0]).map(
      (c) => `${c.label}: ${choices[c.key]}`,
    );
    if (notes.trim()) parts.push(`Notes: ${notes.trim()}`);
    return parts.join("; ");
  }, [choices, notes]);

  const quoteHref =
    `/wholesale?unit=${encodeURIComponent(slug)}&qty=${qty}` +
    (customSummary ? `&custom=${encodeURIComponent(customSummary)}` : "") +
    "#apply";

  return (
    <div className="border border-gold/25">
      {/* Pricing */}
      <div className="p-6">
        <div className="flex items-baseline justify-between">
          <p className="eyebrow text-gold">Trade price</p>
          <p className="text-[0.75rem] text-neutral-400">MOQ {WHOLESALE_MOQ} units</p>
        </div>

        <div className="mt-4 flex items-baseline gap-3">
          <Money
            usd={tier.unitPrice}
            className="font-[family-name:var(--font-display)] text-4xl text-paper tabular-nums"
          />
          <span className="text-[0.875rem] text-neutral-400">/ unit</span>
        </div>

        <div className="mt-6">
          <label className="eyebrow mb-2 block">Order quantity</label>
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-white/15">
              <button
                onClick={() => setQty((q) => clamp(q - WHOLESALE_STEP))}
                aria-label="Decrease quantity"
                className="px-3.5 py-2.5 text-neutral-200 transition-colors hover:text-gold"
              >
                −
              </button>
              <input
                type="number"
                value={qty}
                min={WHOLESALE_MOQ}
                step={WHOLESALE_STEP}
                onChange={(e) => setQty(clamp(Number(e.target.value) || WHOLESALE_MOQ))}
                aria-label="Order quantity in units"
                className="w-16 bg-transparent py-2.5 text-center text-[0.9375rem] text-paper tabular-nums focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                onClick={() => setQty((q) => clamp(q + WHOLESALE_STEP))}
                aria-label="Increase quantity"
                className="px-3.5 py-2.5 text-neutral-200 transition-colors hover:text-gold"
              >
                +
              </button>
            </div>
            <span className="text-[0.8125rem] text-neutral-400">
              units{qty === WHOLESALE_MOQ ? " (minimum)" : ""}
            </span>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-white/[0.08] pt-5">
          <span className="text-[0.9375rem] text-neutral-400">Order subtotal</span>
          <Money usd={subtotal} className="text-xl text-paper tabular-nums" />
        </div>
        <p className="mt-2 text-[0.75rem] leading-relaxed text-neutral-400">
          MAP: you agree not to advertise below <Money usd={pricing.mapPrice} /> per unit.
        </p>
      </div>

      {/* Customization — wholesale only */}
      <div className="border-t border-white/[0.08] p-6">
        <p className="eyebrow mb-1 text-gold">Customization</p>
        <p className="mb-5 text-[0.8125rem] leading-relaxed text-neutral-400">
          Private-label this run. Choose what you need; anything you change is sent with your quote.
        </p>

        <div className="space-y-5">
          {CUSTOMIZATIONS.map((c) => (
            <fieldset key={c.key}>
              <legend className="mb-2 text-[0.8125rem] text-neutral-200">
                {c.label}
                {c.note && <span className="ml-2 text-[0.6875rem] text-neutral-400">{c.note}</span>}
              </legend>
              <div className="flex flex-wrap gap-2">
                {c.options.map((opt) => {
                  const active = choices[c.key] === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setChoices((prev) => ({ ...prev, [c.key]: opt }))}
                      className={`border px-3 py-1.5 text-[0.8125rem] transition-colors duration-300 ${
                        active
                          ? "border-gold text-gold"
                          : "border-white/15 text-neutral-400 hover:border-white/40 hover:text-neutral-200"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}

          <label className="block">
            <span className="mb-2 block text-[0.8125rem] text-neutral-200">
              Anything else for this run (optional)
            </span>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Logo placement, colour ring reference, a target landed cost…"
              className="w-full border border-white/15 bg-transparent px-4 py-3 text-[0.875rem] text-paper placeholder:text-neutral-400/60 transition-colors focus:border-gold focus:outline-none"
            />
          </label>
        </div>
      </div>

      {/* CTAs — carry quantity and the custom brief into the application */}
      <div className="border-t border-white/[0.08] p-6">
        {customSummary && (
          <p className="mb-4 text-[0.75rem] leading-relaxed text-gold">
            Your customization will be attached to the quote.
          </p>
        )}
        <Link
          href={quoteHref}
          className="cta-primary block w-full px-8 py-4 text-center text-[0.8125rem] tracking-[0.14em] uppercase"
        >
          Request this quote
        </Link>
        <Link
          href="/wholesale#samples"
          className="mt-3 block w-full border border-white/15 px-8 py-3.5 text-center text-[0.75rem] tracking-[0.14em] text-neutral-200 uppercase transition-colors hover:border-gold hover:text-gold"
        >
          Request samples first
        </Link>
      </div>
    </div>
  );
}

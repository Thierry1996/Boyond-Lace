"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCart } from "@/lib/stores/cart";
import { Money } from "@/components/ui/Money";
import { shippingSchema, type ShippingDetails } from "@/lib/schemas";
import { Field, SubmitButton, inputClass } from "@/components/forms/fields";

/**
 * Checkout flow — shipping → payment → confirmation, per the sitemap.
 * Payment runs in clearly-labelled DEMO mode until Stripe/PayPal/Alipay keys
 * land (locked stack, Phase 3). Demo orders persist locally so the account
 * page and E2E tests can exercise the full loop.
 */

type Step = "shipping" | "payment" | "done";

interface DemoOrder {
  ref: string;
  placedAt: string;
  lines: Array<{ title: string; quantity: number; unitPrice: number }>;
  total: number;
  shipping: ShippingDetails;
}

const PAYMENT_METHODS = [
  { id: "card", label: "Card — Visa / Mastercard", via: "Stripe Payment Element" },
  { id: "paypal", label: "PayPal", via: "PayPal Checkout" },
  { id: "alipay", label: "Alipay", via: "Stripe Alipay method" },
];

export default function CheckoutPage() {
  const { lines, subtotal, clear, hydrated } = useCart();
  const [step, setStep] = useState<Step>("shipping");
  const [shipping, setShipping] = useState<ShippingDetails | null>(null);
  const [method, setMethod] = useState("card");
  const [orderRef, setOrderRef] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingDetails>({
    resolver: zodResolver(shippingSchema),
    defaultValues: { discreetPackaging: false },
  });

  if (!hydrated) return <div className="min-h-[60vh]" aria-busy="true" />;

  if (lines.length === 0 && step !== "done") {
    return (
      <div className="mx-auto max-w-lg px-[4vw] py-32 text-center">
        <h1 className="text-3xl text-paper">Nothing to check out.</h1>
        <Link
          href="/shop"
          className="mt-8 inline-block border border-gold px-8 py-4 text-[0.8125rem] tracking-[0.14em] text-gold uppercase transition-all duration-500 hover:bg-gold hover:text-ink"
        >
          View the collection
        </Link>
      </div>
    );
  }

  function placeDemoOrder() {
    if (!shipping) return;
    const ref = `BL-${Date.now().toString(36).toUpperCase().slice(-6)}`;
    const order: DemoOrder = {
      ref,
      placedAt: new Date().toISOString(),
      lines: lines.map((l) => ({ title: l.title, quantity: l.quantity, unitPrice: l.unitPrice })),
      total: subtotal,
      shipping,
    };
    try {
      const existing: DemoOrder[] = JSON.parse(localStorage.getItem("bl.orders.v1") ?? "[]");
      localStorage.setItem("bl.orders.v1", JSON.stringify([order, ...existing]));
    } catch {
      // Storage unavailable — the confirmation still shows.
    }
    setOrderRef(ref);
    clear();
    setStep("done");
  }

  const steps: Step[] = ["shipping", "payment", "done"];
  const stepIndex = steps.indexOf(step);

  return (
    <div className="mx-auto max-w-[1200px] px-[4vw] py-20">
      <div className="flex items-center justify-between border-t border-white/[0.07] pt-4">
        <span className="eyebrow">Checkout</span>
        <span className="eyebrow hidden gap-4 md:flex">
          {["Shipping", "Payment", "Confirmation"].map((label, i) => (
            <span key={label} className={i <= stepIndex ? "text-gold" : undefined}>
              {i + 1}. {label}
            </span>
          ))}
        </span>
        <Money usd={subtotal} className="eyebrow tabular-nums" />
      </div>

      {step === "shipping" && (
        <div className="mt-14 grid gap-14 lg:grid-cols-[1.5fr_1fr]">
          <form
            onSubmit={handleSubmit((data) => {
              setShipping(data);
              setStep("payment");
            })}
            noValidate
          >
            <h1 className="mb-10 text-[clamp(1.75rem,4vw,2.75rem)] text-paper">
              Where is it going?
            </h1>
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Full name" error={errors.fullName?.message}>
                <input className={inputClass} autoComplete="name" {...register("fullName")} />
              </Field>
              <Field label="Email" error={errors.email?.message}>
                <input
                  type="email"
                  className={inputClass}
                  autoComplete="email"
                  {...register("email")}
                />
              </Field>
              <Field label="Phone" error={errors.phone?.message}>
                <input
                  type="tel"
                  className={inputClass}
                  autoComplete="tel"
                  {...register("phone")}
                />
              </Field>
              <Field label="Country" error={errors.country?.message}>
                <input
                  className={inputClass}
                  autoComplete="country-name"
                  {...register("country")}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Street address" error={errors.address1?.message}>
                  <input
                    className={inputClass}
                    autoComplete="address-line1"
                    {...register("address1")}
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Apartment, suite (optional)" error={errors.address2?.message}>
                  <input
                    className={inputClass}
                    autoComplete="address-line2"
                    {...register("address2")}
                  />
                </Field>
              </div>
              <Field label="City" error={errors.city?.message}>
                <input className={inputClass} autoComplete="address-level2" {...register("city")} />
              </Field>
              <Field label="Postal code" error={errors.postalCode?.message}>
                <input
                  className={inputClass}
                  autoComplete="postal-code"
                  {...register("postalCode")}
                />
              </Field>
              <label className="flex items-start gap-3 text-[0.875rem] text-neutral-400 sm:col-span-2">
                <input
                  type="checkbox"
                  className="mt-0.5 accent-[#C9A66B]"
                  {...register("discreetPackaging")}
                />
                Ship in unbranded outer packaging with a plain invoice. No brand name appears
                anywhere visible.
              </label>
            </div>
            <div className="mt-10">
              <SubmitButton>Continue to payment</SubmitButton>
            </div>
          </form>
          <OrderSummary />
        </div>
      )}

      {step === "payment" && (
        <div className="mt-14 grid gap-14 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <h1 className="mb-4 text-[clamp(1.75rem,4vw,2.75rem)] text-paper">Payment.</h1>
            <p className="mb-8 border border-gold/40 bg-plum-900/60 p-4 text-[0.8125rem] leading-relaxed text-blush-200">
              <span className="text-gold">Demo mode.</span> Live payment activates when Stripe,
              PayPal, and Alipay keys are configured (Phase 3 of the locked stack). Orders placed
              now are demonstrations — nothing is charged, nothing ships.
            </p>
            <div className="space-y-3">
              {PAYMENT_METHODS.map((m) => (
                <label
                  key={m.id}
                  className={`flex cursor-pointer items-center justify-between border p-5 transition-colors ${
                    method === m.id ? "border-gold" : "border-white/15 hover:border-white/40"
                  }`}
                >
                  <span className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="payment"
                      checked={method === m.id}
                      onChange={() => setMethod(m.id)}
                      className="accent-[#C9A66B]"
                    />
                    <span className="text-[0.9375rem] text-paper">{m.label}</span>
                  </span>
                  <span className="eyebrow">{m.via}</span>
                </label>
              ))}
            </div>
            <div className="mt-10 flex items-center gap-6">
              <button
                type="button"
                onClick={placeDemoOrder}
                className="border border-gold bg-gold px-9 py-4 text-[0.8125rem] tracking-[0.14em] text-ink uppercase transition-all duration-500 hover:bg-transparent hover:text-gold"
              >
                Place demo order
              </button>
              <button
                type="button"
                onClick={() => setStep("shipping")}
                className="text-[0.75rem] tracking-[0.1em] text-neutral-400 uppercase hover:text-paper"
              >
                ← Back to shipping
              </button>
            </div>
          </div>
          <OrderSummary />
        </div>
      )}

      {step === "done" && (
        <div className="mx-auto mt-20 max-w-xl text-center">
          <p className="eyebrow mb-4 text-gold">Demo order placed</p>
          <h1 className="text-[clamp(2rem,5vw,3.5rem)] text-paper">
            Reference <span className="tabular-nums">{orderRef}</span>
          </h1>
          <p className="mt-6 text-[1.0625rem] leading-relaxed text-neutral-400">
            In production this screen confirms payment, emails your receipt, and starts fulfilment
            tracking. Your demo order is saved to this browser and visible in{" "}
            <Link href="/account" className="text-gold underline-offset-4 hover:underline">
              your account
            </Link>
            .
          </p>
          <div className="rule-gilded my-10" />
          <p className="text-[0.9375rem] leading-relaxed text-neutral-400">
            A unit lasts as long as the hands that keep it —{" "}
            <Link
              href="/product/beyond-care-ritual-box"
              className="text-gold underline-offset-4 hover:underline"
            >
              add the Care Ritual
            </Link>{" "}
            before it ships.
          </p>
        </div>
      )}
    </div>
  );
}

function OrderSummary() {
  const { lines, subtotal } = useCart();
  return (
    <aside className="h-fit border border-white/[0.07] p-8 lg:sticky lg:top-32">
      <p className="eyebrow mb-6">Order summary</p>
      <div className="space-y-4">
        {lines.map((l) => (
          <div key={l.id} className="flex justify-between gap-4 text-[0.875rem]">
            <span className="text-neutral-200">
              {l.title} <span className="text-neutral-400">× {l.quantity}</span>
            </span>
            <Money usd={l.unitPrice * l.quantity} className="text-paper tabular-nums" />
          </div>
        ))}
      </div>
      <div className="rule-gilded my-6" />
      <div className="flex justify-between">
        <span className="text-[0.9375rem] text-neutral-400">Total</span>
        <Money
          usd={subtotal}
          className="font-[family-name:var(--font-display)] text-xl text-paper tabular-nums"
        />
      </div>
    </aside>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCart } from "@/lib/stores/cart";
import { Money } from "@/components/ui/Money";
import { shippingSchema, type ShippingDetails } from "@/lib/schemas";
import { Field, SubmitButton, inputClass } from "@/components/forms/fields";

/**
 * Checkout — shipping → payment → confirmation, running the REAL Medusa flow via
 * /api/checkout: a genuine Medusa cart is built, addresses + shipping set, a
 * payment session opened for the chosen provider, and the cart completed into an
 * order. Payment methods are read live from Medusa (Stripe / Paystack / PayPal
 * etc. appear as they're enabled). The "requiresAction" branch is where a
 * client-side provider (Stripe Payment Element) will mount once its keys land.
 */

type Step = "shipping" | "payment" | "done";

const COUNTRIES: { code: string; name: string }[] = [
  { code: "us", name: "United States" }, { code: "ca", name: "Canada" }, { code: "gb", name: "United Kingdom" },
  { code: "ie", name: "Ireland" }, { code: "fr", name: "France" }, { code: "de", name: "Germany" },
  { code: "es", name: "Spain" }, { code: "it", name: "Italy" }, { code: "nl", name: "Netherlands" },
  { code: "au", name: "Australia" }, { code: "nz", name: "New Zealand" }, { code: "ae", name: "United Arab Emirates" },
  { code: "ng", name: "Nigeria" }, { code: "gh", name: "Ghana" }, { code: "cm", name: "Cameroon" },
  { code: "za", name: "South Africa" }, { code: "ke", name: "Kenya" }, { code: "ci", name: "Côte d’Ivoire" },
  { code: "sn", name: "Senegal" }, { code: "tz", name: "Tanzania" }, { code: "ug", name: "Uganda" },
];

interface PaymentProvider {
  id: string;
  label: string;
}

export default function CheckoutPage() {
  const { lines, subtotal, clear, hydrated } = useCart();
  const [step, setStep] = useState<Step>("shipping");
  const [shipping, setShipping] = useState<ShippingDetails | null>(null);

  const [providers, setProviders] = useState<PaymentProvider[]>([]);
  const [providerId, setProviderId] = useState("");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [orderNo, setOrderNo] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingDetails>({
    resolver: zodResolver(shippingSchema),
    defaultValues: { discreetPackaging: false },
  });

  // Live payment methods from Medusa.
  useEffect(() => {
    fetch("/api/checkout")
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) {
          setProviders(d.paymentProviders ?? []);
          setProviderId(d.paymentProviders?.[0]?.id ?? "");
        }
      })
      .catch(() => {});
  }, []);

  if (!hydrated) return <div className="min-h-[60vh]" aria-busy="true" />;

  if (lines.length === 0 && step !== "done") {
    return (
      <div className="mx-auto max-w-lg px-[4vw] py-32 text-center">
        <h1 className="text-3xl text-paper">Nothing to check out.</h1>
        <Link href="/shop" className="cta-secondary mt-8 inline-block px-8 py-4 text-[0.8125rem] tracking-[0.14em] uppercase">
          View the collection
        </Link>
      </div>
    );
  }

  async function placeOrder() {
    if (!shipping || !providerId) return;
    setPlacing(true);
    setError("");
    const [first, ...rest] = shipping.fullName.trim().split(/\s+/);
    const address = {
      email: shipping.email,
      first_name: first,
      last_name: rest.join(" ") || first,
      address_1: shipping.address1,
      city: shipping.city,
      postal_code: shipping.postalCode,
      country_code: shipping.country.toLowerCase(),
      phone: shipping.phone,
    };
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: lines.map((l) => ({ slug: l.slug, selections: l.selections, quantity: l.quantity })),
          address,
          providerId,
        }),
      });
      const data = await res.json();
      if (data.ok && data.displayId != null) {
        setOrderNo(data.displayId);
        clear();
        setStep("done");
      } else if (data.ok && data.requiresAction) {
        // A client-side provider (Stripe) will confirm here once keys are live.
        setError("This method needs its live keys configured. Choose Test payment to place the order for now.");
      } else {
        setError(data.error ?? "We couldn't place the order. Please try again.");
      }
    } catch {
      setError("Network error — please try again.");
    }
    setPlacing(false);
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
            <h1 className="mb-10 text-[clamp(1.75rem,4vw,2.75rem)] text-paper">Where is it going?</h1>
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Full name" error={errors.fullName?.message}>
                <input className={inputClass} autoComplete="name" {...register("fullName")} />
              </Field>
              <Field label="Email" error={errors.email?.message}>
                <input type="email" className={inputClass} autoComplete="email" {...register("email")} />
              </Field>
              <Field label="Phone" error={errors.phone?.message}>
                <input type="tel" className={inputClass} autoComplete="tel" {...register("phone")} />
              </Field>
              <Field label="Country" error={errors.country?.message}>
                <select className={inputClass} autoComplete="country" {...register("country")}>
                  <option value="">Select country…</option>
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code} className="bg-neutral-900">
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="sm:col-span-2">
                <Field label="Street address" error={errors.address1?.message}>
                  <input className={inputClass} autoComplete="address-line1" {...register("address1")} />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Apartment, suite (optional)" error={errors.address2?.message}>
                  <input className={inputClass} autoComplete="address-line2" {...register("address2")} />
                </Field>
              </div>
              <Field label="City" error={errors.city?.message}>
                <input className={inputClass} autoComplete="address-level2" {...register("city")} />
              </Field>
              <Field label="Postal code" error={errors.postalCode?.message}>
                <input className={inputClass} autoComplete="postal-code" {...register("postalCode")} />
              </Field>
              <label className="flex items-start gap-3 text-[0.875rem] text-neutral-400 sm:col-span-2">
                <input type="checkbox" className="mt-0.5 accent-[#C9A66B]" {...register("discreetPackaging")} />
                Ship in unbranded outer packaging with a plain invoice. No brand name appears anywhere visible.
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

            {providers.length === 0 ? (
              <p className="mb-8 border border-white/15 p-4 text-[0.8125rem] text-neutral-400">
                Loading payment methods…
              </p>
            ) : (
              <div className="space-y-3">
                {providers.map((p) => (
                  <label
                    key={p.id}
                    className={`flex cursor-pointer items-center justify-between border p-5 transition-colors ${
                      providerId === p.id ? "border-gold" : "border-white/15 hover:border-white/40"
                    }`}
                  >
                    <span className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="payment"
                        checked={providerId === p.id}
                        onChange={() => setProviderId(p.id)}
                        className="accent-[#C9A66B]"
                      />
                      <span className="text-[0.9375rem] text-paper">{p.label}</span>
                    </span>
                    {/^pp_system/.test(p.id) && <span className="eyebrow text-gold">No charge</span>}
                  </label>
                ))}
              </div>
            )}

            {error && <p className="mt-5 text-[0.8125rem] text-red-400">{error}</p>}

            <div className="mt-10 flex items-center gap-6">
              <button
                type="button"
                onClick={placeOrder}
                disabled={placing || !providerId}
                className="cta-primary px-9 py-4 text-[0.8125rem] tracking-[0.14em] uppercase disabled:opacity-60"
              >
                {placing ? "Placing order…" : "Place order"}
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
          <p className="eyebrow mb-4 text-gold">Order confirmed</p>
          <h1 className="text-[clamp(2rem,5vw,3.5rem)] text-paper">
            Order <span className="tabular-nums">#{orderNo}</span>
          </h1>
          <p className="mt-6 text-[1.0625rem] leading-relaxed text-neutral-400">
            Your order is in — a receipt is on its way, and you can track it from{" "}
            <Link href="/account" className="text-gold underline-offset-4 hover:underline">
              your account
            </Link>
            .
          </p>
          <div className="rule-gilded my-10" />
          <p className="text-[0.9375rem] leading-relaxed text-neutral-400">
            A unit lasts as long as the hands that keep it —{" "}
            <Link href="/product/beyond-care-ritual-box" className="text-gold underline-offset-4 hover:underline">
              add the Care Ritual
            </Link>{" "}
            to your next order.
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
        <Money usd={subtotal} className="font-[family-name:var(--font-display)] text-xl text-paper tabular-nums" />
      </div>
    </aside>
  );
}

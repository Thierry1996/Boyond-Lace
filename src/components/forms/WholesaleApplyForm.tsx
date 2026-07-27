"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { wholesaleApplicationSchema, type WholesaleApplication } from "@/lib/schemas";
import { Field, FormSuccess, SubmitButton, inputClass } from "./fields";

/**
 * The quote a "Request this quote" link carries into this form, resolved on the
 * wholesale page. Kept as a plain prop rather than a schema field so the API and
 * the Prisma model stay unchanged — the quote rides through inside the message.
 */
export interface QuotePrefill {
  slug: string;
  sku: string;
  title: string;
  qty: number;
  volume: WholesaleApplication["estimatedVolume"];
  /** Customization brief composed on the wholesale PDP, if any. */
  custom?: string;
}

/** Turnkey options a partner can flag on the application (Services Needed). */
const SERVICES = [
  "Dropshipping",
  "Private label",
  "Custom packaging",
  "Custom textures",
  "USA warehouse",
  "1-on-1 consultation",
];

export function WholesaleApplyForm({ prefill }: { prefill?: QuotePrefill }) {
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<WholesaleApplication>({
    resolver: zodResolver(wholesaleApplicationSchema),
    // A quote carried in from a product page preselects the volume tier and
    // seeds the message with the unit and quantity, so the enquiry the partner
    // team receives already says what was quoted.
    defaultValues: {
      services: [],
      consent: false,
      ...(prefill
        ? {
            estimatedVolume: prefill.volume,
            message:
              `I'd like a wholesale quote for ${prefill.title} (${prefill.sku}) — ${prefill.qty} units.` +
              (prefill.custom ? `\nCustomization — ${prefill.custom}` : ""),
          }
        : {}),
    },
  });

  if (done) {
    return (
      <FormSuccess
        title="Your application is in review."
        body="Verification protects every partner already in the programme. Expect a reply within two business days — pricing is released the moment you clear."
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        const res = await fetch("/api/wholesale", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (res.ok) setDone(true);
      })}
      className="grid gap-6 text-left sm:grid-cols-2"
      noValidate
    >
      {prefill && (
        <div className="border border-gold/30 bg-gold/[0.06] p-4 sm:col-span-2">
          <p className="eyebrow mb-1 text-gold">Your quote is attached</p>
          <p className="text-[0.9375rem] text-paper">
            {prefill.title}{" "}
            <span className="text-neutral-400">
              · {prefill.qty} units · {prefill.sku}
            </span>
          </p>
          <p className="mt-1 text-[0.8125rem] leading-relaxed text-neutral-400">
            It is noted in the message below — adjust anything before you send.
          </p>
        </div>
      )}
      <Field label="Business name" error={errors.businessName?.message}>
        <input className={inputClass} {...register("businessName")} />
      </Field>
      <Field label="Business type" error={errors.businessType?.message}>
        <select className={inputClass} defaultValue="" {...register("businessType")}>
          <option value="" disabled>
            Select…
          </option>
          <option value="salon">Salon</option>
          <option value="stylist">Independent stylist</option>
          <option value="reseller">Online reseller / white label</option>
          <option value="distributor">Distributor</option>
        </select>
      </Field>
      <Field label="Contact name" error={errors.contactName?.message}>
        <input className={inputClass} {...register("contactName")} />
      </Field>
      <Field label="Email" error={errors.email?.message}>
        <input type="email" className={inputClass} {...register("email")} />
      </Field>
      <Field label="Phone" error={errors.phone?.message}>
        <input type="tel" className={inputClass} {...register("phone")} />
      </Field>
      <Field label="Country" error={errors.country?.message}>
        <input className={inputClass} {...register("country")} />
      </Field>
      <Field label="Order volume" error={errors.estimatedVolume?.message}>
        <select className={inputClass} defaultValue="" {...register("estimatedVolume")}>
          <option value="" disabled>
            Select tier…
          </option>
          <option value="5-50">5–50 units — Bronze</option>
          <option value="50-200">50–200 units — Silver</option>
          <option value="200-500">200–500 units — Gold</option>
        </select>
      </Field>
      <div className="sm:col-span-2">
        <Field label="Anything we should know (optional)" error={errors.message?.message}>
          <textarea rows={4} className={inputClass} {...register("message")} />
        </Field>
      </div>

      {/* Services needed — turnkey options scoped up front */}
      <fieldset className="sm:col-span-2">
        <legend className="eyebrow mb-3">Services needed (optional)</legend>
        <div className="flex flex-wrap gap-2.5">
          {SERVICES.map((s) => (
            <label key={s} className="group cursor-pointer">
              <input type="checkbox" value={s} {...register("services")} className="peer sr-only" />
              <span className="inline-flex items-center rounded-full border border-white/15 px-4 py-2 text-[0.8125rem] text-neutral-300 transition-colors duration-300 group-hover:border-white/40 peer-checked:border-gold peer-checked:bg-gold/[0.06] peer-checked:text-gold">
                {s}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Consent gate */}
      <div className="sm:col-span-2">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            {...register("consent")}
            className="mt-1 size-4 shrink-0 accent-[#C9A66B]"
          />
          <span className="text-[0.8125rem] leading-relaxed text-neutral-400">
            I agree to Beyond Lace processing my enquiry in accordance with the{" "}
            <a href="/legal/privacy" className="text-gold underline-offset-4 hover:underline">
              Privacy Policy
            </a>
            .
          </span>
        </label>
        {errors.consent && (
          <span role="alert" className="mt-1.5 block text-[0.75rem] text-rose-400">
            {errors.consent.message}
          </span>
        )}
      </div>

      <div className="sm:col-span-2">
        <SubmitButton pending={isSubmitting}>Submit wholesale application</SubmitButton>
        <p className="mt-3 text-[0.75rem] text-neutral-400">Secure · Free · No obligation</p>
      </div>
    </form>
  );
}

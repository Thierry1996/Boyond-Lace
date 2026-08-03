"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Lock } from "lucide-react";
import {
  contactInquirySchema,
  type ContactInquiry,
  CUSTOMER_TYPES,
  CONTACT_SUBJECTS,
} from "@/lib/schemas";

/**
 * "Get in Touch" enquiry — the higher-intent contact form. Sits on the light
 * section, so it carries its own light-surface field styling (dark text on a
 * pale panel) rather than the dark shared inputClass. Posts to
 * /api/contact-inquiry which persists to the ContactMessage table.
 */

const field =
  "w-full rounded-md border border-plum-900/15 bg-white/70 px-4 py-3 text-[0.9375rem] text-plum-900 placeholder:text-plum-900/35 focus:border-plum-700 focus:outline-none transition-colors";
const labelCls =
  "mb-2 block text-[0.6875rem] font-medium tracking-[0.14em] text-plum-700 uppercase";

function LightField({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className={labelCls}>
        {label} {required && <span className="text-blush-400">*</span>}
      </span>
      {children}
      {error && (
        <span role="alert" className="mt-1.5 block text-[0.75rem] text-rose-500">
          {error}
        </span>
      )}
    </label>
  );
}

export function ContactInquiryForm() {
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactInquiry>({ resolver: zodResolver(contactInquirySchema) });

  if (done) {
    return (
      <div
        role="status"
        className="rounded-xl border border-plum-700/30 bg-white/70 p-10 text-center"
      >
        <p className="mb-3 text-[0.6875rem] font-medium tracking-[0.14em] text-plum-700 uppercase">
          Received
        </p>
        <h3 className="font-[family-name:var(--font-display)] text-2xl text-plum-900">
          We have it.
        </h3>
        <p className="mx-auto mt-3 max-w-md text-[0.9375rem] leading-relaxed text-plum-900/70">
          A human on the right desk replies within one business day. For anything urgent, WhatsApp
          reaches us in under two hours.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        const res = await fetch("/api/contact-inquiry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (res.ok) setDone(true);
      })}
      className="grid gap-6 sm:grid-cols-2"
      noValidate
    >
      <LightField label="First name" required error={errors.firstName?.message}>
        <input className={field} placeholder="Jane" {...register("firstName")} />
      </LightField>
      <LightField label="Last name" required error={errors.lastName?.message}>
        <input className={field} placeholder="Doe" {...register("lastName")} />
      </LightField>

      <div className="sm:col-span-2">
        <LightField label="Email address" required error={errors.email?.message}>
          <input
            type="email"
            className={field}
            placeholder="jane@yourbusiness.com"
            {...register("email")}
          />
        </LightField>
      </div>

      <LightField label="Phone / WhatsApp" error={errors.phone?.message}>
        <input className={field} placeholder="+1 (555) 000-0000" {...register("phone")} />
      </LightField>
      <LightField label="Country" required error={errors.country?.message}>
        <input className={field} placeholder="e.g. United States" {...register("country")} />
      </LightField>

      <div className="sm:col-span-2">
        <LightField label="Customer type" required error={errors.customerType?.message}>
          <select className={field} defaultValue="" {...register("customerType")}>
            <option value="" disabled>
              Select your role…
            </option>
            {CUSTOMER_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </LightField>
      </div>

      <div className="sm:col-span-2">
        <LightField label="Subject" required error={errors.subject?.message}>
          <select className={field} defaultValue="" {...register("subject")}>
            <option value="" disabled>
              What&rsquo;s this about?
            </option>
            {CONTACT_SUBJECTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </LightField>
      </div>

      <div className="sm:col-span-2">
        <LightField label="Your message" required error={errors.message?.message}>
          <textarea
            rows={5}
            className={field}
            placeholder="Tell us about your needs — quantities, textures, timelines, or anything else. The more detail, the faster we can help."
            {...register("message")}
          />
        </LightField>
      </div>

      <div className="sm:col-span-2">
        <label className="flex items-start gap-3 text-[0.8125rem] leading-relaxed text-plum-900/75">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 shrink-0 accent-plum-700"
            {...register("consent")}
          />
          <span>
            I consent to Beyond Lace processing my data to respond to this enquiry, in accordance
            with their{" "}
            <a href="/legal/privacy" className="text-plum-700 underline underline-offset-2">
              Privacy Policy
            </a>
            . <span className="text-blush-400">*</span>
          </span>
        </label>
        {errors.consent && (
          <span role="alert" className="mt-1.5 block text-[0.75rem] text-rose-500">
            {errors.consent.message}
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-5 sm:col-span-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-md bg-plum-900 px-9 py-4 text-[0.8125rem] tracking-[0.14em] text-blush-200 uppercase transition-colors hover:bg-plum-800 disabled:cursor-wait disabled:opacity-60"
        >
          {isSubmitting ? "Sending…" : "Send message"}
          <ArrowRight size={15} strokeWidth={1.75} />
        </button>
        <span className="flex items-center gap-1.5 text-[0.75rem] text-plum-900/55">
          <Lock size={12} strokeWidth={1.75} />
          Secure · We respond within 24 hours
        </span>
      </div>
    </form>
  );
}

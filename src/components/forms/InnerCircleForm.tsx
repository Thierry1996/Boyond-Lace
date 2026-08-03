"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, ShieldCheck, Mail, MessageCircle, Phone, AtSign } from "lucide-react";
import { newsletterSchema, type NewsletterSignup, CUSTOMER_TYPES } from "@/lib/schemas";
import { Field, inputClass } from "./fields";
import { EMAILS } from "@/lib/contact";

/**
 * "Join the Beyond Circle" newsletter form. Posts to /api/newsletter which
 * writes the subscriber to the Supabase marketing table (source=inner-circle).
 * Marketing preferences are granular per-channel opt-ins.
 */

const PREFS = [
  {
    name: "prefEmail" as const,
    Icon: Mail,
    label: "Email Marketing",
    badge: "Recommended",
    body: "New arrivals, promotions & guides — 2–4 emails a month, never spam.",
  },
  {
    name: "prefWhatsapp" as const,
    Icon: MessageCircle,
    label: "WhatsApp & SMS",
    badge: "Wholesale",
    body: "Flash stock alerts & order updates. Max 1–2 messages per week.",
  },
  {
    name: "prefPhone" as const,
    Icon: Phone,
    label: "Phone Consultation",
    body: "Allow our wholesale team to contact you directly for large orders.",
  },
  {
    name: "prefInstagram" as const,
    Icon: AtSign,
    label: "Instagram Updates",
    badge: "Social",
    body: "Follow @beyondlace and allow DM outreach for subscriber-only offers.",
  },
];

export function InnerCircleForm() {
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterSignup>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { prefEmail: true },
  });

  if (done) {
    return (
      <div role="status" className="border border-gold/40 bg-plum-900/40 p-10 text-center">
        <p className="eyebrow mb-3 text-gold">You&rsquo;re in</p>
        <h3 className="font-[family-name:var(--font-display)] text-2xl text-paper">
          Welcome to the Circle.
        </h3>
        <p className="mx-auto mt-3 max-w-md text-[0.9375rem] leading-relaxed text-blush-200/70">
          Check your inbox for a welcome note. You&rsquo;ll be first to hear about drops, flash
          deals, and subscriber-only pricing.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        const res = await fetch("/api/newsletter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (res.ok) setDone(true);
      })}
      className="grid gap-6 sm:grid-cols-2"
      noValidate
    >
      <Field label="First name" error={errors.firstName?.message}>
        <input className={inputClass} placeholder="Jane" {...register("firstName")} />
      </Field>
      <Field label="Last name" error={errors.lastName?.message}>
        <input className={inputClass} placeholder="Doe" {...register("lastName")} />
      </Field>

      <div className="sm:col-span-2">
        <Field label="Email address" error={errors.email?.message}>
          <input
            type="email"
            className={inputClass}
            placeholder="jane@yourbusiness.com"
            {...register("email")}
          />
        </Field>
      </div>

      <Field label="Phone / WhatsApp" error={errors.phone?.message}>
        <input className={inputClass} placeholder="+1 (555) 000-0000" {...register("phone")} />
      </Field>
      <Field label="Country" error={errors.country?.message}>
        <input className={inputClass} defaultValue="United States" {...register("country")} />
      </Field>

      <div className="sm:col-span-2">
        <Field label="I am a" error={errors.role?.message}>
          <select className={inputClass} defaultValue="" {...register("role")}>
            <option value="" disabled>
              Select your role…
            </option>
            {CUSTOMER_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {/* Marketing preferences */}
      <div className="sm:col-span-2">
        <p className="eyebrow mb-4 text-gold">Marketing preferences — how should we reach you?</p>
        <div className="space-y-3">
          {PREFS.map(({ name, Icon, label, badge, body }) => (
            <label
              key={name}
              className="flex cursor-pointer items-start gap-3 rounded-lg border border-white/[0.08] p-4 transition-colors hover:border-gold/40"
            >
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 shrink-0 accent-gold"
                {...register(name)}
              />
              <span className="flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <Icon size={15} strokeWidth={1.6} className="text-gold" />
                  <span className="text-[0.9375rem] text-paper">{label}</span>
                  {badge && (
                    <span className="rounded-sm border border-gold/40 px-1.5 py-0.5 text-[0.5625rem] tracking-[0.12em] text-gold uppercase">
                      {badge}
                    </span>
                  )}
                </span>
                <span className="mt-1 block text-[0.8125rem] leading-relaxed text-neutral-400">
                  {body}
                </span>
              </span>
            </label>
          ))}
        </div>
      </div>

      <p className="text-[0.75rem] leading-relaxed text-blush-200/55 sm:col-span-2">
        By subscribing, you confirm you are 18+ and agree to our{" "}
        <a href="/legal/privacy" className="text-gold underline underline-offset-2">
          Privacy Policy
        </a>
        . Withdraw consent anytime by emailing{" "}
        <a href={`mailto:${EMAILS.care}`} className="text-gold underline underline-offset-2">
          {EMAILS.care}
        </a>
        . We never sell your data.
      </p>

      <div className="flex flex-wrap items-center gap-5 sm:col-span-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="cta-primary inline-flex items-center gap-2 px-9 py-4 text-[0.8125rem] tracking-[0.14em] uppercase disabled:cursor-wait disabled:opacity-60"
        >
          {isSubmitting ? "Joining…" : "Join the Circle"}
          <ArrowRight size={15} strokeWidth={1.75} />
        </button>
        <span className="flex items-center gap-1.5 text-[0.75rem] text-blush-200/55">
          <ShieldCheck size={13} strokeWidth={1.6} />
          GDPR compliant · Unsubscribe anytime
        </span>
      </div>
    </form>
  );
}

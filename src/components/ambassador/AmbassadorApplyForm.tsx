"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ambassadorApplicationSchema, type AmbassadorApplication } from "@/lib/schemas";
import { Field, FormSuccess, SubmitButton, inputClass } from "@/components/forms/fields";
import type { TierSlug } from "@/lib/ambassador";

/**
 * Ambassador application. The applicant supplies reach and social handles; the
 * social marketing division assigns the tier at review — `preferredTier` is a
 * hint only, never a guarantee, and the copy says so.
 */
export function AmbassadorApplyForm({ preferredTier }: { preferredTier?: TierSlug }) {
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AmbassadorApplication>({
    resolver: zodResolver(ambassadorApplicationSchema),
    defaultValues: { preferredTier, consent: false },
  });

  if (done) {
    return (
      <FormSuccess
        title="Your application is with the marketing division."
        body="We review reach, content and audience fit, then assign your tier — usually within three business days. Approved ambassadors receive a portal invitation by email."
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        const res = await fetch("/api/ambassador/apply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (res.ok) setDone(true);
      })}
      className="grid gap-6 text-left sm:grid-cols-2"
      noValidate
    >
      <Field label="Full name" error={errors.fullName?.message}>
        <input className={inputClass} autoComplete="name" {...register("fullName")} />
      </Field>
      <Field label="Email" error={errors.email?.message}>
        <input type="email" className={inputClass} autoComplete="email" {...register("email")} />
      </Field>
      <Field label="Phone number" error={errors.phone?.message}>
        <input type="tel" className={inputClass} autoComplete="tel" {...register("phone")} />
      </Field>
      <Field label="Country" error={errors.country?.message}>
        <input className={inputClass} autoComplete="country-name" {...register("country")} />
      </Field>

      <div className="sm:col-span-2">
        <Field label="Instagram profile URL" error={errors.instagramUrl?.message}>
          <input
            className={inputClass}
            placeholder="https://instagram.com/yourhandle"
            {...register("instagramUrl")}
          />
        </Field>
      </div>
      <Field label="TikTok URL (optional)" error={errors.tiktokUrl?.message}>
        <input
          className={inputClass}
          placeholder="https://tiktok.com/@yourhandle"
          {...register("tiktokUrl")}
        />
      </Field>
      <Field label="YouTube URL (optional)" error={errors.youtubeUrl?.message}>
        <input
          className={inputClass}
          placeholder="https://youtube.com/@yourhandle"
          {...register("youtubeUrl")}
        />
      </Field>

      <Field label="Largest follower count" error={errors.followerCount?.message}>
        <input
          type="number"
          min={0}
          className={inputClass}
          placeholder="e.g. 24000"
          {...register("followerCount", { valueAsNumber: true })}
        />
      </Field>
      <Field label="Primary niche" error={errors.primaryNiche?.message}>
        <select className={inputClass} defaultValue="" {...register("primaryNiche")}>
          <option value="" disabled>
            Select…
          </option>
          <option value="hair-transformation">Hair & transformation</option>
          <option value="beauty-lifestyle">Beauty & lifestyle</option>
          <option value="professional-stylist">Professional stylist</option>
          <option value="salon-owner">Salon owner</option>
          <option value="medical-restoration">Medical & restoration</option>
          <option value="fashion-editorial">Fashion & editorial</option>
        </select>
      </Field>

      <Field label="Tier you're applying for" error={errors.preferredTier?.message}>
        <select
          className={inputClass}
          defaultValue={preferredTier ?? ""}
          {...register("preferredTier")}
        >
          <option value="">No preference — you decide</option>
          <option value="tier-3">Tier 3 — Micro Affiliate</option>
          <option value="tier-2">Tier 2 — Macro Exclusive</option>
          <option value="tier-1">Tier 1 — Celebrity / Stylist</option>
        </select>
      </Field>
      <Field label="Portfolio or media kit (optional)" error={errors.portfolioUrl?.message}>
        <input className={inputClass} placeholder="https://…" {...register("portfolioUrl")} />
      </Field>

      <div className="sm:col-span-2">
        <Field label="Anything we should know (optional)" error={errors.message?.message}>
          <textarea rows={4} className={inputClass} {...register("message")} />
        </Field>
      </div>

      <div className="sm:col-span-2">
        <label className="flex items-start gap-3 text-[0.8125rem] leading-relaxed text-neutral-400">
          <input type="checkbox" className="mt-1 accent-[#C9A66B]" {...register("consent")} />I
          confirm these accounts are mine, the follower figures are accurate, and Beyond Lace may
          review my public content to classify my tier.
        </label>
        {errors.consent && (
          <p role="alert" className="mt-1.5 text-[0.75rem] text-rose-400">
            {errors.consent.message}
          </p>
        )}
      </div>

      <div className="sm:col-span-2">
        <SubmitButton pending={isSubmitting}>Submit application</SubmitButton>
        <p className="mt-4 text-[0.75rem] leading-relaxed text-neutral-400">
          Tier is assigned by the Beyond Lace social marketing division at review. Your selection
          above is treated as a preference, not a guarantee.
        </p>
      </div>
    </form>
  );
}

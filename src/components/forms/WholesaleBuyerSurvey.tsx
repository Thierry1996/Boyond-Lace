"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { wholesaleSurveySchema, type WholesaleSurvey } from "@/lib/schemas";
import { Field, FormSuccess, SubmitButton, inputClass } from "./fields";

/**
 * Wholesale buyer survey — a three-step qualifying questionnaire that feeds the
 * same partner intake as the full application, but asks only what the partner
 * team needs to price and prioritise a lead. Single-select questions render as
 * radio tiles; the two "what you sell" questions collect arrays of checkboxes.
 *
 * Each step is validated before it advances (RHF `trigger`), so a partner never
 * reaches the end with an empty answer. Posts to /api/wholesale-survey.
 */

const BUSINESS_TYPES: Array<{
  value: WholesaleSurvey["businessType"];
  label: string;
  note: string;
}> = [
  { value: "salon", label: "Salon", note: "Installs for a client book" },
  { value: "stylist", label: "Independent stylist", note: "Chair or mobile" },
  { value: "reseller", label: "Online reseller", note: "Store or white label" },
  { value: "distributor", label: "Distributor", note: "Supplying other sellers" },
  { value: "new", label: "Just starting out", note: "Building the business" },
];

const VOLUMES: Array<{ value: WholesaleSurvey["monthlyVolume"]; label: string; note: string }> = [
  { value: "under-50", label: "Under 50", note: "Below the standing minimum" },
  { value: "50-149", label: "50 – 149", note: "Bronze tier" },
  { value: "150-499", label: "150 – 499", note: "Silver tier" },
  { value: "500+", label: "500+", note: "Gold tier" },
];

const TIMELINES: Array<{ value: WholesaleSurvey["timeline"]; label: string; note: string }> = [
  { value: "now", label: "Ready now", note: "Ordering this month" },
  { value: "1-3-months", label: "1 – 3 months", note: "Planning the launch" },
  { value: "exploring", label: "Exploring", note: "Comparing suppliers" },
];

const PRIVATE_LABEL: Array<{
  value: WholesaleSurvey["privateLabel"];
  label: string;
  note: string;
}> = [
  { value: "yes", label: "Yes — my branding", note: "Your box, comb, hang tag" },
  { value: "maybe", label: "Maybe later", note: "Start plain, brand later" },
  { value: "no", label: "No — unbranded", note: "Ship it as it comes" },
];

const CHANNELS = [
  "Salon / in-person",
  "Own website",
  "Instagram",
  "TikTok",
  "Referrals & word of mouth",
  "Pop-ups & events",
];

const TEXTURES = [
  "Body Wave",
  "Straight",
  "Deep Wave",
  "Kinky Straight",
  "Kinky Curly",
  "Jerry Curl",
];

/** Radio tile bound to an RHF field via register. */
function ChoiceTile({
  name,
  value,
  label,
  note,
  register,
}: {
  name: keyof WholesaleSurvey;
  value: string;
  label: string;
  note: string;
  register: ReturnType<typeof useForm<WholesaleSurvey>>["register"];
}) {
  return (
    <label className="group relative block cursor-pointer">
      <input type="radio" value={value} {...register(name)} className="peer sr-only" />
      <span className="block border border-white/15 p-4 transition-colors duration-300 peer-checked:border-gold peer-checked:bg-gold/[0.06] group-hover:border-white/40 peer-checked:group-hover:border-gold">
        <span className="block text-[0.9375rem] text-paper">{label}</span>
        <span className="mt-1 block text-[0.75rem] leading-snug text-neutral-400">{note}</span>
      </span>
      <span className="pointer-events-none absolute top-3 right-3 grid size-4 place-items-center rounded-full bg-gold text-ink opacity-0 transition-opacity peer-checked:opacity-100">
        <Check size={11} strokeWidth={3} />
      </span>
    </label>
  );
}

/** Checkbox chip for the array questions (channels, textures). */
function ChoiceChip({
  name,
  value,
  register,
}: {
  name: "channels" | "textures";
  value: string;
  register: ReturnType<typeof useForm<WholesaleSurvey>>["register"];
}) {
  return (
    <label className="group cursor-pointer">
      <input type="checkbox" value={value} {...register(name)} className="peer sr-only" />
      <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-[0.8125rem] text-neutral-300 transition-colors duration-300 peer-checked:border-gold peer-checked:bg-gold/[0.06] peer-checked:text-gold group-hover:border-white/40">
        {value}
      </span>
    </label>
  );
}

const STEPS = ["About you", "What you sell", "Where to send it"] as const;
const STEP_FIELDS: Array<Array<keyof WholesaleSurvey>> = [
  ["businessType", "monthlyVolume", "timeline"],
  ["channels", "textures", "privateLabel"],
  ["email"],
];

export function WholesaleBuyerSurvey() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<WholesaleSurvey>({
    resolver: zodResolver(wholesaleSurveySchema),
    defaultValues: { channels: [], textures: [] },
  });

  if (done) {
    return (
      <FormSuccess
        title="Survey received."
        body="A partner manager will reach out with pricing matched to your channels and volume. Ready to make it formal? The application above releases the full catalogue."
      />
    );
  }

  async function next() {
    const valid = await trigger(STEP_FIELDS[step]);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        const res = await fetch("/api/wholesale-survey", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (res.ok) setDone(true);
      })}
      className="text-left"
      noValidate
    >
      {/* Step rail */}
      <ol className="mb-10 flex items-center gap-3">
        {STEPS.map((label, i) => (
          <li key={label} className="flex flex-1 items-center gap-3">
            <span
              className={`grid size-7 shrink-0 place-items-center rounded-full border text-[0.75rem] tabular-nums transition-colors ${
                i < step
                  ? "border-gold bg-gold text-ink"
                  : i === step
                    ? "border-gold text-gold"
                    : "border-white/20 text-neutral-400"
              }`}
            >
              {i < step ? <Check size={13} strokeWidth={2.5} /> : i + 1}
            </span>
            <span
              className={`hidden text-[0.75rem] tracking-[0.08em] uppercase sm:block ${
                i === step ? "text-paper" : "text-neutral-400"
              }`}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && <span className="h-px flex-1 bg-white/12" />}
          </li>
        ))}
      </ol>

      {/* Step 1 — about you */}
      {step === 0 && (
        <div className="space-y-8">
          <fieldset>
            <legend className="eyebrow mb-3">What best describes you?</legend>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {BUSINESS_TYPES.map((o) => (
                <ChoiceTile key={o.value} name="businessType" register={register} {...o} />
              ))}
            </div>
            {errors.businessType && (
              <span className="mt-2 block text-[0.75rem] text-rose-400">
                {errors.businessType.message}
              </span>
            )}
          </fieldset>
          <fieldset>
            <legend className="eyebrow mb-3">How many units a month, roughly?</legend>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {VOLUMES.map((o) => (
                <ChoiceTile key={o.value} name="monthlyVolume" register={register} {...o} />
              ))}
            </div>
            {errors.monthlyVolume && (
              <span className="mt-2 block text-[0.75rem] text-rose-400">
                {errors.monthlyVolume.message}
              </span>
            )}
          </fieldset>
          <fieldset>
            <legend className="eyebrow mb-3">When would you start?</legend>
            <div className="grid gap-3 sm:grid-cols-3">
              {TIMELINES.map((o) => (
                <ChoiceTile key={o.value} name="timeline" register={register} {...o} />
              ))}
            </div>
            {errors.timeline && (
              <span className="mt-2 block text-[0.75rem] text-rose-400">
                {errors.timeline.message}
              </span>
            )}
          </fieldset>
        </div>
      )}

      {/* Step 2 — what you sell */}
      {step === 1 && (
        <div className="space-y-8">
          <fieldset>
            <legend className="eyebrow mb-3">Where do you sell? (Pick any)</legend>
            <div className="flex flex-wrap gap-2.5">
              {CHANNELS.map((c) => (
                <ChoiceChip key={c} name="channels" value={c} register={register} />
              ))}
            </div>
            {errors.channels && (
              <span className="mt-2 block text-[0.75rem] text-rose-400">
                {errors.channels.message}
              </span>
            )}
          </fieldset>
          <fieldset>
            <legend className="eyebrow mb-3">Which textures move for you? (Pick any)</legend>
            <div className="flex flex-wrap gap-2.5">
              {TEXTURES.map((t) => (
                <ChoiceChip key={t} name="textures" value={t} register={register} />
              ))}
            </div>
            {errors.textures && (
              <span className="mt-2 block text-[0.75rem] text-rose-400">
                {errors.textures.message}
              </span>
            )}
          </fieldset>
          <fieldset>
            <legend className="eyebrow mb-3">Interested in private label?</legend>
            <div className="grid gap-3 sm:grid-cols-3">
              {PRIVATE_LABEL.map((o) => (
                <ChoiceTile key={o.value} name="privateLabel" register={register} {...o} />
              ))}
            </div>
            {errors.privateLabel && (
              <span className="mt-2 block text-[0.75rem] text-rose-400">
                {errors.privateLabel.message}
              </span>
            )}
          </fieldset>
        </div>
      )}

      {/* Step 3 — contact */}
      {step === 2 && (
        <div className="grid gap-6">
          <Field label="Email" error={errors.email?.message}>
            <input
              type="email"
              className={inputClass}
              placeholder="you@yourbusiness.com"
              {...register("email")}
            />
          </Field>
          <Field label="Anything else we should know? (optional)" error={errors.message?.message}>
            <textarea
              rows={3}
              className={inputClass}
              placeholder="Lengths you run most, deadlines, questions…"
              {...register("message")}
            />
          </Field>
          <p className="text-[0.75rem] leading-relaxed text-neutral-400">
            We use your answers to match pricing and reach out — nothing else. No account, no spam.
          </p>
        </div>
      )}

      {/* Nav */}
      <div className="mt-10 flex items-center justify-between border-t border-white/[0.07] pt-6">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(s - 1, 0))}
            className="inline-flex items-center gap-2 text-[0.8125rem] tracking-[0.08em] text-neutral-300 uppercase transition-colors hover:text-gold"
          >
            <ArrowLeft size={15} strokeWidth={1.75} />
            Back
          </button>
        ) : (
          <span className="text-[0.75rem] text-neutral-400 tabular-nums">
            Step {step + 1} of {STEPS.length}
          </span>
        )}

        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={next}
            className="cta-primary inline-flex items-center gap-2 px-8 py-3.5 text-[0.8125rem] tracking-[0.14em] uppercase"
          >
            Continue
            <ArrowRight size={15} strokeWidth={1.75} />
          </button>
        ) : (
          <SubmitButton pending={isSubmitting}>Send survey</SubmitButton>
        )}
      </div>
    </form>
  );
}

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Play } from "lucide-react";
import { campaignLogSchema, type CampaignLog } from "@/lib/schemas";
import { Field, SubmitButton, inputClass } from "@/components/forms/fields";
import { TikTokGlyph, InstagramGlyph } from "@/components/brand/SocialIcons";

/**
 * Self-reported campaign log. Numbers here are reconciled against affiliate
 * link clicks and conversions — the two together are what tier reviews use.
 */

const AD_FORMATS = [
  { value: "UGC_REEL", label: "UGC reel" },
  { value: "TRANSFORMATION_BEFORE_AFTER", label: "Before / after transformation" },
  { value: "LONG_FORM_TUTORIAL", label: "Long-form tutorial" },
  { value: "STORY", label: "Story" },
  { value: "LIVE", label: "Live" },
  { value: "STATIC_POST", label: "Static post" },
  { value: "PAID_BOOST", label: "Paid boost" },
];

const SEED_CAMPAIGNS = [
  {
    title: "Glueless install, 4-minute morning",
    platform: "TIKTOK",
    format: "UGC reel",
    start: "2026-07-02",
    impressions: 142000,
    reactions: 9800,
    clicks: 1240,
  },
  {
    title: "Lace melt — the daylight test",
    platform: "INSTAGRAM",
    format: "Before / after transformation",
    start: "2026-06-24",
    impressions: 88400,
    reactions: 6120,
    clicks: 940,
  },
  {
    title: "Coily 4A leave-out blend tutorial",
    platform: "TIKTOK",
    format: "Long-form tutorial",
    start: "2026-06-11",
    impressions: 61300,
    reactions: 4410,
    clicks: 655,
  },
];

function PlatformMark({ platform }: { platform: string }) {
  if (platform === "TIKTOK") return <TikTokGlyph size={14} className="text-gold" />;
  if (platform === "INSTAGRAM") return <InstagramGlyph size={14} className="text-gold" />;
  return <Play size={14} strokeWidth={1.6} className="text-gold" />;
}

export function CampaignLogger() {
  const [open, setOpen] = useState(false);
  const [logged, setLogged] = useState<CampaignLog[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CampaignLog>({ resolver: zodResolver(campaignLogSchema) });

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="eyebrow text-gold">
          {SEED_CAMPAIGNS.length + logged.length} campaigns on record
        </p>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 border border-gold px-6 py-3 text-[0.75rem] tracking-[0.12em] text-gold uppercase transition-all duration-300 hover:bg-gold hover:text-ink"
        >
          <Plus
            size={13}
            strokeWidth={1.75}
            className={`transition-transform duration-300 ${open ? "rotate-45" : ""}`}
          />
          {open ? "Cancel" : "Log a campaign"}
        </button>
      </div>

      {open && (
        <form
          onSubmit={handleSubmit(async (data) => {
            const res = await fetch("/api/ambassador/campaigns", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            });
            if (res.ok) {
              setLogged((l) => [data, ...l]);
              reset();
              setOpen(false);
            }
          })}
          className="grid gap-6 rounded-xl border border-gold/25 bg-plum-900/40 p-7 sm:grid-cols-2"
          noValidate
        >
          <div className="sm:col-span-2">
            <Field label="Campaign title" error={errors.title?.message}>
              <input
                className={inputClass}
                placeholder="Glueless install reel"
                {...register("title")}
              />
            </Field>
          </div>
          <Field label="Platform" error={errors.platform?.message}>
            <select className={inputClass} defaultValue="" {...register("platform")}>
              <option value="" disabled>
                Select…
              </option>
              <option value="INSTAGRAM">Instagram</option>
              <option value="TIKTOK">TikTok</option>
              <option value="YOUTUBE">YouTube</option>
              <option value="PINTEREST">Pinterest</option>
            </select>
          </Field>
          <Field label="Ad / content format" error={errors.format?.message}>
            <select className={inputClass} defaultValue="" {...register("format")}>
              <option value="" disabled>
                Select…
              </option>
              {AD_FORMATS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Start date" error={errors.startDate?.message}>
            <input type="date" className={inputClass} {...register("startDate")} />
          </Field>
          <Field label="End date (optional)" error={errors.endDate?.message}>
            <input type="date" className={inputClass} {...register("endDate")} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Post URL (optional)" error={errors.postUrl?.message}>
              <input className={inputClass} placeholder="https://…" {...register("postUrl")} />
            </Field>
          </div>
          <Field label="Impressions" error={errors.impressions?.message}>
            <input
              type="number"
              min={0}
              className={inputClass}
              {...register("impressions", { valueAsNumber: true })}
            />
          </Field>
          <Field label="Reactions" error={errors.reactions?.message}>
            <input
              type="number"
              min={0}
              className={inputClass}
              {...register("reactions", { valueAsNumber: true })}
            />
          </Field>
          <Field label="Clicks to Beyond Lace" error={errors.clicks?.message}>
            <input
              type="number"
              min={0}
              className={inputClass}
              {...register("clicks", { valueAsNumber: true })}
            />
          </Field>
          <Field label="Paid boost spend (USD)" error={errors.adSpendUsd?.message}>
            <input
              type="number"
              min={0}
              step="0.01"
              className={inputClass}
              {...register("adSpendUsd", { valueAsNumber: true })}
            />
          </Field>
          <div className="sm:col-span-2">
            <SubmitButton pending={isSubmitting}>Save campaign</SubmitButton>
          </div>
        </form>
      )}

      {/* Record */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[46rem] border-collapse text-left">
          <thead>
            <tr className="border-b border-gold/25">
              {["Campaign", "Format", "Started", "Impressions", "Reactions", "Clicks"].map((h) => (
                <th key={h} className="eyebrow py-3 pr-6 text-gold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {logged.map((c, i) => (
              <tr key={`new-${i}`} className="border-b border-white/[0.07] bg-gold/[0.04]">
                <td className="py-4 pr-6 text-[0.9375rem] text-paper">{c.title}</td>
                <td className="py-4 pr-6 text-[0.8125rem] text-neutral-400">{c.format}</td>
                <td className="py-4 pr-6 text-[0.8125rem] text-neutral-400 tabular-nums">
                  {c.startDate}
                </td>
                <td className="py-4 pr-6 text-[0.8125rem] text-neutral-200 tabular-nums">
                  {(c.impressions ?? 0).toLocaleString()}
                </td>
                <td className="py-4 pr-6 text-[0.8125rem] text-neutral-200 tabular-nums">
                  {(c.reactions ?? 0).toLocaleString()}
                </td>
                <td className="py-4 pr-6 text-[0.8125rem] text-gold tabular-nums">
                  {(c.clicks ?? 0).toLocaleString()}
                </td>
              </tr>
            ))}
            {SEED_CAMPAIGNS.map((c) => (
              <tr
                key={c.title}
                className="border-b border-white/[0.07] transition-colors duration-300 hover:bg-white/[0.02]"
              >
                <td className="py-4 pr-6">
                  <span className="flex items-center gap-2.5 text-[0.9375rem] text-paper">
                    <PlatformMark platform={c.platform} />
                    {c.title}
                  </span>
                </td>
                <td className="py-4 pr-6 text-[0.8125rem] text-neutral-400">{c.format}</td>
                <td className="py-4 pr-6 text-[0.8125rem] text-neutral-400 tabular-nums">
                  {c.start}
                </td>
                <td className="py-4 pr-6 text-[0.8125rem] text-neutral-200 tabular-nums">
                  {c.impressions.toLocaleString()}
                </td>
                <td className="py-4 pr-6 text-[0.8125rem] text-neutral-200 tabular-nums">
                  {c.reactions.toLocaleString()}
                </td>
                <td className="py-4 pr-6 text-[0.8125rem] text-gold tabular-nums">
                  {c.clicks.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[0.75rem] text-neutral-400">
        Existing rows are demonstration data. Campaigns you log are validated and saved to your
        record.
      </p>
    </div>
  );
}

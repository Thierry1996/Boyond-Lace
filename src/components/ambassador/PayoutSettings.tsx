"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Wallet, Check } from "lucide-react";
import { payoutMethodSchema, type PayoutMethodInput } from "@/lib/schemas";
import { Field, SubmitButton, inputClass } from "@/components/forms/fields";
import { Money } from "@/components/ui/Money";

/**
 * Payout channel setup and balance view.
 *
 * Destinations are captured and validated per-channel here. Actual disbursement
 * requires processor credentials (PayPal Payouts API, and a custody decision
 * for crypto), so requests are queued for the payments desk rather than
 * pretending to settle — the status column says exactly which is which.
 */

const CHANNELS = [
  { value: "PAYPAL", label: "PayPal", hint: "you@email.com", note: "Fastest, most countries" },
  { value: "CASHAPP", label: "CashApp", hint: "$yourcashtag", note: "US only" },
  {
    value: "BANK_TRANSFER",
    label: "Bank transfer",
    hint: "IBAN / account number",
    note: "Contracted tiers",
  },
  { value: "USDC_WALLET", label: "USDC wallet", hint: "0x…", note: "Stablecoin, low fees" },
  { value: "BTC_WALLET", label: "Bitcoin wallet", hint: "bc1…", note: "Network fees apply" },
  { value: "ETH_WALLET", label: "Ethereum wallet", hint: "0x…", note: "Network fees apply" },
];

const BALANCE = { cleared: 128450, pending: 41200, lifetime: 986300 };

const HISTORY = [
  { date: "2026-06-30", amount: 94200, channel: "PayPal", status: "Paid" },
  { date: "2026-05-31", amount: 88750, channel: "PayPal", status: "Paid" },
  { date: "2026-04-30", amount: 61400, channel: "USDC wallet", status: "Paid" },
];

export function PayoutSettings() {
  const [saved, setSaved] = useState<PayoutMethodInput | null>(null);
  const [requested, setRequested] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PayoutMethodInput>({ resolver: zodResolver(payoutMethodSchema) });

  const channel = watch("channel");
  const hint = CHANNELS.find((c) => c.value === channel)?.hint ?? "Destination";

  return (
    <div className="space-y-12">
      {/* Balance */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Cleared — ready to withdraw", value: BALANCE.cleared, accent: true },
          { label: "Pending clearance", value: BALANCE.pending, accent: false },
          { label: "Lifetime earnings", value: BALANCE.lifetime, accent: false },
        ].map((b) => (
          <div
            key={b.label}
            className={`rounded-xl border p-6 transition-colors duration-400 ${
              b.accent ? "border-gold/50 bg-plum-900/50" : "border-white/[0.07]"
            }`}
          >
            <Money
              usd={b.value}
              className="font-[family-name:var(--font-display)] text-3xl text-paper tabular-nums"
            />
            <p className="eyebrow mt-2">{b.label}</p>
          </div>
        ))}
      </div>

      <div>
        <button
          onClick={() => setRequested(true)}
          disabled={requested || !saved}
          className="cta-primary flex items-center gap-2 px-8 py-3.5 text-[0.75rem] tracking-[0.12em] uppercase disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Wallet size={14} strokeWidth={1.75} />
          {requested ? "Payout requested" : "Request payout"}
        </button>
        {!saved && (
          <p className="mt-3 text-[0.75rem] text-neutral-400">
            Add a payout destination below before requesting.
          </p>
        )}
        {requested && (
          <p className="mt-3 text-[0.75rem] text-gold">
            Queued for the payments desk. Live disbursement activates once processor credentials are
            configured.
          </p>
        )}
      </div>

      {/* Channel setup */}
      <div>
        <p className="eyebrow mb-4 text-gold">Payout destination</p>

        {saved ? (
          <div className="flex flex-wrap items-center gap-4 rounded-xl border border-gold/40 bg-plum-900/50 p-6">
            <Check size={18} className="text-gold" />
            <div className="flex-1">
              <p className="text-[0.9375rem] text-paper">
                {CHANNELS.find((c) => c.value === saved.channel)?.label}
              </p>
              <p className="font-mono text-[0.75rem] text-neutral-400">{saved.destination}</p>
            </div>
            <button
              onClick={() => setSaved(null)}
              className="text-[0.6875rem] tracking-[0.1em] text-gold uppercase hover:opacity-75"
            >
              Change
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit((data) => setSaved(data))}
            className="grid gap-6 rounded-xl border border-white/[0.07] p-7 sm:grid-cols-2"
            noValidate
          >
            <Field label="Channel" error={errors.channel?.message}>
              <select className={inputClass} defaultValue="" {...register("channel")}>
                <option value="" disabled>
                  Select…
                </option>
                {CHANNELS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label} — {c.note}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Destination" error={errors.destination?.message}>
              <input className={inputClass} placeholder={hint} {...register("destination")} />
            </Field>
            <div className="sm:col-span-2">
              <SubmitButton pending={isSubmitting}>Save destination</SubmitButton>
            </div>
          </form>
        )}
      </div>

      {/* History */}
      <div>
        <p className="eyebrow mb-4 text-gold">Payout history</p>
        <div className="divide-y divide-white/[0.07] border-t border-white/[0.07]">
          {HISTORY.map((h) => (
            <div
              key={h.date}
              className="flex flex-wrap items-center justify-between gap-4 py-4 transition-colors duration-300 hover:bg-white/[0.02]"
            >
              <span className="text-[0.875rem] text-neutral-400 tabular-nums">{h.date}</span>
              <span className="text-[0.875rem] text-neutral-200">{h.channel}</span>
              <Money usd={h.amount} className="text-[0.9375rem] text-paper tabular-nums" />
              <span className="rounded-full border border-gold/40 px-3 py-1 text-[0.625rem] tracking-[0.1em] text-gold uppercase">
                {h.status}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[0.75rem] text-neutral-400">Demonstration history.</p>
      </div>
    </div>
  );
}

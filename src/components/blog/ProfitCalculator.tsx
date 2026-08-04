"use client";

import { useState } from "react";
import { Calculator } from "lucide-react";

/**
 * Interactive profit calculator. Estimates monthly social-commerce profit from
 * wholesale cost, retail price, units sold and expenses — all client-side.
 */
export function ProfitCalculator() {
  const [wholesale, setWholesale] = useState(89);
  const [retail, setRetail] = useState(189);
  const [units, setUnits] = useState(50);
  const [expenses, setExpenses] = useState(500);
  const [shown, setShown] = useState(false);

  const revenue = retail * units;
  const cogs = wholesale * units;
  const grossProfit = revenue - cogs;
  const netProfit = grossProfit - expenses;
  const margin = revenue > 0 ? Math.round((netProfit / revenue) * 100) : 0;
  const usd = (n: number) => `$${Math.round(n).toLocaleString()}`;

  const Input = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: number;
    onChange: (n: number) => void;
  }) => (
    <label className="block">
      <span className="mb-1.5 block text-[0.75rem] font-medium text-plum-900/70">{label}</span>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
        className="w-full rounded-md border border-plum-900/15 bg-white px-3 py-2.5 text-[0.9375rem] text-plum-900 focus:border-plum-600 focus:outline-none"
      />
    </label>
  );

  return (
    <div className="rounded-2xl border border-plum-700/15 bg-gradient-to-br from-plum-700/[0.07] to-blush-400/[0.1] p-6 sm:p-8">
      <p className="mb-6 flex items-center gap-2 font-[family-name:var(--font-display)] text-lg text-plum-900">
        <Calculator size={18} strokeWidth={1.75} className="text-plum-600" aria-hidden />
        Calculate Your Potential Profits
      </p>

      <div className="grid gap-4 sm:grid-cols-3">
        <Input label="Wholesale Cost Per Unit ($)" value={wholesale} onChange={setWholesale} />
        <Input label="Retail Price Per Unit ($)" value={retail} onChange={setRetail} />
        <Input label="Units Sold Per Month" value={units} onChange={setUnits} />
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <Input label="Monthly Expenses ($)" value={expenses} onChange={setExpenses} />
        <button
          type="button"
          onClick={() => setShown(true)}
          className="rounded-md bg-plum-600 px-7 py-2.5 text-[0.75rem] font-semibold tracking-[0.12em] text-white uppercase transition-all duration-300 hover:-translate-y-0.5 hover:bg-plum-500 active:scale-95"
        >
          Calculate Profit
        </button>
      </div>

      {shown && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Monthly Revenue", value: usd(revenue) },
            { label: "Gross Profit", value: usd(grossProfit) },
            { label: "Net Profit", value: usd(netProfit) },
            { label: "Net Margin", value: `${margin}%` },
          ].map((r) => (
            <div
              key={r.label}
              className="rounded-xl border border-plum-900/10 bg-white/80 p-4 text-center"
            >
              <p className="font-[family-name:var(--font-display)] text-xl text-plum-600">
                {r.value}
              </p>
              <p className="mt-1 text-[0.625rem] tracking-wide text-plum-900/50 uppercase">
                {r.label}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

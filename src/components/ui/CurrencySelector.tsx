"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useCurrency } from "@/lib/stores/currency";
import { CURRENCIES, getCurrency } from "@/lib/currency";

/** Header currency picker. Selection converts every price live via <Money>. */
export function CurrencySelector({ onDark = true }: { onDark?: boolean }) {
  const { code, setCode, hydrated, live } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const current = getCurrency(code);
  const text = onDark ? "text-neutral-200 hover:text-blush-300" : "text-ink/70 hover:text-ink";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`eyebrow flex items-center gap-1.5 transition-colors ${text}`}
        suppressHydrationWarning
      >
        <span>{current.flag}</span>
        <span>{hydrated ? current.code : "USD"}</span>
        <span>{current.symbol}</span>
        <ChevronDown
          size={11}
          strokeWidth={1.5}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 z-50 mt-3 w-56 border border-gold/30 bg-ink py-2 shadow-2xl"
        >
          <p className="eyebrow px-4 pb-2 text-gold">
            Currency {live ? "· live rates" : "· est. rates"}
          </p>
          {CURRENCIES.map((c) => (
            <button
              key={c.code}
              role="option"
              aria-selected={c.code === code}
              onClick={() => {
                setCode(c.code);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-3 px-4 py-2 text-left text-[0.8125rem] transition-colors hover:bg-plum-900 ${
                c.code === code ? "text-gold" : "text-neutral-200"
              }`}
            >
              <span className="text-base">{c.flag}</span>
              <span className="w-9 tabular-nums">{c.code}</span>
              <span className="text-neutral-400">{c.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

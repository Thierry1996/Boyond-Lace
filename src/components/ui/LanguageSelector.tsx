"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLocale, LOCALES } from "@/lib/stores/locale";

/** Header language picker. Auto-detects browser region; selection persists. */
export function LanguageSelector({ onDark = true }: { onDark?: boolean }) {
  const { code, setCode, hydrated } = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const current = LOCALES.find((l) => l.code === code) ?? LOCALES[0];
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
        <span>{hydrated ? current.code.split("-")[0].toUpperCase() : "EN"}</span>
        <ChevronDown
          size={11}
          strokeWidth={1.5}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 z-50 mt-3 w-52 border border-gold/30 bg-ink py-2 shadow-2xl"
        >
          <p className="eyebrow px-4 pb-2 text-gold">Language / Region</p>
          {LOCALES.map((l) => (
            <button
              key={l.code}
              role="option"
              aria-selected={l.code === code}
              onClick={() => {
                setCode(l.code);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-3 px-4 py-2 text-left text-[0.8125rem] transition-colors hover:bg-plum-900 ${
                l.code === code ? "text-gold" : "text-neutral-200"
              }`}
            >
              <span className="text-base">{l.flag}</span>
              <span className="flex-1">{l.label}</span>
              {!l.translated && (
                <span className="text-[0.625rem] tracking-wide text-neutral-400 uppercase">
                  soon
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

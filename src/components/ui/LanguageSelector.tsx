"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";
import { useLocale, LOCALES } from "@/lib/stores/locale";

/**
 * Header language picker. Auto-detects browser region; selection persists.
 *
 * The panel is portalled to <body> so the header's `overflow-hidden` collapsing
 * row cannot clip it (see CurrencySelector for the same pattern).
 */
export function LanguageSelector({ onDark = true }: { onDark?: boolean }) {
  const { code, setCode, hydrated } = useLocale();
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; right: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const place = () => {
      const r = btnRef.current?.getBoundingClientRect();
      if (r) setPos({ top: r.bottom + 10, right: window.innerWidth - r.right });
    };
    place();
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (btnRef.current?.contains(t) || panelRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onScroll = () => setOpen(false);
    document.addEventListener("mousedown", onDown);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open]);

  const current = LOCALES.find((l) => l.code === code) ?? LOCALES[0];
  const text = onDark ? "text-neutral-200 hover:text-blush-300" : "text-ink/70 hover:text-ink";

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`eyebrow flex items-center gap-1 transition-colors ${text}`}
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

      {open &&
        pos &&
        createPortal(
          <div
            ref={panelRef}
            role="listbox"
            style={{ position: "fixed", top: pos.top, right: pos.right, zIndex: 100 }}
            className="w-52 border border-gold/30 bg-ink py-2 shadow-2xl"
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
          </div>,
          document.body,
        )}
    </div>
  );
}

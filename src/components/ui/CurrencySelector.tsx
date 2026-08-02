"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";
import { useCurrency } from "@/lib/stores/currency";
import { CURRENCIES, getCurrency } from "@/lib/currency";

/**
 * Header currency picker. Selection converts every price live via <Money>.
 *
 * The panel is portalled to <body> because the header's collapsing utility row
 * is `overflow-hidden` (for its scroll-collapse animation) — an inline dropdown
 * would be clipped to the row height and appear broken. Portalling escapes that
 * clip; the panel is positioned under the trigger from its bounding rect.
 */
export function CurrencySelector({ onDark = true }: { onDark?: boolean }) {
  const { code, setCode, hydrated, live } = useCurrency();
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

  const current = getCurrency(code);
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
        <span>{hydrated ? current.code : "USD"}</span>
        <span>{current.symbol}</span>
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
            className="w-56 border border-gold/30 bg-ink py-2 shadow-2xl"
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
          </div>,
          document.body,
        )}
    </div>
  );
}

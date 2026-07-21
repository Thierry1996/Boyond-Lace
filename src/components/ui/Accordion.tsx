"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState, type ReactNode } from "react";
import { EASE } from "@/components/motion/primitives";

/**
 * Editorial accordion.
 *
 * Native <details> snaps open with no transition, which is the giveaway that a
 * page was assembled rather than designed. This animates height and opacity on
 * the brand curve, draws a gold rule across the active row, and rotates a
 * hairline cross rather than shipping a stock chevron.
 *
 * Single-open by default: the eye should have one place to be.
 */

export interface AccordionItem {
  q: string;
  a: ReactNode;
  /** Optional right-aligned meta, e.g. a category or read time. */
  meta?: string;
}

export function Accordion({
  items,
  allowMultiple = false,
  defaultOpen,
}: {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpen?: number;
}) {
  const [open, setOpen] = useState<number[]>(defaultOpen !== undefined ? [defaultOpen] : []);
  const reduced = useReducedMotion();

  function toggle(i: number) {
    setOpen((cur) => {
      const isOpen = cur.includes(i);
      if (allowMultiple) return isOpen ? cur.filter((x) => x !== i) : [...cur, i];
      return isOpen ? [] : [i];
    });
  }

  return (
    <div className="border-t border-white/[0.07]">
      {items.map((item, i) => {
        const isOpen = open.includes(i);
        return (
          <div key={item.q} className="relative border-b border-white/[0.07]">
            {/* Gold rule that sweeps in while the row is open */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px origin-left bg-gold transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ transform: `scaleX(${isOpen ? 1 : 0})` }}
            />

            <h3>
              <button
                type="button"
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
                className="group flex w-full items-start justify-between gap-6 py-6 text-left transition-colors duration-300"
              >
                <span
                  className={`font-[family-name:var(--font-display)] text-[clamp(1.0625rem,1.6vw,1.375rem)] leading-snug transition-colors duration-400 ${
                    isOpen ? "text-gold" : "text-paper group-hover:text-blush-300"
                  }`}
                >
                  {item.q}
                </span>

                <span className="flex shrink-0 items-center gap-4">
                  {item.meta && <span className="eyebrow hidden sm:block">{item.meta}</span>}
                  {/* Hairline cross → minus. Two rules, one rotates away. */}
                  <span className="relative mt-1.5 block h-3 w-3">
                    <span
                      className={`absolute top-1/2 left-0 h-px w-3 -translate-y-1/2 transition-colors duration-400 ${
                        isOpen ? "bg-gold" : "bg-neutral-400 group-hover:bg-gold"
                      }`}
                    />
                    <span
                      className={`absolute top-1/2 left-0 h-px w-3 -translate-y-1/2 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isOpen
                          ? "rotate-0 bg-gold opacity-0"
                          : "rotate-90 bg-neutral-400 group-hover:bg-gold"
                      }`}
                    />
                  </span>
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="panel"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    height: { duration: reduced ? 0.2 : 0.55, ease: EASE },
                    opacity: { duration: reduced ? 0.2 : 0.4, ease: "linear" },
                  }}
                  className="overflow-hidden"
                >
                  <div className="max-w-3xl pr-10 pb-7 text-[0.9375rem] leading-[1.85] text-neutral-400">
                    {item.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

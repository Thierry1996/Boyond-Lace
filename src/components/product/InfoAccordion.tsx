"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState, type ReactNode } from "react";
import { EASE } from "@/components/motion/primitives";

/**
 * Product-information accordion. Distinct from the FAQ Accordion: rows carry a
 * heading and arbitrary rich body, multiple can sit open at once (a buyer often
 * wants Description and Product details both expanded), and the header reads as
 * a section title rather than a question. Native <details> would snap; this
 * animates height on the brand curve with a rotating plus→minus.
 */

export interface InfoItem {
  title: string;
  body: ReactNode;
}

export function InfoAccordion({ items }: { items: InfoItem[] }) {
  // Description and Product details open by default, mirroring the reference.
  const [open, setOpen] = useState<number[]>([0, 1]);
  const reduced = useReducedMotion();

  const toggle = (i: number) =>
    setOpen((cur) => (cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i]));

  return (
    <div className="border-t border-white/[0.09]">
      {items.map((item, i) => {
        const isOpen = open.includes(i);
        return (
          <div key={item.title} className="border-b border-white/[0.09]">
            <h3>
              <button
                type="button"
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
                className="group flex w-full items-center justify-between gap-6 py-5 text-left"
              >
                <span
                  className={`font-[family-name:var(--font-display)] text-[clamp(1.125rem,1.8vw,1.5rem)] transition-colors duration-300 ${
                    isOpen ? "text-paper" : "text-paper group-hover:text-gold"
                  }`}
                >
                  {item.title}
                </span>
                {/* Plus that loses its vertical stroke when open → minus. */}
                <span className="relative mt-1 block h-3.5 w-3.5 shrink-0">
                  <span className="absolute top-1/2 left-0 h-px w-3.5 -translate-y-1/2 bg-gold" />
                  <span
                    className={`absolute top-1/2 left-0 h-px w-3.5 -translate-y-1/2 rotate-90 bg-gold transition-opacity duration-400 ${
                      isOpen ? "opacity-0" : "opacity-100"
                    }`}
                  />
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
                    height: { duration: reduced ? 0.2 : 0.5, ease: EASE },
                    opacity: { duration: reduced ? 0.2 : 0.35, ease: "linear" },
                  }}
                  className="overflow-hidden"
                >
                  <div className="pb-8">{item.body}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

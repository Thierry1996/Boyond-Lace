"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState, type ReactNode } from "react";
import { EASE } from "@/components/motion/primitives";

/**
 * Light-surface policy accordion with a sticky chip navigator. Each policy
 * section collapses on the brand curve (framer-motion height + opacity) with a
 * rotating plus→minus and a plum rule that sweeps across the open row. Chips
 * open their section and scroll it into view, so the long document reads as an
 * index the buyer drives — not a wall of fine print.
 *
 * Multiple rows may sit open at once; the first is open by default.
 */

export interface PolicySection {
  id: string;
  /** Short chip label, e.g. "Shipping". */
  chip: string;
  /** Emoji shown on the chip and section marker. */
  emoji: string;
  /** Section eyebrow, e.g. "Section 01". */
  index: string;
  /** Leading title words rendered upright. */
  title: string;
  /** Trailing title words rendered in italic plum. */
  titleItalic: string;
  body: ReactNode;
}

export function PolicyAccordion({ sections }: { sections: PolicySection[] }) {
  const [open, setOpen] = useState<number[]>([0]);
  const reduced = useReducedMotion();

  const toggle = (i: number) =>
    setOpen((cur) => (cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i]));

  function jumpTo(i: number, id: string) {
    setOpen((cur) => (cur.includes(i) ? cur : [...cur, i]));
    // Let React commit the open state first; a bare rAF fires mid-render and the
    // smooth scroll gets swallowed by the panel's height animation.
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 90);
  }

  return (
    <>
      {/* Chip navigator */}
      <div className="sticky top-[64px] z-20 -mx-[4vw] mb-14 bg-[#faf6f9]/85 px-[4vw] py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1100px] flex-wrap justify-center gap-2.5">
          {sections.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => jumpTo(i, s.id)}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-[0.75rem] tracking-[0.1em] uppercase transition-all duration-300 ${
                open.includes(i)
                  ? "border-plum-700/40 bg-plum-700/[0.06] text-plum-800"
                  : "border-plum-900/10 bg-white/60 text-plum-900/70 hover:border-plum-700/30 hover:text-plum-800"
              }`}
            >
              <span aria-hidden>{s.emoji}</span>
              {s.chip}
            </button>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div className="mx-auto max-w-[1100px] border-t border-plum-900/10">
        {sections.map((s, i) => {
          const isOpen = open.includes(i);
          return (
            <section key={s.id} id={s.id} className="relative scroll-mt-32 border-b border-plum-900/10">
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-px origin-left bg-gradient-to-r from-plum-700 to-blush-400 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ transform: `scaleX(${isOpen ? 1 : 0})` }}
              />
              <h2>
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  className="group flex w-full items-center justify-between gap-6 py-8 text-left"
                >
                  <span className="flex items-center gap-5">
                    <span
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border text-xl transition-colors duration-400 ${
                        isOpen
                          ? "border-plum-700/30 bg-plum-700/[0.08]"
                          : "border-plum-900/10 bg-white/70 group-hover:border-plum-700/25"
                      }`}
                    >
                      <span aria-hidden>{s.emoji}</span>
                    </span>
                    <span>
                      <span className="block text-[0.625rem] tracking-[0.2em] text-plum-700/70 uppercase">
                        {s.index}
                      </span>
                      <span className="mt-1 block font-[family-name:var(--font-display)] text-[clamp(1.5rem,3vw,2.25rem)] leading-tight text-plum-900">
                        {s.title} <span className="italic text-plum-600">{s.titleItalic}</span>
                      </span>
                    </span>
                  </span>

                  {/* Plus → minus */}
                  <span className="relative mt-1 block h-4 w-4 shrink-0">
                    <span className="absolute top-1/2 left-0 h-px w-4 -translate-y-1/2 bg-plum-700" />
                    <span
                      className={`absolute top-1/2 left-0 h-px w-4 -translate-y-1/2 rotate-90 bg-plum-700 transition-opacity duration-400 ${
                        isOpen ? "opacity-0" : "opacity-100"
                      }`}
                    />
                  </span>
                </button>
              </h2>

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
                    <div className="pb-14">{s.body}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          );
        })}
      </div>
    </>
  );
}

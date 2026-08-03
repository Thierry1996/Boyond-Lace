"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { EASE } from "@/components/motion/primitives";

/**
 * Filterable FAQ accordion on a light surface. Category chips narrow the list;
 * each answer collapses on the brand curve (framer-motion height + opacity)
 * behind a plum diamond whose plus rotates into a cross. Multiple rows may sit
 * open; the first is open by default. Numbering follows the filtered position.
 */

export interface FaqItem {
  q: string;
  category: string;
  a: ReactNode;
}

const ALL = "All Questions";

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(ALL);
  const [open, setOpen] = useState<number[]>([0]);

  const categories = useMemo(() => {
    const seen: string[] = [];
    for (const it of items) if (!seen.includes(it.category)) seen.push(it.category);
    return [ALL, ...seen];
  }, [items]);

  const filtered = useMemo(
    () => (active === ALL ? items : items.filter((i) => i.category === active)),
    [items, active],
  );

  function pick(cat: string) {
    setActive(cat);
    setOpen([0]); // reopen the first of the new set
  }

  const toggle = (i: number) =>
    setOpen((cur) => (cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i]));

  return (
    <>
      {/* Category filter */}
      <div className="flex flex-wrap justify-center gap-2.5">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => pick(cat)}
            className={`rounded-md border px-4 py-2.5 text-[0.6875rem] tracking-[0.12em] uppercase transition-all duration-300 ${
              active === cat
                ? "border-plum-700 bg-plum-900 text-blush-200"
                : "border-plum-900/12 bg-white/60 text-plum-900/65 hover:border-plum-700/35 hover:text-plum-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="mt-16 text-center text-[0.6875rem] tracking-[0.28em] text-plum-900/45 uppercase">
        {filtered.length} {filtered.length === 1 ? "Answer" : "Answers"} · Curated for You
      </p>

      {/* List */}
      <div className="mx-auto mt-10 max-w-[1100px]">
        {filtered.map((item, i) => {
          const isOpen = open.includes(i);
          const n = String(i + 1).padStart(2, "0");
          return (
            <div key={item.q} className="border-t border-plum-900/10 last:border-b">
              <h3>
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  className="group flex w-full items-start gap-5 py-7 text-left sm:gap-8"
                >
                  <span className="mt-1 font-[family-name:var(--font-display)] text-sm text-plum-900/35 italic tabular-nums">
                    {n}.
                  </span>
                  <span className="flex-1">
                    <span
                      className={`font-[family-name:var(--font-display)] text-[clamp(1.0625rem,1.8vw,1.375rem)] leading-snug transition-colors duration-300 ${
                        isOpen ? "text-plum-600" : "text-plum-900 group-hover:text-plum-600"
                      }`}
                    >
                      {item.q}
                    </span>
                  </span>
                  {/* Plum diamond, plus → cross */}
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 rotate-45 items-center justify-center rounded-[5px] bg-plum-600 transition-colors duration-300 group-hover:bg-plum-700">
                    <Plus
                      size={16}
                      strokeWidth={2}
                      className={`text-white transition-transform duration-300 ${
                        isOpen ? "rotate-0" : "-rotate-45"
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
                    <div className="pb-9 pl-10 sm:pl-[3.25rem]">
                      <span className="mb-4 inline-block rounded border border-plum-700/25 bg-plum-700/[0.06] px-2.5 py-1 text-[0.5625rem] tracking-[0.14em] text-plum-700 uppercase">
                        {item.category}
                      </span>
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </>
  );
}

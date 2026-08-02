"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { CollectionFaq } from "@/lib/collections";

/** Collection FAQ — an expandable list, first item open by default. */
export function FaqAccordion({ items }: { items: CollectionFaq[] }) {
  const [open, setOpen] = useState(0);

  return (
    <ul className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <li key={item.q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-6 py-5 text-left"
            >
              <span
                className={`text-[1.0625rem] transition-colors ${isOpen ? "text-gold" : "text-paper"}`}
              >
                {item.q}
              </span>
              <Plus
                size={18}
                strokeWidth={1.5}
                className={`shrink-0 text-gold transition-transform duration-300 ${
                  isOpen ? "rotate-45" : ""
                }`}
              />
            </button>
            <div
              className="grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="pb-5 text-[0.9375rem] leading-relaxed text-neutral-400">{item.a}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import type { KeyAttributes as KeyAttributesData } from "@/lib/commerce";

/**
 * Key attributes.
 *
 * Opens on the quick "at a glance" view — a six-attribute summary plus headline
 * highlights — because an experienced trade buyer scans that and moves on. "See
 * all attributes" expands the exhaustive paired table for anyone doing full due
 * diligence. Content is derived from the product (see deriveKeyAttributes), so
 * every listing exposes the same attributes.
 */
export function KeyAttributes({ data }: { data: KeyAttributesData }) {
  const [full, setFull] = useState(false);

  return (
    <div className="mx-auto max-w-[1440px] px-[4vw]">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,3vw,2.5rem)] text-paper">
          Key attributes
        </h2>
        <button
          type="button"
          onClick={() => setFull((v) => !v)}
          aria-expanded={full}
          className="text-[0.75rem] tracking-[0.12em] text-gold uppercase underline-offset-4 hover:underline"
        >
          {full ? "Quick view" : "See all attributes"}
        </button>
      </div>

      {full ? (
        // Full paired table — two attribute pairs per row.
        <div className="mt-8 overflow-hidden rounded-lg border border-white/[0.08]">
          <dl className="grid sm:grid-cols-2">
            {data.rows.map((row, i) => (
              <div
                key={row.label}
                className={`grid grid-cols-[130px_1fr] gap-4 border-b border-white/[0.06] px-5 py-3.5 ${
                  i % 2 === 0 ? "sm:border-r sm:border-white/[0.06]" : ""
                }`}
              >
                <dt className="text-[0.8125rem] text-neutral-400">{row.label}</dt>
                <dd className="text-[0.875rem] text-neutral-200">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : (
        <>
          {/* At a glance — the quick option for experienced buyers */}
          <div className="mt-8 grid gap-x-10 gap-y-7 rounded-lg bg-white/[0.03] p-7 sm:grid-cols-3">
            {data.glance.map((row) => (
              <div key={row.label} className="border-l border-white/10 pl-4">
                <p className="text-[0.75rem] text-neutral-400">{row.label}</p>
                <p className="mt-1 text-[0.9375rem] font-medium text-paper">{row.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <p className="mb-4 inline-flex items-center gap-1.5 text-[0.9375rem] text-paper">
              At a glance
              <Info size={14} strokeWidth={1.75} className="text-neutral-400" />
            </p>
            <ul className="space-y-3">
              {data.highlights.map((h) => (
                <li
                  key={h.title}
                  className="flex items-start gap-2.5 text-[0.9375rem] leading-relaxed"
                >
                  <span className="mt-2 inline-block h-1 w-1 shrink-0 rotate-45 bg-gold" />
                  <span className="text-neutral-400">
                    <span className="font-medium text-paper">{h.title}:</span> {h.body}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

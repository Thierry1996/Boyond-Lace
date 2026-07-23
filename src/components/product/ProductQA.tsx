"use client";

import { useMemo, useState } from "react";
import { Search, PenLine } from "lucide-react";
import type { Question } from "@/lib/commerce";

/**
 * Product Q&A. A searchable, horizontally-scrolling row of question cards, each
 * with its top answer and a way in to answer or ask. The questions are seeded
 * placeholder content (see lib/commerce/reviews.ts) until the community
 * integration lands; the note under the row says so plainly.
 *
 * Search filters the visible cards live rather than round-tripping — the whole
 * set is on the page, so a query just narrows what shows. Asking a question
 * routes to Support, the one place set up to actually receive it, with the unit
 * carried along so the team knows what was asked about.
 */
export function ProductQA({
  questions,
  supportHref,
}: {
  questions: Question[];
  supportHref: string;
}) {
  const [query, setQuery] = useState("");

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return questions;
    return questions.filter(
      (item) => item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q),
    );
  }, [questions, query]);

  return (
    <div className="mx-auto max-w-[1440px] px-[4vw]">
      {/* Heading + search */}
      <div className="flex flex-wrap items-center justify-between gap-5 border-b border-white/[0.08] pb-6">
        <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,3vw,2.5rem)] text-paper">
          Q&amp;A
        </h2>
        <div className="flex items-center gap-1 rounded-full border border-white/20 bg-white/[0.05] py-1 pr-1.5 pl-5 transition-colors focus-within:border-gold">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search these questions…"
            aria-label="Search questions"
            className="w-44 bg-transparent py-1.5 text-[0.875rem] text-paper placeholder:text-neutral-400/70 focus:outline-none sm:w-56 [&::-webkit-search-cancel-button]:hidden"
          />
          <span
            aria-hidden="true"
            className="grid size-8 shrink-0 place-items-center rounded-full bg-white/10 text-neutral-200"
          >
            <Search size={15} strokeWidth={1.75} />
          </span>
        </div>
      </div>

      {/* Cards — horizontal scroll, snapping */}
      {shown.length > 0 ? (
        <ul className="no-scrollbar -mx-[4vw] mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto px-[4vw] pb-2">
          {shown.map((item) => (
            <li
              key={item.id}
              className="flex w-[min(88vw,26rem)] shrink-0 snap-start flex-col border border-white/[0.09] p-7"
            >
              <p className="font-[family-name:var(--font-display)] text-[1.125rem] leading-snug text-paper">
                {item.question}
              </p>

              <div className="mt-6 flex-1 border-t border-white/[0.07] pt-5">
                <div className="mb-2.5 flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2">
                    <span
                      className={`grid size-6 place-items-center rounded-full text-[0.625rem] ${
                        item.fromBrand ? "bg-gold text-ink" : "bg-plum-800 text-paper"
                      }`}
                    >
                      {item.answeredBy.charAt(0)}
                    </span>
                    <span className="text-[0.8125rem] text-paper">{item.answeredBy}</span>
                    {item.fromBrand && (
                      <span className="text-[0.625rem] tracking-[0.12em] text-gold uppercase">
                        Brand
                      </span>
                    )}
                  </span>
                  <span className="text-[0.75rem] text-neutral-400 tabular-nums">{item.date}</span>
                </div>
                <p className="text-[0.9375rem] leading-relaxed text-neutral-400">{item.answer}</p>
              </div>

              <a
                href={`${supportHref}&intent=answer&q=${encodeURIComponent(item.question)}`}
                className="mt-6 self-center border-b border-gold pb-0.5 text-[0.8125rem] text-gold underline-offset-4 transition-opacity hover:opacity-75"
              >
                Answer this
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-10 text-center text-[0.9375rem] text-neutral-400">
          No question matches &ldquo;{query}&rdquo;. Ask it and we&apos;ll answer.
        </p>
      )}

      {/* Ask */}
      <div className="mt-8 flex flex-col items-center gap-3">
        <a
          href={`${supportHref}&intent=ask`}
          className="inline-flex items-center gap-2 text-[0.9375rem] text-paper transition-colors hover:text-gold"
        >
          <PenLine size={16} strokeWidth={1.6} className="text-gold" />
          Ask a question — we answer fast
        </a>
        <p className="text-[0.75rem] text-neutral-400">
          Questions shown are illustrative sample content pending our community Q&amp;A.
        </p>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { BrandImage } from "@/components/ui/BrandImage";
import type { BlogPost } from "@/lib/blog";
import { formatBlogDate } from "@/lib/blog";

/**
 * Latest-news grid. Four rounded thumbnails per row, paginated client-side so
 * every card is a real link into /blog/[slug]. Page state lives here; the list
 * is passed in already ordered newest-first.
 */

const PER_PAGE = 8;

export function BlogGrid({ posts }: { posts: BlogPost[] }) {
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(posts.length / PER_PAGE));
  const start = (page - 1) * PER_PAGE;
  const visible = posts.slice(start, start + PER_PAGE);

  const go = (n: number) => {
    setPage(Math.min(pageCount, Math.max(1, n)));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {visible.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="group block">
            <div className="overflow-hidden rounded-2xl border border-plum-900/10 shadow-[0_18px_40px_-24px_rgba(90,45,103,0.4)]">
              <BrandImage
                name={p.image}
                ratio="4 / 3"
                overlay={false}
                sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
                imgClassName="transition-transform duration-[900ms] ease-[var(--ease-editorial)] group-hover:scale-[1.06]"
              />
            </div>
            <p className="mt-4 text-[0.6875rem] font-semibold tracking-[0.1em] text-plum-600 uppercase">
              {p.tags.join(", ")}
            </p>
            <h3 className="mt-2 text-[1.0625rem] leading-snug font-semibold text-plum-900 transition-colors duration-300 group-hover:text-plum-600">
              {p.title}
            </h3>
            <p className="mt-2 text-[0.75rem] tracking-wide text-plum-900/45 tabular-nums">
              {formatBlogDate(p.date)}
            </p>
          </Link>
        ))}
      </div>

      {pageCount > 1 && (
        <nav
          aria-label="Blog pages"
          className="mt-16 flex items-center justify-center gap-2.5"
        >
          <button
            type="button"
            onClick={() => go(page - 1)}
            disabled={page === 1}
            aria-label="Previous page"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-plum-900/15 text-plum-700 transition-all duration-300 hover:border-plum-600 hover:bg-plum-900/[0.04] active:scale-95 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ArrowLeft size={15} strokeWidth={1.75} />
          </button>

          {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => go(n)}
              aria-current={page === n ? "page" : undefined}
              className={`flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-[0.8125rem] font-semibold tabular-nums transition-all duration-300 active:scale-95 ${
                page === n
                  ? "bg-plum-600 text-white shadow-[0_6px_16px_-6px_rgba(113,64,127,0.8)]"
                  : "border border-plum-900/15 text-plum-700 hover:border-plum-600 hover:bg-plum-900/[0.04]"
              }`}
            >
              {n}
            </button>
          ))}

          <button
            type="button"
            onClick={() => go(page + 1)}
            disabled={page === pageCount}
            aria-label="Next page"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-plum-900/15 text-plum-700 transition-all duration-300 hover:border-plum-600 hover:bg-plum-900/[0.04] active:scale-95 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ArrowRight size={15} strokeWidth={1.75} />
          </button>
        </nav>
      )}
    </div>
  );
}

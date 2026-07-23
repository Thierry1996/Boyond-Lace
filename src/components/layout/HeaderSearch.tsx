"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, X, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Money } from "@/components/ui/Money";
import { ProductImage } from "@/components/ui/ProductImage";
import { MIN_QUERY_LENGTH, type SearchResults } from "@/lib/search";

/**
 * Header live search.
 *
 * Results appear from the third character — the threshold the brief asked for
 * and also the point below which a catalogue this size returns almost
 * everything. Typing is debounced by 220ms so a fast typist fires one request
 * instead of eight, and TanStack Query caches per-term, so backspacing through
 * a word is instant rather than a fresh round trip.
 *
 * The control is a real combobox: arrow keys move through results, Enter opens
 * the highlighted one (or runs a full search when nothing is highlighted),
 * Escape closes. Screen readers get live result counts.
 */

const DEBOUNCE_MS = 220;

export function HeaderSearch({
  className = "",
  attention = false,
}: {
  className?: string;
  /** Runs a gold light around the pill to pull the eye on first visit. */
  attention?: boolean;
}) {
  const router = useRouter();
  const [term, setTerm] = useState("");
  const [debounced, setDebounced] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [anchor, setAnchor] = useState<{ top: number; left: number; width: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(term.trim()), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [term]);

  const enabled = debounced.length >= MIN_QUERY_LENGTH;

  const { data, isFetching } = useQuery<SearchResults>({
    queryKey: ["header-search", debounced],
    queryFn: async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(debounced)}`);
      if (!res.ok) throw new Error("Search failed");
      return res.json();
    },
    enabled,
    staleTime: 60_000,
  });

  // One flat list so arrow keys cross the group boundary naturally.
  const flat = [
    ...(data?.products ?? []).map((p) => ({ href: `/product/${p.slug}`, label: p.title })),
    ...(data?.docs ?? []).map((d) => ({ href: d.href, label: d.title })),
  ];

  useEffect(() => setActive(-1), [debounced]);

  // Close on outside click. The panel is portalled to <body>, so it is NOT
  // inside rootRef — without checking it too, pressing a result would unmount
  // the panel on mousedown and the click would never land.
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      const inField = rootRef.current?.contains(t);
      const inPanel = panelRef.current?.contains(t);
      if (!inField && !inPanel) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  function go(href: string) {
    setOpen(false);
    setTerm("");
    router.push(href);
  }

  function submit() {
    if (!term.trim()) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(term.trim())}`);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      if (!flat.length) return;
      e.preventDefault();
      setOpen(true);
      setActive((i) => {
        const next = e.key === "ArrowDown" ? i + 1 : i - 1;
        return next < 0 ? flat.length - 1 : next >= flat.length ? 0 : next;
      });
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (active >= 0 && flat[active]) go(flat[active].href);
      else submit();
    }
  }

  const showPanel = open && debounced.length >= MIN_QUERY_LENGTH;
  const hasResults = (data?.total ?? 0) > 0;

  /**
   * The results panel is portalled to <body> and positioned fixed. It cannot
   * live inside the header: row 2 animates its collapse with overflow-hidden
   * and a max-height, which clips any child that overflows the row — the panel
   * rendered correctly and was simply invisible. Re-anchor on scroll and resize
   * so it tracks the field.
   */
  useEffect(() => {
    if (!showPanel) return;
    const place = () => {
      const el = fieldRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setAnchor({ top: r.bottom + 8, left: r.left, width: r.width });
    };
    place();
    window.addEventListener("scroll", place, { passive: true });
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place);
      window.removeEventListener("resize", place);
    };
  }, [showPanel]);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      {/* A pill field with a circular action inside it. The previous full-height
          button with a border-l divider fought the rounded corners and left the
          glyph sitting off the field's centre line; everything here shares one
          horizontal axis via items-center, and the button is a fixed square so
          the icon cannot drift. */}
      <div
        ref={fieldRef}
        className={`relative flex items-center gap-1 rounded-full border border-white/20 bg-white/[0.05] py-1 pr-1.5 pl-5 transition-colors duration-300 focus-within:border-gold focus-within:bg-white/[0.08] ${
          attention ? "search-attn" : ""
        }`}
      >
        <input
          ref={inputRef}
          type="search"
          value={term}
          onChange={(e) => {
            setTerm(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search units, guides, wholesale…"
          aria-label="Search Beyond Lace"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls="header-search-results"
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `header-search-opt-${active}` : undefined}
          // The WebKit cancel glyph would sit beside our own clear button.
          className="min-w-0 flex-1 bg-transparent py-1.5 text-[0.875rem] text-paper placeholder:text-neutral-400/70 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
        />
        {term && (
          <button
            type="button"
            onClick={() => {
              setTerm("");
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
            className="grid size-7 shrink-0 place-items-center rounded-full text-neutral-400 transition-colors hover:bg-white/10 hover:text-paper"
          >
            <X size={13} strokeWidth={1.75} />
          </button>
        )}
        <button
          type="button"
          onClick={submit}
          aria-label="Search"
          className="grid size-8 shrink-0 place-items-center rounded-full bg-white/10 text-neutral-200 transition-colors duration-300 hover:bg-gold hover:text-ink"
        >
          {isFetching ? (
            <Loader2 size={15} strokeWidth={1.75} className="animate-spin" />
          ) : (
            <Search size={15} strokeWidth={1.75} />
          )}
        </button>
      </div>

      {/* Live region so assistive tech hears the count without opening the list. */}
      <span className="sr-only" role="status" aria-live="polite">
        {showPanel && data ? `${data.total} results for ${data.query}` : ""}
      </span>

      {showPanel &&
        mounted &&
        anchor &&
        createPortal(
          <div
            ref={panelRef}
            id="header-search-results"
            role="listbox"
            aria-label="Search results"
            className="dark-island fixed z-[90] max-h-[70vh] overflow-y-auto rounded-2xl border border-gold/25 bg-neutral-900 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.8)]"
            style={{
              top: anchor.top,
              left: anchor.left,
              width: Math.max(anchor.width, 360),
              animation: "blFade 240ms cubic-bezier(0.16,1,0.3,1)",
            }}
            onMouseDown={(e) => e.preventDefault()}
          >
            {!hasResults && !isFetching && (
              <p className="px-5 py-6 text-[0.875rem] text-neutral-400">
                Nothing for &ldquo;{data?.query}&rdquo;. Try a construction, a texture, or a topic
                like returns or shade.
              </p>
            )}

            {(data?.products.length ?? 0) > 0 && (
              <div className="border-b border-white/[0.07]">
                <p className="eyebrow px-5 pt-4 pb-2 text-gold">Units</p>
                {data!.products.map((p, i) => (
                  <Link
                    key={p.id}
                    id={`header-search-opt-${i}`}
                    role="option"
                    aria-selected={active === i}
                    href={`/product/${p.slug}`}
                    onClick={() => go(`/product/${p.slug}`)}
                    onMouseEnter={() => setActive(i)}
                    className={`flex items-center gap-3 px-5 py-3 transition-colors ${
                      active === i ? "bg-white/[0.06]" : "hover:bg-white/[0.04]"
                    }`}
                  >
                    <span className="w-11 shrink-0">
                      <ProductImage src={p.image} alt={p.imageAlt} ratio="1 / 1" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[0.875rem] text-paper">{p.title}</span>
                      <span className="block truncate text-[0.75rem] text-neutral-400">
                        {p.tagline}
                      </span>
                    </span>
                    <Money
                      usd={p.price}
                      className="shrink-0 text-[0.8125rem] text-gold tabular-nums"
                    />
                  </Link>
                ))}
              </div>
            )}

            {(data?.docs.length ?? 0) > 0 && (
              <div>
                <p className="eyebrow px-5 pt-4 pb-2 text-gold">Guides & pages</p>
                {data!.docs.map((d, i) => {
                  const idx = (data?.products.length ?? 0) + i;
                  return (
                    <Link
                      key={d.href}
                      id={`header-search-opt-${idx}`}
                      role="option"
                      aria-selected={active === idx}
                      href={d.href}
                      onClick={() => go(d.href)}
                      onMouseEnter={() => setActive(idx)}
                      className={`block px-5 py-3 transition-colors ${
                        active === idx ? "bg-white/[0.06]" : "hover:bg-white/[0.04]"
                      }`}
                    >
                      <span className="flex items-baseline justify-between gap-3">
                        <span className="truncate text-[0.875rem] text-paper">{d.title}</span>
                        <span className="shrink-0 text-[0.625rem] tracking-[0.12em] text-neutral-400 uppercase">
                          {d.section}
                        </span>
                      </span>
                      {d.blurb && (
                        <span className="mt-0.5 block truncate text-[0.75rem] text-neutral-400">
                          {d.blurb}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}

            {hasResults && (
              <button
                type="button"
                onClick={submit}
                className="w-full border-t border-white/[0.07] px-5 py-3.5 text-left text-[0.75rem] tracking-[0.12em] text-gold uppercase transition-colors hover:bg-gold/10"
              >
                See all results for &ldquo;{data?.query}&rdquo; →
              </button>
            )}
          </div>,
          document.body,
        )}
    </div>
  );
}

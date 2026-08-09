"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { primaryNav } from "@/lib/navigation";
import { useCart } from "@/lib/stores/cart";
import { useWishlist } from "@/lib/stores/wishlist";
import { AuthControls } from "@/components/auth/AuthControls";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { CurrencySelector } from "@/components/ui/CurrencySelector";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { LogoMark } from "@/components/brand/LogoMark";
import { AnnouncementBar } from "./AnnouncementBar";
import { HeaderSearch } from "./HeaderSearch";
import { ChannelSwitch } from "@/components/channel/ChannelSwitch";
import { MegaMenu } from "./MegaMenu";
import { WhatsAppGlyph } from "@/components/brand/SocialIcons";
import { URLS } from "@/lib/contact";

/**
 * Three-row stacked header.
 *
 *   Row 1 · Announcement marquee (dismissible)
 *   Row 2 · Utility left / centred wordmark / commerce right
 *   Row 3 · Primary navigation
 *
 * Rows 1 and 2 stay ink in both themes on purpose: the supplied wordmark is an
 * opaque PNG on a black ground, so a dark band is the only place it can sit
 * without a visible rectangle — and a dark masthead over a light page is a
 * luxury convention rather than a compromise.
 *
 * On scroll, rows 1 and 2 collapse away and row 3 alone stays pinned, so the
 * navigation is always reachable without a 200px header following you down the
 * page.
 */
export function Header() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [condensed, setCondensed] = useState(false);
  // Measured height of rows 1–2, so the condense transform slides them exactly
  // out of view and lands row 3 at the top.
  const topRowsRef = useRef<HTMLDivElement>(null);
  const [topRowsH, setTopRowsH] = useState(0);
  const { count, hydrated, setOpen: setCartOpen } = useCart();
  const wishCount = useWishlist((s) => s.slugs.length);
  const wishHydrated = useWishlist((s) => s.hydrated);

  // Track the live height of rows 1–2 so the condense transform is exact across
  // breakpoints (the wordmark and utility row change height with the viewport).
  useEffect(() => {
    const el = topRowsRef.current;
    if (!el) return;
    const measure = () => setTopRowsH(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    // Rows 1–2 aren't collapsed by JS anymore — they sit in normal flow and
    // scroll away, while row 3 is natively sticky (no reflow, no scroll-anchor
    // jitter). This flag only styles the docked nav: it fades in a drop shadow
    // and the compact wordmark once the nav has actually reached the top. A
    // small hysteresis band around the rows' height keeps that toggle from
    // buzzing on and off right at the seam. rAF-batched.
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const on = topRowsH || 160;
      setCondensed((prev) => {
        if (!prev && y > on - 4) return true;
        if (prev && y < on - 48) return false;
        return prev;
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [topRowsH]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    // display:contents keeps the <header> landmark without a box, so the sticky
    // nav below resolves its containing block against <body> and pins for the
    // whole page — a real <header> box would confine sticky to the header alone.
    <header className="contents">
      {/* ── Rows 1–2 · normal flow — they scroll away; the nav below pins ──── */}
      <div ref={topRowsRef}>
        {/* ── Row 1 · Announcement marquee ───────────────────────────────── */}
        <AnnouncementBar />

        {/* ── Row 2 · Utility / centred wordmark / commerce ──────────────── */}
        <div className="bg-ink">
          <div className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 px-5 py-2.5">
            {/* Left — the wordmark, sized to content so it never squeezes the nav. */}
            <Link
              href="/"
              aria-label="Beyond Lace — home"
              className="justify-self-start transition-opacity duration-300 hover:opacity-85"
            >
              <LogoMark width={260} priority className="w-[11rem] sm:w-[13rem] lg:w-[15rem]" />
            </Link>

            {/* Centre — the search field. The column flexes with the viewport while
              the field itself caps at 700px and stays centred, so the right nav
              always keeps its natural width and is never clipped. */}
            <div className="hidden w-full lg:block">
              <HeaderSearch className="mx-auto w-full max-w-[700px]" attention />
            </div>

            {/* Right — preferences and commerce, compact. On mobile the search
              collapses to a link and the menu trigger lives here too. */}
            <div className="flex items-center justify-end gap-2">
              <nav
                aria-label="Preferences"
                className="hidden items-center gap-2 border-r border-white/12 pr-2.5 lg:flex"
              >
                <ChannelSwitch />
                <CurrencySelector />
                <LanguageSelector />
                <ThemeToggle />
                <a
                  href={URLS.whatsappPrefilled}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat with us on WhatsApp"
                  title="Chat with us on WhatsApp"
                  className="wa-pop group flex h-8 w-8 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/12 text-emerald-400 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-500/25 hover:text-emerald-300 active:translate-y-0 active:scale-95"
                >
                  <WhatsAppGlyph
                    size={15}
                    className="transition-transform duration-300 group-hover:scale-110"
                  />
                </a>
              </nav>

              <nav aria-label="Account and cart" className="flex items-center gap-3">
                {/* Below lg the inline field is hidden, so keep a route to search. */}
                <Link
                  href="/search"
                  aria-label="Search"
                  className="text-neutral-400 transition-colors duration-300 hover:text-gold lg:hidden"
                >
                  <Search size={16} strokeWidth={1.5} />
                </Link>
                <Link
                  href="/wishlist"
                  aria-label={`Wishlist${wishHydrated && wishCount ? `, ${wishCount} saved` : ""}`}
                  className="group relative hidden h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-neutral-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/50 hover:bg-white/[0.09] hover:text-gold active:translate-y-0 active:scale-95 sm:flex"
                >
                  <Heart
                    size={16}
                    strokeWidth={1.6}
                    className="transition-transform duration-300 group-hover:scale-110"
                  />
                  {wishHydrated && wishCount > 0 && (
                    <span className="pop-badge absolute -top-1.5 -right-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-blush-400 px-1 text-[0.625rem] font-semibold text-plum-900 tabular-nums ring-2 ring-ink transition-transform duration-300 group-hover:scale-110">
                      {wishCount}
                    </span>
                  )}
                </Link>
                <div className="hidden sm:block">
                  <AuthControls />
                </div>
                <button
                  type="button"
                  onClick={() => setCartOpen(true)}
                  aria-label={`Bag, ${hydrated ? count : 0} item${count === 1 ? "" : "s"}`}
                  className="group relative flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-neutral-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/50 hover:bg-white/[0.09] hover:text-gold active:translate-y-0 active:scale-95"
                >
                  <ShoppingBag
                    size={16}
                    strokeWidth={1.6}
                    className="transition-transform duration-300 group-hover:scale-110"
                  />
                  {hydrated && count > 0 && (
                    <span
                      suppressHydrationWarning
                      className="pop-badge absolute -top-1.5 -right-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-blush-400 px-1 text-[0.625rem] font-semibold text-plum-900 tabular-nums ring-2 ring-ink transition-transform duration-300 group-hover:scale-110"
                    >
                      {count}
                    </span>
                  )}
                </button>
                {/* Mobile menu trigger */}
                <button
                  className="lg:hidden"
                  onClick={() => setMobileOpen((v) => !v)}
                  aria-label={mobileOpen ? "Close menu" : "Open menu"}
                  aria-expanded={mobileOpen}
                >
                  {mobileOpen ? (
                    <X size={20} strokeWidth={1.5} className="text-paper" />
                  ) : (
                    <Menu size={20} strokeWidth={1.5} className="text-paper" />
                  )}
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 3 + overlays · the sticky unit ─────────────────────────────
          Only this pins. It's a sibling of rows 1–2 (not their child), so its
          sticky containing block is <body> and it stays put the whole page.
          The mega menu and mobile drawer live inside it, so they anchor to the
          docked nav rather than to the header's original top. */}
      <div className="sticky top-0 z-50" onMouseLeave={() => setOpenMenu(null)}>
        {/* ── Row 3 · Primary navigation ─────────────────────────────────── */}
        <div
          className={`nav-band relative border-y border-ink/25 transition-shadow duration-500 ${
            condensed ? "shadow-[0_14px_44px_-16px_rgb(0_0_0/0.75)]" : ""
          }`}
        >
          <div className="flex w-full items-center gap-1 px-5">
            {/* Condensed state reintroduces the mark so the brand never vanishes.
              Width has to clear the full wordmark — 7rem clipped it to "Beyo". */}
            <Link
              href="/"
              aria-label="Beyond Lace — home"
              className={`shrink-0 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                condensed ? "mr-5 max-w-[11rem] opacity-100" : "mr-0 max-w-0 opacity-0"
              }`}
            >
              <span className="font-[family-name:var(--font-display)] text-[1.125rem] whitespace-nowrap text-ink">
                Beyond&nbsp;Lace
              </span>
            </Link>

            {/* Full-width, non-wrapping: items spread edge to edge across the band.
              At tighter widths the nine items exceed the band; rather than wrap
              or push the page, the band scrolls horizontally inside itself. */}
            <nav
              aria-label="Primary"
              className="no-scrollbar hidden w-full items-stretch justify-between overflow-x-auto lg:flex"
            >
              {primaryNav.map((item) => (
                <div
                  key={item.label}
                  className="flex"
                  onMouseEnter={() => setOpenMenu(item.groups ? item.label : null)}
                >
                  <Link
                    href={item.href}
                    aria-expanded={item.groups ? openMenu === item.label : undefined}
                    data-open={openMenu === item.label ? "true" : undefined}
                    className="nav-link relative flex items-center px-2.5 py-4 text-[0.75rem] font-medium tracking-[0.08em] whitespace-nowrap text-ink uppercase xl:px-4 xl:text-[0.8125rem] xl:tracking-[0.12em]"
                  >
                    <span className="relative z-[1]">{item.label}</span>
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-3 bottom-2.5 h-[2px] origin-left bg-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        openMenu === item.label ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </Link>
                </div>
              ))}
            </nav>

            {/* Mobile: row 3 becomes a single labelled trigger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="flex w-full items-center justify-center gap-2 py-3.5 text-[0.8125rem] font-medium tracking-[0.14em] text-ink uppercase lg:hidden"
              aria-expanded={mobileOpen}
            >
              <Menu size={14} strokeWidth={1.75} />
              Browse the collection
            </button>
          </div>
        </div>

        {/* Mega menu */}
        {primaryNav.map(
          (item) =>
            item.groups &&
            openMenu === item.label && (
              <MegaMenu key={item.label} item={item} onNavigate={() => setOpenMenu(null)} />
            ),
        )}

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="border-t border-gold/20 bg-ink lg:hidden">
            <nav aria-label="Mobile" className="max-h-[70vh] overflow-y-auto px-[6vw] py-8">
              {/* The inline field is lg-only, so the drawer carries its own. */}
              <div className="mb-6">
                <HeaderSearch />
              </div>
              {primaryNav.map((item) => (
                <div key={item.label} className="border-b border-white/[0.07] py-4">
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block text-lg text-paper"
                  >
                    {item.label}
                  </Link>
                  {item.groups && (
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                      {item.groups
                        .flatMap((g) => g.links.slice(0, 4))
                        .map((link) => (
                          <Link
                            key={link.href + link.label}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            className="text-[0.8125rem] text-neutral-400"
                          >
                            {link.label}
                          </Link>
                        ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="mt-6 flex flex-wrap items-center gap-6 border-t border-white/[0.07] pt-6">
                <ThemeToggle />
                <CurrencySelector />
                <LanguageSelector />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { primaryNav } from "@/lib/navigation";
import { useCart } from "@/lib/stores/cart";
import { AuthControls } from "@/components/auth/AuthControls";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { CurrencySelector } from "@/components/ui/CurrencySelector";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { LogoMark } from "@/components/brand/LogoMark";
import { AnnouncementBar } from "./AnnouncementBar";
import { HeaderSearch } from "./HeaderSearch";
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
  const { count, hydrated } = useCart();

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 140);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <header className="sticky top-0 z-50" onMouseLeave={() => setOpenMenu(null)}>
      {/* ── Row 1 · Announcement marquee ─────────────────────────────────── */}
      <div
        className="overflow-hidden transition-[max-height,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ maxHeight: condensed ? 0 : 60, opacity: condensed ? 0 : 1 }}
      >
        <AnnouncementBar />
      </div>

      {/* ── Row 2 · Utility / centred wordmark / commerce ─────────────────── */}
      <div
        className="overflow-hidden bg-ink transition-[max-height,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ maxHeight: condensed ? 0 : 160, opacity: condensed ? 0 : 1 }}
      >
        <div className="mx-auto grid max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center gap-6 px-[4vw] py-2">
          {/* Left — currency/language, then the search field beside the wordmark.
              The theme toggle and WhatsApp moved to the right cluster: with all
              four preference controls here the search column collapsed to ~56px
              at 1100px wide, which is a field nobody can type into. */}
          <div className="hidden items-center gap-4 lg:flex">
            <nav aria-label="Preferences" className="flex shrink-0 items-center gap-4">
              <CurrencySelector />
              <LanguageSelector />
            </nav>
            <HeaderSearch className="min-w-0 flex-1" />
          </div>

          {/* Mobile menu trigger sits where the locale nav would be */}
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

          {/* Centre — the wordmark */}
          <Link
            href="/"
            aria-label="Beyond Lace — home"
            className="justify-self-center transition-opacity duration-300 hover:opacity-85"
          >
            <LogoMark width={230} priority className="w-[9.5rem] sm:w-[11.5rem] lg:w-[13rem]" />
          </Link>

          {/* Right — commerce */}
          <nav aria-label="Account and cart" className="flex items-center justify-end gap-5">
            {/* Below lg the inline field is hidden, so keep a route to search. */}
            <Link
              href="/search"
              aria-label="Search"
              className="text-neutral-400 transition-colors duration-300 hover:text-gold lg:hidden"
            >
              <Search size={18} strokeWidth={1.5} />
            </Link>
            <span className="hidden lg:block">
              <ThemeToggle />
            </span>
            <a
              href={URLS.whatsappPrefilled}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="hidden text-neutral-400 transition-colors duration-300 hover:text-gold lg:block"
            >
              <WhatsAppGlyph size={17} />
            </a>
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="hidden text-neutral-400 transition-colors duration-300 hover:text-gold sm:block"
            >
              <Heart size={18} strokeWidth={1.5} />
            </Link>
            <div className="hidden sm:block">
              <AuthControls />
            </div>
            <Link
              href="/cart"
              aria-label="Cart"
              className="group relative text-neutral-400 transition-colors duration-300 hover:text-gold"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              <span
                suppressHydrationWarning
                className="count-badge absolute -top-2 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[0.625rem] font-medium tabular-nums"
              >
                {hydrated ? count : 0}
              </span>
            </Link>
          </nav>
        </div>
      </div>

      {/* ── Row 3 · Primary navigation ───────────────────────────────────── */}
      <div
        className={`nav-band relative border-y border-ink/25 transition-shadow duration-500 ${
          condensed ? "shadow-[0_14px_44px_-16px_rgb(0_0_0/0.75)]" : ""
        }`}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-center gap-1 px-[4vw]">
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

          <nav aria-label="Primary" className="hidden items-stretch lg:flex">
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
                  className="nav-link relative flex items-center px-5 py-4 text-[0.8125rem] font-medium tracking-[0.13em] text-ink uppercase"
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
    </header>
  );
}

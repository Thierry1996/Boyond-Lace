"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { primaryNav, utilityNav } from "@/lib/navigation";
import { Wordmark, MonogramFlat } from "@/components/brand/Logo";
import { useCart } from "@/lib/stores/cart";
import { AuthControls } from "@/components/auth/AuthControls";

export function Header() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count, hydrated } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
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
    <header
      className={`sticky top-0 z-50 transition-colors duration-500 ${
        scrolled || openMenu ? "bg-ink/95 backdrop-blur-xl" : "bg-transparent"
      }`}
      onMouseLeave={() => setOpenMenu(null)}
    >
      {/* Utility bar — secondary nav per the sitemap. */}
      <div className="hidden border-b border-white/[0.07] md:block">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-[4vw] py-2.5">
          <p className="eyebrow">Complimentary worldwide shipping over $400</p>
          <nav aria-label="Utility" className="flex items-center gap-6">
            {utilityNav
              .filter((link) => link.label !== "Account")
              .map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="eyebrow transition-colors hover:text-blush-300"
                >
                  {link.label}
                </Link>
              ))}
            <AuthControls />
            <span className="h-3 w-px bg-white/15" />
            <button className="eyebrow transition-colors hover:text-blush-300">USD $</button>
            <button className="eyebrow transition-colors hover:text-blush-300">EN</button>
          </nav>
        </div>
      </div>

      {/* Primary bar */}
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-8 px-[4vw] py-5">
        <Link href="/" className="flex items-center gap-3" aria-label="Beyond Lace — home">
          <MonogramFlat size={34} />
          <Wordmark className="text-[1.375rem] text-paper" />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
          {primaryNav.map((item) => (
            <div key={item.label} onMouseEnter={() => setOpenMenu(item.groups ? item.label : null)}>
              <Link
                href={item.href}
                className="relative py-2 text-[0.8125rem] tracking-[0.06em] text-neutral-200 uppercase transition-colors hover:text-paper"
                aria-expanded={item.groups ? openMenu === item.label : undefined}
              >
                {item.label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-px bg-gold transition-all duration-400 ${
                    openMenu === item.label ? "w-full" : "w-0"
                  }`}
                />
              </Link>
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <Link
            href="/learn/quiz"
            className="hidden text-[0.8125rem] tracking-[0.06em] text-gold uppercase transition-opacity hover:opacity-70 xl:block"
          >
            Find your unit
          </Link>
          <Link
            href="/cart"
            className="flex items-center gap-2 text-[0.8125rem] tracking-[0.06em] text-neutral-200 uppercase transition-colors hover:text-paper"
          >
            Cart
            <span
              className="inline-flex h-5 min-w-5 items-center justify-center rounded-full border border-gold/50 px-1 text-[0.6875rem] text-gold tabular-nums"
              suppressHydrationWarning
            >
              {hydrated ? count : 0}
            </span>
          </Link>
          <button
            className="lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <span className="block h-px w-6 bg-paper" />
            <span className="mt-1.5 block h-px w-6 bg-paper" />
          </button>
        </div>
      </div>

      {/* Mega menu */}
      {primaryNav.map(
        (item) =>
          item.groups &&
          openMenu === item.label && (
            <div
              key={item.label}
              className="absolute inset-x-0 top-full hidden border-t border-white/[0.07] bg-ink/98 backdrop-blur-xl lg:block"
            >
              <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-10 px-[4vw] py-12">
                <div
                  className={`grid gap-10 ${item.feature ? "col-span-8" : "col-span-12"}`}
                  style={{
                    gridTemplateColumns: `repeat(${item.groups.length}, minmax(0, 1fr))`,
                  }}
                >
                  {item.groups.map((group) => (
                    <div key={group.heading}>
                      <p className="eyebrow mb-5">{group.heading}</p>
                      <ul className="space-y-3">
                        {group.links.map((link) => (
                          <li key={link.href + link.label}>
                            <Link
                              href={link.href}
                              className="group block text-[0.9375rem] text-neutral-200 transition-colors hover:text-paper"
                            >
                              {link.label}
                              {link.note && (
                                <span className="mt-0.5 block text-[0.75rem] text-neutral-400">
                                  {link.note}
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {item.feature && (
                  <div className="col-span-4 border-l border-white/[0.07] pl-10">
                    <p className="eyebrow mb-4 text-gold">{item.feature.eyebrow}</p>
                    <h3 className="mb-3 text-2xl text-paper">{item.feature.title}</h3>
                    <p className="mb-6 text-sm leading-relaxed text-neutral-400">
                      {item.feature.body}
                    </p>
                    <Link
                      href={item.feature.href}
                      className="inline-block border-b border-gold pb-1 text-[0.8125rem] tracking-[0.08em] text-gold uppercase"
                    >
                      {item.feature.cta}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ),
      )}

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="border-t border-white/[0.07] bg-ink lg:hidden">
          <nav aria-label="Mobile" className="max-h-[70vh] overflow-y-auto px-[6vw] py-8">
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
            <div className="mt-6 flex gap-6">
              {utilityNav.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="eyebrow"
                  onClick={() => setMobileOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Download } from "lucide-react";
import type { PrimaryNavItem } from "@/lib/navigation";
import { BrandImage } from "@/components/ui/BrandImage";

/**
 * Image-guided mega menu. Hovering a column swaps the photograph on the right,
 * so you always see where you are before you click. Restrained by design: at
 * most six short columns, one image, one feature — enough to orient, never
 * enough to get lost in.
 */
export function MegaMenu({ item, onNavigate }: { item: PrimaryNavItem; onNavigate: () => void }) {
  const [activeGroup, setActiveGroup] = useState<number | null>(null);
  if (!item.groups) return null;

  const panelImage =
    (activeGroup !== null ? item.groups[activeGroup]?.image : undefined) ?? item.image ?? "navShop";
  const panelBlurb = activeGroup !== null ? item.groups[activeGroup]?.blurb : undefined;
  const panelHeading = activeGroup !== null ? item.groups[activeGroup]?.heading : item.label;

  return (
    <div
      // Explicit z-index so the panel reliably sits above page content: the
      // header owns a z-50 stacking context, and page sections animated by
      // Framer Motion each get their own `transform` stacking context, so an
      // implicit `z-index: auto` here was fragile. It also enters with a short
      // fade-and-drop rather than hard-mounting, which read as a flicker.
      className="absolute inset-x-0 top-full z-[60] hidden border-t border-gold/20 bg-ink/98 backdrop-blur-xl lg:block"
      style={{ animation: "blMenuIn 320ms cubic-bezier(0.16,1,0.3,1)" }}
    >
      <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-10 px-[4vw] py-11">
        {/* Columns */}
        <div className="col-span-8 grid grid-cols-3 gap-x-8 gap-y-9">
          {item.groups.map((group, i) => (
            <div
              key={group.heading}
              onMouseEnter={() => setActiveGroup(i)}
              className="transition-opacity duration-300"
              style={{ opacity: activeGroup === null || activeGroup === i ? 1 : 0.45 }}
            >
              <p className="eyebrow mb-4 border-b border-gold/15 pb-2 text-gold">{group.heading}</p>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      onClick={onNavigate}
                      {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="group/link inline-flex items-start gap-1.5 text-[0.875rem] text-neutral-200 transition-colors duration-200 hover:text-gold"
                    >
                      <span className="border-b border-transparent transition-colors duration-200 group-hover/link:border-gold/60">
                        {link.label}
                      </span>
                      {link.note === "Download" && (
                        <Download
                          size={12}
                          strokeWidth={1.5}
                          className="mt-1 shrink-0 opacity-70"
                        />
                      )}
                      {link.external && (
                        <ArrowUpRight
                          size={12}
                          strokeWidth={1.5}
                          className="mt-1 shrink-0 opacity-70"
                        />
                      )}
                    </Link>

                    {link.children && (
                      <ul className="mt-2 ml-3 space-y-1.5 border-l border-gold/20 pl-3">
                        {link.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={onNavigate}
                              className="text-[0.8125rem] text-neutral-400 transition-colors duration-200 hover:text-blush-300"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Image panel — the orientation cue */}
        <div className="col-span-4">
          <Link
            href={item.href}
            onClick={onNavigate}
            className="group/panel block overflow-hidden rounded-lg"
          >
            <div className="relative">
              <BrandImage
                name={panelImage}
                ratio="4 / 3"
                width={900}
                sizes="30vw"
                imgClassName="transition-transform duration-[900ms] ease-[var(--ease-editorial)] group-hover/panel:scale-[1.06]"
              />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p
                  key={panelHeading}
                  className="eyebrow mb-2 text-gold"
                  style={{ animation: "blFade 400ms var(--ease-editorial)" }}
                >
                  {panelHeading}
                </p>
                <p
                  key={panelBlurb ?? "default"}
                  className="font-[family-name:var(--font-display)] text-xl leading-snug text-paper"
                  style={{ animation: "blFade 500ms var(--ease-editorial)" }}
                >
                  {panelBlurb ?? item.feature?.title ?? "Explore the collection"}
                </p>
              </div>
            </div>
          </Link>

          {item.feature && (
            <div className="mt-5 border-t border-gold/15 pt-5">
              <p className="eyebrow mb-2 text-gold">{item.feature.eyebrow}</p>
              <p className="mb-3 text-[0.8125rem] leading-relaxed text-neutral-400">
                {item.feature.body}
              </p>
              <Link
                href={item.feature.href}
                onClick={onNavigate}
                className="inline-flex items-center gap-1.5 border-b border-gold pb-0.5 text-[0.75rem] tracking-[0.1em] text-gold uppercase transition-opacity hover:opacity-75"
              >
                {item.feature.cta}
                <ArrowUpRight size={12} strokeWidth={1.5} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

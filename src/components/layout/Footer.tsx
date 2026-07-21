import Link from "next/link";
import { footerColumns } from "@/lib/navigation";
import { OfficialWordmark, CrownWave } from "@/components/brand/Logo";
import { SocialRow } from "@/components/brand/SocialIcons";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.07] bg-ink">
      <div className="mx-auto max-w-[1440px] px-[4vw] py-20">
        {/* Official gold wordmark — the brand closes the way it opens. */}
        <div className="mb-16 flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
          <OfficialWordmark size="2.5rem" />
          <div className="max-w-md">
            <p className="text-lg leading-relaxed text-neutral-400">
              We don&apos;t sell hair. We sell the version of you that exists beyond the wig.
            </p>
            <SocialRow className="mt-6" />
          </div>
        </div>

        <div className="rule-gilded mb-14" />

        <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-3 lg:grid-cols-6">
          {footerColumns.map((column) => (
            <div key={column.heading}>
              <p className="eyebrow mb-5">{column.heading}</p>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-[0.875rem] text-neutral-400 transition-colors hover:text-paper"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="rule-gilded my-14" />

        <div className="flex flex-col gap-6 pb-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 text-neutral-400">
            <CrownWave size={24} className="text-gold" />
            <p className="text-[0.8125rem]">
              © {new Date().getFullYear()} Beyond Lace. All rights reserved.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/legal/accessibility" className="eyebrow hover:text-blush-300">
              Accessibility
            </Link>
            <Link href="/legal/privacy" className="eyebrow hover:text-blush-300">
              Privacy
            </Link>
            <Link href="/legal/terms" className="eyebrow hover:text-blush-300">
              Terms
            </Link>
          </div>
        </div>
      </div>

      {/* Gilded closing strip — per the reference footer band. */}
      <div style={{ background: "var(--grad-gilded)" }}>
        <p className="mx-auto max-w-[1440px] px-[4vw] py-2.5 text-center text-[0.625rem] font-medium tracking-[0.22em] text-ink uppercase">
          Beyond Lace™&ensp;|&ensp;Luxury Human Hair&ensp;|&ensp;Est. 2026
        </p>
      </div>
    </footer>
  );
}

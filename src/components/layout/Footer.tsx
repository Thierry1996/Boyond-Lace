import Link from "next/link";
import { footerColumns } from "@/lib/navigation";
import { Wordmark, CrownWave } from "@/components/brand/Logo";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.07] bg-ink">
      <div className="mx-auto max-w-[1440px] px-[4vw] py-20">
        {/* Manifesto restatement — the brand closes the way it opens. */}
        <div className="mb-16 max-w-2xl">
          <Wordmark className="mb-4 block text-4xl text-paper" />
          <p className="text-lg leading-relaxed text-neutral-400">
            We don&apos;t sell hair. We sell the version of you that exists beyond the wig.
          </p>
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

        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 text-neutral-400">
            <CrownWave size={24} className="text-gold" />
            <p className="text-[0.8125rem]">
              © {new Date().getFullYear()} Beyond Lace. All rights reserved.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <p className="eyebrow">Beyond Lace. Beyond Beautiful.</p>
            <span className="hidden h-3 w-px bg-white/15 md:block" />
            <Link href="/legal/accessibility" className="eyebrow hover:text-blush-300">
              Accessibility
            </Link>
            <Link href="/legal/privacy" className="eyebrow hover:text-blush-300">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

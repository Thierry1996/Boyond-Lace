import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Careers",
  description: "Open roles at Beyond Lace — luxury human hair, built deliberately.",
};

const ROLES = [
  {
    title: "Senior Wig Construction Specialist",
    where: "Xuchang facility · On-site",
    type: "Full-time",
  },
  { title: "B2B Partner Success Manager", where: "Remote · US timezones", type: "Full-time" },
  { title: "Content & Community Lead — The Beyond Circle", where: "Remote", type: "Full-time" },
];

export default function CareersPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-[4vw] py-20">
      <div className="flex items-center justify-between border-t border-white/[0.07] pt-4">
        <span className="eyebrow">Careers</span>
        <span className="eyebrow">We hire slowly, on purpose</span>
      </div>

      <h1 className="mt-14 text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] text-paper">
        Build the standard
        <span className="block italic">with us.</span>
      </h1>
      <p className="mt-7 max-w-xl text-[1.0625rem] leading-relaxed text-neutral-400">
        Beyond Lace is small by intention. Every hire owns something real — a pillar, a market, a
        craft — and every role touches the customer or the product directly. No layers, no theatre.
      </p>

      <div className="mt-16 divide-y divide-white/[0.07] border-t border-white/[0.07]">
        {ROLES.map((r) => (
          <div key={r.title} className="flex flex-wrap items-baseline justify-between gap-4 py-7">
            <div>
              <h2 className="text-xl text-paper">{r.title}</h2>
              <p className="mt-1 text-[0.875rem] text-neutral-400">{r.where}</p>
            </div>
            <span className="eyebrow">{r.type}</span>
          </div>
        ))}
      </div>

      <p className="mt-12 text-[0.9375rem] leading-relaxed text-neutral-400">
        To apply, write to us through the{" "}
        <Link href="/support#contact" className="text-gold underline-offset-4 hover:underline">
          contact form
        </Link>{" "}
        with the topic &ldquo;Something else&rdquo; and the role in your first line. A portfolio or
        a story beats a CV every time.
      </p>
    </div>
  );
}

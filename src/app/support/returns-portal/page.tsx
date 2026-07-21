import type { Metadata } from "next";
import Link from "next/link";
import { ResourceHero } from "@/components/ui/ResourceHero";
import { Section, SectionHeading } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Return Portal — Self-Service Returns & Exchanges",
  description:
    "Start a Beyond Lace return or exchange yourself: 30 days, lace uncut, Lace Test credit applied automatically. No email chain, no retention script.",
};

const STEPS = [
  {
    n: "01",
    title: "Find your order number",
    body: "It looks like BL-XXXXXX and sits at the top of your confirmation email. If you checked out as a guest, that email is the only place it exists.",
  },
  {
    n: "02",
    title: "Tell us what happened",
    body: "Shade, fit, construction, or changed your mind — all four are valid. Shade feedback goes straight to the team that maintains the matching chart.",
  },
  {
    n: "03",
    title: "Print the prepaid label",
    body: "Returns inside 30 days ship back on us when the reason is our error, including a shade our own guidance got wrong after you used a Lace Test kit.",
  },
  {
    n: "04",
    title: "Refund or exchange",
    body: "Refunds issue to the original payment method within five business days of inspection. First shade exchange is free in both directions.",
  },
];

const ELIGIBILITY = [
  { ok: true, text: "Within 30 days of delivery" },
  { ok: true, text: "Lace uncut and unglued" },
  { ok: true, text: "Original condition, tags and packaging intact" },
  { ok: false, text: "Lace has been cut, tinted, or bleached" },
  { ok: false, text: "Unit has been washed, coloured, or restyled with heat" },
  { ok: false, text: "Care products opened (hygiene — adhesives and cleansers)" },
];

export default function ReturnsPortalPage() {
  return (
    <>
      <ResourceHero
        eyebrow="Orders & logistics"
        title="Return portal."
        italic="Self-service, no gatekeeping."
        body="Thirty days, lace uncut, original condition. We would rather you returned a unit that was wrong than kept one you never wear — but the $5 Lace Test exists so this page stays quiet."
        image="ordersLogistics"
        cta={{ label: "Start a return", href: "/support#contact" }}
      />

      <Section
        className="py-20"
        eyebrowLeft="How it works"
        eyebrowCenter="Four steps"
        eyebrowRight="30 days"
      >
        <SectionHeading
          title="Start it yourself."
          body="The self-service portal activates with customer accounts. Until then this same flow runs through the support form and is handled same-day — the steps and the outcome are identical."
        />
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.n} className="border-t border-gold/20 pt-6">
              <span className="font-[family-name:var(--font-display)] text-3xl text-gold tabular-nums">
                {s.n}
              </span>
              <h3 className="mt-3 text-lg text-paper">{s.title}</h3>
              <p className="mt-3 text-[0.875rem] leading-relaxed text-neutral-400">{s.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <section className="border-t border-white/[0.07] bg-plum-900 py-20">
        <div className="mx-auto max-w-[1440px] px-[4vw]">
          <p className="eyebrow mb-4 text-gold">Eligibility</p>
          <h2 className="text-[clamp(1.75rem,4vw,3rem)] text-paper">
            What comes back, what does not.
          </h2>
          <div className="mt-12 grid gap-x-10 gap-y-4 md:grid-cols-2">
            {ELIGIBILITY.map((e) => (
              <div key={e.text} className="flex items-start gap-3 border-b border-white/10 pb-4">
                <span
                  aria-hidden="true"
                  className={`mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rotate-45 ${
                    e.ok ? "bg-gold" : "bg-blush-200/30"
                  }`}
                />
                <span
                  className={`text-[0.9375rem] ${e.ok ? "text-blush-200/85" : "text-blush-200/45"}`}
                >
                  {e.text}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-5">
            <Link
              href="/support#contact"
              className="border border-gold bg-gold px-8 py-3.5 text-[0.8125rem] tracking-[0.14em] text-ink uppercase transition-all duration-500 hover:bg-transparent hover:text-gold"
            >
              Start a return
            </Link>
            <Link
              href="/legal/shipping-policy"
              className="border-b border-white/25 pb-1 text-[0.8125rem] tracking-[0.1em] text-blush-200 uppercase transition-colors hover:border-gold hover:text-gold"
            >
              Full policy text
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

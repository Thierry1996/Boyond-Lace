import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Camera, MessageCircle } from "lucide-react";
import { PolicyAccordion, type PolicySection } from "@/components/policy/PolicyAccordion";
import { InnerCircleForm } from "@/components/forms/InnerCircleForm";
import { EMAILS, LOCATION, PHONE_DISPLAY, URLS } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Shipping & Returns Policy",
  description:
    "How Beyond Lace ships luxury human-hair wigs worldwide, how to track your order, customs and duties, our 30-day returns window, and refund timelines. Clear, fair, and built around you.",
};

const UPDATED = "August 2026";

/* ---------------------------------------------------------------- Light UI */

function Prose({ children }: { children: React.ReactNode }) {
  return <p className="text-[0.9375rem] leading-[1.85] text-plum-900/75">{children}</p>;
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mt-10 mb-4 font-[family-name:var(--font-display)] text-xl text-plum-900">
      {children}
    </h3>
  );
}

function Callout({
  tone = "note",
  children,
}: {
  tone?: "note" | "warn" | "brand";
  children: React.ReactNode;
}) {
  const bar =
    tone === "warn" ? "border-amber-500" : tone === "brand" ? "border-plum-600" : "border-blush-400";
  const bg =
    tone === "warn" ? "bg-amber-50" : tone === "brand" ? "bg-plum-700/[0.05]" : "bg-blush-200/25";
  return (
    <div className={`mt-6 rounded-r-lg border-l-[3px] ${bar} ${bg} px-6 py-5`}>
      <p className="text-[0.9375rem] leading-[1.75] text-plum-900/80">{children}</p>
    </div>
  );
}

function Bullets({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="mt-4 space-y-3.5">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3 text-[0.9375rem] leading-[1.7] text-plum-900/75">
          <span aria-hidden className="mt-2.5 h-px w-4 shrink-0 bg-plum-600/60" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

function Steps({
  steps,
}: {
  steps: { n: string; t: string; b: string }[];
}) {
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      {steps.map((s) => (
        <div key={s.n} className="flex gap-4 rounded-xl border border-plum-900/10 bg-white/60 p-6">
          <span className="font-[family-name:var(--font-display)] text-2xl text-blush-400">
            {s.n}
          </span>
          <div>
            <p className="text-[0.9375rem] font-medium text-plum-900">{s.t}</p>
            <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-plum-900/65">{s.b}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

const YES = (
  <span className="inline-block rounded border border-emerald-500/40 bg-emerald-500/[0.08] px-2 py-1 text-[0.625rem] tracking-[0.1em] text-emerald-700 uppercase">
    Yes
  </span>
);
const LIMITED = (
  <span className="inline-block rounded border border-plum-900/15 px-2 py-1 text-[0.625rem] tracking-[0.1em] text-plum-900/55 uppercase">
    Limited
  </span>
);

/* ---------------------------------------------------------------- Sections */

const SECTIONS: PolicySection[] = [
  {
    id: "shipping",
    chip: "Shipping",
    emoji: "✈️",
    index: "Section 01",
    title: "Shipping",
    titleItalic: "Policy",
    body: (
      <>
        <Prose>
          At Beyond Lace, we are committed to delivering your order swiftly, safely, and with full
          transparency. We ship globally from our base in{" "}
          <strong className="font-semibold text-plum-900">
            {LOCATION.line1}, {LOCATION.line2}
          </strong>{" "}
          — the world&rsquo;s premier hair manufacturing district — and work with the most trusted
          international logistics partners to get your hair to you in perfect condition.
        </Prose>

        <SubHeading>Processing Time</SubHeading>
        <Prose>
          All orders are carefully{" "}
          <strong className="font-semibold text-plum-900">
            processed and quality-checked within 1–3 business days
          </strong>{" "}
          of payment confirmation. Custom and bespoke orders may require an extended production
          period — this will be communicated to you individually at the time of ordering.
        </Prose>
        <Callout tone="note">
          <strong className="font-semibold">⏰ Please note:</strong> Orders placed on Saturdays after
          4:00 PM CST, on Sundays, or on Chinese public holidays will begin processing on the next
          available business day.
        </Callout>

        <SubHeading>Delivery Options &amp; Timeframes</SubHeading>
        <Prose>
          We offer three tiers of international shipping to accommodate different needs and budgets.
          All timeframes are calculated from the date of dispatch, not the date of order placement.
        </Prose>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            {
              e: "⚡",
              k: "Express",
              d: "3–7",
              c: "DHL Express · FedEx International Priority",
            },
            { e: "✈️", k: "Standard Air", d: "7–15", c: "EMS · Air Parcel International" },
            { e: "🌍", k: "Economy", d: "15–25", c: "China Post · ePacket (select regions)" },
          ].map((o) => (
            <div key={o.k} className="rounded-xl border border-plum-900/10 bg-white/60 p-6">
              <span className="text-2xl" aria-hidden>
                {o.e}
              </span>
              <p className="mt-4 text-[0.6875rem] tracking-[0.14em] text-plum-900/55 uppercase">
                {o.k}
              </p>
              <p className="mt-1 font-[family-name:var(--font-display)] text-3xl text-plum-600">
                {o.d}
              </p>
              <p className="text-[0.8125rem] text-plum-900/70">Business Days</p>
              <p className="mt-4 text-[0.75rem] leading-relaxed text-plum-900/55">{o.c}</p>
            </div>
          ))}
        </div>
        <Callout tone="brand">
          <strong className="font-semibold">Complimentary worldwide shipping</strong> on every order
          over $400 — applied automatically at checkout, on any delivery tier available to your
          region.
        </Callout>
        <Callout tone="warn">
          <strong className="font-semibold">⚠️ Seasonal note:</strong> During Chinese national
          holidays (including Spring Festival / Chinese New Year, National Day Week, and Golden
          Week), shipping timelines may extend by 5–10 additional business days. We recommend placing
          time-sensitive orders well in advance of these periods.
        </Callout>

        <SubHeading>Shipping Rates</SubHeading>
        <Prose>
          Shipping rates are calculated at checkout based on destination country, package weight, and
          chosen delivery method. Wholesale orders with high volume may be eligible for{" "}
          <strong className="font-semibold text-plum-900">negotiated freight rates</strong> —{" "}
          <Link href="/contact" className="text-plum-700 underline underline-offset-2">
            contact us
          </Link>{" "}
          directly for a custom shipping quote before placing large orders.
        </Prose>

        <SubHeading>Global Delivery Zones</SubHeading>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse text-left">
            <thead>
              <tr className="bg-plum-900 text-blush-200">
                {["Region", "Key Countries", "Express", "Economy"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3.5 text-[0.6875rem] tracking-[0.12em] uppercase first:rounded-l-lg last:rounded-r-lg"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["North America", "USA, Canada, Mexico", YES, YES],
                ["Europe", "UK, France, Germany, Italy, Netherlands + more", YES, YES],
                ["West Africa", "Nigeria, Ghana, Senegal, Côte d’Ivoire", YES, LIMITED],
                ["Southern Africa", "South Africa, Kenya, Tanzania, Zimbabwe", YES, LIMITED],
                ["Middle East", "UAE, Saudi Arabia, Qatar, Kuwait", YES, YES],
                ["Asia Pacific", "Australia, New Zealand, Singapore, Malaysia", YES, YES],
                ["Caribbean & Latin America", "Jamaica, Trinidad, Brazil, Colombia", LIMITED, LIMITED],
              ].map((row, i) => (
                <tr key={i} className="border-b border-plum-900/10">
                  <td className="px-5 py-4 text-[0.875rem] font-medium text-plum-900">{row[0]}</td>
                  <td className="px-5 py-4 text-[0.8125rem] text-plum-900/70">{row[1]}</td>
                  <td className="px-5 py-4">{row[2]}</td>
                  <td className="px-5 py-4">{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-[0.8125rem] leading-relaxed text-plum-900/60">
          Don&rsquo;t see your country?{" "}
          <Link href="/contact" className="text-plum-700 underline underline-offset-2">
            Contact us
          </Link>{" "}
          — we ship to virtually everywhere. Some remote regions may incur additional freight
          surcharges.
        </p>
      </>
    ),
  },
  {
    id: "tracking",
    chip: "Tracking",
    emoji: "📦",
    index: "Section 02",
    title: "Order",
    titleItalic: "Tracking",
    body: (
      <>
        <Prose>
          Every shipment from Beyond Lace is assigned a unique tracking number. Once your order has
          been dispatched, you will receive a{" "}
          <strong className="font-semibold text-plum-900">
            tracking notification email within 24 hours
          </strong>{" "}
          containing your tracking ID and a direct link to monitor your shipment in real time.
        </Prose>
        <SubHeading>How to Track Your Order</SubHeading>
        <Steps
          steps={[
            {
              n: "1",
              t: "Dispatch Confirmation",
              b: "You’ll receive an email with your tracking number and courier name within 24 hours of dispatch.",
            },
            {
              n: "2",
              t: "Track Online",
              b: "Visit the courier’s tracking portal (DHL, FedEx, or EMS) and enter your tracking number.",
            },
            {
              n: "3",
              t: "Monitor Progress",
              b: "Track your package from our warehouse in China all the way to your door.",
            },
            {
              n: "4",
              t: "Contact Us If Needed",
              b: "If tracking shows no update for 7+ business days, reach out via WhatsApp with your order number.",
            },
          ]}
        />
        <Callout tone="brand">
          <strong className="font-semibold">☕ No tracking update for a few days?</strong> This is
          common during international customs clearance — packages can sit at customs for 2–5 business
          days without visible movement. This is completely normal and does not indicate a problem
          with your shipment.
        </Callout>
      </>
    ),
  },
  {
    id: "customs",
    chip: "Customs & Duties",
    emoji: "🌍",
    index: "Section 03",
    title: "Customs, Duties",
    titleItalic: "& Taxes",
    body: (
      <>
        <Prose>
          When ordering internationally, your shipment may be subject to{" "}
          <strong className="font-semibold text-plum-900">
            import duties, customs taxes, and VAT
          </strong>{" "}
          levied by your country&rsquo;s customs authority. These charges are entirely outside our
          control and are not included in your order total or shipping fee.
        </Prose>
        <Bullets
          items={[
            <>
              Customs fees are the{" "}
              <strong className="font-semibold text-plum-900">
                sole responsibility of the recipient
              </strong>{" "}
              and must be paid before your local courier can release the package
            </>,
            "Rates vary widely by country — we recommend checking your local customs authority’s website for estimated charges before ordering",
            <>
              We declare all packages accurately with their{" "}
              <strong className="font-semibold text-plum-900">true commercial value</strong> in
              compliance with international trade law — we do not falsify customs declarations
            </>,
            "Packages held at customs for extended periods due to unpaid duties may be returned to us — in such cases, re-delivery costs are the buyer’s responsibility",
          ]}
        />
        <Callout tone="warn">
          <strong className="font-semibold">⚠️ High-duty regions:</strong> Buyers in the UK, EU,
          Brazil, and India should be particularly aware of import threshold rules that may trigger
          duty payments. For large wholesale orders entering these regions, we recommend consulting a
          local customs broker in advance.
        </Callout>
      </>
    ),
  },
  {
    id: "returns",
    chip: "Returns",
    emoji: "↩️",
    index: "Section 04",
    title: "Returns",
    titleItalic: "Policy",
    body: (
      <>
        <Prose>
          We want every customer to feel completely confident purchasing from Beyond Lace. If for any
          reason you are not satisfied with your order, we operate a{" "}
          <strong className="font-semibold text-plum-900">30-day return window</strong> from the
          confirmed date of delivery.
        </Prose>
        <SubHeading>Eligibility for Return</SubHeading>
        <Prose>
          To be eligible for a return, your item must meet{" "}
          <strong className="font-semibold text-plum-900">all</strong> of the following conditions:
        </Prose>
        <Bullets
          items={[
            <>
              Item is <strong className="font-semibold text-plum-900">unworn and unwashed</strong> —
              hair must not have been installed, fitted, or placed on any head
            </>,
            <>
              Item is in its{" "}
              <strong className="font-semibold text-plum-900">original, unaltered state</strong> — no
              cutting, dyeing, bleaching, perming, or heat styling, and the lace must be uncut
            </>,
            <>
              Item is in its{" "}
              <strong className="font-semibold text-plum-900">original packaging</strong> with all
              swing tags, wefts, and accessories intact
            </>,
            <>
              Return is initiated within{" "}
              <strong className="font-semibold text-plum-900">30 calendar days</strong> of the
              confirmed delivery date
            </>,
            <>
              You have <strong className="font-semibold text-plum-900">photographic evidence</strong>{" "}
              of the item&rsquo;s condition at the time of return initiation
            </>,
          ]}
        />
        <SubHeading>Non-Returnable Items</SubHeading>
        <Prose>
          The following items and circumstances are explicitly{" "}
          <strong className="font-semibold text-plum-900">excluded from our returns policy</strong>:
        </Prose>
        <Bullets
          items={[
            "Hair that has been chemically processed — coloured, bleached, relaxed, permed, or keratin-treated",
            "Hair that has been cut, resewn, or structurally altered",
            "Hair that has been worn, washed, or styled with any heat tool",
            "Custom and bespoke orders made to your specific specifications",
            "Sale or clearance items marked as final sale at time of purchase",
            "Items returned after the 30-day window without prior written approval from our team",
          ]}
        />
        <Callout tone="note">
          <strong className="font-semibold">💡 Unsure if your item qualifies?</strong> Contact us via
          email or WhatsApp with photos before initiating a return. Our team will assess your case
          within 24 hours and advise you on the best resolution — we would rather resolve things
          fairly than leave you frustrated.
        </Callout>
        <SubHeading>How to Initiate a Return</SubHeading>
        <Steps
          steps={[
            {
              n: "1",
              t: "Contact Us First",
              b: "Email or WhatsApp us within 30 days of delivery. Include your order number and reason for return.",
            },
            {
              n: "2",
              t: "Send Photos",
              b: "Photograph the item and original packaging clearly. This protects both you and us during the process.",
            },
            {
              n: "3",
              t: "Receive Return Address",
              b: "Once approved, we’ll provide the return shipping address and instructions. Do not return items without approval.",
            },
            {
              n: "4",
              t: "Ship & Track",
              b: "Package carefully and ship using a tracked service. Share your tracking number with us once dispatched.",
            },
          ]}
        />
        <Prose>
          <span className="mt-6 block">
            Return shipping costs are borne by the{" "}
            <strong className="font-semibold text-plum-900">buyer</strong> unless the item is
            confirmed defective, incorrect, or damaged in transit, in which case Beyond Lace will
            cover all return shipping expenses.
          </span>
        </Prose>
      </>
    ),
  },
  {
    id: "refunds",
    chip: "Refunds",
    emoji: "💳",
    index: "Section 05",
    title: "Refunds",
    titleItalic: "& Resolutions",
    body: (
      <>
        <Prose>
          Once your return is received and inspected by our team, we will notify you of the outcome
          within <strong className="font-semibold text-plum-900">3 business days</strong>. If your
          return is approved, a refund will be processed by one of the following methods:
        </Prose>
        <Bullets
          items={[
            <>
              <strong className="font-semibold text-plum-900">Original payment method:</strong>{" "}
              Refunds are issued back to the original card, account, or payment platform used at
              checkout
            </>,
            <>
              <strong className="font-semibold text-plum-900">Store credit:</strong> At your
              preference, we can issue store credit with a 5% bonus value
            </>,
            <>
              <strong className="font-semibold text-plum-900">Exchange:</strong> We can arrange an
              exchange for an item of equivalent or greater value (you pay the difference)
            </>,
          ]}
        />
        <SubHeading>Refund Timeline</SubHeading>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[36rem] border-collapse text-left">
            <thead>
              <tr className="bg-plum-900 text-blush-200">
                {["Payment Method", "Processing Time", "Bank Clearance"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3.5 text-[0.6875rem] tracking-[0.12em] uppercase first:rounded-l-lg last:rounded-r-lg"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["PayPal", "1–2 business days", "Instant – 3 days"],
                ["Credit / Debit Card", "3–5 business days", "5–10 business days"],
                ["Bank Transfer (Wire)", "3–5 business days", "3–7 business days"],
                ["Store Credit", "Same day", "Immediate"],
              ].map((row, i) => (
                <tr key={i} className="border-b border-plum-900/10">
                  <td className="px-5 py-4 text-[0.875rem] font-medium text-plum-900">{row[0]}</td>
                  <td className="px-5 py-4 text-[0.8125rem] text-plum-900/70">{row[1]}</td>
                  <td className="px-5 py-4 text-[0.8125rem] text-plum-900/70">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <SubHeading>Damaged or Incorrect Items</SubHeading>
        <Prose>
          If you receive an item that is{" "}
          <strong className="font-semibold text-plum-900">
            damaged, defective, or does not match your order
          </strong>
          , please contact us within{" "}
          <strong className="font-semibold text-plum-900">48 hours of delivery</strong> with clear
          photographs of the issue. In all such cases, we will offer one of the following at no extra
          cost to you:
        </Prose>
        <Bullets
          items={[
            "A full replacement shipment dispatched via Express courier at our expense",
            "A complete refund of the item value plus original shipping paid",
            "A store credit of the item value plus a 10% goodwill addition",
          ]}
        />
        <Callout tone="brand">
          <strong className="font-semibold">🤝 Our commitment to you:</strong> We are a
          relationship-first business. We will always work to find the fairest resolution — because a
          customer treated well is a customer for life, and word travels.
        </Callout>
      </>
    ),
  },
];

const TRUST = [
  {
    Icon: ShieldCheck,
    t: "Quality Guaranteed",
    b: "Every unit is inspected and quality-checked by hand before it leaves the floor.",
  },
  {
    Icon: Camera,
    t: "Photo-Verified Returns",
    b: "A transparent, photo-documented process that protects both you and us.",
  },
  {
    Icon: MessageCircle,
    t: "24-Hour Response",
    b: "Real people on WhatsApp and email, replying within one business day.",
  },
];

/* -------------------------------------------------------------------- Page */

export default function ShippingReturnsPage() {
  return (
    <div className="bg-[#faf6f9] text-plum-900">
      {/* Hero */}
      <section className="relative overflow-hidden px-[4vw] pt-24 pb-16 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(154,102,180,0.16),transparent)]"
        />
        <div className="relative mx-auto max-w-3xl">
          <p className="text-xl tracking-[0.5em] text-plum-600" aria-hidden>
            ✦ ✦ ✦
          </p>
          <p className="mt-6 text-[0.6875rem] tracking-[0.28em] text-plum-900/50 uppercase">
            Policies · Transparency · Your Peace of Mind
          </p>
          <h1 className="mt-6 font-[family-name:var(--font-display)] text-[clamp(2.75rem,7vw,5rem)] leading-[0.98] text-plum-900">
            Shipping &amp;
            <br />
            <span className="italic text-plum-600">Returns Policy</span>
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-[1rem] leading-relaxed text-plum-900/65">
            Clear, fair, and designed around you. Everything you need to know about how we deliver
            and how we make it right.
          </p>
          <div className="mx-auto mt-8 h-px w-24 bg-gradient-to-r from-transparent via-plum-600 to-transparent" />
        </div>
      </section>

      {/* Interactive policy accordion + chip navigator */}
      <div className="px-[4vw] pb-8">
        <PolicyAccordion sections={SECTIONS} />
        <div className="mx-auto mt-12 max-w-[1100px] text-center">
          <span className="inline-block rounded-lg border border-plum-900/10 bg-white/60 px-5 py-2.5 text-[0.6875rem] tracking-[0.14em] text-plum-900/55 uppercase">
            🗓 Last updated: {UPDATED} · Version 1.0
          </span>
        </div>
      </div>

      {/* Trust band */}
      <section className="bg-gradient-to-b from-plum-900 to-plum-800 py-16">
        <div className="mx-auto grid max-w-[1100px] gap-5 px-[4vw] sm:grid-cols-3">
          {TRUST.map(({ Icon, t, b }) => (
            <div
              key={t}
              className="rounded-xl border border-white/[0.08] bg-plum-900/30 p-7 text-center"
            >
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-gold/25 bg-plum-900 text-gold">
                <Icon size={20} strokeWidth={1.6} />
              </span>
              <p className="mt-4 font-[family-name:var(--font-display)] text-lg text-paper">{t}</p>
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-blush-200/70">{b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter — wired to the marketing database */}
      <section id="newsletter" className="scroll-mt-24 bg-plum-800 pb-24">
        <div className="mx-auto max-w-[1100px] px-[4vw]">
          <div className="rounded-2xl border border-white/[0.08] bg-plum-900/40 p-8 sm:p-12">
            <div className="text-center">
              <p className="eyebrow text-gold">Never miss a thing</p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(1.75rem,3.5vw,2.5rem)] text-paper">
                Join the <span className="italic text-blush-300">Beyond Circle</span>
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-[0.9375rem] leading-relaxed text-blush-200/70">
                Subscribe for early access, exclusive wholesale deals, styling content, and flash
                stock alerts — plus policy updates the moment anything changes.
              </p>
            </div>
            <div className="mx-auto mt-10 max-w-2xl">
              <InnerCircleForm />
            </div>
            <p className="mt-8 text-center text-[0.8125rem] text-blush-200/60">
              Prefer to talk first? Reach us on{" "}
              <a
                href={URLS.whatsappPrefilled}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold underline underline-offset-2"
              >
                WhatsApp
              </a>{" "}
              at {PHONE_DISPLAY} or email{" "}
              <a href={`mailto:${EMAILS.care}`} className="text-gold underline underline-offset-2">
                {EMAILS.care}
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

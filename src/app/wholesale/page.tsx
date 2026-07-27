import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, Phone, Mail, UserRound, ArrowRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { WholesaleApplyForm } from "@/components/forms/WholesaleApplyForm";
import { WholesaleBuyerSurvey } from "@/components/forms/WholesaleBuyerSurvey";
import { WholesaleCatalogPreview } from "@/components/wholesale/WholesaleCatalogPreview";
import { WholesaleShowcase } from "@/components/wholesale/WholesaleShowcase";
import { commerce } from "@/lib/commerce";
import { WHOLESALE_MOQ } from "@/lib/channel";
import { URLS, EMAILS, PHONE_DISPLAY, RESPONSE_TIMES } from "@/lib/contact";
import type { QuotePrefill } from "@/components/forms/WholesaleApplyForm";

export const metadata: Metadata = {
  title: "Wholesale & Private Label — Beyond Lace Pro",
  description:
    "Build a human hair wig business on our floor. 50-unit MOQ, factory-direct pricing, custom packaging, batch consistency guarantee, and contractually enforced MAP protection.",
};

const TIERS = [
  {
    name: "Bronze",
    units: "50–149 units / year",
    margin: "Standard partner pricing",
    perks: [
      "Full collection access",
      "Turnkey asset kit",
      "MAP protection",
      "Net 15 after order one",
    ],
  },
  {
    name: "Silver",
    units: "150–499 units / year",
    margin: "Improved tier pricing",
    perks: [
      "Everything in Bronze",
      "Salon-exclusive shades",
      "Custom branded packaging",
      "Priority allocation",
      "Net 30 terms",
    ],
    featured: true,
  },
  {
    name: "Gold",
    units: "500+ units / year",
    margin: "Best available pricing",
    perks: [
      "Everything in Silver",
      "Beyond Lace Pro private label",
      "Dedicated account manager",
      "Reserved capacity",
      "Net 45 terms",
    ],
  },
];

const WHY_APPLY = [
  {
    t: "Factory-direct",
    b: "You buy from the floor that builds the unit — no trading company between us.",
  },
  {
    t: "Quote in 24 hours",
    b: "Applying costs nothing. Verified partners get personalised pricing within a business day.",
  },
  {
    t: "MAP-protected",
    b: "Every partner signs a price floor we enforce, so no one undercuts you — including us.",
  },
  {
    t: "Custom from order one",
    b: "Private label, custom lengths, densities and caps — not held back for volume.",
  },
];

const CONNECT = [
  {
    icon: MessageCircle,
    title: "WhatsApp",
    line: "Fastest for a live quote",
    meta: RESPONSE_TIMES.whatsapp,
    href: URLS.whatsappPrefilled,
    cta: "Message us",
    external: true,
  },
  {
    icon: Phone,
    title: "Call the desk",
    line: PHONE_DISPLAY,
    meta: RESPONSE_TIMES.phone,
    href: URLS.phone,
    cta: "Call now",
    external: false,
  },
  {
    icon: Mail,
    title: "Partner email",
    line: EMAILS.partners,
    meta: RESPONSE_TIMES.email,
    href: `mailto:${EMAILS.partners}`,
    cta: "Write to us",
    external: false,
  },
  {
    icon: UserRound,
    title: "Account manager",
    line: "One named contact, start to finish",
    meta: "Assigned on approval",
    href: "#apply",
    cta: "Apply to unlock",
    external: false,
  },
];

const SPECS: Array<{ label: string; value: string }> = [
  { label: "Material", value: "Virgin Remy human hair, cuticle intact and aligned" },
  { label: "Origin", value: "Single-donor where specified; published per batch" },
  { label: "Lace / cap", value: "Swiss HD lace — 13×4, 13×6, 5×5 closure, full lace" },
  { label: "Density", value: "150% standard · 180% / 200% to order" },
  { label: "Lengths", value: '10" – 30", in 2" steps' },
  {
    label: "Textures",
    value: "Body Wave, Straight, Deep Wave, Kinky Straight, Kinky Curly, Jerry Curl",
  },
  { label: "Knots", value: "Bleached individually through the parting on full lace" },
  { label: "Baby hair", value: "Pre-plucked hairline, natural density falloff" },
  { label: "Colour", value: "Natural black default; custom colour and highlights to order" },
  { label: "Batch guarantee", value: "Texture, tone and density matched to the reference run" },
  { label: "MOQ", value: `${WHOLESALE_MOQ} units, mix-and-match across the range` },
  { label: "Lead time", value: "In-stock 3–5 days · custom runs 2–3 weeks" },
];

const WHY_CHOOSE = [
  {
    t: "Warehouses in two hemispheres",
    b: "Stock held in both the US and China. Domestic US orders move in three to five days rather than waiting on a container.",
  },
  {
    t: "Global dispatch, tracked",
    b: "DHL, FedEx and EMS to more than 180 countries. Express lanes run three to seven days door to door.",
  },
  {
    t: "Trend reserve",
    b: "A fifth of monthly capacity held idle. A silhouette that moves Tuesday has a cut sample by Friday.",
  },
  {
    t: "Batch consistency guarantee",
    b: "Measured against the reference batch. A reorder in eighteen months matches the unit in your hand today.",
  },
  {
    t: "Private label as standard",
    b: "Your box, comb, hang tag and insert. We appear nowhere on it and never sell to your customers behind you.",
  },
  {
    t: "One named account manager",
    b: "The same person for orders, logistics and custom requests — not a shared inbox or a new introduction each month.",
  },
];

const SHOWCASE: Array<{ src: string; label: string; note: string }> = [
  { src: "aurora", label: 'Body Wave, 22"', note: "180% density · 13×6 HD lace" },
  { src: "velvet", label: 'Bone Straight, 26"', note: "Full lace · bleached knots" },
  { src: "gold", label: 'Deep Wave, 20"', note: "Glueless · pre-plucked hairline" },
  { src: "blush", label: 'Kinky Curly, 18"', note: "5×5 closure · natural black" },
  { src: "plum", label: 'Jerry Curl, 24"', note: "150% density · natural falloff" },
  { src: "mono-2", label: "Custom colour run", note: "Highlights to spec · batch matched" },
];

/** Maps an order quantity to the application's volume-tier options. */
function volumeTierFor(qty: number): QuotePrefill["volume"] {
  if (qty >= 500) return "500+";
  if (qty >= 150) return "150-499";
  return "50-149";
}

/**
 * Resolves the ?unit=&qty= a "Request this quote" link carries into a prefill
 * for the application form. Server-side, so the product title is looked up from
 * the catalogue rather than fetched on the client, and a bad slug simply yields
 * no prefill instead of an error.
 */
async function resolvePrefill(sp: {
  unit?: string;
  qty?: string;
  custom?: string;
}): Promise<QuotePrefill | undefined> {
  if (!sp.unit) return undefined;
  const product = await commerce.getProduct(sp.unit);
  if (!product?.wholesale) return undefined;

  const qty = Math.max(WHOLESALE_MOQ, Number(sp.qty) || WHOLESALE_MOQ);
  // The customization brief is untrusted URL text; cap its length so a crafted
  // link cannot stuff the message field.
  const custom = sp.custom?.slice(0, 600).trim() || undefined;
  return {
    slug: product.slug,
    sku: product.sku,
    title: product.title,
    qty,
    volume: volumeTierFor(qty),
    custom,
  };
}

export default async function WholesalePage({
  searchParams,
}: {
  searchParams: Promise<{ unit?: string; qty?: string; custom?: string }>;
}) {
  const [prefill, products] = await Promise.all([
    resolvePrefill(await searchParams),
    commerce.getProducts({ wholesaleOnly: true, sort: "launch-rank" }),
  ]);

  return (
    <>
      {/* 1 — Hero */}
      <section className="surface-velvet border-b border-white/[0.07] pt-20 pb-24">
        <div className="mx-auto max-w-[1440px] px-[4vw]">
          <div className="flex items-center justify-between border-t border-white/[0.07] pt-4">
            <span className="eyebrow">Wholesale</span>
            <span className="eyebrow hidden md:block">Salon & Private Label</span>
            <span className="eyebrow">MOQ {WHOLESALE_MOQ}</span>
          </div>
          <div className="mt-20 max-w-4xl">
            <p className="eyebrow mb-8 text-gold">For salons, stylists & resellers</p>
            <h1 className="text-[clamp(2.5rem,7vw,6rem)] leading-[0.95] text-paper">
              Build your hair business
              <span className="block italic">on our manufacturing floor.</span>
            </h1>
            <p className="mt-9 max-w-2xl text-lg leading-relaxed text-neutral-400">
              Fifty units is the whole minimum. You get the cap construction, the batch guarantee
              and the asset kit — and a margin we defend contractually rather than hope you can
              hold.
            </p>
            <div className="mt-11 flex flex-wrap gap-6">
              <Link
                href="#apply"
                className="border border-gold px-9 py-4 text-[0.8125rem] tracking-[0.14em] text-gold uppercase transition-all duration-500 hover:bg-gold hover:text-ink"
              >
                Apply as a partner
              </Link>
              <Link
                href="#survey"
                className="border-b border-white/25 pb-1 text-[0.8125rem] tracking-[0.1em] text-neutral-200 uppercase transition-colors hover:border-gold hover:text-gold"
              >
                Not sure yet? Take the survey
              </Link>
            </div>
            <div className="mt-16 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-lg border border-white/[0.07] bg-white/[0.07] sm:grid-cols-4">
              {[
                { h: "50", p: "Unit minimum" },
                { h: "24h", p: "Quote turnaround" },
                { h: "180+", p: "Countries served" },
                { h: "100%", p: "Batch guarantee" },
              ].map((s) => (
                <div key={s.p} className="bg-plum-900 p-5">
                  <p className="font-[family-name:var(--font-display)] text-3xl text-gold tabular-nums">
                    {s.h}
                  </p>
                  <p className="mt-1 text-[0.75rem] leading-snug text-blush-200/60">{s.p}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2 — Factory & partner process */}
      <Section
        className="py-28"
        eyebrowLeft="Inside the floor"
        eyebrowCenter="Factory & partner process"
        eyebrowRight="How a unit is built"
      >
        <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <SectionHeading
            title="See where your inventory comes from."
            body="No trading company, no relabelled stock. The floor that builds the unit is the floor you order from — from cuticle alignment to the final knot-bleach, on camera."
          />
          <WholesaleShowcase
            variant="feature"
            items={[
              {
                src: "velvet",
                label: "Inside our factory & partner process",
                note: "Sourcing, wefting, cap construction, QC — the full run",
                ratio: "16 / 9",
              },
            ]}
          />
        </div>
      </Section>

      {/* 3 — Apply */}
      <section
        id="apply"
        className="scroll-mt-32 surface-velvet border-y border-white/[0.07] py-28"
      >
        <div className="mx-auto max-w-[1440px] px-[4vw]">
          <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr] lg:items-start">
            <div>
              <p className="eyebrow mb-5 text-gold">Start your hair business today</p>
              <h2 className="text-[clamp(2rem,4.5vw,3.25rem)] text-paper">
                We verify every partner.
              </h2>
              <p className="mt-6 max-w-2xl text-[1.0625rem] leading-relaxed text-neutral-400">
                Pricing is released after your salon or store is verified — that verification is
                what makes MAP enforceable and protects the partners already in the programme. Most
                applications are reviewed within two business days.
              </p>
              <div className="mt-12">
                <WholesaleApplyForm prefill={prefill} />
              </div>
              <p className="mt-8 text-[0.9375rem] leading-relaxed text-neutral-400">
                Not ready to apply? Request a sample unit through the same form — note it in the
                message field. Partners who sample convert at roughly three times the rate, so we
                would rather you did. Direct line:{" "}
                <a
                  href={`mailto:${EMAILS.partners}`}
                  className="text-gold underline-offset-4 hover:underline"
                >
                  {EMAILS.partners}
                </a>
              </p>
            </div>

            {/* Why apply here rail */}
            <aside className="lg:sticky lg:top-24">
              <div className="border border-gold/25 p-8">
                <p className="eyebrow mb-6 text-gold">Why apply here</p>
                <ul className="space-y-6">
                  {WHY_APPLY.map((w) => (
                    <li
                      key={w.t}
                      className="border-t border-white/[0.07] pt-6 first:border-0 first:pt-0"
                    >
                      <h3 className="text-[1.0625rem] text-paper">{w.t}</h3>
                      <p className="mt-2 text-[0.875rem] leading-relaxed text-neutral-400">{w.b}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* 4 — Four ways to connect */}
      <Section
        className="py-28"
        eyebrowLeft="Talk to a human"
        eyebrowCenter="Four ways to connect"
        eyebrowRight="Same desk, your choice"
      >
        <SectionHeading
          title="However you like to reach a supplier."
          body="A named team on the other end of each of these — not a chatbot, not a ticket queue. Pick whichever gets you an answer fastest."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CONNECT.map(({ icon: Icon, ...c }) => (
            <a
              key={c.title}
              href={c.href}
              {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group flex flex-col border border-white/[0.07] p-7 transition-colors duration-300 hover:border-gold/50"
            >
              <Icon size={22} strokeWidth={1.5} className="text-gold" aria-hidden="true" />
              <h3 className="mt-6 text-[1.0625rem] text-paper">{c.title}</h3>
              <p className="mt-1 text-[0.875rem] break-words text-neutral-400">{c.line}</p>
              <p className="mt-4 text-[0.6875rem] tracking-[0.1em] text-neutral-400 uppercase">
                {c.meta}
              </p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-[0.75rem] tracking-[0.1em] text-gold uppercase">
                {c.cta}
                <ArrowRight
                  size={13}
                  strokeWidth={1.75}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </span>
            </a>
          ))}
        </div>
      </Section>

      {/* 5 — Catalogue preview */}
      <section id="catalog" className="scroll-mt-32 bg-plum-900 py-28">
        <div className="mx-auto max-w-[1440px] px-[4vw]">
          <SectionHeading
            eyebrow="Our wholesale catalogue"
            title="Stock the range your clients ask about."
            body="Per-unit trade pricing from fifty units, filtered by texture. Tap through to the full catalogue to see every SKU and its standing tier price."
          />
          <div className="mt-14">
            <WholesaleCatalogPreview products={products} />
          </div>
        </div>
      </section>

      {/* 6 — Tiers */}
      <Section
        className="py-28"
        eyebrowLeft="The programme"
        eyebrowCenter="Three tiers"
        eyebrowRight="Volume-based"
      >
        <SectionHeading
          title="Tiers you can actually reach."
          body="Most wholesale programmes start where a boutique salon finishes. Ours starts at fifty units, because the salons that build brands are rarely the ones already buying containers."
        />
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`flex flex-col border p-8 ${
                tier.featured ? "border-gold/50 bg-plum-900" : "border-white/[0.07]"
              }`}
            >
              {tier.featured && <p className="eyebrow mb-4 text-gold">Most partners</p>}
              <h3 className="font-[family-name:var(--font-display)] text-3xl text-paper">
                {tier.name}
              </h3>
              <p className="mt-2 text-[0.875rem] text-neutral-400 tabular-nums">{tier.units}</p>
              <p className="mt-1 text-[0.875rem] text-gold">{tier.margin}</p>
              <ul className="mt-7 flex-1 space-y-3 border-t border-white/[0.07] pt-7">
                {tier.perks.map((perk) => (
                  <li
                    key={perk}
                    className="flex items-start gap-3 text-[0.875rem] text-neutral-200"
                  >
                    <span className="mt-1.5 inline-block h-1 w-1 shrink-0 rotate-45 bg-gold" />
                    {perk}
                  </li>
                ))}
              </ul>
              <Link
                href="#apply"
                className="mt-8 block border border-white/20 py-3 text-center text-[0.75rem] tracking-[0.12em] text-neutral-200 uppercase transition-colors hover:border-gold hover:text-gold"
              >
                Apply
              </Link>
            </div>
          ))}
        </div>
      </Section>

      {/* 7 — Specifications */}
      <section id="specs" className="scroll-mt-32 border-t border-white/[0.07] py-28">
        <div className="mx-auto max-w-[1440px] px-[4vw]">
          <div className="grid gap-16 lg:grid-cols-[1fr_1.3fr]">
            <SectionHeading
              title="Product specifications."
              body="Grade labels are marketing — ask two suppliers what 12A means and you get two answers. What is verifiable is the construction. Here is ours, published."
            />
            <dl className="grid gap-x-10 gap-y-0 sm:grid-cols-2">
              {SPECS.map((row) => (
                <div key={row.label} className="border-t border-white/[0.07] py-5">
                  <dt className="eyebrow">{row.label}</dt>
                  <dd className="mt-2 text-[0.9375rem] leading-relaxed text-neutral-200">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* 8 — Buyer survey */}
      <section
        id="survey"
        className="scroll-mt-32 surface-velvet border-y border-white/[0.07] py-28"
      >
        <div className="mx-auto max-w-3xl px-[4vw]">
          <div className="text-center">
            <p className="eyebrow mb-5 text-gold">Wholesale buyer survey</p>
            <h2 className="text-[clamp(2rem,4.5vw,3.25rem)] text-paper">
              Two minutes to matched pricing.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-[1.0625rem] leading-relaxed text-neutral-400">
              Not ready for the full application? Answer a few questions and a partner manager will
              come back with pricing matched to your channels and volume. No account, no commitment.
            </p>
          </div>
          <div className="mt-14 border border-white/[0.07] bg-plum-900/40 p-8 md:p-10">
            <WholesaleBuyerSurvey />
          </div>
        </div>
      </section>

      {/* 9 — Why partners choose Beyond Lace */}
      <Section
        className="py-28"
        eyebrowLeft="The case"
        eyebrowCenter="Why partners choose Beyond Lace"
        eyebrowRight="Day one onward"
      >
        <div id="why" className="scroll-mt-32">
          <SectionHeading
            title="Judged on the unglamorous parts."
            body="A programme lives or dies on how fast a quote comes back, who picks up when something goes wrong, and whether stock is where your customers are."
          />
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_CHOOSE.map((o) => (
              <div
                key={o.t}
                className="border-t border-gold/20 pt-6 transition-colors duration-300 hover:border-gold"
              >
                <h3 className="text-lg text-paper">{o.t}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-neutral-400">{o.b}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 border border-gold/25 p-7">
            <p className="eyebrow mb-3 text-gold">One thing we do not offer</p>
            <p className="max-w-3xl text-[0.9375rem] leading-relaxed text-neutral-400">
              Marketplace dropshipping. We will fulfil directly to your customers under your
              branding, but not onto venues where listings race each other to the bottom. That
              restraint is what makes the MAP floor enforceable — and the margin you hold is worth
              more than the channel you lose.
            </p>
          </div>
        </div>
      </Section>

      {/* 10 — Live product showcase */}
      <section className="border-t border-white/[0.07] bg-plum-900 py-28">
        <div className="mx-auto max-w-[1440px] px-[4vw]">
          <SectionHeading
            eyebrow="Live product showcase"
            title="How the units move in daylight."
            body="Texture, density and cap construction across the range. Every reel is placeholder footage pending the shoot — the specs beneath each are real."
          />
          <div className="mt-14">
            <WholesaleShowcase items={SHOWCASE} />
          </div>
        </div>
      </section>
    </>
  );
}

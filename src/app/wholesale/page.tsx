import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ProductImage } from "@/components/ui/ProductImage";
import { WholesaleApplyForm } from "@/components/forms/WholesaleApplyForm";
import { commerce } from "@/lib/commerce";
import { WHOLESALE_MOQ } from "@/lib/channel";
import type { QuotePrefill } from "@/components/forms/WholesaleApplyForm";

export const metadata: Metadata = {
  title: "Wholesale & Private Label — Beyond Lace Pro",
  description:
    "Tiered salon wholesale and private label human hair wigs. 50-unit MOQ, custom packaging, batch consistency guarantee, and contractually enforced MAP protection.",
};

const TIERS = [
  {
    name: "Bronze",
    units: "50–149 units / year",
    margin: "Standard partner pricing",
    perks: [
      "Full collection access",
      "Turnkey asset kit — photography, spec sheets",
      "MAP protection",
      "Net 15 terms after first order",
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
      "Priority capsule allocation",
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
      "Reserved manufacturing capacity",
      "Territory consideration",
      "Net 45 terms",
    ],
  },
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
  const prefill = await resolvePrefill(await searchParams);

  return (
    <>
      <section className="surface-velvet border-b border-white/[0.07] pt-20 pb-24">
        <div className="mx-auto max-w-[1440px] px-[4vw]">
          <div className="flex items-center justify-between border-t border-white/[0.07] pt-4">
            <span className="eyebrow">Wholesale</span>
            <span className="eyebrow hidden md:block">Salon & Private Label</span>
            <span className="eyebrow">MOQ 50</span>
          </div>
          <div className="mt-20 max-w-4xl">
            <p className="eyebrow mb-8 text-gold">For salons, stylists & resellers</p>
            <h1 className="text-[clamp(2.5rem,7vw,6rem)] leading-[0.95] text-paper">
              Your name on our
              <span className="block italic">manufacturing floor.</span>
            </h1>
            <p className="mt-9 max-w-2xl text-lg leading-relaxed text-neutral-400">
              Fifty units is the whole minimum. You get the cap construction, the batch guarantee,
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
                href="#samples"
                className="border-b border-white/25 pb-1 text-[0.8125rem] tracking-[0.1em] text-neutral-200 uppercase transition-colors hover:border-gold hover:text-gold"
              >
                Request samples first
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tiers */}
      <Section
        className="py-28"
        eyebrowLeft="The programme"
        eyebrowCenter="Three tiers"
        eyebrowRight="Volume-based"
      >
        <SectionHeading
          eyebrow="Salon wholesale"
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

      {/* MAP */}
      <section id="map" className="scroll-mt-32 bg-plum-900 py-24">
        <div className="mx-auto grid max-w-[1440px] gap-14 px-[4vw] lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow mb-5 text-gold">Margin protection</p>
            <h2 className="text-[clamp(2rem,4.5vw,3.25rem)] text-paper">
              MAP is enforced, not suggested.
            </h2>
            <p className="mt-6 text-[1.0625rem] leading-relaxed text-blush-200/70">
              Every partner signs a minimum advertised price agreement, and we act on breaches. That
              sounds restrictive until you have watched a competitor discount your inventory out
              from under you on a marketplace you do not control.
            </p>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-blush-200/70">
              It also binds us. We do not list the full wholesale catalogue at retail, and our
              direct pricing never undercuts yours. A programme where the manufacturer competes with
              its own partners is not a programme.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {[
              { h: "50", p: "Unit minimum order quantity" },
              { h: "20%", p: "Capacity held for rapid trend runs" },
              { h: "100%", p: "Batch consistency guarantee" },
              { h: "0", p: "Partners we allow to undercut you" },
            ].map((stat) => (
              <div key={stat.h} className="border border-white/10 p-6">
                <p className="font-[family-name:var(--font-display)] text-4xl text-gold tabular-nums">
                  {stat.h}
                </p>
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-blush-200/60">{stat.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Operations */}
      <Section
        className="py-28"
        eyebrowLeft="Operations"
        eyebrowCenter="How a partnership runs"
        eyebrowRight="Day one onward"
      >
        <div id="operations" className="scroll-mt-32">
          <SectionHeading
            title="What partnership actually looks like."
            body="The programme is judged on the unglamorous parts: how fast a quote comes back, who picks up when something goes wrong, and whether stock is where your customers are."
          />
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                t: "Factory-direct, no middleman",
                b: "You buy from the floor that builds the unit. There is no trading company between us adding a margin and a week to every question.",
              },
              {
                t: "Warehouses in two hemispheres",
                b: "Stock held in both the US and China. Domestic US orders move in three to five days rather than waiting on an inbound container.",
              },
              {
                t: "Global dispatch",
                b: "DHL, FedEx and EMS to more than 180 countries, fully tracked. Express lanes run three to seven days door to door.",
              },
              {
                t: "One named account manager",
                b: "The same person for orders, logistics and custom requests. Not a shared inbox, not a ticket number, not a new introduction every month.",
              },
              {
                t: "Quotes inside one business day",
                b: "Applying costs nothing and commits you to nothing. Verified partners receive personalised pricing within twenty-four hours.",
              },
              {
                t: "Customisation as standard",
                b: "Private label packaging, custom lengths, densities and cap constructions — available from your first order, not held back for volume.",
              },
            ].map((o) => (
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
              branding, but not onto Amazon, Etsy or any venue where listings race each other to the
              bottom. That restraint is what makes the MAP floor enforceable — and the margin you
              hold is worth more than the channel you lose.
            </p>
          </div>
        </div>
      </Section>

      {/* Sourcing */}
      <Section
        className="py-28"
        eyebrowLeft="Transparency"
        eyebrowCenter="Sourcing & construction"
        eyebrowRight="Published"
      >
        <div id="sourcing" className="scroll-mt-32 grid gap-16 lg:grid-cols-[1fr_1.2fr]">
          <SectionHeading
            title="We publish the process, not the grade."
            body="Grade labels are marketing. Ask any two suppliers what 12A means and you will get two answers. What is verifiable is where the hair came from, how the cap was built, and whether this batch matches the last."
          />
          <dl className="divide-y divide-white/[0.07] border-t border-white/[0.07]">
            {[
              {
                t: "Virgin Remy, cuticle intact",
                d: "Single-donor where specified. Cuticles aligned in one direction — the reason our units do not matte at the nape after eight weeks.",
              },
              {
                t: "Batch consistency guarantee",
                d: "Texture, tone, and density measured against the reference batch. A reorder in eighteen months matches the unit in your hand today.",
              },
              {
                t: "Swiss HD lace cap",
                d: "Hand-tied through the parting on full lace units. Knots bleached individually rather than dipped — slower, and the only method that survives close daylight.",
              },
              {
                t: "Trend reserve",
                d: "A fifth of monthly capacity held idle. A silhouette that moves Tuesday has a cut sample by Friday, while full-capacity factories wait on a container.",
              },
            ].map((row) => (
              <div key={row.t} className="py-6">
                <dt className="text-[1.0625rem] text-paper">{row.t}</dt>
                <dd className="mt-2 text-[0.9375rem] leading-relaxed text-neutral-400">{row.d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      {/* Private label */}
      <section id="private-label" className="scroll-mt-32 border-t border-white/[0.07] py-28">
        <div className="mx-auto grid max-w-[1440px] gap-16 px-[4vw] lg:grid-cols-2 lg:items-center">
          <div className="grid grid-cols-2 gap-5">
            <ProductImage src="plum" alt="Private label packaging mockup in Velvet Plum" />
            <ProductImage
              src="gold"
              alt="Branded comb and hang tag customisation"
              className="mt-12"
            />
          </div>
          <div>
            <p className="eyebrow mb-5 text-gold">Beyond Lace Pro</p>
            <h2 className="text-[clamp(2rem,4.5vw,3.25rem)] text-paper">
              Sell it as yours. Because it is.
            </h2>
            <p className="mt-6 text-[1.0625rem] leading-relaxed text-neutral-400">
              Private label puts your branding on our construction: your box, your comb, your hang
              tag, your insert card. We do not appear anywhere on it, and we do not sell to your
              customers behind you.
            </p>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-neutral-400">
              Every order ships with a launch kit — lifestyle photography, spec sheets, and copy
              written to your positioning. Most partners are selling within a week of delivery
              rather than waiting on a shoot they have to fund themselves.
            </p>
            <Link
              href="/product/beyond-lace-pro-salon-program"
              className="mt-8 inline-block border-b border-gold pb-1 text-[0.8125rem] tracking-[0.1em] text-gold uppercase"
            >
              Beyond Lace Pro details
            </Link>
          </div>
        </div>
      </section>

      {/* Apply */}
      <section
        id="apply"
        className="scroll-mt-32 surface-velvet border-t border-white/[0.07] py-28"
      >
        <div className="mx-auto max-w-3xl px-[4vw]">
          <div className="text-center">
            <p className="eyebrow mb-5 text-gold">Applications</p>
            <h2 className="text-[clamp(2rem,4.5vw,3.25rem)] text-paper">
              We verify every partner.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-[1.0625rem] leading-relaxed text-neutral-400">
              Pricing is released after your salon or store is verified — that verification is what
              makes MAP enforceable and protects the partners already in the programme. Most
              applications are reviewed within two business days.
            </p>
          </div>
          <div className="mt-14">
            <WholesaleApplyForm prefill={prefill} />
          </div>
          <div id="samples" className="rule-gilded my-14 scroll-mt-32" />
          <p className="text-center text-[0.9375rem] leading-relaxed text-neutral-400">
            Not ready to apply? Request a sample unit through the same form — note it in the message
            field. Partners who sample convert at roughly three times the rate of those who do not,
            so we would rather you did. Direct line:{" "}
            <a
              href="mailto:partners@beyondlace.com"
              className="text-gold underline-offset-4 hover:underline"
            >
              partners@beyondlace.com
            </a>
          </p>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import {
  MessageCircle,
  Phone,
  Mail,
  UserRound,
  ArrowRight,
  Award,
  Ruler,
  Waves,
  Layers,
  Scissors,
  Palette,
  Package,
  Microscope,
  BadgeCheck,
  Factory,
  Rocket,
  Warehouse,
  Globe,
  Gem,
} from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { WholesaleApplyForm } from "@/components/forms/WholesaleApplyForm";
import { WholesaleBuyerSurvey } from "@/components/forms/WholesaleBuyerSurvey";
import { WholesaleCategoryRow } from "@/components/wholesale/WholesaleCategoryRow";
import { CustomizedSection } from "@/components/wholesale/CustomizedSection";
import { CustomerFeedback } from "@/components/wholesale/CustomerFeedback";
import { WholesaleRewards } from "@/components/wholesale/WholesaleRewards";
import { WholesaleShowcase } from "@/components/wholesale/WholesaleShowcase";
import {
  ProductCategoriesShowcase,
  type CategoryCard,
} from "@/components/wholesale/ProductCategoriesShowcase";
import { commerce, type Product } from "@/lib/commerce";
import { WHOLESALE_MOQ } from "@/lib/channel";
import { URLS, EMAILS, PHONE_DISPLAY, RESPONSE_TIMES } from "@/lib/contact";
import type { QuotePrefill } from "@/components/forms/WholesaleApplyForm";

export const metadata: Metadata = {
  title: "Wholesale & Private Label — Beyond Lace Pro",
  description:
    "Build a human hair wig business on our floor. 5-unit first-trial minimum, factory-direct pricing, custom packaging, batch consistency guarantee, and contractually enforced MAP protection.",
};

const TIERS = [
  {
    name: "Bronze",
    units: "5–50 units",
    margin: "First-trial entry pricing",
    perks: [
      "Full collection access",
      "As few as 5 units to start",
      "Turnkey asset kit",
      "MAP protection",
    ],
  },
  {
    name: "Silver",
    units: "50–200 units",
    margin: "Standing salon pricing",
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
    units: "200–500 units",
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

interface SpecGroup {
  icon: typeof Award;
  eyebrow: string;
  title: string;
  chips: string[];
  /** Chips rendered in gold to signal the standing default. */
  active?: string[];
  note?: string;
}

const SPEC_GROUPS: SpecGroup[] = [
  {
    icon: Award,
    eyebrow: "Hair quality grade",
    title: "Quality tiers",
    chips: ["12A Virgin", "10A Remy", "100% Human"],
    active: ["12A Virgin"],
    note: "12A is our highest grade — unprocessed virgin hair, cuticle intact, zero-shed guarantee.",
  },
  {
    icon: Ruler,
    eyebrow: "Length range",
    title: "Available lengths",
    chips: [
      '8"',
      '10"',
      '12"',
      '14"',
      '16"',
      '18"',
      '20"',
      '22"',
      '24"',
      '26"',
      '28"',
      '30"',
      '32"',
      '36"',
      '40"',
    ],
  },
  {
    icon: Waves,
    eyebrow: "Hair textures",
    title: "All texture variants",
    chips: [
      "Bone Straight",
      "Yaki Straight",
      "Body Wave",
      "Loose Wave",
      "Deep Wave",
      "Loose Deep",
      "Water Wave",
      "Jerry Curl",
      "Kinky Curly",
      "Afro Kinky",
      "Natural Wave",
      "Spanish Wave",
    ],
  },
  {
    icon: Layers,
    eyebrow: "Density options",
    title: "Fullness levels",
    chips: [
      "100% Light",
      "130% Natural",
      "150% Medium",
      "180% Full",
      "200% Extra Full",
      "250% Super Dense",
    ],
    active: ["150% Medium"],
    note: "150% is most popular — natural volume. 180%–250% preferred for dramatic fullness.",
  },
  {
    icon: Scissors,
    eyebrow: "Lace types",
    title: "Lace & cap construction",
    chips: [
      "HD Swiss Lace",
      "Transparent Lace",
      "Brown Lace",
      "13×4 Frontal",
      "13×6 Frontal",
      "4×4 Closure",
      "5×5 Closure",
      "6×6 Closure",
      "Full Lace Cap",
      "360 Lace",
    ],
  },
  {
    icon: Palette,
    eyebrow: "Colour options",
    title: "Available colour range",
    chips: [
      "Natural Black #1B",
      "Jet Black #1",
      "Dark Brown #2",
      "Honey Blonde #27",
      "Platinum #613",
      "Burgundy #99J",
      "Ombré 1B/30",
      "Highlight",
      "Copper Brown",
      "Custom Colour",
    ],
  },
  {
    icon: Package,
    eyebrow: "Weight per unit",
    title: "Bundle & wig weights",
    chips: ["Bundles 100g", "Bundles 120g", "Wigs 200–400g", "Closures 50–80g", "Frontals 80–120g"],
  },
  {
    icon: Microscope,
    eyebrow: "Fibre material",
    title: "Material classifications",
    chips: ["Virgin Human Hair", "Remy Human Hair", "Kanekalon", "Toyokalon", "High-Temp Fibre"],
    active: ["Virgin Human Hair", "Remy Human Hair"],
    note: "Wigs and bundles in our premium range are 100% human hair — heat-styleable and dyeable. Braiding and crochet lines are premium synthetic fibre where specified.",
  },
  {
    icon: BadgeCheck,
    eyebrow: "Quality assurance",
    title: "Our QC standards",
    chips: [
      "Cuticle-Aligned",
      "Tangle-Free",
      "Shedding-Free",
      "Chemical-Free Option",
      "Hand-Knotted",
      "Batch Tested",
    ],
    note: "Every batch undergoes tangle resistance, cuticle inspection, and shedding evaluation before dispatch.",
  },
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

/** Hero benefit tiles — the eight-card grid on the right of the hero. */
const HERO_BENEFITS = [
  {
    icon: Factory,
    title: "Factory-Direct Prices",
    body: "Skip every middleman. Buy direct from Xuchang manufacturing at source pricing.",
  },
  {
    icon: Rocket,
    title: "Dropshipping Ready",
    body: "We ship to your customers under your brand. No warehouse needed to start.",
  },
  {
    icon: Palette,
    title: "Full Customization",
    body: "Private label, custom packaging, custom lengths, densities and lace types.",
  },
  {
    icon: Warehouse,
    title: "USA & China Warehouses",
    body: "Stock in both hemispheres for 3–5 day US delivery and fast global dispatch.",
  },
  {
    icon: UserRound,
    title: "1-on-1 Consultation",
    body: "Dedicated wholesale agent for every partner. Personalised guidance from day one.",
  },
  {
    icon: Package,
    title: "Low MOQ to Start",
    body: `Begin with as few as ${WHOLESALE_MOQ} units. Scale on your terms with no pressure.`,
  },
  {
    icon: Globe,
    title: "Global Fast Delivery",
    body: "DHL, FedEx & EMS to 180+ countries. Express 3–7 days with full tracking.",
  },
  {
    icon: Gem,
    title: "Multi-Grade Stock",
    body: "12A, 10A, Virgin and Remy human hair for every market segment.",
  },
];

/** Hero credibility bar — the seven figures beneath the fold. */
const HERO_STATS = [
  { h: "10K+", p: "Active Partners" },
  { h: "180+", p: "Countries Served" },
  { h: "500+", p: "SKUs in Catalog" },
  { h: "12A", p: "Top Grade" },
  { h: "3–7", p: "Days Express" },
  { h: "$0", p: "Application Fee" },
  { h: "24h", p: "Quote Turnaround" },
];

/** Maps an order quantity to the application's volume-tier options. */
function volumeTierFor(qty: number): QuotePrefill["volume"] {
  if (qty >= 200) return "200-500";
  if (qty >= 50) return "50-200";
  return "5-50";
}

/**
 * Groups the wholesale-channel products into category rows for the tile grids —
 * one row per collection with enough SKUs to fill a shelf. Rows appear/populate
 * automatically as wholesale datasets are imported, so no hand-kept category list.
 */
function buildWholesaleRows(products: Product[]) {
  const wholesale = products.filter((p) => p.wholesale && p.slug !== "beyond-lace-pro-salon-program");
  const byCollection = new Map<string, Product[]>();
  for (const p of wholesale) {
    const key = (p.collections ?? [])[0] ?? "Signature Wigs";
    if (!byCollection.has(key)) byCollection.set(key, []);
    byCollection.get(key)!.push(p);
  }
  return [...byCollection.entries()]
    .filter(([, ps]) => ps.length >= 3)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 6)
    .map(([name, ps]) => ({ name, products: ps }));
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
    commerce.getProducts({ sort: "launch-rank" }),
  ]);
  const wholesaleRows = buildWholesaleRows(products);

  // Real catalogue photography for the Custom Styles grid.
  const styleImages = products
    .filter((p) => /^https?:/.test(p.images?.[0]?.src ?? ""))
    .slice(0, 7)
    .map((p) => ({ src: p.images[0].src, alt: p.title }));

  // Bento showcase cards — a real hero image pulled from each headline
  // collection, linking into the shop filtered to it. Order is the bento order.
  const CATEGORY_CARDS: { name: string; label: string; key: string }[] = [
    { name: "Coloured & Fashion Wigs", label: "Colourful Human Hair Wigs", key: "colour" },
    { name: "Glueless Wigs", label: "Natural Colour Glueless Wigs", key: "construction" },
    { name: "Extensions & Bundles", label: "Human Hair Bundles", key: "range" },
    { name: "Lace Front Wigs", label: "HD Lace Frontals & Closures", key: "construction" },
    { name: "Curly Wigs", label: "Curly & Textured Wigs", key: "texture" },
    { name: "Long Wigs", label: "Long Hair Extensions", key: "cut" },
  ];
  const heroImage = (name: string) => {
    const hit = products.find(
      (p) => (p.collections ?? []).includes(name) && /^https?:/.test(p.images?.[0]?.src ?? ""),
    );
    return hit ? { image: hit.images[0].src, alt: hit.images[0].alt } : { image: undefined, alt: name };
  };
  const categoryCards: CategoryCard[] = CATEGORY_CARDS.map((c) => ({
    label: c.label,
    href: `/shop?${c.key}=${encodeURIComponent(c.name)}`,
    ...heroImage(c.name),
  }));

  return (
    <>
      {/* 1 — Hero */}
      <section className="relative overflow-hidden border-b border-plum-900/10 bg-gradient-to-br from-[#f3ecfa] via-[#efe6f7] to-[#f7f0f9] py-20 text-plum-900">
        {/* Faint grid + glow, echoing the reference's lavender field. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.5] [background-image:linear-gradient(rgba(90,45,103,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(90,45,103,0.05)_1px,transparent_1px)] [background-size:54px_54px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 right-0 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(137,88,152,0.18),transparent_70%)]"
        />
        <div className="relative mx-auto max-w-[1440px] px-[4vw]">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Left — pitch + CTAs */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-plum-700/25 bg-white/60 px-4 py-1.5 text-[0.6875rem] font-medium tracking-[0.14em] text-plum-700 uppercase">
                <span aria-hidden className="wa-pop h-1.5 w-1.5 rounded-full bg-plum-600" />
                Wholesale Program — Now Open
              </span>
              <h1 className="mt-8 font-[family-name:var(--font-display)] text-[clamp(2.75rem,6.5vw,5.25rem)] leading-[0.95] text-plum-900">
                Build Your
                <br />
                Hair Empire
                <br />
                <span className="italic text-plum-600">With Beyond Lace.</span>
              </h1>
              <p className="mt-8 max-w-md text-[1rem] leading-relaxed text-plum-900/65">
                Source directly from Xuchang — China&rsquo;s hair manufacturing capital. Factory
                prices, global logistics, 1-on-1 support, and everything you need to launch or scale
                your own wig, hair and accessories business.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href="#apply"
                  className="group inline-flex items-center gap-2 rounded-md bg-plum-900 px-8 py-4 text-[0.8125rem] font-medium tracking-[0.14em] text-blush-200 uppercase shadow-[0_10px_30px_-12px_rgba(50,21,40,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-plum-800 active:translate-y-0 active:scale-[0.98]"
                >
                  Start Wholesale Inquiry
                  <ArrowRight
                    size={15}
                    strokeWidth={1.75}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
                <Link
                  href="#catalog"
                  className="inline-flex items-center rounded-md border border-plum-900/25 px-8 py-4 text-[0.8125rem] font-medium tracking-[0.14em] text-plum-900 uppercase transition-all duration-300 hover:-translate-y-0.5 hover:border-plum-700 hover:bg-plum-900/[0.04]"
                >
                  View Full Catalog
                </Link>
              </div>
            </div>

            {/* Right — benefit tiles */}
            <div className="rounded-2xl border border-plum-900/10 bg-white/70 p-2 shadow-[0_40px_80px_-40px_rgba(90,45,103,0.4)] backdrop-blur-sm">
              <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl bg-plum-900/[0.08] sm:grid-cols-2">
                {HERO_BENEFITS.map((b) => {
                  const Icon = b.icon;
                  return (
                    <div
                      key={b.title}
                      className="group bg-white/85 p-5 transition-colors duration-300 hover:bg-white"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-plum-700/[0.08] text-plum-700 transition-all duration-300 group-hover:bg-plum-700 group-hover:text-white">
                        <Icon size={18} strokeWidth={1.6} aria-hidden />
                      </span>
                      <h3 className="mt-3.5 text-[0.9375rem] font-semibold text-plum-900">
                        {b.title}
                      </h3>
                      <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-plum-900/60">
                        {b.body}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Credibility bar */}
          <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-plum-900/10 bg-plum-900/10 sm:grid-cols-4 lg:grid-cols-7">
            {HERO_STATS.map((s) => (
              <div key={s.p} className="bg-[#f7f0f9] px-5 py-6">
                <p className="font-[family-name:var(--font-display)] text-[1.75rem] text-plum-600 italic tabular-nums">
                  {s.h}
                </p>
                <p className="mt-1 text-[0.625rem] tracking-[0.12em] text-plum-900/50 uppercase">
                  {s.p}
                </p>
              </div>
            ))}
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
              <p
                id="samples"
                className="mt-8 scroll-mt-32 text-[0.9375rem] leading-relaxed text-neutral-400"
              >
                Not ready for a full tier? Place a first-trial sample order — as few as five units,
                or the curated{" "}
                <Link
                  href="/wholesale/product/the-first-order-reseller-pack"
                  className="text-gold underline-offset-4 hover:underline"
                >
                  First Order pack
                </Link>
                . Partners who sample convert at roughly three times the rate, so we would rather
                you did. Direct line:{" "}
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

      {/* Product categories — bento showcase of headline collections */}
      <ProductCategoriesShowcase cards={categoryCards} />

      {/* 5 — Wholesale category rows: banner + quick-view/buy tile grid per category */}
      <section id="catalog" className="scroll-mt-32 bg-plum-900 pt-28 pb-24">
        <div className="mx-auto max-w-[1440px] px-[4vw]">
          <SectionHeading
            eyebrow="Our wholesale catalogue"
            title="Every category to build a complete hair business."
            body="Wigs, extensions and bundles, curated and trade-priced from five units per SKU — and shoppable in place: quick-view any unit and buy it now without a detour to the full catalogue."
          />
        </div>

        {wholesaleRows.map((row, i) => (
          <WholesaleCategoryRow
            key={row.name}
            title={row.name}
            href="/wholesale/catalog"
            products={row.products}
            flip={i % 2 === 1}
          />
        ))}

        {/* Private-label capability — custom styles + colour ring */}
        <CustomizedSection styleImages={styleImages} />

        {/* Kept: the route to the complete wholesale catalogue grid */}
        <div className="mx-auto mt-14 max-w-[1440px] px-[4vw] text-center">
          <Link
            href="/wholesale/catalog"
            className="inline-flex items-center gap-2 border border-gold px-10 py-4 text-[0.8125rem] tracking-[0.14em] text-gold uppercase transition-all duration-500 hover:bg-gold hover:text-ink"
          >
            See the full wholesale catalogue
            <ArrowRight size={16} strokeWidth={2} />
          </Link>
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
          body="Most wholesale programmes start where a boutique salon finishes. Ours starts at five units, because the salons that build brands are rarely the ones already buying containers."
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

      {/* Social proof — customer feedback + chat gallery (placeholder content) */}
      <CustomerFeedback />

      {/* Marketing perk — volume rewards to drive repeat orders */}
      <WholesaleRewards />

      {/* 7 — Specifications */}
      <section id="specs" className="scroll-mt-32 border-t border-white/[0.07] py-28">
        <div className="mx-auto max-w-[1440px] px-[4vw]">
          <SectionHeading
            eyebrow="Product specifications"
            title="Everything you can spec, published."
            body="Grade labels are marketing — ask two suppliers what 12A means and you get two answers. What is verifiable is the construction. Every option we run, on one sheet."
          />
          <div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-white/[0.07] bg-white/[0.07] md:grid-cols-2 lg:grid-cols-3">
            {SPEC_GROUPS.map((group) => {
              const Icon = group.icon;
              const active = new Set(group.active ?? []);
              return (
                <div key={group.title} className="bg-plum-900 p-7">
                  <Icon size={22} strokeWidth={1.5} className="text-gold" aria-hidden="true" />
                  <p className="eyebrow mt-5">{group.eyebrow}</p>
                  <h3 className="mt-1 font-[family-name:var(--font-display)] text-xl text-paper">
                    {group.title}
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {group.chips.map((chip) => (
                      <span
                        key={chip}
                        className={`rounded border px-2.5 py-1 text-[0.75rem] tabular-nums transition-colors ${
                          active.has(chip)
                            ? "border-gold/60 bg-gold/[0.08] text-gold"
                            : "border-white/12 text-neutral-300"
                        }`}
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                  {group.note && (
                    <p className="mt-4 text-[0.8125rem] leading-relaxed text-neutral-400">
                      {group.note}
                    </p>
                  )}
                </div>
              );
            })}
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

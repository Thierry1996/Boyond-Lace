import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FaqAccordion, type FaqItem } from "@/components/faq/FaqAccordion";
import { EMAILS, URLS } from "@/lib/contact";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers about Beyond Lace luxury human-hair wigs — quality and HD lace, wholesale and custom orders, international shipping, hair care, colouring, and our 30-day returns policy.",
};

/* ---------------------------------------------------------------- Light UI */

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 text-[0.9375rem] leading-[1.8] text-plum-900/75 first:mt-0">{children}</p>
  );
}
function B({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-plum-900">{children}</strong>;
}
function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-5 rounded-r-lg border-l-[3px] border-plum-600 bg-plum-700/[0.05] px-5 py-4">
      <p className="text-[0.875rem] leading-[1.7] text-plum-900/80">{children}</p>
    </div>
  );
}
function List({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="mt-4 space-y-3">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3 text-[0.9375rem] leading-[1.7] text-plum-900/75">
          <span aria-hidden className="mt-2.5 h-px w-3.5 shrink-0 bg-plum-600/60" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------- Items */

const ITEMS: FaqItem[] = [
  {
    category: "Products & Quality",
    q: "Is your hair 100% human hair? How can I verify its quality?",
    a: (
      <>
        <P>
          Yes — every strand we sell is <B>100% genuine human hair</B>. We source exclusively from
          Xuchang, Henan Province, the globally recognised hub responsible for a significant portion
          of the world&rsquo;s human hair supply, giving us unmatched access to premium raw
          materials.
        </P>
        <Note>
          <B>Burn test:</B> Authentic human hair curls away from flame, burns slowly, and smells
          like burning protein — never synthetic plastic. We invite customers to perform this test
          on receipt of any order.
        </Note>
        <P>
          Our quality assurance includes cuticle alignment checks, tangle-resistance testing, and
          shedding evaluations on every batch before dispatch. We never blend synthetic or animal
          fibre into our products.
        </P>
      </>
    ),
  },
  {
    category: "Products & Quality",
    q: "What types of hair textures and lengths do you offer?",
    a: (
      <>
        <P>
          Our catalogue is designed to celebrate a range of textures and needs. We currently offer
          straight, body wave, deep wave, water wave, kinky curly, and kinky straight textures,
          hand-selected for lustre and longevity.
        </P>
        <List
          items={[
            <>
              <B>Lengths:</B> from 10&Prime; to 30&Prime;, in both wig and bundle form
            </>,
            <>
              <B>Constructions:</B> HD full lace, 13&times;6 and 13&times;4 frontals, closures, and
              glueless caps
            </>,
            <>
              <B>Densities:</B> 150% to 250%, so the finish suits everyday wear or full editorial
              volume
            </>,
          ]}
        />
        <P>
          If you have a specific texture, length, or shade in mind that you don&rsquo;t see listed,{" "}
          <Link href="/contact" className="text-plum-700 underline underline-offset-2">
            contact us
          </Link>{" "}
          — much of our stock moves quickly and we can advise on the next run.
        </P>
      </>
    ),
  },
  {
    category: "Products & Quality",
    q: "What makes your HD Lace Wigs different from standard lace wigs?",
    a: (
      <>
        <P>
          HD Lace (High-Definition Lace) is a thinner, finer-grade Swiss lace that{" "}
          <B>melts invisibly into virtually all skin tones</B>, creating an undetectable, scalp-like
          hairline that standard brown or transparent lace simply cannot match.
        </P>
        <Note>
          Our HD lace wigs require minimal to no bleaching of knots and significantly less
          foundation or concealer application — saving you time and protecting your hairline.
        </Note>
        <P>
          The result is a finish that looks genuinely grown from your scalp, which is why HD lace
          has become the industry standard for editorial and everyday wear alike. All our HD wigs
          are hand-tied by skilled artisans with decades of experience in Xuchang&rsquo;s hair
          manufacturing district.
        </P>
      </>
    ),
  },
  {
    category: "Ordering & Wholesale",
    q: "Do you offer wholesale pricing, and what are the minimum order quantities?",
    a: (
      <>
        <P>
          Yes — wholesale is at the heart of what we do. Beyond Lace was built to serve salon
          owners, distributors, boutiques, and resellers across the globe with competitive, tiered
          pricing structures.
        </P>
        <List
          items={[
            <>
              <B>Bundles &amp; Weave:</B> Minimum 5 bundles per order
            </>,
            <>
              <B>Wigs (HD Lace):</B> Minimum 3 units per order
            </>,
            <>
              <B>Closures &amp; Frontals:</B> Minimum 5 pieces per order
            </>,
            <>
              <B>Mixed orders</B> are permitted — contact us to discuss your combination
            </>,
          ]}
        />
        <P>
          For a personalised quote, complete our{" "}
          <Link href="/contact" className="text-plum-700 underline underline-offset-2">
            contact form
          </Link>{" "}
          or send us a WhatsApp message with your desired products, quantities, and destination
          country. We&rsquo;ll respond within 24 hours.
        </P>
      </>
    ),
  },
  {
    category: "Ordering & Wholesale",
    q: "Can I place a custom or bespoke hair order for a special occasion?",
    a: (
      <>
        <P>
          Absolutely. We specialise in custom hair solutions for{" "}
          <B>bridal, editorial, stage, and event styling</B>. Whether you need a specific texture
          blended, a unique cap construction, or a rare length, our team works directly with you and
          our manufacturing partners to bring your vision to life.
        </P>
        <P>
          Custom orders typically require a <B>lead time of 10–21 business days</B> depending on
          complexity and quantity. A 50% deposit is required at confirmation, with the balance due
          before dispatch.
        </P>
        <Note>
          Custom orders are available for both retail clients and wholesale buyers. Reach out via
          email or WhatsApp with as much detail as possible — reference photos are always helpful!
        </Note>
      </>
    ),
  },
  {
    category: "Shipping & Delivery",
    q: "How long does international shipping take, and which countries do you deliver to?",
    a: (
      <>
        <P>
          We deliver <B>globally</B> — from North America and Europe to Africa, the Middle East, and
          beyond. Our most popular delivery destinations include the United States, United Kingdom,
          Nigeria, Ghana, South Africa, Canada, and Australia.
        </P>
        <List
          items={[
            <>
              <B>Express (DHL / FedEx):</B> 3–7 business days worldwide
            </>,
            <>
              <B>Standard Air Freight:</B> 7–15 business days
            </>,
            <>
              <B>Economy:</B> 15–25 business days (available for some regions)
            </>,
          ]}
        />
        <P>
          All shipments include a tracking number sent to your email within 24 hours of dispatch.
          Please note that <B>customs duties and import taxes</B> are the responsibility of the
          recipient and vary by country — full detail is in our{" "}
          <Link href="/shipping-returns" className="text-plum-700 underline underline-offset-2">
            Shipping &amp; Returns Policy
          </Link>
          .
        </P>
      </>
    ),
  },
  {
    category: "Shipping & Delivery",
    q: "My order hasn’t arrived — what should I do?",
    a: (
      <>
        <P>We&rsquo;re sorry to hear your order is delayed! Here&rsquo;s what to do:</P>
        <List
          items={[
            <>
              First, <B>check your tracking link</B> — most delays are due to customs clearance,
              which can add 2–5 business days without visible movement
            </>,
            <>
              If your tracking shows no update for more than <B>7 business days</B>, contact us
              directly
            </>,
            <>
              Have your <B>order number and email address</B> ready when you reach out — it helps us
              resolve things faster
            </>,
          ]}
        />
        <P>
          We take delivery issues seriously. If your order is confirmed lost by the courier, we will{" "}
          <B>reship or issue a full refund</B> at no additional cost to you. Reach us via WhatsApp
          for the fastest response.
        </P>
      </>
    ),
  },
  {
    category: "Hair Care",
    q: "How do I care for my Beyond Lace products to maximise their lifespan?",
    a: (
      <>
        <P>
          With the right care, our 100% human hair can last <B>12 months or longer</B> with regular
          wear. Follow these professional guidelines:
        </P>
        <List
          items={[
            <>
              <B>Washing:</B> Use sulphate-free shampoo; wash every 1–2 weeks max. Always detangle
              before washing
            </>,
            <>
              <B>Conditioning:</B> Deep condition monthly. Leave-in conditioner after every wash
              keeps strands hydrated
            </>,
            <>
              <B>Heat:</B> Always use a heat protectant before any hot tool use. Maximum 180°C
              (356°F)
            </>,
            <>
              <B>Sleeping:</B> Braid or twist hair and wrap in a silk or satin bonnet to prevent
              friction and tangling
            </>,
            <>
              <B>Storage:</B> Store in a hair bag or silk pillowcase in a cool, dry space away from
              direct sunlight
            </>,
          ]}
        />
        <Note>
          Treat our hair as you would your own — it responds the same way. The more moisture and
          care you invest, the longer and more beautifully it will perform.
        </Note>
      </>
    ),
  },
  {
    category: "Hair Care",
    q: "Can I colour, bleach, or chemically treat the hair?",
    a: (
      <>
        <P>
          Yes — because our hair is <B>100% human</B>, it responds to colour, bleach, perms, and
          relaxers much like natural hair. However, chemical processing will reduce longevity and is
          done at the client&rsquo;s discretion.
        </P>
        <List
          items={[
            <>
              We recommend using a <B>professional colourist</B>, especially for bleaching or
              drastic colour changes
            </>,
            <>
              <B>Bleaching knots</B> on HD lace wigs: use diluted bleach and process for a shorter
              time than you would with standard lace
            </>,
            <>
              Deep condition thoroughly <B>after any chemical treatment</B> to restore moisture
            </>,
            <>Note: chemically treated hair will not be eligible for returns</>,
          ]}
        />
        <P>
          We also offer a range of <B>pre-coloured units</B> in popular tones if you&rsquo;d prefer
          to avoid the process altogether. Ask us about our current colour stock.
        </P>
      </>
    ),
  },
  {
    category: "Returns & Support",
    q: "What is your return and refund policy if I’m not satisfied?",
    a: (
      <>
        <P>
          Your satisfaction matters. We offer a <B>30-day return window</B> from the confirmed date
          of delivery, provided the hair is unworn, unwashed, and in its original, uncut condition
          with all packaging intact.
        </P>
        <List
          items={[
            "Contact us within 30 days with your order number and clear photographs of the item",
            "Approved refunds are issued to your original payment method within 3 business days of inspection",
            "Chemically processed, cut, or worn hair is not eligible for return",
          ]}
        />
        <P>
          For the full breakdown, see our{" "}
          <Link href="/shipping-returns" className="text-plum-700 underline underline-offset-2">
            Shipping &amp; Returns Policy
          </Link>
          . Still unsure? Message us — we would rather resolve things fairly than leave you
          frustrated.
        </P>
      </>
    ),
  },
];

/* -------------------------------------------------------------------- Page */

export default function FaqPage() {
  return (
    <div className="bg-[#faf6f9] text-plum-900">
      {/* Hero */}
      <section className="relative overflow-hidden px-[4vw] pt-24 pb-12 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_0%,rgba(154,102,180,0.16),transparent)]"
        />
        <div className="relative mx-auto max-w-3xl">
          <h1 className="font-[family-name:var(--font-display)] text-[clamp(2.75rem,7vw,5rem)] leading-[0.98] text-plum-900">
            Your Questions,
            <br />
            <span className="italic text-plum-600">Beautifully Answered</span>
          </h1>
          <p className="mx-auto mt-6 max-w-md text-[1rem] leading-relaxed text-plum-900/65">
            Everything you need to know about our hair, our process, and how we serve you — all in
            one place.
          </p>
          <div className="mx-auto mt-8 mb-12 h-px w-24 bg-gradient-to-r from-transparent via-plum-600 to-transparent" />
        </div>
      </section>

      {/* Filter + accordion */}
      <div className="px-[4vw] pb-24">
        <FaqAccordion items={ITEMS} />
      </div>

      {/* Still have questions — CTA band */}
      <section className="bg-gradient-to-b from-plum-900 to-plum-800 py-20">
        <div className="mx-auto max-w-2xl px-[4vw] text-center">
          <p className="eyebrow text-gold">Still have questions?</p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(1.9rem,4vw,2.75rem)] text-paper">
            We&rsquo;d Love to <span className="italic text-blush-300">Hear from You</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[0.9375rem] leading-relaxed text-blush-200/70">
            Our team is available Monday–Saturday during business hours, and responds to all
            international inquiries within 24 hours.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href={`mailto:${EMAILS.care}`}
              className="cta-primary inline-flex items-center gap-2 px-8 py-4 text-[0.75rem] tracking-[0.14em] uppercase"
            >
              Email Us
              <ArrowRight size={14} strokeWidth={1.75} />
            </a>
            <a
              href={URLS.whatsappPrefilled}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-blush-200/40 px-8 py-4 text-[0.75rem] tracking-[0.14em] text-blush-200 uppercase transition-colors hover:border-gold hover:text-gold"
            >
              WhatsApp
              <ArrowRight size={14} strokeWidth={1.75} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";

/**
 * Legal & policy pages. Content is deliberately concise and legible — the
 * brand's voice extends to its fine print. Counsel review required before
 * launch; these are working drafts, structured for that review.
 */

interface LegalDoc {
  title: string;
  updated: string;
  sections: Array<{ h: string; p: string[] }>;
}

const DOCS: Record<string, LegalDoc> = {
  privacy: {
    title: "Privacy Policy",
    updated: "July 2026",
    sections: [
      {
        h: "What we collect",
        p: [
          "Order details (name, address, email, phone) to fulfil purchases. Quiz answers, only with your explicit consent, to recommend units and improve shade guidance. Payment details are handled entirely by our payment processors — card numbers never touch our servers.",
          "The virtual try-on runs on your device. Camera frames are processed locally in your browser and are never uploaded, stored, or used to train anything. This is an architectural commitment, not a preference setting.",
        ],
      },
      {
        h: "What we never do",
        p: [
          "We do not sell your data. We do not share purchase history with data brokers. We do not infer or store health information — including from purchases in our sensitive-scalp or restoration lines. A wig purchase is nobody's business but yours.",
        ],
      },
      {
        h: "Discretion by default",
        p: [
          "Unbranded packaging is available on every order. Order confirmations use neutral subject lines on request. Marketing email requires opt-in consent and unsubscribes in one click, effective immediately.",
        ],
      },
      {
        h: "Your rights",
        p: [
          "Access, correction, export, and deletion of your data on request — no fee, no friction, honoured within 30 days. Contact us through the support form or privacy@beyondlace.com.",
        ],
      },
    ],
  },
  terms: {
    title: "Terms of Service",
    updated: "July 2026",
    sections: [
      {
        h: "The agreement",
        p: [
          "Using beyondlace.com or purchasing from Beyond Lace constitutes agreement to these terms. We keep them short on purpose; if anything is unclear, ask before you buy.",
        ],
      },
      {
        h: "Products & accuracy",
        p: [
          "Every unit is handmade from natural human hair; minor variation between units is inherent to the material. What we guarantee is batch consistency — measured texture, tone, and density against a reference batch — and the construction specifications published on each product page.",
        ],
      },
      {
        h: "Pricing & orders",
        p: [
          "Prices are in USD unless a currency selector states otherwise. We reserve the right to cancel orders affected by obvious pricing errors, with a full refund and an honest explanation. Capsule drops are final-run: once an edition sells out, it is not repeated.",
        ],
      },
      {
        h: "Acceptable use",
        p: [
          "Do not scrape the catalogue, resell retail purchases as new commercial stock, or misrepresent affiliation with the brand. Wholesale resale requires a partner agreement — apply through the wholesale programme.",
        ],
      },
    ],
  },
  "wholesale-terms": {
    title: "Wholesale Partner Terms",
    updated: "July 2026",
    sections: [
      {
        h: "Partnership basis",
        p: [
          "Wholesale pricing is extended to verified businesses only. Verification protects every partner in the programme — it is what makes the pricing floor enforceable.",
        ],
      },
      {
        h: "Minimum advertised price (MAP)",
        p: [
          "Partners agree not to advertise Beyond Lace or Beyond Lace Pro product below the published MAP floor. First breach earns a written notice; second suspends wholesale pricing; third ends the partnership. We hold ourselves to the same floor: our direct retail pricing never undercuts partner MAP.",
        ],
      },
      {
        h: "Private label",
        p: [
          "White-label product is your brand and your customer relationship. We do not market to your customer list, and we do not disclose your sourcing relationship without your written consent.",
        ],
      },
      {
        h: "Territory & tiers",
        p: [
          "Bronze, Silver, and Gold tiers are set by trailing 12-month volume and reviewed quarterly. Gold partners may request territory consideration; exclusivity, where granted, is contractual and published to no one.",
        ],
      },
    ],
  },
  "shipping-policy": {
    title: "Shipping & Returns Policy",
    updated: "July 2026",
    sections: [
      {
        h: "Shipping",
        p: [
          "Complimentary worldwide shipping on orders over $400. Standard delivery 5–9 business days; express 2–4. Every unit ships insured with signature on delivery. Unbranded outer packaging is available at checkout on every order.",
        ],
      },
      {
        h: "Returns",
        p: [
          "Thirty days from delivery, lace uncut, original condition. Refunds issue to the original payment method within 5 business days of inspection. Lace Test kit purchases are automatically credited against unit purchases — the kit exists so returns don't have to.",
        ],
      },
      {
        h: "Exchanges",
        p: [
          "Shade exchanges within the same unit are free both directions on the first exchange. If our shade guidance got it wrong after you used a Lace Test kit, return shipping is on us, no questions.",
        ],
      },
    ],
  },
  cookies: {
    title: "Cookie Settings",
    updated: "July 2026",
    sections: [
      {
        h: "Our approach",
        p: [
          "Essential cookies only by default: cart contents, session continuity, and security. Analytics and marketing cookies are opt-in, and declining them changes nothing about how the site works.",
          "A consent manager with granular controls ships with the analytics phase. Until then, the site sets no analytics or advertising cookies at all — what you see here is the essential set, fully listed below.",
        ],
      },
      {
        h: "The essential set",
        p: [
          "bl.cart.v1 — your bag, stored in your browser only. bl.wishlist.v1 — saved units, stored in your browser only. bl.orders.v1 — demo order history, stored in your browser only. None of these transmit to our servers.",
        ],
      },
    ],
  },
  accessibility: {
    title: "Accessibility Statement",
    updated: "July 2026",
    sections: [
      {
        h: "Our commitment",
        p: [
          "Beyond Lace targets WCAG 2.2 AA across the storefront. This is not a compliance checkbox: a meaningful share of our customers come to us during or after medical treatment, and an inaccessible luxury site is a contradiction in terms.",
        ],
      },
      {
        h: "What that means in practice",
        p: [
          "Full keyboard navigation, visible focus states, screen-reader-tested forms and checkout, text contrast at or above 4.5:1 for body copy, reduced-motion support honoured everywhere, and no information conveyed by colour alone.",
        ],
      },
      {
        h: "Found a barrier?",
        p: [
          "Tell us through the support contact form or accessibility@beyondlace.com. Accessibility reports are triaged at the same priority as checkout defects.",
        ],
      },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(DOCS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = DOCS[slug];
  return doc ? { title: doc.title } : { title: "Not found" };
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = DOCS[slug];
  if (!doc) notFound();

  return (
    <div className="mx-auto max-w-[860px] px-[4vw] py-20">
      <div className="flex items-center justify-between border-t border-white/[0.07] pt-4">
        <span className="eyebrow">Legal</span>
        <span className="eyebrow">Updated {doc.updated}</span>
      </div>
      <h1 className="mt-12 text-[clamp(2.25rem,5vw,3.5rem)] text-paper">{doc.title}</h1>
      <div className="mt-12 space-y-12">
        {doc.sections.map((s) => (
          <section key={s.h}>
            <h2 className="text-xl text-paper">{s.h}</h2>
            {s.p.map((para, i) => (
              <p key={i} className="mt-4 text-[0.9375rem] leading-[1.8] text-neutral-400">
                {para}
              </p>
            ))}
          </section>
        ))}
      </div>
      <div className="rule-gilded mt-16" />
      <p className="mt-6 text-[0.75rem] text-neutral-400">
        Working draft, structured for counsel review before launch.
      </p>
    </div>
  );
}

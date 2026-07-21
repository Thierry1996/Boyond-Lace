import type { Metadata } from "next";
import Link from "next/link";
import { ResourceHero } from "@/components/ui/ResourceHero";
import { Section, SectionHeading } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Bulk Order Support — Salons, Stylists & Distributors",
  description:
    "A dedicated desk for high-volume Beyond Lace orders: committed response times, batch-matched allocations, staged delivery and account terms.",
};

const DESK = [
  {
    t: "Committed response times",
    b: "Bulk enquiries route to a named account contact, not a shared inbox. First response inside one business day, quotes inside two.",
  },
  {
    t: "Batch-matched allocation",
    b: "Order fifty units and they come from one production run — the same texture, tone and density across every piece. That is the whole point of the guarantee.",
  },
  {
    t: "Staged delivery",
    b: "Large orders can ship in scheduled tranches against a single price lock, so you are not warehousing a year of stock to hold a rate.",
  },
  {
    t: "Terms that scale",
    b: "Net 15 at Bronze, Net 30 at Silver, Net 45 at Gold — reviewed quarterly on trailing twelve-month volume.",
  },
];

export default function BulkOrdersPage() {
  return (
    <>
      <ResourceHero
        eyebrow="Orders & logistics"
        title="Bulk order support."
        italic="A desk, not a queue."
        body="Fifty units and up is a different conversation to a single purchase, so it gets different handling: a named contact, batch-matched stock, and terms that move as your volume does."
        image="ordersLogistics"
        cta={{ label: "Talk to the desk", href: "/support#contact" }}
      />

      <Section
        className="py-20"
        eyebrowLeft="The desk"
        eyebrowCenter="MOQ 50"
        eyebrowRight="Named contact"
      >
        <SectionHeading
          title="What high-volume gets you."
          body="Everything here is standard at fifty units. None of it requires negotiation, and none of it is withheld until you ask."
        />
        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {DESK.map((d) => (
            <div
              key={d.t}
              className="border border-white/[0.07] p-8 transition-colors duration-300 hover:border-gold/50"
            >
              <h3 className="text-xl text-paper">{d.t}</h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-neutral-400">{d.b}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            {
              t: "Wholesale programme",
              b: "Tiers, MAP protection and partner terms.",
              href: "/wholesale",
            },
            {
              t: "Pricing sheet",
              b: "Per-SKU pricing, released on verification.",
              href: "/support/wholesale-pricing",
            },
            {
              t: "Private label",
              b: "Your branding on our construction.",
              href: "/support/private-label-gallery",
            },
          ].map((c) => (
            <Link
              key={c.t}
              href={c.href}
              className="group block border border-gold/25 p-7 transition-colors duration-300 hover:border-gold"
            >
              <h3 className="text-lg text-paper transition-colors group-hover:text-gold">{c.t}</h3>
              <p className="mt-2 text-[0.875rem] leading-relaxed text-neutral-400">{c.b}</p>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}

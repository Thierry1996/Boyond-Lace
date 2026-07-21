import type { Metadata } from "next";
import Link from "next/link";
import { ResourceHero } from "@/components/ui/ResourceHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ProductImage } from "@/components/ui/ProductImage";

export const metadata: Metadata = {
  title: "Private Label Mockup Gallery — Beyond Lace Pro",
  description:
    "Packaging, hang tag, comb and insert mockups for Beyond Lace Pro private label partners. Your branding, our cap construction and batch guarantee.",
};

const MOCKUPS = [
  { src: "plum", label: "Shipping carton", note: "Matte soft-touch, your wordmark deboss" },
  { src: "gold", label: "Product box", note: "Gold foil, blush inner tissue" },
  { src: "velvet", label: "Hang tag & comb", note: "Your logo, our carbon comb" },
  { src: "blush", label: "Insert card", note: "Your copy, your care instructions" },
  { src: "aurora", label: "Tissue & seal", note: "Custom wrap, wax-effect seal" },
  { src: "mono", label: "Discreet variant", note: "Unbranded outer for private clients" },
];

export default function PrivateLabelGalleryPage() {
  return (
    <>
      <ResourceHero
        eyebrow="B2B resources"
        title="Private label gallery."
        italic="Your name on our floor."
        body="Beyond Lace Pro is the white-label line: our cap construction and batch consistency guarantee, your branding on every surface the customer touches. We appear nowhere on it."
        image="b2bResources"
        cta={{ label: "Beyond Lace Pro", href: "/product/beyond-lace-pro-salon-program" }}
      />

      <Section
        className="py-20"
        eyebrowLeft="Mockups"
        eyebrowCenter="Packaging system"
        eyebrowRight="MOQ 50"
      >
        <SectionHeading
          title="Every surface, brandable."
          body="Rendered here in the Beyond Lace palette. Partners receive editable templates in their own colours once an order is confirmed — photography and spec sheets included."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MOCKUPS.map((m) => (
            <figure key={m.label} className="group">
              <div className="overflow-hidden rounded-lg">
                <ProductImage
                  src={m.src}
                  alt={`${m.label} private label mockup`}
                  ratio="1 / 1"
                  className="transition-transform duration-[900ms] ease-[var(--ease-editorial)] group-hover:scale-[1.05]"
                />
              </div>
              <figcaption className="mt-4">
                <p className="text-[1.0625rem] text-paper">{m.label}</p>
                <p className="mt-1 text-[0.8125rem] text-neutral-400">{m.note}</p>
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="mt-10 max-w-2xl text-[0.8125rem] leading-relaxed text-neutral-400">
          Renders shown are brand-palette placeholders pending the production photo shoot. Approved
          partners receive the full print-ready template pack.
        </p>

        <div className="mt-10 flex flex-wrap gap-5">
          <Link
            href="/wholesale#private-label"
            className="border border-gold px-8 py-3.5 text-[0.8125rem] tracking-[0.14em] text-gold uppercase transition-all duration-500 hover:bg-gold hover:text-ink"
          >
            Private label programme
          </Link>
          <Link
            href="/wholesale#apply"
            className="border-b border-white/25 pb-1 text-[0.8125rem] tracking-[0.1em] text-neutral-200 uppercase transition-colors hover:border-gold hover:text-gold"
          >
            Apply as a partner
          </Link>
        </div>
      </Section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ResourceHero } from "@/components/ui/ResourceHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ContactForm } from "@/components/forms/ContactForm";
import { SocialRow } from "@/components/brand/SocialIcons";

export const metadata: Metadata = {
  title: "Contact Headquarters",
  description:
    "Reach Beyond Lace: customer support, wholesale partnerships, press and media, ambassador enquiries, and the manufacturing facility.",
};

const DESKS = [
  {
    t: "Customer support",
    b: "Orders, returns, fit and shade. Replies within one business day.",
    contact: "care@beyondlace.com",
  },
  {
    t: "Wholesale & private label",
    b: "Salon programme, Beyond Lace Pro, bulk allocation and terms.",
    contact: "partners@beyondlace.com",
  },
  {
    t: "Press & media",
    b: "Interviews, assets, and approved brand language.",
    contact: "press@beyondlace.com",
  },
  {
    t: "Ambassadors",
    b: "Three-tier creator and stylist partnerships.",
    contact: "ambassadors@beyondlace.com",
  },
];

export default function ContactHQPage() {
  return (
    <>
      <ResourceHero
        eyebrow="Company"
        title="Contact headquarters."
        italic="A person, not a ticket."
        body="Every message is read by someone who can act on it. Choose the desk that fits and you skip the triage entirely."
        image="company"
      />

      <Section
        className="py-20"
        eyebrowLeft="Desks"
        eyebrowCenter="Four routes"
        eyebrowRight="One business day"
      >
        <SectionHeading title="Where to send it." />
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {DESKS.map((d) => (
            <div
              key={d.t}
              className="border border-white/[0.07] p-7 transition-colors duration-300 hover:border-gold/50"
            >
              <h3 className="text-xl text-paper">{d.t}</h3>
              <p className="mt-2 text-[0.875rem] leading-relaxed text-neutral-400">{d.b}</p>
              <a
                href={`mailto:${d.contact}`}
                className="mt-4 inline-block text-[0.875rem] text-gold underline-offset-4 hover:underline"
              >
                {d.contact}
              </a>
            </div>
          ))}
        </div>
      </Section>

      <section className="border-t border-white/[0.07] bg-plum-900 py-20">
        <div className="mx-auto grid max-w-[1440px] gap-14 px-[4vw] lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="eyebrow mb-4 text-gold">Manufacturing</p>
            <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] text-paper">Xuchang, China.</h2>
            <p className="mt-5 text-[0.9375rem] leading-relaxed text-blush-200/70">
              The wig capital, and the floor where every Beyond Lace unit is hand-tied. Twenty
              percent of its capacity sits in reserve on purpose so a silhouette that moves on
              Tuesday has a cut sample by Friday.
            </p>
            <Link
              href="/brand#facility"
              className="mt-6 inline-block border-b border-gold pb-1 text-[0.8125rem] tracking-[0.1em] text-gold uppercase"
            >
              Behind the scenes
            </Link>

            <p className="eyebrow mt-12 mb-4 text-gold">Social</p>
            <SocialRow />
          </div>

          <ContactForm />
        </div>
      </section>
    </>
  );
}

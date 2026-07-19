import type { Metadata } from "next";
import Link from "next/link";
import { Package, RotateCcw, Truck, ShieldCheck, MessageCircle, Boxes } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ContactForm } from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Support — Orders, Returns, Shipping & Warranty",
  description:
    "Track your Beyond Lace order, returns and exchange policy, shipping information, human hair unit warranty, and contact options.",
};

export default function SupportPage() {
  return (
    <>
      <section className="surface-velvet border-b border-white/[0.07] pt-20 pb-16">
        <div className="mx-auto max-w-[1440px] px-[4vw]">
          <div className="flex items-center justify-between border-t border-white/[0.07] pt-4">
            <span className="eyebrow">Support</span>
            <span className="eyebrow hidden md:block">Post-purchase logistics</span>
            <span className="eyebrow">Humans reply</span>
          </div>
          <div className="mt-16 max-w-3xl">
            <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] text-paper">
              After the purchase
              <span className="block italic">is where we compete.</span>
            </h1>
            <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-neutral-400">
              This industry treats support as a cost centre. We treat it as the retention pillar —
              because a unit that ships late or returns badly undoes everything the manufacturing
              floor got right.
            </p>
          </div>
        </div>
      </section>

      {/* Track */}
      <Section className="py-20" eyebrowLeft="Orders" eyebrowCenter="Tracking" eyebrowRight="Live">
        <div id="track" className="scroll-mt-32 grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <Package size={28} strokeWidth={1.5} className="mb-5 text-gold" />
            <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] text-paper">Track my order.</h2>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-neutral-400">
              Every order emails a tracking link at dispatch. Live in-account tracking activates
              with customer accounts (Clerk sign-in, arriving with the auth phase) — until then,
              your dispatch email is the source of truth, and support can look anything up in
              minutes.
            </p>
          </div>
          <div className="border border-white/[0.07] p-8">
            <p className="eyebrow mb-3">Have your order number?</p>
            <p className="text-[0.9375rem] leading-relaxed text-neutral-400">
              It looks like <span className="text-paper">BL-XXXXXX</span> and sits at the top of
              your confirmation email. Send it through the contact form below with the topic
              &ldquo;An order&rdquo; and we reply with a full status, usually same-day.
            </p>
            <Link
              href="#contact"
              className="mt-5 inline-block border-b border-gold pb-1 text-[0.8125rem] tracking-[0.1em] text-gold uppercase"
            >
              Go to contact form
            </Link>
          </div>
        </div>
      </Section>

      {/* Policies grid */}
      <Section
        className="pb-20"
        eyebrowLeft="Policies"
        eyebrowCenter="The fine print, legible"
        eyebrowRight="Plain English"
      >
        <div className="grid gap-10 md:grid-cols-2">
          <div id="returns" className="scroll-mt-32 border-t border-white/[0.07] pt-6">
            <RotateCcw size={24} strokeWidth={1.5} className="mb-4 text-gold" />
            <h3 className="text-xl text-paper">Returns & exchanges</h3>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-neutral-400">
              Thirty days, lace uncut, original condition. Lace Test kit purchases credit
              automatically against your unit — and if you used the kit first, odds are you will
              never need this paragraph. Full text in the{" "}
              <Link
                href="/legal/shipping-policy"
                className="text-gold underline-offset-4 hover:underline"
              >
                shipping & returns policy
              </Link>
              .
            </p>
          </div>
          <div id="shipping" className="scroll-mt-32 border-t border-white/[0.07] pt-6">
            <Truck size={24} strokeWidth={1.5} className="mb-4 text-gold" />
            <h3 className="text-xl text-paper">Shipping</h3>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-neutral-400">
              Complimentary worldwide over $400. Standard 5–9 business days, express 2–4. Every unit
              ships insured and signature-on-delivery. Unbranded outer packaging is a checkout
              option on every order, always.
            </p>
          </div>
          <div id="warranty" className="scroll-mt-32 border-t border-white/[0.07] pt-6">
            <ShieldCheck size={24} strokeWidth={1.5} className="mb-4 text-gold" />
            <h3 className="text-xl text-paper">Warranty on human hair units</h3>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-neutral-400">
              Twelve months on construction — cap seams, knots, lace integrity. Hair itself is a
              natural material and behaves like one; what we warrant is that the build will not fail
              before the hair does. Batch-consistency claims are covered without time limit.
            </p>
          </div>
          <div id="bulk" className="scroll-mt-32 border-t border-white/[0.07] pt-6">
            <Boxes size={24} strokeWidth={1.5} className="mb-4 text-gold" />
            <h3 className="text-xl text-paper">Bulk order support</h3>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-neutral-400">
              Salon and distributor orders route to a dedicated desk with committed response times.{" "}
              <Link href="/wholesale" className="text-gold underline-offset-4 hover:underline">
                The wholesale programme
              </Link>{" "}
              covers terms; existing partners reach the desk through the portal.
            </p>
          </div>
        </div>
      </Section>

      {/* Live chat note */}
      <section id="chat" className="scroll-mt-32 bg-plum-900 py-16">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-6 px-[4vw] md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-5">
            <MessageCircle size={28} strokeWidth={1.5} className="mt-1 shrink-0 text-gold" />
            <div>
              <h3 className="text-xl text-paper">Live chat & the virtual stylist</h3>
              <p className="mt-2 max-w-xl text-[0.9375rem] leading-relaxed text-blush-200/70">
                The Claude-powered stylist — face shape, skin tone, and lace matching guidance in
                chat — activates with the AI integration phase. Until then, the contact form below
                reaches the same humans, just slower.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <Section
        className="py-24"
        eyebrowLeft="Contact"
        eyebrowCenter="One business day"
        eyebrowRight="No ticket purgatory"
      >
        <div id="contact" className="scroll-mt-32 grid gap-14 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <SectionHeading
              title="Talk to us."
              body="Every message is read by a person who can actually fix the thing. Wholesale enquiries route to the partner desk; press to the studio."
            />
            <div id="careers" className="mt-10 scroll-mt-32 border border-white/[0.07] p-6">
              <p className="eyebrow mb-2 text-gold">Careers</p>
              <p className="text-[0.875rem] leading-relaxed text-neutral-400">
                We hire slowly and deliberately.{" "}
                <Link href="/careers" className="text-gold underline-offset-4 hover:underline">
                  Open roles live here
                </Link>
                .
              </p>
            </div>
          </div>
          <ContactForm />
        </div>
      </Section>
    </>
  );
}

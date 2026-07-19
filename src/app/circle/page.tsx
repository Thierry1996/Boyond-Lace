import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ProductImage } from "@/components/ui/ProductImage";
import { CrownWave } from "@/components/brand/Logo";

export const metadata: Metadata = {
  title: "The Beyond Circle — Community, Loyalty & Events",
  description:
    "The Beyond Lace private community: transformation stories, loyalty rewards, member perks, virtual styling masterclasses, and the three-tier ambassador programme.",
};

const TIERS = [
  {
    name: "Tier 3 — Micro Creators",
    range: "10k–50k followers",
    body: "Affiliate partnership at 15–20% commission. Your honest lace-melt journey — struggle and reveal included — is worth more than any studio shoot we could fund.",
    cta: "Apply as an affiliate",
    href: "/lp/influencer-affiliates",
  },
  {
    name: "Tier 2 — Macro Creators",
    range: "100k+ followers",
    body: "Exclusive contract, early drop access, and long-form masterclass collaborations. Limited seats per region — exclusivity is the point.",
    cta: "Enquire for contract",
    href: "/support#contact",
  },
  {
    name: "Tier 1 — Celebrity Stylists",
    range: "By invitation & referral",
    body: "Equity and retainer partnerships with the stylists who decide what walks a red carpet. We court the hands before the faces.",
    cta: "Studio contact",
    href: "/support#contact",
  },
];

const STORIES = [
  {
    src: "aurora",
    quote: "Eleven years of buying hair. This is the first year nobody asked about it.",
    who: "Member · Atlanta",
  },
  {
    src: "blush",
    quote:
      "My consultant matched my shade from the $5 kit. The unit arrived correct. That has literally never happened.",
    who: "Member · London",
  },
  {
    src: "velvet",
    quote:
      "Post-chemo, I didn't want glamour. I wanted to look like me on a good day. The Restoration is exactly that.",
    who: "Member · Toronto",
  },
];

export default function CirclePage() {
  return (
    <>
      <section className="surface-velvet border-b border-white/[0.07] pt-20 pb-20">
        <div className="mx-auto max-w-[1440px] px-[4vw]">
          <div className="flex items-center justify-between border-t border-white/[0.07] pt-4">
            <span className="eyebrow">The Beyond Circle</span>
            <span className="eyebrow hidden md:block">Community</span>
            <span className="eyebrow">Members only</span>
          </div>
          <div className="mt-20 max-w-3xl">
            <CrownWave size={40} className="mb-8 text-gold" />
            <h1 className="text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] text-paper">
              The proof arrives
              <span className="block italic">before the parcel does.</span>
            </h1>
            <p className="mt-7 max-w-xl text-[1.0625rem] leading-relaxed text-neutral-400">
              A private community where members post transformations while their unit is still in
              transit. By the time your box lands, you have watched twenty women with your hair type
              wear it. Buyer&apos;s remorse does not survive that.
            </p>
            <a
              href="https://facebook.com/groups/beyondcircle"
              rel="noopener noreferrer"
              target="_blank"
              className="mt-10 inline-block border border-gold px-9 py-4 text-[0.8125rem] tracking-[0.14em] text-gold uppercase transition-all duration-500 hover:bg-gold hover:text-ink"
            >
              Request group access
            </a>
          </div>
        </div>
      </section>

      {/* Stories */}
      <Section
        className="py-24"
        eyebrowLeft="Transformation stories"
        eyebrowCenter="Real members"
        eyebrowRight="Moderated gallery"
      >
        <div id="stories" className="scroll-mt-32">
          <SectionHeading
            title="Told by the people wearing it."
            body="Every story here was posted by a member and published with consent. No stock, no scripts — the moderation queue exists to verify, not to polish."
          />
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {STORIES.map((s) => (
              <figure key={s.who} className="border-t border-white/[0.07] pt-6">
                <ProductImage src={s.src} alt="Member transformation portrait" ratio="4 / 5" />
                <blockquote className="mt-5 font-[family-name:var(--font-display)] text-lg leading-relaxed text-paper italic">
                  &ldquo;{s.quote}&rdquo;
                </blockquote>
                <figcaption className="eyebrow mt-3">{s.who}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </Section>

      {/* Loyalty */}
      <section id="loyalty" className="scroll-mt-32 bg-plum-900 py-24">
        <div className="mx-auto grid max-w-[1440px] gap-14 px-[4vw] lg:grid-cols-2">
          <div>
            <p className="eyebrow mb-5 text-gold">Loyalty programme</p>
            <h2 className="text-[clamp(2rem,4.5vw,3.25rem)] text-paper">
              Points that behave like money.
            </h2>
            <p className="mt-6 text-[1.0625rem] leading-relaxed text-blush-200/70">
              One point per dollar, no expiry games, no blackout products. Points redeem against
              units, care, and masterclass seats at a flat, published rate. The ledger lives in your
              account and never quietly resets.
            </p>
            <dl className="mt-8 divide-y divide-white/10 border-t border-white/10">
              {[
                ["Earn", "1 point / $1 on everything, 2x on care subscriptions"],
                ["Redeem", "100 points = $5, flat, on anything"],
                ["Tiers", "Circle → Silk → Crown, by 12-month spend"],
                ["Crown perk", "Early capsule access and a dedicated stylist line"],
              ].map(([t, d]) => (
                <div key={t} className="grid grid-cols-[110px_1fr] gap-6 py-4">
                  <dt className="eyebrow pt-0.5 text-gold">{t}</dt>
                  <dd className="text-[0.9375rem] text-blush-200/80">{d}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div id="perks" className="scroll-mt-32">
            <p className="eyebrow mb-5 text-gold">Care box member perks</p>
            <h2 className="text-[clamp(2rem,4.5vw,3.25rem)] text-paper">Subscribers get more.</h2>
            <ul className="mt-8 space-y-4">
              {[
                "20% under one-time pricing, every month",
                "Double loyalty points on every box",
                "Priority allocation on capsule drops",
                "Quarterly members-only masterclass invite",
                "Pause, skip, or cancel in-account — no phone call, no script",
              ].map((perk) => (
                <li
                  key={perk}
                  className="flex items-start gap-3 text-[0.9375rem] text-blush-200/80"
                >
                  <span className="mt-1.5 inline-block h-1 w-1 shrink-0 rotate-45 bg-gold" />
                  {perk}
                </li>
              ))}
            </ul>
            <Link
              href="/product/beyond-care-ritual-box"
              className="mt-9 inline-block border border-gold px-8 py-3.5 text-[0.8125rem] tracking-[0.14em] text-gold uppercase transition-all duration-500 hover:bg-gold hover:text-ink"
            >
              The Care Ritual
            </Link>
          </div>
        </div>
      </section>

      {/* Events */}
      <Section
        className="py-24"
        eyebrowLeft="Events"
        eyebrowCenter="Masterclasses"
        eyebrowRight="Virtual · live"
      >
        <div id="events" className="scroll-mt-32">
          <SectionHeading
            title="Community events."
            body="Live virtual styling masterclasses, streamed inside the Circle. Recordings land in the Learn library after each session."
          />
          <div className="mt-12 divide-y divide-white/[0.07] border-t border-white/[0.07]">
            {[
              [
                "Melt Clinic",
                "Monthly · live troubleshooting on your own install, camera on or off",
              ],
              [
                "Colour & Tone",
                "Quarterly · toning platinum and colour-matching lace with a session colourist",
              ],
              [
                "First Unit, Together",
                "Monthly · a guided first install for new members, start to finish",
              ],
            ].map(([name, detail]) => (
              <div key={name} className="grid gap-4 py-6 md:grid-cols-[240px_1fr]">
                <h3 className="text-xl text-paper">{name}</h3>
                <p className="text-[0.9375rem] text-neutral-400">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Ambassadors */}
      <section id="ambassadors" className="scroll-mt-32 border-t border-white/[0.07] py-24">
        <div className="mx-auto max-w-[1440px] px-[4vw]">
          <SectionHeading
            eyebrow="Beyond Ambassadors"
            title="Three tiers. One standard."
            body="Not a gifting programme — a partnership structure. Every tier trades real value both directions, and every tier is capped."
          />
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {TIERS.map((tier) => (
              <div key={tier.name} className="flex flex-col border border-white/[0.07] p-8">
                <h3 className="text-xl text-paper">{tier.name}</h3>
                <p className="eyebrow mt-1 text-gold">{tier.range}</p>
                <p className="mt-5 flex-1 text-[0.9375rem] leading-relaxed text-neutral-400">
                  {tier.body}
                </p>
                <Link
                  href={tier.href}
                  className="mt-7 inline-block border-b border-gold pb-1 text-[0.8125rem] tracking-[0.1em] text-gold uppercase"
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ResourceHero } from "@/components/ui/ResourceHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ContactForm } from "@/components/forms/ContactForm";
import {
  InstagramGlyph,
  WhatsAppGlyph,
  TikTokGlyph,
  SocialRow,
} from "@/components/brand/SocialIcons";
import { Phone, Mail, Send, MapPin, Clock } from "lucide-react";
import {
  EMAILS,
  HOURS,
  LOCATION,
  PHONE_DISPLAY,
  RESPONSE_TIMES,
  TIMEZONE_NOTE,
  URLS,
  HANDLES,
} from "@/lib/contact";

export const metadata: Metadata = {
  title: "Contact Headquarters",
  description:
    "Reach Beyond Lace six ways — WhatsApp, phone, email, Instagram, WeChat and Telegram. Customer care, wholesale, press and ambassador desks, plus business hours.",
};

/** Six channels, each with an honest response commitment attached. */
const CHANNELS = [
  {
    name: "WhatsApp",
    context: "Fastest route",
    body: "Quotes, order status, shade questions. If it is urgent, use this — it reaches a person, not a queue.",
    handle: PHONE_DISPLAY,
    response: RESPONSE_TIMES.whatsapp,
    href: URLS.whatsappPrefilled,
    external: true,
    icon: <WhatsAppGlyph size={20} />,
    live: true,
  },
  {
    name: "Direct call",
    context: "Voice · sales desk",
    body: "For wholesale conversations that are faster spoken than typed. Ask for the partner desk by name.",
    handle: PHONE_DISPLAY,
    response: RESPONSE_TIMES.phone,
    href: URLS.phone,
    external: false,
    icon: <Phone size={19} strokeWidth={1.6} />,
    live: false,
  },
  {
    name: "Email",
    context: "Considered enquiries",
    body: "Best for detailed briefs, bulk specifications, press requests and anything that needs a paper trail.",
    handle: EMAILS.care,
    response: RESPONSE_TIMES.email,
    href: `mailto:${EMAILS.care}`,
    external: false,
    icon: <Mail size={19} strokeWidth={1.6} />,
    live: false,
  },
  {
    name: "Instagram",
    context: `DMs open · @${HANDLES.instagram}`,
    body: "Shade opinions, styling questions, and the transformation gallery. Our most visual channel by some distance.",
    handle: `@${HANDLES.instagram}`,
    response: RESPONSE_TIMES.instagram,
    href: URLS.instagramDm,
    external: true,
    icon: <InstagramGlyph size={20} />,
    live: true,
  },
  {
    name: "WeChat",
    context: "Mainland China & East Asia",
    body: "The primary line for partners and clients operating in mainland China, in the timezone of our floor.",
    handle: `ID: ${HANDLES.wechat}`,
    response: RESPONSE_TIMES.wechat,
    href: URLS.whatsapp,
    external: true,
    icon: <TikTokGlyph size={20} />,
    live: false,
  },
  {
    name: "Telegram",
    context: "Broadcast · capsule drops",
    body: "Capsule drop alerts and restock notices for partners who would rather not watch an inbox.",
    handle: `@${HANDLES.telegram}`,
    response: RESPONSE_TIMES.telegram,
    href: URLS.telegram,
    external: true,
    icon: <Send size={19} strokeWidth={1.6} />,
    live: false,
  },
];

const DESKS = [
  { t: "Customer care", b: "Orders, returns, fit and shade.", email: EMAILS.care },
  {
    t: "Wholesale & private label",
    b: "Salon programme, Beyond Lace Pro, bulk allocation.",
    email: EMAILS.partners,
  },
  { t: "Press & media", b: "Interviews, assets, approved brand language.", email: EMAILS.press },
  {
    t: "Ambassadors",
    b: "Three-tier creator and stylist partnerships.",
    email: EMAILS.ambassadors,
  },
];

export default function ContactHQPage() {
  return (
    <>
      <ResourceHero
        eyebrow="Company"
        title="Contact headquarters."
        italic="A person, not a ticket."
        body="Six ways in, each with a response time we publish and hold ourselves to. Every message is read by someone who can actually act on it — choose the desk that fits and you skip the triage entirely."
        image="company"
      />

      {/* Channels */}
      <Section
        className="py-20"
        eyebrowLeft="Every way in"
        eyebrowCenter="Six channels"
        eyebrowRight="Published response times"
      >
        <SectionHeading
          title="Reach us however suits you."
          body="No channel is a dead end and none of them route to an autoresponder. The response times below are commitments, not aspirations."
        />
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {CHANNELS.map((c) => (
            <Link
              key={c.name}
              href={c.href}
              {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group flex flex-col rounded-xl border border-white/[0.07] p-7 transition-all duration-400 hover:-translate-y-1 hover:border-gold/60"
            >
              <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg border border-gold/25 bg-plum-900 text-gold transition-transform duration-400 group-hover:scale-110">
                {c.icon}
              </span>
              <p className="eyebrow text-gold">{c.context}</p>
              <h3 className="mt-1.5 font-[family-name:var(--font-display)] text-xl text-paper">
                {c.name}
              </h3>
              <p className="mt-2.5 flex-1 text-[0.875rem] leading-relaxed text-neutral-400">
                {c.body}
              </p>
              <p className="mt-4 font-mono text-[0.75rem] text-neutral-200">{c.handle}</p>
              <span className="mt-3 flex items-center gap-2 text-[0.6875rem] tracking-[0.1em] text-neutral-400 uppercase">
                <span
                  aria-hidden="true"
                  className={`inline-block h-1.5 w-1.5 rounded-full ${
                    c.live ? "bg-gold" : "bg-neutral-400/50"
                  }`}
                />
                {c.response}
              </span>
            </Link>
          ))}
        </div>
      </Section>

      {/* Desks */}
      <Section className="pb-20" eyebrowLeft="Desks" eyebrowRight="Skip the triage">
        <div className="grid gap-5 sm:grid-cols-2">
          {DESKS.map((d) => (
            <div
              key={d.t}
              className="rounded-xl border border-white/[0.07] p-6 transition-colors duration-300 hover:border-gold/50"
            >
              <h3 className="text-[1.0625rem] text-paper">{d.t}</h3>
              <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-neutral-400">{d.b}</p>
              <a
                href={`mailto:${d.email}`}
                className="mt-3 inline-block text-[0.8125rem] text-gold underline-offset-4 hover:underline"
              >
                {d.email}
              </a>
            </div>
          ))}
        </div>
      </Section>

      {/* Hours + location + form */}
      <section className="border-t border-white/[0.07] bg-plum-900 py-20">
        <div className="mx-auto grid max-w-[1440px] gap-14 px-[4vw] lg:grid-cols-[1fr_1.35fr]">
          <div>
            <p className="eyebrow mb-4 flex items-center gap-2 text-gold">
              <Clock size={13} strokeWidth={1.6} />
              Business hours
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,4vw,2.5rem)] text-paper">
              When the desk is staffed.
            </h2>

            <dl className="mt-8 divide-y divide-white/10 border-t border-white/10">
              {HOURS.map((h) => (
                <div key={h.day} className="flex items-baseline justify-between gap-4 py-3.5">
                  <dt className="text-[0.875rem] text-blush-200/85">{h.day}</dt>
                  <dd className="flex items-baseline gap-3">
                    <span className="text-[0.875rem] text-paper tabular-nums">{h.time}</span>
                    {h.note && (
                      <span className="hidden text-[0.625rem] tracking-[0.1em] text-gold uppercase sm:inline">
                        {h.note}
                      </span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 text-[0.8125rem] leading-relaxed text-blush-200/60">
              {TIMEZONE_NOTE}
            </p>

            <div className="mt-10 flex items-start gap-3">
              <MapPin size={17} strokeWidth={1.6} className="mt-0.5 shrink-0 text-gold" />
              <div>
                <p className="eyebrow mb-1 text-gold">Manufacturing floor</p>
                <p className="text-[0.9375rem] leading-relaxed text-blush-200/85">
                  {LOCATION.line1}
                  <br />
                  {LOCATION.line2}
                </p>
                <Link
                  href="/brand#facility"
                  className="mt-3 inline-block border-b border-gold pb-0.5 text-[0.75rem] tracking-[0.1em] text-gold uppercase"
                >
                  Inside the floor
                </Link>
              </div>
            </div>

            <p className="eyebrow mt-10 mb-4 text-gold">Social</p>
            <SocialRow />
          </div>

          <ContactForm />
        </div>
      </section>
    </>
  );
}

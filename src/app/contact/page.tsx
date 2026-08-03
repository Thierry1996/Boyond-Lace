import type { Metadata } from "next";
import Link from "next/link";
import {
  Phone,
  Mail,
  Send,
  MapPin,
  Clock,
  MessageCircle,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";
import { ContactInquiryForm } from "@/components/forms/ContactInquiryForm";
import { InnerCircleForm } from "@/components/forms/InnerCircleForm";
import {
  InstagramGlyph,
  WhatsAppGlyph,
  TikTokGlyph,
  YouTubeGlyph,
  PinterestGlyph,
} from "@/components/brand/SocialIcons";
import {
  EMAILS,
  HANDLES,
  HOURS,
  LOCATION,
  PHONE_DISPLAY,
  TIMEZONE_NOTE,
  URLS,
} from "@/lib/contact";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Talk to Beyond Lace about luxury human-hair wigs — WhatsApp, phone, email, Instagram, WeChat and Telegram. Wholesale quotes, order updates, and support, with published response times.",
};

/* ------------------------------------------------------------------ Data */

const CHANNELS = [
  {
    eyebrow: "WhatsApp · Recommended",
    name: "WhatsApp Business",
    body: "Wholesale quotes, order updates, product enquiries. Our fastest response channel.",
    handle: PHONE_DISPLAY,
    note: "Typically under 2 hours",
    cta: "Open Chat",
    href: URLS.whatsappPrefilled,
    external: true,
    icon: <WhatsAppGlyph size={20} />,
  },
  {
    eyebrow: "Voice · Sales team",
    name: "Direct Phone Call",
    body: "Speak one-to-one with a sales or wholesale representative for detailed discussions.",
    handle: PHONE_DISPLAY,
    note: "Mon–Fri 9AM–6PM CST",
    cta: "Call Now",
    href: URLS.phone,
    external: false,
    icon: <Phone size={19} strokeWidth={1.6} />,
  },
  {
    eyebrow: "Email · Formal enquiries",
    name: "Send an Email",
    body: "Best for detailed wholesale orders, custom briefs, legal, and formal requests.",
    handle: EMAILS.care,
    note: "Within 24 hours",
    cta: "Email Us",
    href: `mailto:${EMAILS.care}`,
    external: false,
    icon: <Mail size={19} strokeWidth={1.6} />,
  },
  {
    eyebrow: "Instagram · DMs open",
    name: `@${HANDLES.instagram}`,
    body: "Style inspo, DM support, new arrivals, and community. Follow for hair goals daily.",
    handle: URLS.instagram.replace("https://", ""),
    note: "DMs checked daily",
    cta: "Follow & DM",
    href: URLS.instagram,
    external: true,
    icon: <InstagramGlyph size={20} />,
  },
  {
    eyebrow: "WeChat · China clients",
    name: "WeChat Business",
    body: "Primary channel for clients and partners based in mainland China and East Asia.",
    handle: `ID: ${HANDLES.wechat}`,
    note: "Business hours CST",
    cta: "Add on WeChat",
    href: URLS.whatsapp,
    external: true,
    icon: <MessageCircle size={19} strokeWidth={1.6} />,
  },
  {
    eyebrow: "Telegram · Updates",
    name: "Telegram Channel",
    body: "Join our Telegram for wholesale flash deals, stock alerts, and community updates.",
    handle: `@${HANDLES.telegram}`,
    note: "Updated weekly",
    cta: "Join Channel",
    href: URLS.telegram,
    external: true,
    icon: <Send size={19} strokeWidth={1.6} />,
  },
];

const STATS = [
  { value: "<2h", label: "WhatsApp response" },
  { value: "24h", label: "Email response" },
  { value: "6", label: "Contact channels" },
  { value: "12+", label: "Social platforms" },
];

const SOCIALS = [
  {
    label: "Instagram · Main hub",
    handle: `@${HANDLES.instagram}`,
    body: "Hair inspo, tutorials, before & afters, new drops, and daily style content.",
    cta: "Follow on Instagram",
    href: URLS.instagram,
    icon: <InstagramGlyph size={22} />,
    feature: true,
  },
  {
    label: "TikTok · Trending",
    handle: `@${HANDLES.tiktok}`,
    body: "Styling reels, wig install tutorials, factory tours, and viral hair content.",
    cta: "Follow on TikTok",
    href: URLS.tiktok,
    icon: <TikTokGlyph size={22} />,
    feature: true,
  },
  {
    label: "YouTube",
    handle: "Beyond Lace",
    body: "Long-form tutorials, reviews & styling guides.",
    cta: "Subscribe",
    href: URLS.youtube,
    icon: <YouTubeGlyph size={22} />,
  },
  {
    label: "Facebook",
    handle: "Beyond Lace",
    body: "Community, promotions & customer stories.",
    cta: "Like Page",
    href: `https://facebook.com/${HANDLES.instagram}`,
    icon: <span className="font-[family-name:var(--font-display)] text-lg">f</span>,
  },
  {
    label: "WhatsApp",
    handle: "Business Chat",
    body: "Direct support & wholesale quotes.",
    cta: "Chat Now",
    href: URLS.whatsapp,
    icon: <WhatsAppGlyph size={22} />,
  },
  {
    label: "Pinterest",
    handle: `@${HANDLES.pinterest}`,
    body: "Hair mood boards & style inspiration.",
    cta: "Save Pins",
    href: URLS.pinterest,
    icon: <PinterestGlyph size={22} />,
  },
  {
    label: "X · Twitter",
    handle: `@${HANDLES.instagram}`,
    body: "Updates, industry news & brand voice.",
    cta: "Follow",
    href: `https://x.com/${HANDLES.instagram}`,
    icon: <span className="text-base font-semibold">X</span>,
  },
  {
    label: "Threads",
    handle: `@${HANDLES.instagram}`,
    body: "Conversations, opinions & community.",
    cta: "Follow",
    href: `https://threads.net/@${HANDLES.instagram}`,
    icon: <span className="text-base font-semibold">@</span>,
  },
  {
    label: "LinkedIn",
    handle: "Beyond Lace",
    body: "B2B partnerships & wholesale network.",
    cta: "Connect",
    href: `https://linkedin.com/company/${HANDLES.instagram}`,
    icon: <span className="text-sm font-bold tracking-tight">in</span>,
  },
  {
    label: "Telegram",
    handle: `@${HANDLES.telegram}`,
    body: "Flash deals & wholesale alerts.",
    cta: "Join",
    href: URLS.telegram,
    icon: <Send size={20} strokeWidth={1.6} />,
  },
  {
    label: "Snapchat",
    handle: HANDLES.instagram,
    body: "Behind the scenes & stories.",
    cta: "Add",
    href: `https://snapchat.com/add/${HANDLES.instagram}`,
    icon: <span className="text-base font-semibold">S</span>,
  },
  {
    label: "WeChat",
    handle: HANDLES.wechat,
    body: "China & East Asia clients.",
    cta: "Scan QR",
    href: URLS.whatsapp,
    icon: <MessageCircle size={20} strokeWidth={1.6} />,
  },
];

const LIVE_SUPPORT = [
  {
    eyebrow: "WhatsApp · Fastest",
    name: "WhatsApp Business Chat",
    body: `${PHONE_DISPLAY} · Order quotes, tracking, wholesale support.`,
    note: "Under 2 hours · Mon–Sat",
    href: URLS.whatsappPrefilled,
    icon: <WhatsAppGlyph size={18} />,
  },
  {
    eyebrow: "Phone · Sales team",
    name: "Direct Voice Call",
    body: `${PHONE_DISPLAY} · Speak to a sales or wholesale specialist.`,
    note: "Mon–Fri · 9AM–6PM CST",
    href: URLS.phone,
    icon: <Phone size={17} strokeWidth={1.6} />,
  },
  {
    eyebrow: "Instagram · DMs open",
    name: `@${HANDLES.instagram}`,
    body: "Style questions, product support, and community engagement.",
    note: "DMs checked daily · Mon–Sat",
    href: URLS.instagram,
    icon: <InstagramGlyph size={18} />,
  },
  {
    eyebrow: "Email · Formal enquiries",
    name: EMAILS.care,
    body: "Wholesale briefs, custom orders, returns & legal enquiries.",
    note: "Within 24 hours · International",
    href: `mailto:${EMAILS.care}`,
    icon: <Mail size={17} strokeWidth={1.6} />,
  },
];

const SUBSCRIBE_PERKS = [
  "Early access to new drops",
  "Wholesale flash deals",
  "Styling & care guides",
  "Subscriber-only discounts",
  "Zero spam, unsubscribe anytime",
];

/* ------------------------------------------------------------------ Page */

export default function ContactPage() {
  return (
    <>
      {/* 1 — Hero */}
      <section className="grid lg:grid-cols-2">
        <div className="relative overflow-hidden bg-plum-900 px-[6vw] py-24 lg:py-32">
          <p className="eyebrow text-blush-300">Contact · Support · Connect</p>
          <h1 className="mt-8 font-[family-name:var(--font-display)] text-[clamp(3rem,7vw,5.5rem)] leading-[0.95] text-paper">
            Let&rsquo;s Talk
            <br />
            <span className="italic text-blush-300">Hair.</span>
          </h1>
          <p className="mt-8 max-w-md text-[0.9375rem] leading-relaxed text-blush-200/75">
            Whether you&rsquo;re a salon owner in Lagos, a boutique buyer in London, or a first-time
            customer in New York — we&rsquo;re ready, responsive, and genuinely excited to hear from
            you.
          </p>
          <dl className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label}>
                <dd className="font-[family-name:var(--font-display)] text-3xl text-gold">
                  {s.value}
                </dd>
                <dt className="mt-1 text-[0.625rem] tracking-[0.12em] text-blush-200/60 uppercase">
                  {s.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>

        {/* WhatsApp Direct panel — green is the channel's own identity */}
        <div className="flex flex-col items-center justify-center bg-gradient-to-b from-[#0b2a1c] to-[#06170f] px-[6vw] py-24 text-center lg:py-32">
          <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-[0_0_40px_rgba(16,185,129,0.45)]">
            <WhatsAppGlyph size={40} className="text-white" />
          </span>
          <p className="mt-8 text-[0.6875rem] tracking-[0.2em] text-emerald-400/80 uppercase">
            Fastest support channel
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-paper">
            WhatsApp <span className="italic text-emerald-400">Direct</span>
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-[0.9375rem] leading-relaxed text-emerald-50/70">
            Our most responsive channel — speak directly with our team for quotes, order updates,
            and wholesale enquiries.
          </p>

          <div className="mt-8 w-full max-w-sm space-y-3 text-left">
            <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-emerald-600/90 px-4 py-3">
              <p className="text-[0.875rem] leading-snug text-white">
                Hi! 👋 I&rsquo;m interested in wholesale HD lace wigs. Can you share pricing?
              </p>
              <p className="mt-1 text-right text-[0.625rem] text-emerald-100/70">10:42 AM ✓✓</p>
            </div>
            <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white/10 px-4 py-3">
              <p className="text-[0.875rem] leading-snug text-emerald-50">
                Welcome! We&rsquo;d love to help 💜 Let me pull up our wholesale catalogue for you…
              </p>
              <p className="mt-1 text-right text-[0.625rem] text-emerald-100/50">10:43 AM</p>
            </div>
            <div className="flex gap-1.5 pl-1">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 [animation-delay:0ms]" />
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 [animation-delay:200ms]" />
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 [animation-delay:400ms]" />
            </div>
          </div>

          <Link
            href={URLS.whatsappPrefilled}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 flex w-full max-w-sm items-center justify-center gap-2 rounded-md bg-emerald-500 px-8 py-4 text-[0.75rem] tracking-[0.14em] text-white uppercase transition-colors hover:bg-emerald-400"
          >
            <WhatsAppGlyph size={16} className="text-white" />
            Open WhatsApp Chat
          </Link>
          <p className="mt-4 text-[0.75rem] text-emerald-100/50">
            {PHONE_DISPLAY} · Mon–Sat, CST
          </p>
        </div>
      </section>

      {/* 2 — Six Ways to Connect */}
      <section className="border-t border-white/[0.07] bg-ink py-24">
        <div className="mx-auto max-w-[1440px] px-[4vw]">
          <div className="text-center">
            <p className="eyebrow text-gold">Every way to reach us</p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(2rem,4vw,3rem)] text-paper">
              Six Ways to <span className="italic text-blush-300">Connect</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[0.9375rem] leading-relaxed text-neutral-400">
              Choose whatever channel feels most natural — we&rsquo;re present, professional, and
              ready on all of them.
            </p>
          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {CHANNELS.map((c) => (
              <Link
                key={c.name}
                href={c.href}
                {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group flex flex-col rounded-xl border border-white/[0.07] p-7 transition-all duration-400 hover:-translate-y-1 hover:border-gold/60"
              >
                <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg border border-gold/25 bg-plum-900 text-gold transition-transform duration-400 group-hover:scale-110">
                  {c.icon}
                </span>
                <p className="eyebrow text-gold">{c.eyebrow}</p>
                <h3 className="mt-1.5 font-[family-name:var(--font-display)] text-xl text-paper">
                  {c.name}
                </h3>
                <p className="mt-2.5 flex-1 text-[0.875rem] leading-relaxed text-neutral-400">
                  {c.body}
                </p>
                <p className="mt-5 font-mono text-[0.8125rem] text-neutral-200">{c.handle}</p>
                <span className="mt-2 flex items-center gap-2 text-[0.6875rem] tracking-[0.1em] text-neutral-400 uppercase">
                  <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-gold" />
                  {c.note}
                </span>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[0.75rem] tracking-[0.1em] text-gold uppercase">
                  {c.cta}
                  <ArrowRight size={12} strokeWidth={1.75} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3 — Get in Touch (light) */}
      <section className="bg-[#f4eef2] py-24">
        <div className="mx-auto grid max-w-[1440px] gap-14 px-[4vw] lg:grid-cols-[1fr_1.35fr]">
          <div>
            <p className="text-[0.6875rem] tracking-[0.14em] text-plum-700 uppercase">
              Send a message
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(1.9rem,4vw,2.75rem)] text-plum-900">
              Get in <span className="italic text-plum-700">Touch</span>
            </h2>
            <p className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-plum-900/70">
              Fill in the form and our team will respond within 24 hours. For urgent wholesale
              quotes or time-sensitive orders, we recommend reaching us on WhatsApp for the fastest
              response.
            </p>

            <div className="mt-10 space-y-6">
              <ContactDetail
                icon={<MapPin size={17} strokeWidth={1.6} />}
                label="Our location"
                title={LOCATION.line1}
                sub={`${LOCATION.line2} — World Hair Capital`}
              />
              <ContactDetail
                icon={<Mail size={17} strokeWidth={1.6} />}
                label="Email"
                title={EMAILS.care}
                sub="International enquiries · 24-hour response"
              />
              <ContactDetail
                icon={<MessageCircle size={17} strokeWidth={1.6} />}
                label="WhatsApp / WeChat"
                title={PHONE_DISPLAY}
                sub="Fastest channel · Under 2 hours"
              />
              <ContactDetail
                icon={<InstagramGlyph size={17} />}
                label="Instagram"
                title={`@${HANDLES.instagram}`}
                sub="DMs welcome · Style enquiries & support"
              />
            </div>

            <div className="mt-10 border-t border-plum-900/10 pt-8">
              <p className="text-[0.6875rem] tracking-[0.14em] text-plum-700 uppercase">
                Business hours · China Standard Time (UTC+8)
              </p>
              <dl className="mt-4 divide-y divide-plum-900/10">
                {HOURS.map((h) => (
                  <div key={h.day} className="flex items-baseline justify-between py-2.5">
                    <dt className="text-[0.875rem] text-plum-900/80">{h.day}</dt>
                    <dd className="text-[0.875rem] text-plum-900 tabular-nums">{h.time}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div>
            <ContactInquiryForm />
          </div>
        </div>
      </section>

      {/* 4 — Our Social Universe */}
      <section className="border-t border-white/[0.07] bg-ink py-24">
        <div className="mx-auto max-w-[1440px] px-[4vw]">
          <div className="text-center">
            <p className="eyebrow text-gold">Find us everywhere</p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(2rem,4vw,3rem)] text-paper">
              Our Social <span className="italic text-blush-300">Universe</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[0.9375rem] leading-relaxed text-neutral-400">
              Follow, subscribe, and connect across every platform we call home. Each channel has
              its own flavour — find yours.
            </p>
          </div>

          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SOCIALS.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex flex-col rounded-xl border border-white/[0.07] p-6 transition-all duration-400 hover:-translate-y-1 hover:border-gold/60 ${
                  s.feature ? "lg:col-span-2" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-gold/25 bg-plum-900 text-gold">
                    {s.icon}
                  </span>
                  <div>
                    <p className="eyebrow text-gold">{s.label}</p>
                    <p className="font-[family-name:var(--font-display)] text-lg text-paper">
                      {s.handle}
                    </p>
                  </div>
                </div>
                <p className="mt-4 flex-1 text-[0.8125rem] leading-relaxed text-neutral-400">
                  {s.body}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[0.6875rem] tracking-[0.12em] text-gold uppercase">
                  {s.cta}
                  <ArrowUpRight size={12} strokeWidth={1.75} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5 — Join the Beyond Circle */}
      <section className="relative overflow-hidden bg-gradient-to-b from-plum-900 to-plum-800 py-24">
        <div className="mx-auto max-w-[1440px] px-[4vw]">
          <div className="text-center">
            <p className="eyebrow text-gold">Never miss a thing</p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(2rem,4vw,3rem)] text-paper">
              Join the <span className="italic text-blush-300">Beyond Circle</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[0.9375rem] leading-relaxed text-blush-200/70">
              Subscribe for early access, exclusive wholesale deals, styling content, and flash
              stock alerts — straight to you.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-2.5">
              {SUBSCRIBE_PERKS.map((p) => (
                <span
                  key={p}
                  className="rounded-full border border-gold/25 bg-plum-900/40 px-4 py-2 text-[0.75rem] text-blush-200/85"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-16 grid gap-14 lg:grid-cols-[1.15fr_1fr]">
            <div>
              <h3 className="font-[family-name:var(--font-display)] text-2xl text-paper">
                Subscribe &amp; <span className="italic text-blush-300">Stay Inspired</span>
              </h3>
              <p className="mt-2 mb-8 text-[0.875rem] leading-relaxed text-blush-200/65">
                Fill in your details and choose how you&rsquo;d like us to keep you in the loop.
              </p>
              <InnerCircleForm />
            </div>

            <div>
              <h3 className="font-[family-name:var(--font-display)] text-2xl text-paper">
                Live <span className="italic text-blush-300">Support</span>
              </h3>
              <p className="mt-2 mb-8 text-[0.875rem] leading-relaxed text-blush-200/65">
                Our team is available across four dedicated channels. Reach us wherever is most
                convenient for you.
              </p>
              <div className="space-y-4">
                {LIVE_SUPPORT.map((c) => (
                  <Link
                    key={c.name}
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-4 rounded-xl border border-white/[0.08] bg-plum-900/30 p-5 transition-colors hover:border-gold/50"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gold/25 bg-plum-900 text-gold">
                      {c.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="eyebrow text-gold">{c.eyebrow}</p>
                      <p className="mt-0.5 text-[0.9375rem] text-paper">{c.name}</p>
                      <p className="mt-1 text-[0.8125rem] leading-relaxed text-neutral-400">
                        {c.body}
                      </p>
                      <span className="mt-2 flex items-center gap-2 text-[0.625rem] tracking-[0.1em] text-neutral-400 uppercase">
                        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold" />
                        {c.note}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-6 rounded-xl border border-white/[0.08] bg-plum-900/30 p-5">
                <p className="eyebrow mb-3 flex items-center gap-2 text-gold">
                  <Clock size={12} strokeWidth={1.6} />
                  Business hours · China Standard Time (UTC+8)
                </p>
                <dl className="divide-y divide-white/[0.06]">
                  {HOURS.map((h) => (
                    <div key={h.day} className="flex items-baseline justify-between py-2">
                      <dt className="text-[0.8125rem] text-blush-200/80">{h.day}</dt>
                      <dd className="text-[0.8125rem] text-paper tabular-nums">{h.time}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 text-[0.75rem] leading-relaxed text-blush-200/50">
                  {TIMEZONE_NOTE}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ContactDetail({
  icon,
  label,
  title,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  title: string;
  sub: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-plum-900/8 text-plum-700">
        {icon}
      </span>
      <div>
        <p className="text-[0.625rem] tracking-[0.14em] text-plum-700 uppercase">{label}</p>
        <p className="mt-0.5 text-[0.9375rem] text-plum-900">{title}</p>
        <p className="text-[0.8125rem] text-plum-900/60">{sub}</p>
      </div>
    </div>
  );
}

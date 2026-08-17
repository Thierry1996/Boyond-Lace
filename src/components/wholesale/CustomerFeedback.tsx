import { Star, Quote, MessageCircle, Check } from "lucide-react";

/**
 * "Customer Feedback" social proof — testimonial cards + an editorial masonry of
 * realistic mobile chat/receipt mockups (WhatsApp, Instagram, Messenger, order
 * receipts), cloned in spirit from the reference, in the Beyond Lace system.
 *
 * ⚠ PLACEHOLDER CONTENT. The names, messages, receipts, and review count are
 * SAMPLE/template data for layout only. Replace with REAL customer screenshots
 * and the real count before shoppers see this — presenting fabricated reviews as
 * genuine is deceptive. Pass real data via props to override the samples.
 */

type Platform = "whatsapp" | "instagram" | "messenger";

export interface Testimonial {
  name: string;
  country: string;
  quote: string;
}
interface ChatMessage {
  from: "them" | "us";
  text: string;
}
interface ChatCardData {
  kind: "chat";
  platform: Platform;
  contact: string;
  handle?: string;
  messages: ChatMessage[];
  photo?: boolean;
}
interface ReceiptCardData {
  kind: "receipt";
  contact: string;
  order: string;
  item: string;
  qty: string;
  total: string;
}
export type ProofCard = ChatCardData | ReceiptCardData;

const THEME: Record<Platform, { header: string; bg: string; foot: string; inBubble: string; outBubble: string; label: string }> = {
  whatsapp: { header: "#128C7E", bg: "#0b141a", foot: "#1f2c34", inBubble: "#202c33", outBubble: "#005c4b", label: "WhatsApp" },
  instagram: { header: "linear-gradient(90deg,#feda75,#fa7e1e,#d62976,#962fbf,#4f5bd5)", bg: "#121212", foot: "#1c1c1c", inBubble: "#262626", outBubble: "#3797f0", label: "Instagram" },
  messenger: { header: "#0084ff", bg: "#18191a", foot: "#242526", inBubble: "#3a3b3c", outBubble: "#0084ff", label: "Messenger" },
};

// --- sample/template data (replace before launch) ---
const SAMPLE_TESTIMONIALS: Testimonial[] = [
  { name: "[ Customer name ]", country: "United States", quote: "Sample testimonial — replace with a real verified review. Quality, no shedding, fast shipping." },
  { name: "[ Customer name ]", country: "United Kingdom", quote: "Sample testimonial — replace with a real verified review. The hairline, and reordering again." },
  { name: "[ Customer name ]", country: "France", quote: "Sample testimonial — replace with a real verified review. Service and the finished install." },
];
const SAMPLE_CARDS: ProofCard[] = [
  { kind: "chat", platform: "whatsapp", contact: "[ Customer ]", messages: [{ from: "them", text: "Just installed it 😍 flawless!" }, { from: "us", text: "Love to see it 💛" }, { from: "them", text: "Reordering 3 more this week" }], photo: true },
  { kind: "receipt", contact: "[ Customer ]", order: "#BL-0000", item: "[ Unit name ]", qty: "5 units", total: "$0.00" },
  { kind: "chat", platform: "instagram", contact: "[ Customer ]", handle: "@handle", messages: [{ from: "them", text: "girl this lace MELTED 🔥" }, { from: "us", text: "🙌🙌" }] },
  { kind: "chat", platform: "messenger", contact: "[ Customer ]", messages: [{ from: "them", text: "Order arrived, thank you!" }, { from: "us", text: "Enjoy — care card is inside 💛" }, { from: "them", text: "Best supplier I've used" }, { from: "them", text: "5 stars ⭐️⭐️⭐️⭐️⭐️" }] },
  { kind: "chat", platform: "whatsapp", contact: "[ Customer ]", messages: [{ from: "them", text: "No shedding after 3 washes 👏" }, { from: "us", text: "That's the batch guarantee 💛" }], photo: true },
  { kind: "receipt", contact: "[ Customer ]", order: "#BL-0000", item: "[ Unit name ]", qty: "12 units", total: "$0.00" },
  { kind: "chat", platform: "instagram", contact: "[ Customer ]", handle: "@handle", messages: [{ from: "them", text: "sending my clients your way 💇🏾‍♀️" }, { from: "us", text: "Partner pricing in your DMs 📩" }, { from: "them", text: "🤝🤝" }] },
];

function Avatar({ label }: { label: string }) {
  return (
    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white/25 text-[0.75rem] font-semibold text-white">
      {label.replace(/[^A-Za-z]/g, "").slice(0, 1) || "•"}
    </span>
  );
}

function ChatCard({ c }: { c: ChatCardData }) {
  const th = THEME[c.platform];
  return (
    <article className="mb-5 break-inside-avoid overflow-hidden rounded-[1.4rem] border border-white/10 shadow-xl">
      <div className="flex items-center gap-2.5 px-3.5 py-3" style={{ background: th.header }}>
        <Avatar label={c.contact} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.8125rem] font-medium text-white">{c.handle ?? c.contact}</p>
          <p className="text-[0.625rem] text-white/70">{c.platform === "whatsapp" ? "online" : th.label}</p>
        </div>
        <span className="rounded-full bg-white/15 px-2 py-0.5 text-[0.5625rem] font-medium tracking-wide text-white/90 uppercase">
          {th.label}
        </span>
      </div>
      <div className="space-y-2 px-3 py-4" style={{ background: th.bg }}>
        {c.messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === "us" ? "justify-end" : "justify-start"}`}>
            <span
              className="max-w-[82%] rounded-2xl px-3 py-1.5 text-[0.8125rem] leading-snug text-white"
              style={{ background: m.from === "us" ? th.outBubble : th.inBubble }}
            >
              {m.text}
            </span>
          </div>
        ))}
        {c.photo && (
          <div className="flex justify-start">
            <span
              className="block h-40 w-32 rounded-xl"
              style={{ background: "linear-gradient(150deg,#5A2D67,#321528 60%,#090909)" }}
              aria-hidden="true"
            />
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 border-t border-white/5 px-3 py-2.5" style={{ background: th.foot }}>
        <span className="flex-1 rounded-full bg-white/10 px-3 py-1.5 text-[0.6875rem] text-white/45">Message…</span>
        <MessageCircle size={14} className="text-white/40" />
      </div>
    </article>
  );
}

function ReceiptCard({ c }: { c: ReceiptCardData }) {
  return (
    <article className="mb-5 break-inside-avoid rounded-[1.4rem] border border-gold/25 bg-neutral-900 p-5 shadow-xl">
      <div className="flex items-center justify-between">
        <p className="eyebrow text-gold">Order confirmed</p>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[0.625rem] font-medium text-emerald-400 uppercase">
          <Check size={11} strokeWidth={2.5} /> Paid
        </span>
      </div>
      <p className="mt-3 text-[0.75rem] text-neutral-400 tabular-nums">{c.order}</p>
      <div className="mt-4 flex items-center gap-3 border-t border-white/[0.08] pt-4">
        <span className="size-12 shrink-0 rounded-lg" style={{ background: "linear-gradient(135deg,#46215A,#DCA8B7,#C9A66B)" }} aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.875rem] text-paper">{c.item}</p>
          <p className="text-[0.75rem] text-neutral-400">{c.qty}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-white/[0.08] pt-4">
        <span className="text-[0.8125rem] text-neutral-400">Total paid</span>
        <span className="font-[family-name:var(--font-display)] text-xl text-paper tabular-nums">{c.total}</span>
      </div>
    </article>
  );
}

export function CustomerFeedback({
  reviewCount,
  testimonials = SAMPLE_TESTIMONIALS,
  cards = SAMPLE_CARDS,
}: {
  reviewCount?: number;
  testimonials?: Testimonial[];
  cards?: ProofCard[];
}) {
  return (
    <section className="surface-velvet border-t border-white/[0.06] py-24">
      <div className="mx-auto max-w-[1440px] px-[4vw]">
        <div className="text-center">
          <span className="inline-block rounded-full border border-gold/40 px-6 py-2 text-[0.75rem] tracking-[0.16em] text-gold uppercase">
            Customer Feedback
          </span>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <span className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,3.2vw,2.75rem)] text-paper tabular-nums">
              {reviewCount != null ? `${reviewCount.toLocaleString()}+` : "Thousands of"}
            </span>
            <span className="flex text-gold" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={22} strokeWidth={0} fill="currentColor" />
              ))}
            </span>
            <span className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,3.2vw,2.75rem)] text-paper">
              five-star reviews
            </span>
          </div>
        </div>

        {/* Testimonial cards */}
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <div key={i} className="rounded-xl border border-white/[0.08] bg-ink/30 p-7">
              <div className="flex items-center gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-plum-700 to-blush-300/60 text-sm font-semibold text-paper">
                  {t.name.replace(/[^A-Za-z]/g, "").slice(0, 1) || "•"}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[0.9375rem] text-paper">{t.name}</p>
                  <p className="text-[0.75rem] tracking-[0.06em] text-gold uppercase">{t.country}</p>
                </div>
              </div>
              <Quote size={20} strokeWidth={1.5} className="mt-5 text-gold/60" aria-hidden="true" />
              <p className="mt-2 text-[0.875rem] leading-relaxed text-neutral-300">{t.quote}</p>
              <div className="mt-4 flex text-gold" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} size={15} strokeWidth={0} fill="currentColor" />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Editorial masonry of chat + receipt mockups */}
        <p className="mt-16 mb-6 text-center eyebrow text-neutral-400">Straight from the chats &amp; receipts</p>
        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 xl:columns-4">
          {cards.map((c, i) =>
            c.kind === "receipt" ? <ReceiptCard key={i} c={c} /> : <ChatCard key={i} c={c} />,
          )}
        </div>
        <p className="mt-4 text-center text-[0.6875rem] text-neutral-400/60">
          Sample layout — drop in real WhatsApp / Instagram / Facebook chats and order receipts.
        </p>
      </div>
    </section>
  );
}

import { Star, Quote } from "lucide-react";

/**
 * "Customer Feedback" social proof — testimonial cards + a WhatsApp-style chat
 * gallery, cloned in layout from the reference and rendered in the Beyond Lace
 * system.
 *
 * ⚠ PLACEHOLDER CONTENT. The testimonials, chat messages, and review count below
 * are sample/template data for layout only. Replace them with REAL customer
 * reviews, real chat screenshots, and the real review count before this is shown
 * to shoppers — presenting fabricated reviews as genuine is deceptive. Pass real
 * data via props (reviewCount / testimonials / chats) to override the samples.
 */

export interface Testimonial {
  name: string;
  country: string;
  quote: string;
}
export interface ChatMessage {
  from: "them" | "us";
  text: string;
}
export interface ChatThread {
  contact: string;
  messages: ChatMessage[];
}

// --- sample/template data (replace before launch) ---
const SAMPLE_TESTIMONIALS: Testimonial[] = [
  { name: "[ Customer name ]", country: "United States", quote: "Sample testimonial — replace with a real verified customer review. Speaks to quality, no shedding, fast shipping." },
  { name: "[ Customer name ]", country: "United Kingdom", quote: "Sample testimonial — replace with a real verified customer review. Speaks to the hairline and repeat ordering." },
  { name: "[ Customer name ]", country: "France", quote: "Sample testimonial — replace with a real verified customer review. Speaks to service and the finished install." },
];
const SAMPLE_CHATS: ChatThread[] = [
  { contact: "[ Customer ]", messages: [{ from: "them", text: "Sample chat message — swap for a real customer screenshot." }, { from: "us", text: "Thank you! 💛" }, { from: "them", text: "Reordering soon 😍" }] },
  { contact: "[ Customer ]", messages: [{ from: "them", text: "Sample chat message — swap for a real customer screenshot." }, { from: "us", text: "So glad you love it!" }] },
  { contact: "[ Customer ]", messages: [{ from: "them", text: "Sample chat message — swap for a real customer screenshot." }, { from: "us", text: "Enjoy 💛" }, { from: "them", text: "Best hair company 🙌" }] },
  { contact: "[ Customer ]", messages: [{ from: "them", text: "Sample chat message — swap for a real customer screenshot." }, { from: "us", text: "Sending the care card too." }] },
];

function ChatCard({ thread }: { thread: ChatThread }) {
  return (
    <div className="w-64 shrink-0 overflow-hidden rounded-xl border border-white/[0.08] bg-ink/40">
      <div className="flex items-center gap-2 bg-[#1f2c34] px-3 py-2.5">
        <span className="grid size-7 place-items-center rounded-full bg-gold/80 text-[0.6875rem] font-semibold text-ink">BL</span>
        <span className="text-[0.8125rem] text-paper">{thread.contact}</span>
      </div>
      <div className="space-y-2 p-3">
        {thread.messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === "us" ? "justify-end" : "justify-start"}`}>
            <span
              className={`max-w-[85%] rounded-lg px-3 py-1.5 text-[0.75rem] leading-snug ${
                m.from === "us" ? "bg-[#005c4b] text-paper" : "bg-white/[0.08] text-neutral-200"
              }`}
            >
              {m.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CustomerFeedback({
  reviewCount,
  testimonials = SAMPLE_TESTIMONIALS,
  chats = SAMPLE_CHATS,
}: {
  reviewCount?: number;
  testimonials?: Testimonial[];
  chats?: ChatThread[];
}) {
  return (
    <section className="surface-velvet border-t border-white/[0.06] py-24">
      <div className="mx-auto max-w-[1440px] px-[4vw]">
        <div className="text-center">
          <span className="inline-block rounded-full border border-gold/40 px-6 py-2 text-[0.75rem] tracking-[0.16em] text-gold uppercase">
            Customer Feedback
          </span>
          <div className="mt-5 flex items-center justify-center gap-3">
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

        {/* WhatsApp-style chat gallery */}
        <p className="mt-14 mb-4 text-center eyebrow text-neutral-400">Straight from the chats</p>
        <div className="flex gap-4 overflow-x-auto pb-4 [scrollbar-width:thin]">
          {chats.map((c, i) => (
            <ChatCard key={i} thread={c} />
          ))}
        </div>
      </div>
    </section>
  );
}

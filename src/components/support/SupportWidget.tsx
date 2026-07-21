"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Sparkles, ArrowLeft } from "lucide-react";
import { WhatsAppGlyph, InstagramGlyph } from "@/components/brand/SocialIcons";
import { URLS } from "@/lib/contact";

/**
 * Floating support hub. Offers every contact channel with a visible icon
 * (ref: support panel): the AI virtual stylist, WhatsApp, and Instagram. The
 * stylist opens an inline chat backed by /api/chat (Anthropic when keyed,
 * concierge fallback otherwise).
 */

const WHATSAPP_URL = URLS.whatsappPrefilled;
const INSTAGRAM_URL = URLS.instagramDm;

type View = "menu" | "chat";
interface Msg {
  role: "user" | "assistant";
  content: string;
}

export function SupportWidget() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>("menu");
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Welcome to Beyond Lace. I'm your virtual stylist — ask me about textures, lace shades, sizing, or finding your unit. How can I help?",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, view]);

  async function send() {
    const text = input.trim();
    if (!text || sending) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setSending(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.map(({ role, content }) => ({ role, content })) }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        { role: "assistant", content: data.reply ?? "Something went wrong — please try WhatsApp." },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "Connection issue — WhatsApp or Instagram will reach us fastest.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {/* Launcher */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close support" : "Open support"}
        className="fixed right-5 bottom-5 z-[80] flex h-14 w-14 items-center justify-center rounded-full text-ink shadow-2xl transition-transform duration-300 hover:scale-105"
        style={{ background: "var(--grad-gilded)" }}
      >
        {open ? <X size={22} strokeWidth={1.75} /> : <MessageCircle size={22} strokeWidth={1.75} />}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed right-5 bottom-24 z-[80] flex h-[30rem] w-[calc(100vw-2.5rem)] max-w-[23rem] flex-col overflow-hidden rounded-2xl border border-gold/30 bg-ink shadow-2xl">
          {/* Header */}
          <div
            className="flex items-center gap-3 px-5 py-4"
            style={{ background: "var(--grad-velvet)" }}
          >
            {view === "chat" && (
              <button
                onClick={() => setView("menu")}
                aria-label="Back to options"
                className="text-neutral-200 hover:text-gold"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <div className="flex-1">
              <p className="font-[family-name:var(--font-display)] text-lg text-paper">
                {view === "chat" ? "Virtual Stylist" : "How can we help?"}
              </p>
              <p className="text-[0.6875rem] tracking-[0.12em] text-gold uppercase">
                Beyond Lace Support
              </p>
            </div>
          </div>

          {view === "menu" ? (
            <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-5">
              <ChannelButton
                onClick={() => setView("chat")}
                icon={<Sparkles size={20} strokeWidth={1.6} />}
                title="Chat with our stylist"
                sub="Instant answers — textures, shades, sizing"
              />
              <ChannelLink
                href={WHATSAPP_URL}
                icon={<WhatsAppGlyph size={20} />}
                title="WhatsApp"
                sub="Message us directly, reply within the hour"
              />
              <ChannelLink
                href={INSTAGRAM_URL}
                icon={<InstagramGlyph size={20} />}
                title="Instagram"
                sub="DM @beyondlace"
              />
              <p className="mt-auto pt-3 text-center text-[0.6875rem] leading-relaxed text-neutral-400">
                Prefer email? Use the{" "}
                <a href="/support#contact" className="text-gold underline-offset-2 hover:underline">
                  contact form
                </a>
                .
              </p>
            </div>
          ) : (
            <>
              <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[0.875rem] leading-relaxed ${
                      m.role === "user"
                        ? "ml-auto bg-gold text-ink"
                        : "bg-plum-900 text-neutral-200"
                    }`}
                  >
                    {m.content}
                  </div>
                ))}
                {sending && (
                  <div className="max-w-[85%] rounded-2xl bg-plum-900 px-4 py-2.5 text-[0.875rem] text-neutral-400">
                    <span className="inline-flex gap-1">
                      <span className="animate-pulse">●</span>
                      <span className="animate-pulse [animation-delay:0.2s]">●</span>
                      <span className="animate-pulse [animation-delay:0.4s]">●</span>
                    </span>
                  </div>
                )}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
                className="flex items-center gap-2 border-t border-white/10 p-3"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about shades, textures, sizing…"
                  className="flex-1 bg-transparent px-2 text-[0.875rem] text-paper placeholder:text-neutral-400/60 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={sending || !input.trim()}
                  aria-label="Send message"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-ink transition-opacity disabled:opacity-40"
                >
                  <Send size={16} strokeWidth={1.75} />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}

function ChannelButton({
  onClick,
  icon,
  title,
  sub,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  sub: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-xl border border-gold/25 bg-plum-900 p-4 text-left transition-colors hover:border-gold hover:bg-plum-800"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-gold">
        {icon}
      </span>
      <span>
        <span className="block text-[0.9375rem] text-paper">{title}</span>
        <span className="block text-[0.75rem] text-neutral-400">{sub}</span>
      </span>
    </button>
  );
}

function ChannelLink({
  href,
  icon,
  title,
  sub,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  sub: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex w-full items-center gap-4 rounded-xl border border-gold/25 bg-plum-900 p-4 text-left transition-colors hover:border-gold hover:bg-plum-800"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-gold">
        {icon}
      </span>
      <span>
        <span className="block text-[0.9375rem] text-paper">{title}</span>
        <span className="block text-[0.75rem] text-neutral-400">{sub}</span>
      </span>
    </a>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, Sparkles } from "lucide-react";

/**
 * Spin-wheel marketing popup — a right-docked panel that slides in fifteen
 * seconds after the shopper has entered the store (once the channel gate is
 * resolved, so the two never fight for the screen), and slides back out on
 * close. A weighted prize wheel sits on the left; an email + phone capture form
 * with a marketing/data consent gate sits on the right. On submit the wheel
 * spins to the won prize and the lead is posted to /api/email-capture, which
 * stores it in Supabase.
 *
 * Shown at most once per browser until the shopper subscribes (never again) or
 * dismisses (again after a few days). Styled in the brand's plum-and-gold, not
 * the reference's colours — same mechanic, our identity.
 */

const STORAGE_KEY = "bl.spinwheel.v1";
const SHOW_DELAY_MS = 15_000;
const REDISPLAY_DAYS = 3;
const COUNTDOWN_SECONDS = 5 * 60;

interface Prize {
  label: string;
  sub: string;
  code: string;
  weight: number;
}

const PRIZES: Prize[] = [
  { label: "$130 OFF", sub: "no minimum", code: "BL130", weight: 1 },
  { label: "FREE UNIT", sub: "on us", code: "BLUNIT", weight: 0.15 },
  { label: "24% OFF", sub: "coupon", code: "BL24", weight: 3 },
  { label: "$15 GIFT", sub: "gift card", code: "BLGIFT15", weight: 2 },
  { label: "FREE UNIT", sub: "on us", code: "BLUNIT", weight: 0.15 },
  { label: "FREE SHIP", sub: "worldwide", code: "BLSHIP", weight: 3 },
];

const SEG = 360 / PRIZES.length;
const GOLD = "#C9A66B";
const PLUM = "#3B1F35";

function pt(cx: number, cy: number, r: number, deg: number): [number, number] {
  const a = (deg * Math.PI) / 180;
  return [cx + r * Math.sin(a), cy - r * Math.cos(a)];
}

function wedgePath(i: number): string {
  const [sx, sy] = pt(100, 100, 100, i * SEG);
  const [ex, ey] = pt(100, 100, 100, (i + 1) * SEG);
  return `M100 100 L${sx.toFixed(2)} ${sy.toFixed(2)} A100 100 0 0 1 ${ex.toFixed(2)} ${ey.toFixed(2)} Z`;
}

function pickPrizeIndex(): number {
  const total = PRIZES.reduce((s, p) => s + p.weight, 0);
  let r = Math.random() * total;
  for (let i = 0; i < PRIZES.length; i++) {
    r -= PRIZES[i].weight;
    if (r <= 0) return i;
  }
  return PRIZES.length - 1;
}

function fmt(total: number): [string, string, string] {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return [pad(h), pad(m), pad(s)];
}

function Wheel({ rotation }: { rotation: number }) {
  return (
    <div className="relative mx-auto aspect-square w-[min(78vw,320px)] md:w-[340px]">
      {/* Pointer */}
      <div className="absolute top-[-2px] left-1/2 z-[2] -translate-x-1/2">
        <div className="h-0 w-0 border-x-[11px] border-t-[18px] border-x-transparent border-t-gold drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
      </div>

      <svg
        viewBox="0 0 200 200"
        className="h-full w-full drop-shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: "transform 4.4s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <circle cx="100" cy="100" r="100" fill={PLUM} />
        {PRIZES.map((prize, i) => {
          const fill = i % 2 === 0 ? GOLD : PLUM;
          const text = i % 2 === 0 ? "#20121C" : "#F5E6D8";
          const mid = i * SEG + SEG / 2;
          const [lx, ly] = pt(100, 100, 64, mid);
          let rot = mid;
          if (mid > 90 && mid < 270) rot += 180;
          return (
            <g key={i}>
              <path d={wedgePath(i)} fill={fill} stroke="#20121C" strokeWidth="0.6" />
              <g transform={`rotate(${rot} ${lx} ${ly})`}>
                <text
                  x={lx}
                  y={ly - 2}
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="700"
                  fill={text}
                  fontFamily="var(--font-cormorant), serif"
                >
                  {prize.label}
                </text>
                <text
                  x={lx}
                  y={ly + 7}
                  textAnchor="middle"
                  fontSize="4.5"
                  letterSpacing="0.5"
                  fill={text}
                  opacity="0.8"
                >
                  {prize.sub.toUpperCase()}
                </text>
              </g>
            </g>
          );
        })}
        <circle cx="100" cy="100" r="100" fill="none" stroke={GOLD} strokeWidth="2" />
      </svg>

      {/* Hub */}
      <div className="absolute top-1/2 left-1/2 z-[2] grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-gold bg-ink">
        <span className="font-[family-name:var(--font-display)] text-lg text-gold">BL</span>
      </div>
    </div>
  );
}

export function SpinWheelPopup() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [phase, setPhase] = useState<"form" | "spinning" | "won">("form");
  const [won, setWon] = useState<Prize | null>(null);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const [seconds, setSeconds] = useState(COUNTDOWN_SECONDS);
  const rotationRef = useRef(0);

  // Decide whether and when to appear.
  useEffect(() => {
    let raw: { subscribed?: boolean; dismissedAt?: number } = {};
    try {
      raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    } catch {
      /* ignore */
    }
    if (raw.subscribed) return;
    if (raw.dismissedAt && Date.now() - raw.dismissedAt < REDISPLAY_DAYS * 86_400_000) return;

    let delayTimer: ReturnType<typeof setTimeout>;
    const start = () => {
      delayTimer = setTimeout(() => {
        setMounted(true);
        requestAnimationFrame(() => setOpen(true));
      }, SHOW_DELAY_MS);
    };

    // Wait until the compulsory channel gate is resolved this session.
    const confirmed = () => {
      try {
        return sessionStorage.getItem("bl.channel.session") === "1";
      } catch {
        return true;
      }
    };
    if (confirmed()) {
      start();
      return () => clearTimeout(delayTimer);
    }
    const poll = setInterval(() => {
      if (confirmed()) {
        clearInterval(poll);
        start();
      }
    }, 600);
    return () => {
      clearInterval(poll);
      clearTimeout(delayTimer);
    };
  }, []);

  // FOMO countdown, runs while the panel is open on the form step.
  useEffect(() => {
    if (!open || phase !== "form") return;
    const id = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [open, phase]);

  // Lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function persist(state: { subscribed?: boolean; dismissedAt?: number }) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }

  function close() {
    setOpen(false);
    if (phase !== "won") persist({ dismissedAt: Date.now() });
    setTimeout(() => setMounted(false), 480);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (phase !== "form") return;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (!consent) {
      setError("Please tick the box to subscribe and spin.");
      return;
    }
    setError("");

    const index = pickPrizeIndex();
    const prize = PRIZES[index];

    // Spin: land the won segment centre under the top pointer, plus a little
    // in-segment jitter, always rotating forward from the current angle.
    const center = index * SEG + SEG / 2;
    const desired = (((360 - center) % 360) + 360) % 360;
    const jitter = (Math.random() - 0.5) * (SEG - 20);
    const base = rotationRef.current - (rotationRef.current % 360);
    const next = base + 360 * 6 + desired + jitter;
    rotationRef.current = next;
    setRotation(next);
    setPhase("spinning");

    // Fire-and-forget capture; the prize reveal is driven by the CSS transition.
    void fetch("/api/email-capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        phone,
        consentMarketing: consent,
        consentTerms: true,
        prize: `${prize.label} (${prize.code})`,
        source: "spin-wheel-popup",
        pagePath: typeof window !== "undefined" ? window.location.pathname : undefined,
      }),
    }).catch(() => {});

    window.setTimeout(() => {
      setWon(prize);
      setPhase("won");
      persist({ subscribed: true });
    }, 4600);
  }

  function copyCode() {
    if (!won) return;
    navigator.clipboard?.writeText(won.code).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      },
      () => {},
    );
  }

  if (!mounted) return null;
  const [hh, mm, ss] = fmt(seconds);

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-stretch justify-end sm:items-center">
      {/* Scrim */}
      <button
        type="button"
        aria-label="Close offer"
        onClick={close}
        className={`absolute inset-0 bg-ink/50 backdrop-blur-[2px] transition-opacity duration-500 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Win a free unit or big rewards"
        className={`relative flex w-full max-w-[860px] flex-col overflow-y-auto border-l border-gold/30 bg-gradient-to-br from-plum-900 to-ink shadow-[0_20px_80px_-20px_rgba(0,0,0,0.8)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:my-auto sm:h-auto sm:max-h-[94vh] sm:rounded-l-2xl ${
          open ? "translate-x-0" : "translate-x-[105%]"
        }`}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute top-4 right-4 z-[3] grid size-9 place-items-center rounded-full text-neutral-300 transition-colors hover:bg-white/10 hover:text-gold"
        >
          <X size={18} strokeWidth={1.75} />
        </button>

        <div className="flex flex-col items-center gap-8 p-7 md:flex-row md:items-center md:gap-10 md:p-10">
          {/* Left — wheel */}
          <div className="shrink-0">
            <Wheel rotation={rotation} />
          </div>

          {/* Right — form / prize */}
          <div className="w-full text-center md:text-left">
            {phase === "won" && won ? (
              <div>
                <p className="eyebrow mb-3 inline-flex items-center gap-2 text-gold">
                  <Sparkles size={14} strokeWidth={1.75} /> You won
                </p>
                <h2 className="font-[family-name:var(--font-display)] text-[clamp(2rem,5vw,3rem)] leading-tight text-paper">
                  {won.label}
                </h2>
                <p className="mt-2 text-[0.9375rem] text-blush-200/80">
                  {won.sub} — check your inbox, we&apos;ve sent the details.
                </p>
                <div className="mt-6 flex items-center justify-center gap-3 md:justify-start">
                  <span className="border border-dashed border-gold px-5 py-2.5 font-mono text-lg tracking-[0.2em] text-gold">
                    {won.code}
                  </span>
                  <button
                    type="button"
                    onClick={copyCode}
                    className="cta-primary px-5 py-2.5 text-[0.75rem] tracking-[0.12em] uppercase"
                  >
                    {copied ? "Copied" : "Copy code"}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={close}
                  className="mt-6 text-[0.8125rem] tracking-[0.08em] text-neutral-400 uppercase underline-offset-4 hover:text-gold"
                >
                  Continue shopping →
                </button>
              </div>
            ) : (
              <>
                <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.6rem,3.6vw,2.4rem)] leading-tight text-paper">
                  Win a free unit or big rewards
                </h2>
                <p className="mt-2 text-[0.875rem] text-blush-200/80">
                  Top prizes left: 1 · $130 OFF · 3 free units &amp; 5 gift cards
                </p>

                {/* Timer */}
                <div className="mt-5 flex items-center justify-center gap-2 md:justify-start">
                  {[hh, mm, ss].map((block, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="grid min-w-[2.4rem] place-items-center rounded-md border border-white/10 bg-ink px-2 py-1.5 font-[family-name:var(--font-display)] text-xl text-gold tabular-nums">
                        {block}
                      </span>
                      {i < 2 && <span className="text-gold">:</span>}
                    </div>
                  ))}
                  <span className="ml-2 text-[0.6875rem] tracking-[0.1em] text-neutral-400 uppercase">
                    left to claim
                  </span>
                </div>

                <form onSubmit={submit} className="mt-6 space-y-3" noValidate>
                  <input
                    type="email"
                    required
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={phase === "spinning"}
                    className="w-full border border-white/15 bg-white/[0.04] px-4 py-3 text-[0.9375rem] text-paper placeholder:text-neutral-400/70 transition-colors focus:border-gold focus:outline-none"
                  />
                  <input
                    type="tel"
                    placeholder="Phone number (optional)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={phase === "spinning"}
                    className="w-full border border-white/15 bg-white/[0.04] px-4 py-3 text-[0.9375rem] text-paper placeholder:text-neutral-400/70 transition-colors focus:border-gold focus:outline-none"
                  />

                  <label className="flex items-start gap-2.5 text-left">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 size-4 shrink-0 accent-[#C9A66B]"
                    />
                    <span className="text-[0.6875rem] leading-relaxed text-neutral-400">
                      I agree to receive marketing emails and SMS from Beyond Lace. Message and data
                      rates may apply; reply STOP to opt out. I have read the{" "}
                      <a
                        href="/legal/privacy"
                        target="_blank"
                        className="text-gold underline-offset-2 hover:underline"
                      >
                        Privacy Policy
                      </a>{" "}
                      and{" "}
                      <a
                        href="/legal/terms"
                        target="_blank"
                        className="text-gold underline-offset-2 hover:underline"
                      >
                        Terms
                      </a>
                      .
                    </span>
                  </label>

                  {error && (
                    <p role="alert" className="text-left text-[0.75rem] text-rose-400">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={phase === "spinning"}
                    className="cta-primary w-full px-8 py-3.5 text-[0.8125rem] tracking-[0.14em] uppercase disabled:cursor-wait disabled:opacity-70"
                  >
                    {phase === "spinning" ? "Spinning…" : "I agree to subscribe & spin"}
                  </button>
                </form>

                <button
                  type="button"
                  onClick={close}
                  className="mt-4 text-[0.6875rem] tracking-[0.08em] text-neutral-500 uppercase underline-offset-4 hover:text-neutral-300"
                >
                  No thanks, I&apos;ll pay full price
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

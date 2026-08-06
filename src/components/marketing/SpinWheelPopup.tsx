"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, Sparkles, Minus, Gift } from "lucide-react";

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

/** Light input styling — dark text on a solid field, so the value is always
 * legible (a dark field turned white by browser autofill hid it before). */
const FIELD =
  "w-full rounded-md border border-black/10 bg-white px-4 py-3 text-[0.9375rem] text-ink placeholder:text-neutral-500 transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40 disabled:opacity-60";

interface Country {
  iso: string;
  name: string;
  dial: string;
  flag: string;
}

/** Dial-code list — key markets first, then broadly alphabetical. */
const COUNTRIES: Country[] = [
  { iso: "US", name: "United States", dial: "+1", flag: "🇺🇸" },
  { iso: "GB", name: "United Kingdom", dial: "+44", flag: "🇬🇧" },
  { iso: "CA", name: "Canada", dial: "+1", flag: "🇨🇦" },
  { iso: "NG", name: "Nigeria", dial: "+234", flag: "🇳🇬" },
  { iso: "ZA", name: "South Africa", dial: "+27", flag: "🇿🇦" },
  { iso: "GH", name: "Ghana", dial: "+233", flag: "🇬🇭" },
  { iso: "CM", name: "Cameroon", dial: "+237", flag: "🇨🇲" },
  { iso: "KE", name: "Kenya", dial: "+254", flag: "🇰🇪" },
  { iso: "DE", name: "Germany", dial: "+49", flag: "🇩🇪" },
  { iso: "FR", name: "France", dial: "+33", flag: "🇫🇷" },
  { iso: "AU", name: "Australia", dial: "+61", flag: "🇦🇺" },
  { iso: "IE", name: "Ireland", dial: "+353", flag: "🇮🇪" },
  { iso: "NL", name: "Netherlands", dial: "+31", flag: "🇳🇱" },
  { iso: "ES", name: "Spain", dial: "+34", flag: "🇪🇸" },
  { iso: "IT", name: "Italy", dial: "+39", flag: "🇮🇹" },
  { iso: "BE", name: "Belgium", dial: "+32", flag: "🇧🇪" },
  { iso: "PT", name: "Portugal", dial: "+351", flag: "🇵🇹" },
  { iso: "SE", name: "Sweden", dial: "+46", flag: "🇸🇪" },
  { iso: "CH", name: "Switzerland", dial: "+41", flag: "🇨🇭" },
  { iso: "BR", name: "Brazil", dial: "+55", flag: "🇧🇷" },
  { iso: "JM", name: "Jamaica", dial: "+1876", flag: "🇯🇲" },
  { iso: "TT", name: "Trinidad & Tobago", dial: "+1868", flag: "🇹🇹" },
  { iso: "IN", name: "India", dial: "+91", flag: "🇮🇳" },
  { iso: "AE", name: "United Arab Emirates", dial: "+971", flag: "🇦🇪" },
  { iso: "SA", name: "Saudi Arabia", dial: "+966", flag: "🇸🇦" },
  { iso: "SG", name: "Singapore", dial: "+65", flag: "🇸🇬" },
  { iso: "MY", name: "Malaysia", dial: "+60", flag: "🇲🇾" },
  { iso: "NZ", name: "New Zealand", dial: "+64", flag: "🇳🇿" },
  { iso: "MX", name: "Mexico", dial: "+52", flag: "🇲🇽" },
  { iso: "EG", name: "Egypt", dial: "+20", flag: "🇪🇬" },
  { iso: "UG", name: "Uganda", dial: "+256", flag: "🇺🇬" },
  { iso: "TZ", name: "Tanzania", dial: "+255", flag: "🇹🇿" },
  { iso: "CI", name: "Côte d’Ivoire", dial: "+225", flag: "🇨🇮" },
  { iso: "SN", name: "Senegal", dial: "+221", flag: "🇸🇳" },
];

const dialFor = (iso: string) => COUNTRIES.find((c) => c.iso === iso)?.dial ?? "+1";

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
  const [country, setCountry] = useState("US");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const [seconds, setSeconds] = useState(COUNTDOWN_SECONDS);
  const rotationRef = useRef(0);

  // The docker tab is available from the start (unless the shopper already won),
  // so there is always a visible handle on the right edge. The full panel
  // auto-opens once — after the channel gate resolves and a short delay — unless
  // it was recently dismissed, in which case only the tab remains.
  useEffect(() => {
    let raw: { subscribed?: boolean; dismissedAt?: number } = {};
    try {
      raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    } catch {
      /* ignore */
    }
    if (raw.subscribed) return; // already claimed — nothing to show
    setMounted(true); // docker visible immediately

    // Recently dismissed → keep the tab, but don't auto-pop the panel.
    if (raw.dismissedAt && Date.now() - raw.dismissedAt < REDISPLAY_DAYS * 86_400_000) return;

    // Wait until the compulsory channel gate is resolved this session.
    const confirmed = () => {
      try {
        return sessionStorage.getItem("bl.channel.session") === "1";
      } catch {
        return true;
      }
    };
    let delayTimer: ReturnType<typeof setTimeout> | undefined;
    let poll: ReturnType<typeof setInterval> | undefined;
    const start = () => {
      delayTimer = setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    };
    if (confirmed()) start();
    else
      poll = setInterval(() => {
        if (confirmed()) {
          clearInterval(poll);
          start();
        }
      }, 600);
    return () => {
      clearTimeout(delayTimer);
      clearInterval(poll);
    };
  }, []);

  // FOMO countdown, runs while the panel is open on the form step.
  useEffect(() => {
    if (!open || phase !== "form") return;
    const id = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [open, phase]);

  // Non-blocking: the panel docks to the side and never locks page scroll, so a
  // shopper can keep browsing and come back to fill it in and submit later.
  // Escape just tucks it away to the edge tab rather than dismissing it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function persist(state: { subscribed?: boolean; dismissedAt?: number }) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }

  // Collapse the panel back to the edge tab. On a win we're done, so the tab is
  // retired too; otherwise the tab persists and auto-open is suppressed for a
  // few days, but the shopper can reopen from the tab any time.
  function close() {
    setOpen(false);
    if (phase === "won") {
      persist({ subscribed: true });
      setTimeout(() => setMounted(false), 480);
    } else {
      persist({ dismissedAt: Date.now() });
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (phase !== "form") return;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 6) {
      setError("Enter a valid phone number.");
      return;
    }
    if (!consent) {
      setError("Please tick the box to subscribe and spin.");
      return;
    }
    setError("");

    const dial = dialFor(country);
    const fullPhone = `${dial} ${phone.trim()}`;

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
        phone: fullPhone,
        phoneCountry: dial,
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
    // Non-blocking wrapper: pointer-events pass through to the page; only the
    // panel and the reopen tab are interactive.
    <div className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-end">
      {/* Persistent docker — always on the right edge whenever the panel is
          closed, so the offer is one click away. */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open offer"
        className={`pointer-events-auto fixed top-1/2 right-0 z-[91] flex -translate-y-1/2 rotate-180 items-center gap-2 rounded-l-xl border border-r-0 border-gold/40 bg-gradient-to-br from-plum-900 to-ink px-2.5 py-4 text-gold shadow-[0_10px_40px_-12px_rgba(0,0,0,0.7)] [writing-mode:vertical-rl] transition-transform duration-500 ${
          open ? "translate-x-[110%]" : "translate-x-0"
        }`}
      >
        <Gift size={15} strokeWidth={1.75} className="rotate-180" />
        <span className="text-[0.6875rem] font-semibold tracking-[0.16em] uppercase">
          Spin &amp; Save
        </span>
      </button>

      {/* Panel — docked a couple pixels from the right edge, never full-bleed */}
      <div
        role="dialog"
        aria-label="Win a free unit or big rewards"
        className={`pointer-events-auto relative mr-2 flex max-h-[94vh] w-[min(96vw,860px)] flex-col overflow-y-auto rounded-2xl border border-gold/30 bg-gradient-to-br from-plum-900 to-ink shadow-[0_20px_80px_-20px_rgba(0,0,0,0.85)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? "translate-x-0" : "translate-x-[calc(100%+1rem)]"
        }`}
      >
        <div className="absolute top-3 right-3 z-[3] flex gap-1">
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Minimize — finish later"
            className="grid size-9 place-items-center rounded-full text-neutral-300 transition-colors hover:bg-white/10 hover:text-gold"
          >
            <Minus size={18} strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="grid size-9 place-items-center rounded-full text-neutral-300 transition-colors hover:bg-white/10 hover:text-gold"
          >
            <X size={18} strokeWidth={1.75} />
          </button>
        </div>

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
                    placeholder="Email address *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={phase === "spinning"}
                    className={FIELD}
                  />

                  {/* Phone — country dial-code dropdown + number, both required */}
                  <div className="flex gap-2">
                    <select
                      aria-label="Country dialing code"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      disabled={phase === "spinning"}
                      className="w-[7.25rem] shrink-0 rounded-md border border-black/10 bg-white px-2 py-3 text-[0.9375rem] text-ink transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40 disabled:opacity-60"
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.iso} value={c.iso}>
                          {c.flag} {c.dial}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      required
                      inputMode="tel"
                      placeholder="Phone number *"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={phase === "spinning"}
                      className={`${FIELD} flex-1`}
                    />
                  </div>

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

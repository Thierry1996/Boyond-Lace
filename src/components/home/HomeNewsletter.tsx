"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Mail } from "lucide-react";

/**
 * Home newsletter band — a centred subscribe block dropped after the blog
 * strip. First name + email, posting to /api/newsletter (Supabase marketing
 * table) with source="home". Its own soft-animated plum ground sets it apart
 * from the sections around it; dark-island keeps it legible in both modes.
 */
export function HomeNewsletter() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    if (firstName.trim().length < 2) return setError("Tell us your first name.");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return setError("Enter a valid email.");
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          email: email.trim(),
          prefEmail: true,
          source: "home",
          pagePath: "/",
        }),
      });
      if (res.ok) setDone(true);
      else setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section
      aria-label="Newsletter"
      className="dark-island relative overflow-hidden border-t border-white/[0.06] bg-gradient-to-br from-plum-900 via-[#2a1122] to-ink py-20 sm:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 h-72 w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-2xl px-[5vw] text-center">
        <Mail size={30} className="mx-auto mb-5 text-gold" strokeWidth={1.5} />
        <p className="eyebrow text-gold">Stay in the loop</p>
        <h2 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(1.9rem,4vw,3rem)] text-paper">
          The edit, in your inbox.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-[0.9375rem] leading-relaxed text-blush-200/75">
          New drops and restocks, care guides, and members-only offers — the good stuff, never the
          spam. Unsubscribe anytime.
        </p>

        {done ? (
          <p className="mt-8 flex items-center justify-center gap-2 text-[0.9375rem] text-blush-200">
            <Check size={16} strokeWidth={2} className="text-gold" />
            You&rsquo;re subscribed — watch your inbox for the next drop.
          </p>
        ) : (
          <>
            <form
              onSubmit={submit}
              className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row"
            >
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                aria-label="First name"
                className="w-full rounded-md border border-white/15 bg-white/10 px-4 py-3 text-[0.9375rem] text-paper placeholder:text-blush-200/40 focus:border-gold focus:outline-none sm:w-40"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                aria-label="Email address"
                required
                className="w-full flex-1 rounded-md border border-white/15 bg-white/10 px-4 py-3 text-[0.9375rem] text-paper placeholder:text-blush-200/40 focus:border-gold focus:outline-none"
              />
              <button
                type="submit"
                disabled={busy}
                className="cta-primary inline-flex items-center justify-center gap-2 px-7 py-3 text-[0.75rem] tracking-[0.14em] uppercase disabled:opacity-60"
              >
                {busy ? "Joining…" : "Subscribe"}
                <ArrowRight size={14} strokeWidth={1.75} />
              </button>
            </form>
            {error && <p className="mt-3 text-[0.75rem] text-rose-400">{error}</p>}
            <p className="mt-4 text-[0.6875rem] text-blush-200/50">
              By subscribing you agree to our{" "}
              <Link
                href="/legal/privacy"
                className="text-gold/80 underline-offset-2 hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </>
        )}
      </div>
    </section>
  );
}

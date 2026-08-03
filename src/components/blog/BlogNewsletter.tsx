"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

/**
 * Compact end-of-article newsletter band. First name + email subscribe, posting
 * to /api/newsletter (Supabase marketing table) with source="blog".
 */
export function BlogNewsletter({ slug }: { slug: string }) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy || !email.trim() || firstName.trim().length < 2) return;
    setBusy(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          email: email.trim(),
          prefEmail: true,
          source: "blog",
          pagePath: `/blog/${slug}`,
        }),
      });
      if (res.ok) setDone(true);
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <p className="flex items-center justify-center gap-2 text-[0.9375rem] text-blush-200">
        <Check size={16} strokeWidth={2} className="text-gold" />
        You’re subscribed — watch your inbox for the next drop.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="mx-auto flex max-w-xl flex-col gap-3 sm:flex-row">
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
  );
}

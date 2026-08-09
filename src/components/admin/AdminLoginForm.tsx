"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { signIn } from "@/lib/auth-client";

/**
 * Dedicated admin control-centre login — separate from the shopper sign-in.
 * Authenticates against Better Auth; the `/admin` gate then confirms the ADMIN
 * role (a signed-in non-admin gets a 404, never the console). On success it
 * lands on the console overview.
 */
export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const res = await signIn.email({ email: email.trim(), password });
      if (res.error) {
        setError(res.error.message ?? "Sign-in failed. Check your credentials.");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <span className="mx-auto mb-5 grid size-12 place-items-center rounded-full border border-gold/40 bg-gold/[0.06]">
          <ShieldCheck size={22} className="text-gold" strokeWidth={1.6} />
        </span>
        <p className="eyebrow text-gold">Beyond Lace · Control Centre</p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-paper">
          Admin sign-in.
        </h1>
        <p className="mt-2 text-[0.8125rem] text-neutral-400">
          Restricted to assigned account managers. Staff access only.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-3" noValidate>
        <label className="block">
          <span className="mb-1.5 block text-[0.6875rem] font-semibold tracking-[0.1em] text-neutral-400 uppercase">
            Work email
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
            placeholder="you@beyondlace.com"
            className="w-full rounded-md border border-white/15 bg-white/[0.04] px-4 py-3 text-[0.9375rem] text-paper placeholder:text-neutral-500 focus:border-gold focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[0.6875rem] font-semibold tracking-[0.1em] text-neutral-400 uppercase">
            Password
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            placeholder="••••••••"
            className="w-full rounded-md border border-white/15 bg-white/[0.04] px-4 py-3 text-[0.9375rem] text-paper placeholder:text-neutral-500 focus:border-gold focus:outline-none"
          />
        </label>

        {error && <p className="text-[0.8125rem] text-rose-400">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-md bg-gold px-8 py-3.5 text-[0.75rem] font-semibold tracking-[0.14em] text-ink uppercase transition-transform duration-300 hover:-translate-y-0.5 disabled:opacity-60"
        >
          {busy ? "Signing in…" : "Enter control centre"}
          <ArrowRight size={15} strokeWidth={2} />
        </button>
      </form>

      <p className="mt-8 text-center text-[0.6875rem] text-neutral-500">
        Access is granted by a system administrator. Not staff?{" "}
        <a href="/" className="text-gold/80 underline-offset-2 hover:underline">
          Return to the store
        </a>
        .
      </p>
    </div>
  );
}

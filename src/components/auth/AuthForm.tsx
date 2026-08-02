"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, signUp } from "@/lib/auth-client";

/**
 * Email + password auth form for both sign-in and sign-up, on the Better Auth
 * client. Light fields keep the value legible (typed and password-manager
 * autofilled). On success it lands on the post-auth redirect (?redirect=…) or
 * the account page.
 */
export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/account";
  const isSignUp = mode === "sign-up";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = isSignUp
      ? await signUp.email({ email, password, name })
      : await signIn.email({ email, password });
    setLoading(false);
    if (res.error) {
      setError(res.error.message ?? "Something went wrong. Please try again.");
      return;
    }
    router.push(redirect);
    router.refresh();
  }

  const field =
    "w-full rounded-md border border-black/10 bg-white px-4 py-3 text-[0.9375rem] text-ink placeholder:text-neutral-500 transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40";

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="text-center">
        <p className="eyebrow mb-3 text-gold">{isSignUp ? "Create account" : "Welcome back"}</p>
        <h1 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,4vw,2.5rem)] leading-tight text-paper">
          {isSignUp ? "Join Beyond Lace" : "Sign in to Beyond Lace"}
        </h1>
      </div>

      <form onSubmit={submit} className="mt-8 space-y-3" noValidate>
        {isSignUp && (
          <input
            type="text"
            autoComplete="name"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={field}
          />
        )}
        <input
          type="email"
          required
          autoComplete="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={field}
        />
        <input
          type="password"
          required
          autoComplete={isSignUp ? "new-password" : "current-password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={field}
        />

        {error && (
          <p role="alert" className="text-[0.8125rem] text-rose-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="cta-primary w-full px-8 py-3.5 text-[0.8125rem] tracking-[0.14em] uppercase disabled:cursor-wait disabled:opacity-70"
        >
          {loading ? "One moment…" : isSignUp ? "Create account" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-[0.8125rem] text-neutral-400">
        {isSignUp ? (
          <>
            Already have an account?{" "}
            <Link href="/sign-in" className="text-gold underline-offset-4 hover:underline">
              Sign in
            </Link>
          </>
        ) : (
          <>
            New to Beyond Lace?{" "}
            <Link href="/sign-up" className="text-gold underline-offset-4 hover:underline">
              Create an account
            </Link>
          </>
        )}
      </p>

      <p className="mt-8 text-center text-[0.6875rem] leading-relaxed text-neutral-500">
        By continuing you agree to our{" "}
        <Link href="/legal/terms" className="text-gold underline-offset-2 hover:underline">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/legal/privacy" className="text-gold underline-offset-2 hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}

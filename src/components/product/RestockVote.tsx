"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, BellRing, Check } from "lucide-react";

/**
 * "Vote to restock" — shown in place of the buy action when a unit is out of
 * stock, on both the retail and wholesale channels. A shopper picks the length
 * they want back and leaves an email or phone; each submission is a demand
 * signal persisted via /api/restock-vote for marketing and restock decisions.
 *
 * Cloned from the reference feature (trigger button → modal with length picker,
 * Email/SMS toggle, and a notify action), restyled into the Beyond Lace system.
 */
export function RestockVote({
  productSlug,
  productTitle,
  channel = "RETAIL",
  lengths = [],
}: {
  productSlug: string;
  productTitle: string;
  channel?: "RETAIL" | "WHOLESALE";
  lengths?: string[];
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [variant, setVariant] = useState(lengths[0] ?? "");
  const [contactType, setContactType] = useState<"EMAIL" | "SMS">("EMAIL");
  const [contact, setContact] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/restock-vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productSlug, productTitle, channel, variant, contactType, contact }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data?.errors?.contact?.[0] ?? data?.error ?? "Something went wrong");
      setMessage(data.message ?? "You're on the list.");
      setState("done");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Something went wrong");
      setState("error");
    }
  }

  return (
    <>
      {/* Trigger — replaces the buy action when out of stock */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2.5 bg-plum-700 px-8 py-4 text-[0.8125rem] tracking-[0.14em] text-paper uppercase transition-colors duration-300 hover:bg-gold hover:text-ink"
      >
        <BellRing size={16} strokeWidth={1.75} />
        Vote to restock
      </button>

      {mounted &&
        open &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Vote to restock"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/85 p-[5vw] backdrop-blur-sm"
            style={{ animation: "blFade 300ms cubic-bezier(0.16,1,0.3,1)" }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="dark-island relative w-full max-w-md overflow-hidden rounded-2xl border border-gold/25 bg-neutral-900 p-8"
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="absolute top-4 right-4 grid size-8 place-items-center rounded-full text-neutral-400 transition-colors hover:text-gold"
              >
                <X size={18} strokeWidth={1.75} />
              </button>

              {state === "done" ? (
                <div className="py-6 text-center">
                  <span className="mx-auto mb-5 grid size-14 place-items-center rounded-full bg-gold text-ink">
                    <Check size={26} strokeWidth={2} />
                  </span>
                  <h2 className="font-[family-name:var(--font-display)] text-2xl text-paper">
                    Your vote is in.
                  </h2>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-neutral-400">{message}</p>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="cta-primary mt-7 w-full px-8 py-3.5 text-[0.8125rem] tracking-[0.14em] uppercase"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <p className="eyebrow text-gold">Vote to restock</p>
                  <p className="mt-3 text-[0.875rem] leading-relaxed text-neutral-400">
                    We&apos;ll notify you the moment this unit is available again — and your vote
                    tells us to bring it back sooner.
                  </p>

                  <div className="my-6 h-px bg-white/[0.08]" />

                  <p className="text-[0.9375rem] leading-snug text-paper">{productTitle}</p>

                  <form onSubmit={submit} className="mt-6 space-y-5">
                    {lengths.length > 0 && (
                      <label className="block">
                        <span className="eyebrow mb-2 block">Length</span>
                        <select
                          value={variant}
                          onChange={(e) => setVariant(e.target.value)}
                          className="w-full border border-white/15 bg-neutral-900 px-4 py-3 text-[0.9375rem] text-paper transition-colors focus:border-gold focus:outline-none"
                        >
                          {lengths.map((l) => (
                            <option key={l} value={l} className="bg-neutral-900">
                              {l}
                            </option>
                          ))}
                        </select>
                      </label>
                    )}

                    {/* Email / SMS toggle */}
                    <div className="grid grid-cols-2 gap-0 border border-white/15 p-1">
                      {(["EMAIL", "SMS"] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setContactType(t)}
                          className={`py-2.5 text-[0.8125rem] tracking-[0.08em] uppercase transition-colors ${
                            contactType === t
                              ? "bg-gold text-ink"
                              : "text-neutral-400 hover:text-paper"
                          }`}
                        >
                          {t === "EMAIL" ? "Email" : "SMS"}
                        </button>
                      ))}
                    </div>

                    <input
                      type={contactType === "EMAIL" ? "email" : "tel"}
                      inputMode={contactType === "EMAIL" ? "email" : "tel"}
                      required
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder={contactType === "EMAIL" ? "Email address" : "Phone number"}
                      className="w-full border border-white/15 bg-transparent px-4 py-3 text-[0.9375rem] text-paper placeholder:text-neutral-400/60 transition-colors focus:border-gold focus:outline-none"
                    />

                    {state === "error" && (
                      <p className="text-[0.8125rem] text-red-400">{message}</p>
                    )}

                    <button
                      type="submit"
                      disabled={state === "loading"}
                      className="cta-primary w-full px-8 py-4 text-[0.8125rem] tracking-[0.14em] uppercase disabled:opacity-60"
                    >
                      {state === "loading" ? "Submitting…" : "Notify me"}
                    </button>
                  </form>

                  <p className="mt-5 text-center text-[0.75rem] text-neutral-400">
                    We respect your privacy and never share your details.
                  </p>
                </>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { formatPrice, type Product } from "@/lib/commerce";
import { ProductImage } from "@/components/ui/ProductImage";
import { Field, SubmitButton, inputClass } from "@/components/forms/fields";

/**
 * "Find Your Unit" quiz — zero-party data capture (Pillar 4) + heuristic
 * recommendation. The scoring upgrades to Claude-driven recommendations in the
 * AI phase; the answer capture contract stays identical.
 */

const QUESTIONS = [
  {
    key: "goal",
    prompt: "What is this unit actually for?",
    options: [
      {
        value: "everyday",
        label: "Everyday ease",
        note: "Out the door in minutes, polished all day",
      },
      {
        value: "occasion",
        label: "A moment that matters",
        note: "Wedding, shoot, the photographs that outlive the day",
      },
      {
        value: "restoration",
        label: "Restoration",
        note: "Post-treatment, sensitive scalp, or simply getting back to yourself",
      },
      { value: "trend", label: "The new silhouette", note: "Fashion-forward, current, wearable" },
    ],
  },
  {
    key: "texture",
    prompt: "Which texture reads as you?",
    options: [
      { value: "straight", label: "Straight" },
      { value: "body-wave", label: "Body wave" },
      { value: "deep-wave", label: "Deep wave" },
      { value: "curly", label: "Coily / curly" },
      { value: "kinky-straight", label: "Kinky straight" },
    ],
  },
  {
    key: "experience",
    prompt: "How comfortable are you with lace?",
    options: [
      { value: "beginner", label: "New to this", note: "Glueless, pre-cut, forgiving" },
      { value: "some", label: "I can melt a frontal", note: "Comfortable with adhesive" },
      { value: "pro", label: "Full-lace fluent", note: "Give me the parting freedom" },
    ],
  },
  {
    key: "density",
    prompt: "How much hair do you want it to be?",
    options: [
      { value: "natural", label: "Believably mine", note: "130–150% — soft, everyday" },
      { value: "editorial", label: "Editorial", note: "180% — camera-ready" },
      { value: "maximum", label: "Full glamour", note: "200% — the entrance" },
    ],
  },
  {
    key: "budget",
    prompt: "Where does the budget sit?",
    options: [
      { value: "under600", label: "Under $600" },
      { value: "600-900", label: "$600 – $900" },
      { value: "900plus", label: "$900 and beyond" },
    ],
  },
] as const;

type AnswerKey = (typeof QUESTIONS)[number]["key"];

function scoreProduct(p: Product, a: Record<string, string>): number {
  if (p.price === 0 || p.line === "care" || p.line === "try-on") return -1;
  let s = p.rating;

  if (a.texture && p.texture === a.texture) s += 5;
  if (a.experience === "beginner" && p.laceType === "glueless") s += 4;
  if (a.experience === "pro" && p.laceType === "hd-swiss-full") s += 3;
  if (a.goal === "restoration" && (p.line === "silk" || p.avatar === "medical")) s += 6;
  if (a.goal === "trend" && p.avatar === "editorial") s += 4;
  if (a.goal === "occasion" && (p.laceType === "hd-swiss-13x6" || p.laceType === "hd-swiss-full"))
    s += 3;
  if (a.goal === "everyday" && p.laceType === "glueless") s += 4;

  const d = parseInt(p.density ?? "0", 10);
  if (a.density === "natural" && d > 0 && d <= 150) s += 3;
  if (a.density === "editorial" && d === 180) s += 3;
  if (a.density === "maximum" && d >= 200) s += 3;

  if (a.budget === "under600" && p.price < 60000) s += 3;
  if (a.budget === "600-900" && p.price >= 60000 && p.price <= 90000) s += 3;
  if (a.budget === "900plus" && p.price > 90000) s += 3;
  if (a.budget === "under600" && p.price > 90000) s -= 3;

  return s;
}

const leadFormSchema = z.object({
  email: z.string().email("A valid email is required"),
  consent: z
    .boolean()
    .refine((v) => v, { message: "Consent is required to send your match sheet" }),
});
type LeadForm = z.infer<typeof leadFormSchema>;

export function QuizFlow() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [leadDone, setLeadDone] = useState(false);
  const finished = step >= QUESTIONS.length;

  const { data: products } = useQuery({
    queryKey: ["quiz-products"],
    queryFn: async (): Promise<Product[]> => {
      const res = await fetch("/api/products?limit=50");
      const json = await res.json();
      return json.products;
    },
    enabled: finished,
  });

  const matches = useMemo(() => {
    if (!products) return [];
    return products
      .map((p) => ({ p, s: scoreProduct(p, answers) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 3)
      .map((x) => x.p);
  }, [products, answers]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LeadForm>({ resolver: zodResolver(leadFormSchema) });

  function answer(key: AnswerKey, value: string) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setStep((s) => s + 1);
  }

  if (finished) {
    return (
      <div>
        <p className="eyebrow mb-4 text-gold">Your matches</p>
        <h2 className="text-[clamp(1.75rem,4vw,3rem)] text-paper">Three units. Ranked for you.</h2>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {matches.map((p, i) => (
            <Link key={p.id} href={`/product/${p.slug}`} className="group block">
              <div className="relative">
                <ProductImage src={p.images[0].src} alt={p.images[0].alt} />
                <span className="absolute top-4 left-4 border border-gold/40 bg-ink/70 px-2.5 py-1 text-[0.625rem] tracking-[0.14em] text-gold uppercase backdrop-blur-sm">
                  {i === 0 ? "Best match" : `Match ${i + 1}`}
                </span>
              </div>
              <h3 className="mt-4 text-lg text-paper group-hover:text-blush-300">{p.title}</h3>
              <p className="mt-1 text-[0.8125rem] text-neutral-400">{p.tagline}</p>
              <p className="mt-2 text-[0.9375rem] text-paper tabular-nums">
                {formatPrice(p.price, p.currency)}
              </p>
            </Link>
          ))}
          {matches.length === 0 && (
            <p className="text-neutral-400 md:col-span-3">Loading your matches…</p>
          )}
        </div>

        <div className="mt-16 max-w-lg border border-white/[0.07] p-8">
          {leadDone ? (
            <p role="status" className="text-[0.9375rem] text-neutral-200">
              <span className="text-gold">Sent.</span> Your match sheet — with the shade guidance
              for each unit — is on its way.
            </p>
          ) : (
            <form
              onSubmit={handleSubmit(async (data) => {
                const res = await fetch("/api/quiz-lead", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email: data.email, consent: true, answers }),
                });
                if (res.ok) setLeadDone(true);
              })}
              noValidate
            >
              <p className="eyebrow mb-2 text-gold">Keep your results</p>
              <p className="mb-5 text-[0.875rem] leading-relaxed text-neutral-400">
                We&apos;ll email your match sheet with per-unit shade guidance. No list-blasting —
                unsubscribe is one click and it works.
              </p>
              <div className="flex flex-col gap-4">
                <Field label="Email" error={errors.email?.message}>
                  <input type="email" className={inputClass} {...register("email")} />
                </Field>
                <label className="flex items-start gap-3 text-[0.8125rem] text-neutral-400">
                  <input
                    type="checkbox"
                    className="mt-0.5 accent-[#C9A66B]"
                    {...register("consent")}
                  />
                  I agree to receive my match sheet and occasional Beyond Lace email.
                </label>
                {errors.consent && (
                  <p role="alert" className="text-[0.75rem] text-rose-400">
                    {errors.consent.message}
                  </p>
                )}
                <SubmitButton pending={isSubmitting}>Send my match sheet</SubmitButton>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  const q = QUESTIONS[step];
  return (
    <div>
      <div className="mb-10 flex items-center gap-3">
        {QUESTIONS.map((_, i) => (
          <span
            key={i}
            className={`h-px flex-1 transition-colors duration-500 ${i <= step ? "bg-gold" : "bg-white/10"}`}
          />
        ))}
        <span className="eyebrow tabular-nums">
          {step + 1}/{QUESTIONS.length}
        </span>
      </div>

      {/* Keyed remount gives the entry animation; no exit dependency — an
          AnimatePresence exit that fails to complete freezes the whole flow. */}
      <motion.div
        key={q.key}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="text-[clamp(1.75rem,4vw,3rem)] text-paper">{q.prompt}</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {q.options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => answer(q.key, opt.value)}
              className="group border border-white/15 p-6 text-left transition-colors duration-300 hover:border-gold"
            >
              <span className="block text-[1.0625rem] text-paper group-hover:text-gold">
                {opt.label}
              </span>
              {"note" in opt && opt.note && (
                <span className="mt-1.5 block text-[0.8125rem] text-neutral-400">{opt.note}</span>
              )}
            </button>
          ))}
        </div>
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="mt-8 text-[0.75rem] tracking-[0.1em] text-neutral-400 uppercase hover:text-paper"
          >
            ← Back
          </button>
        )}
      </motion.div>
    </div>
  );
}

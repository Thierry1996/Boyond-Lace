"use client";

import { useState } from "react";

/**
 * Lightweight "find your platform" quiz. Each answer nudges a score toward
 * TikTok or Instagram; once every question is answered it reveals a pick. No
 * network — purely a client-side engagement widget.
 */
export function PlatformQuiz({ questions }: { questions: { q: string; options: string[] }[] }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const answered = Object.keys(answers).length;
  const done = answered === questions.length;

  // First option leans TikTok (video-first), last leans Instagram (considered).
  const tiktokLean = Object.entries(answers).reduce(
    (acc, [, opt]) => acc + (opt === 0 ? 1 : opt === 1 ? -1 : 0),
    0,
  );
  const pick = tiktokLean >= 0 ? "TikTok Shop" : "Instagram Shop";

  return (
    <div className="space-y-5">
      {questions.map((question, qi) => (
        <div
          key={question.q}
          className="overflow-hidden rounded-2xl bg-gradient-to-r from-plum-800 to-plum-600"
        >
          <p className="px-6 pt-5 pb-3 text-[0.9375rem] font-semibold text-white">{question.q}</p>
          <div className="space-y-2 px-4 pb-4">
            {question.options.map((opt, oi) => {
              const selected = answers[qi] === oi;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                  className={`block w-full rounded-lg px-4 py-3 text-left text-[0.875rem] transition-all duration-200 ${
                    selected
                      ? "bg-white font-medium text-plum-900"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {done && (
        <div className="rounded-2xl border border-plum-600/30 bg-white/70 p-6 text-center">
          <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-plum-600 uppercase">
            Your recommended platform
          </p>
          <p className="mt-2 font-[family-name:var(--font-display)] text-2xl text-plum-900">
            {pick}
          </p>
          <p className="mx-auto mt-2 max-w-md text-[0.875rem] leading-relaxed text-plum-900/65">
            Start here, master it, then add the other platform once you’re consistent. Beyond Lace
            supports selling on both.
          </p>
        </div>
      )}
    </div>
  );
}

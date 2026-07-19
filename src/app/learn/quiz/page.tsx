import type { Metadata } from "next";
import { QuizFlow } from "@/components/quiz/QuizFlow";

export const metadata: Metadata = {
  title: "Find Your Unit — 90-Second Quiz",
  description:
    "Five questions, three ranked matches from the Beyond Lace human hair wig collection, plus a shade-guidance match sheet by email.",
};

export default function QuizPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-[4vw] py-20">
      <div className="flex items-center justify-between border-t border-white/[0.07] pt-4">
        <span className="eyebrow">Find your unit</span>
        <span className="eyebrow hidden md:block">Five questions</span>
        <span className="eyebrow">90 seconds</span>
      </div>
      <div className="mt-16">
        <QuizFlow />
      </div>
    </div>
  );
}

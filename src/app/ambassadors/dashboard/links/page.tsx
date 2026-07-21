import type { Metadata } from "next";
import { AuthGate } from "@/components/ambassador/AuthGate";
import { AffiliateLinkBuilder } from "@/components/ambassador/AffiliateLinkBuilder";

export const metadata: Metadata = { title: "Affiliate Links" };

export default function LinksPage() {
  return (
    <AuthGate>
      <p className="eyebrow mb-2 text-gold">Tracking</p>
      <h1 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,3.5vw,2.5rem)] text-paper">
        Affiliate links.
      </h1>
      <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-neutral-400">
        Every link carries your referral code. Attribution is cookie-based for 30 days, so a click
        today still pays you when they buy three weeks from now.
      </p>

      <div className="mt-10">
        <AffiliateLinkBuilder />
      </div>
    </AuthGate>
  );
}

import type { Metadata } from "next";
import { AuthGate } from "@/components/ambassador/AuthGate";
import { CampaignLogger } from "@/components/ambassador/CampaignLogger";

export const metadata: Metadata = { title: "Campaigns & Ads" };

export default function CampaignsPage() {
  return (
    <AuthGate>
      <p className="eyebrow mb-2 text-gold">Transparency record</p>
      <h1 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,3.5vw,2.5rem)] text-paper">
        Campaigns & ads.
      </h1>
      <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-neutral-400">
        Log what you are running — format, platform, dates, and performance. This is what lets us
        credit your work, reconcile it against tracked link data, and move you up a tier on evidence
        rather than argument.
      </p>

      <div className="mt-10">
        <CampaignLogger />
      </div>
    </AuthGate>
  );
}

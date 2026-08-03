import type { Metadata } from "next";
import { AuthGate } from "@/components/ambassador/AuthGate";
import { CampaignLogger } from "@/components/ambassador/CampaignLogger";
import { getCurrentAmbassador, listCampaigns } from "@/lib/ambassador-server";

export const metadata: Metadata = { title: "Campaigns & Ads" };

const FORMAT_LABEL: Record<string, string> = {
  UGC_REEL: "UGC reel",
  TRANSFORMATION_BEFORE_AFTER: "Before / after transformation",
  LONG_FORM_TUTORIAL: "Long-form tutorial",
  STORY: "Story",
  LIVE: "Live",
  STATIC_POST: "Static post",
  PAID_BOOST: "Paid boost",
};

export default async function CampaignsPage() {
  const amb = await getCurrentAmbassador();
  const campaigns = amb ? await listCampaigns(amb.id) : [];
  const initialCampaigns = campaigns.map((c) => ({
    title: c.title,
    platform: c.platform,
    format: FORMAT_LABEL[c.format] ?? c.format,
    start: c.startDate.toISOString().slice(0, 10),
    impressions: c.impressions,
    reactions: c.reactions,
    clicks: c.clicks,
  }));
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
        <CampaignLogger initialCampaigns={initialCampaigns} />
      </div>
    </AuthGate>
  );
}

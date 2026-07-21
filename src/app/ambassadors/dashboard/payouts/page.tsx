import type { Metadata } from "next";
import { AuthGate } from "@/components/ambassador/AuthGate";
import { PayoutSettings } from "@/components/ambassador/PayoutSettings";

export const metadata: Metadata = { title: "Payouts" };

export default function PayoutsPage() {
  return (
    <AuthGate>
      <p className="eyebrow mb-2 text-gold">Getting paid</p>
      <h1 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,3.5vw,2.5rem)] text-paper">
        Payouts.
      </h1>
      <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-neutral-400">
        Choose your rail, set your destination, and request a payout whenever your cleared balance
        passes the minimum. No ninety-day hold, no rolling reserve.
      </p>

      <div className="mt-10">
        <PayoutSettings />
      </div>
    </AuthGate>
  );
}

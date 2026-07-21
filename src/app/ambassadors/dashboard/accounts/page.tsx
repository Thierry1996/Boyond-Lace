import type { Metadata } from "next";
import { AuthGate } from "@/components/ambassador/AuthGate";
import { LinkedAccounts } from "@/components/ambassador/LinkedAccounts";

export const metadata: Metadata = { title: "Linked Accounts" };

export default function AccountsPage() {
  return (
    <AuthGate>
      <p className="eyebrow mb-2 text-gold">Your channels</p>
      <h1 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,3.5vw,2.5rem)] text-paper">
        Linked accounts.
      </h1>
      <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-neutral-400">
        Connect the accounts you post from. Reach across your linked channels is what the marketing
        division reviews when considering you for a higher tier.
      </p>

      <div className="mt-10">
        <LinkedAccounts />
      </div>
    </AuthGate>
  );
}

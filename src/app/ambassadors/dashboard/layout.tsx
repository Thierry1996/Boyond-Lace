import Link from "next/link";
import type { Metadata } from "next";
import { LayoutDashboard, Link2, Megaphone, Wallet, Trophy, Share2 } from "lucide-react";
import { MonogramFlat } from "@/components/brand/Logo";

export const metadata: Metadata = {
  title: { default: "Ambassador Dashboard", template: "%s — Ambassador Portal" },
  robots: { index: false, follow: false },
};

const PORTAL_NAV = [
  { label: "Overview", href: "/ambassadors/dashboard", icon: LayoutDashboard },
  { label: "Affiliate Links", href: "/ambassadors/dashboard/links", icon: Link2 },
  { label: "Campaigns & Ads", href: "/ambassadors/dashboard/campaigns", icon: Megaphone },
  { label: "Linked Accounts", href: "/ambassadors/dashboard/accounts", icon: Share2 },
  { label: "Payouts", href: "/ambassadors/dashboard/payouts", icon: Wallet },
  { label: "Leaderboard", href: "/ambassadors/dashboard/leaderboard", icon: Trophy },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto grid max-w-[1600px] gap-0 lg:grid-cols-[248px_1fr]">
      {/* Portal sidebar */}
      <aside className="border-b border-white/[0.07] lg:sticky lg:top-0 lg:h-screen lg:border-r lg:border-b-0">
        <div className="flex h-full flex-col p-6">
          <Link href="/" className="mb-9 flex items-center gap-3">
            <MonogramFlat size={32} />
            <span>
              <span className="block font-[family-name:var(--font-display)] text-[1.0625rem] text-paper">
                Beyond Lace
              </span>
              <span className="eyebrow">Ambassador Portal</span>
            </span>
          </Link>

          <nav aria-label="Ambassador portal" className="flex gap-1.5 overflow-x-auto lg:flex-col">
            {PORTAL_NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="group flex shrink-0 items-center gap-3 rounded-lg px-3.5 py-2.5 text-[0.875rem] text-neutral-400 transition-colors duration-300 hover:bg-plum-900 hover:text-paper"
              >
                <n.icon
                  size={16}
                  strokeWidth={1.6}
                  className="shrink-0 text-neutral-400 transition-colors group-hover:text-gold"
                />
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto hidden border-t border-white/[0.07] pt-6 lg:block">
            <p className="eyebrow mb-2 text-gold">Need a hand?</p>
            <p className="text-[0.75rem] leading-relaxed text-neutral-400">
              Your account contact is on{" "}
              <a
                href="mailto:ambassadors@beyondlace.com"
                className="text-gold underline-offset-2 hover:underline"
              >
                ambassadors@beyondlace.com
              </a>
              .
            </p>
          </div>
        </div>
      </aside>

      <div className="min-w-0 px-[4vw] py-10 lg:px-10">{children}</div>
    </div>
  );
}

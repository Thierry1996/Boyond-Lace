import Link from "next/link";
import type { Metadata } from "next";
import {
  Gauge,
  Users,
  FileText,
  Link2,
  Megaphone,
  Receipt,
  Wallet,
  ShieldCheck,
} from "lucide-react";
import { MonogramFlat } from "@/components/brand/Logo";
import { requireAdmin } from "@/lib/admin-server";

export const metadata: Metadata = {
  title: { default: "Admin Console", template: "%s — Beyond Lace Admin" },
  robots: { index: false, follow: false },
};

const ADMIN_NAV = [
  { label: "Overview", href: "/admin", icon: Gauge },
  { label: "Ambassadors", href: "/admin/ambassadors", icon: Users },
  { label: "Applications", href: "/admin/applications", icon: FileText },
  { label: "Affiliate Links", href: "/admin/links", icon: Link2 },
  { label: "Campaigns", href: "/admin/campaigns", icon: Megaphone },
  { label: "Commissions", href: "/admin/commissions", icon: Receipt },
  { label: "Payouts", href: "/admin/payouts", icon: Wallet },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Hard gate: signed-out → sign-in, signed-in non-admin → 404. Runs before any
  // child page renders, so the console and its data never reach a non-admin.
  const admin = await requireAdmin();

  return (
    <div className="mx-auto grid max-w-[1600px] gap-0 lg:grid-cols-[248px_1fr]">
      <aside className="border-b border-white/[0.07] lg:sticky lg:top-0 lg:h-screen lg:border-r lg:border-b-0">
        <div className="flex h-full flex-col p-6">
          <Link href="/" className="mb-2 flex items-center gap-3">
            <MonogramFlat size={32} />
            <span>
              <span className="block font-[family-name:var(--font-display)] text-[1.0625rem] text-paper">
                Beyond Lace
              </span>
              <span className="eyebrow text-gold">Admin Console</span>
            </span>
          </Link>
          <p className="mb-8 inline-flex items-center gap-1.5 text-[0.6875rem] text-neutral-400">
            <ShieldCheck size={12} className="text-emerald-400" />
            {admin.email}
          </p>

          <nav aria-label="Admin console" className="flex gap-1.5 overflow-x-auto lg:flex-col">
            {ADMIN_NAV.map((n) => (
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
            <p className="text-[0.6875rem] leading-relaxed text-neutral-500">
              Read-only monitoring. All figures are live from the ambassador ledger.
            </p>
          </div>
        </div>
      </aside>

      <div className="min-w-0 px-[4vw] py-10 lg:px-10">{children}</div>
    </div>
  );
}

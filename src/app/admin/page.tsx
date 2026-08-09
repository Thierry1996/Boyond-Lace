import Link from "next/link";
import { Users, MousePointerClick, TrendingUp, DollarSign, Wallet, FileText } from "lucide-react";
import { getAdminOverview, listCommissions } from "@/lib/admin-server";
import { Usd, AdminDate, StatusPill, AdminTable } from "@/components/admin/AdminUI";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [o, commissions] = await Promise.all([getAdminOverview(), listCommissions()]);
  const recent = commissions.slice(0, 10);

  const kpis = [
    {
      label: "Ambassadors",
      value: o.ambassadors.toLocaleString(),
      sub: `${o.approvedAmbassadors} approved`,
      icon: Users,
    },
    {
      label: "Pending applications",
      value: o.pendingApplications.toLocaleString(),
      sub: `${o.totalApplications} all-time`,
      icon: FileText,
      href: "/admin/applications",
    },
    {
      label: "Tracked clicks",
      value: o.totalClicks.toLocaleString(),
      sub: `${o.links} links`,
      icon: MousePointerClick,
      href: "/admin/links",
    },
    {
      label: "Attributed sales",
      value: o.totalConversions.toLocaleString(),
      sub: "via affiliate links",
      icon: TrendingUp,
      href: "/admin/commissions",
    },
    {
      label: "Commission owed",
      value: <Usd cents={o.commissionPendingAmount} />,
      sub: "pending approval",
      icon: DollarSign,
      href: "/admin/commissions",
    },
    {
      label: "Payouts requested",
      value: <Usd cents={o.payoutsRequestedAmount} />,
      sub: "awaiting release",
      icon: Wallet,
      href: "/admin/payouts",
    },
  ];

  return (
    <>
      <div className="mb-9">
        <p className="eyebrow mb-2 text-gold">Universal monitoring · read-only</p>
        <h1 className="font-[family-name:var(--font-display)] text-[clamp(2rem,4vw,3rem)] text-paper">
          Ambassador economy.
        </h1>
        <p className="mt-2 text-[0.875rem] text-neutral-400">
          Every application, link, click, attributed sale and payout across the programme — live
          from the ledger.
        </p>
      </div>

      <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {kpis.map((k) => {
          const body = (
            <>
              <div className="flex items-center justify-between">
                <k.icon
                  size={18}
                  strokeWidth={1.6}
                  className="text-neutral-400 group-hover:text-gold"
                />
              </div>
              <p className="mt-5 font-[family-name:var(--font-display)] text-3xl text-paper tabular-nums">
                {k.value}
              </p>
              <p className="eyebrow mt-1.5">{k.label}</p>
              <p className="mt-1 text-[0.6875rem] text-neutral-500">{k.sub}</p>
            </>
          );
          return k.href ? (
            <Link
              key={k.label}
              href={k.href}
              className="group rounded-xl border border-white/[0.07] p-6 transition-colors duration-300 hover:border-gold/50"
            >
              {body}
            </Link>
          ) : (
            <div key={k.label} className="group rounded-xl border border-white/[0.07] p-6">
              {body}
            </div>
          );
        })}
      </div>

      <div className="mb-4 flex items-end justify-between gap-4">
        <h2 className="font-[family-name:var(--font-display)] text-xl text-paper">
          Latest attributed sales
        </h2>
        <Link
          href="/admin/commissions"
          className="text-[0.6875rem] tracking-[0.1em] text-gold uppercase hover:opacity-75"
        >
          Full ledger →
        </Link>
      </div>

      <AdminTable
        headers={[
          "Date",
          "Ambassador",
          "Code",
          "Order",
          "Order total",
          "Rate",
          "Commission",
          "Status",
        ]}
        rowCount={recent.length}
        empty="No attributed sales yet — they appear here the moment an order is credited to a referral link."
      >
        {recent.map((c) => (
          <tr key={c.id} className="hover:bg-white/[0.02]">
            <td className="px-4 py-3 text-neutral-400">
              <AdminDate value={c.createdAt} />
            </td>
            <td className="px-4 py-3 text-paper">{c.ambassador.displayName}</td>
            <td className="px-4 py-3 font-mono text-[0.75rem] text-gold">
              {c.ambassador.referralCode}
            </td>
            <td className="px-4 py-3 font-mono text-[0.75rem] text-neutral-300">{c.orderRef}</td>
            <td className="px-4 py-3 text-neutral-300">
              <Usd cents={c.orderTotal} />
            </td>
            <td className="px-4 py-3 text-neutral-400 tabular-nums">
              {(c.rateBps / 100).toFixed(0)}%
            </td>
            <td className="px-4 py-3 text-paper">
              <Usd cents={c.amount} />
            </td>
            <td className="px-4 py-3">
              <StatusPill status={c.status} />
            </td>
          </tr>
        ))}
      </AdminTable>
    </>
  );
}

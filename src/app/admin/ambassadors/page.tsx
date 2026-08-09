import { listAmbassadors } from "@/lib/admin-server";
import { Usd, AdminDate, StatusPill, AdminTable } from "@/components/admin/AdminUI";

export const dynamic = "force-dynamic";
export const metadata = { title: "Ambassadors" };

export default async function AdminAmbassadorsPage() {
  const rows = await listAmbassadors();
  return (
    <>
      <div className="mb-8">
        <p className="eyebrow mb-2 text-gold">{rows.length} on the roster</p>
        <h1 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,3.5vw,2.5rem)] text-paper">
          Ambassadors.
        </h1>
      </div>
      <AdminTable
        headers={[
          "Joined",
          "Name",
          "Email",
          "Code",
          "Tier",
          "Status",
          "Rate",
          "Links",
          "Clicks",
          "Sales",
          "Earned",
        ]}
        rowCount={rows.length}
        empty="No ambassadors provisioned yet."
      >
        {rows.map((a) => (
          <tr key={a.id} className="hover:bg-white/[0.02]">
            <td className="px-4 py-3 text-neutral-400">
              <AdminDate value={a.createdAt} />
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-paper">{a.displayName}</td>
            <td className="px-4 py-3 text-neutral-300">{a.email}</td>
            <td className="px-4 py-3 font-mono text-[0.75rem] text-gold">{a.referralCode}</td>
            <td className="px-4 py-3 text-[0.75rem] whitespace-nowrap text-neutral-300">
              {a.tier.replace(/_/g, " ")}
            </td>
            <td className="px-4 py-3">
              <StatusPill status={a.status} />
            </td>
            <td className="px-4 py-3 text-neutral-400 tabular-nums">
              {(a.commissionBps / 100).toFixed(0)}%
            </td>
            <td className="px-4 py-3 text-neutral-300 tabular-nums">{a.links}</td>
            <td className="px-4 py-3 text-neutral-300 tabular-nums">{a.clicks.toLocaleString()}</td>
            <td className="px-4 py-3 text-neutral-300 tabular-nums">
              {a.conversions.toLocaleString()}
            </td>
            <td className="px-4 py-3 text-paper">
              <Usd cents={a.earnedTotal} />
            </td>
          </tr>
        ))}
      </AdminTable>
    </>
  );
}

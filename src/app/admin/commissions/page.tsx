import { listCommissions } from "@/lib/admin-server";
import { Usd, AdminDate, StatusPill, AdminTable } from "@/components/admin/AdminUI";

export const dynamic = "force-dynamic";
export const metadata = { title: "Commissions" };

export default async function AdminCommissionsPage() {
  const rows = await listCommissions();
  const owed = rows
    .filter((r) => r.status === "PENDING" || r.status === "APPROVED")
    .reduce((s, r) => s + r.amount, 0);
  const paid = rows.filter((r) => r.status === "PAID").reduce((s, r) => s + r.amount, 0);
  return (
    <>
      <div className="mb-8">
        <p className="eyebrow mb-2 text-gold">
          {rows.length} entries · <Usd cents={owed} /> owed · <Usd cents={paid} /> paid
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,3.5vw,2.5rem)] text-paper">
          Commission ledger.
        </h1>
        <p className="mt-2 text-[0.875rem] text-neutral-400">
          Every sale attributed to a referral link — the audit trail that confirms which creator
          sourced each sold unit.
        </p>
      </div>
      <AdminTable
        headers={[
          "Date",
          "Ambassador",
          "Code",
          "Order ref",
          "Order total",
          "Rate",
          "Commission",
          "Status",
        ]}
        rowCount={rows.length}
        empty="No commissions recorded yet. Entries are created automatically when a referred order is paid."
      >
        {rows.map((c) => (
          <tr key={c.id} className="hover:bg-white/[0.02]">
            <td className="px-4 py-3 text-neutral-400">
              <AdminDate value={c.createdAt} />
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-paper">{c.ambassador.displayName}</td>
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

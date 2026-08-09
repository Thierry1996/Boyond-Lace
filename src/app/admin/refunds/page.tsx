import { listRefunds } from "@/lib/admin-server";
import { Usd, AdminDate, StatusPill, AdminTable } from "@/components/admin/AdminUI";

export const dynamic = "force-dynamic";
export const metadata = { title: "Refunds" };

export default async function AdminRefundsPage() {
  const orders = await listRefunds();
  return (
    <>
      <div className="mb-8">
        <p className="eyebrow mb-2 text-gold">Operations · returns &amp; refunds</p>
        <h1 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,3.5vw,2.5rem)] text-paper">
          Refunds.
        </h1>
        <p className="mt-2 text-[0.875rem] text-neutral-400">
          Return requests and processed refunds — the desk that protects the lace-uncut policy and
          the 30-day window.
        </p>
      </div>
      <AdminTable
        headers={["Placed", "Ref", "Customer", "Total", "Status", "Payment ref"]}
        rowCount={orders.length}
        empty="No return requests. Orders flagged for return or refund surface here for the desk to action."
      >
        {orders.map((o) => (
          <tr key={o.id} className="hover:bg-white/[0.02]">
            <td className="px-4 py-3 text-neutral-400">
              <AdminDate value={o.placedAt} />
            </td>
            <td className="px-4 py-3 font-mono text-[0.75rem] text-gold">{o.ref}</td>
            <td className="px-4 py-3 whitespace-nowrap text-paper">
              {o.user?.name ?? o.user?.email ?? "Guest"}
            </td>
            <td className="px-4 py-3 text-paper">
              <Usd cents={o.total} />
            </td>
            <td className="px-4 py-3">
              <StatusPill status={o.status} />
            </td>
            <td className="px-4 py-3 font-mono text-[0.75rem] text-neutral-400">
              {o.paymentRef ?? "—"}
            </td>
          </tr>
        ))}
      </AdminTable>
    </>
  );
}

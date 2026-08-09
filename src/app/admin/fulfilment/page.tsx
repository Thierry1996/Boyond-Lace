import { listFulfilmentQueue } from "@/lib/admin-server";
import { Usd, AdminDate, StatusPill, AdminTable } from "@/components/admin/AdminUI";

export const dynamic = "force-dynamic";
export const metadata = { title: "Fulfilment" };

export default async function AdminFulfilmentPage() {
  const orders = await listFulfilmentQueue();
  return (
    <>
      <div className="mb-8">
        <p className="eyebrow mb-2 text-gold">Operations · fulfilment tracker</p>
        <h1 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,3.5vw,2.5rem)] text-paper">
          Fulfilment queue.
        </h1>
        <p className="mt-2 text-[0.875rem] text-neutral-400">
          Paid orders moving through production and dispatch — with the batch each unit ships from,
          for the consistency audit trail.
        </p>
      </div>
      <AdminTable
        headers={["Placed", "Ref", "Customer", "SKUs", "Batches", "Total", "Status", "Tracking"]}
        rowCount={orders.length}
        empty="Nothing in the queue. Paid orders appear here for production and dispatch once checkout is live."
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
            <td className="px-4 py-3 font-mono text-[0.6875rem] text-neutral-300">
              {o.lines.map((l) => l.variant.sku).join(", ") || "—"}
            </td>
            <td className="px-4 py-3 font-mono text-[0.6875rem] text-neutral-400">
              {o.lines
                .map((l) => l.batchCode)
                .filter(Boolean)
                .join(", ") || "—"}
            </td>
            <td className="px-4 py-3 text-paper">
              <Usd cents={o.total} />
            </td>
            <td className="px-4 py-3">
              <StatusPill status={o.status} />
            </td>
            <td className="px-4 py-3 font-mono text-[0.75rem] text-neutral-400">
              {o.trackingNumber ?? "—"}
            </td>
          </tr>
        ))}
      </AdminTable>
    </>
  );
}

import { listOrders, getOrderStats } from "@/lib/admin-server";
import { Usd, AdminDate, StatusPill, AdminTable } from "@/components/admin/AdminUI";

export const dynamic = "force-dynamic";
export const metadata = { title: "Orders" };

export default async function AdminOrdersPage() {
  const [orders, stats] = await Promise.all([listOrders(), getOrderStats()]);
  const kpis = [
    { label: "Orders", value: stats.total.toLocaleString() },
    { label: "Revenue", value: <Usd cents={stats.revenue} /> },
    { label: "Awaiting fulfilment", value: stats.awaitingFulfilment.toLocaleString() },
    { label: "Open refunds", value: stats.refundsOpen.toLocaleString() },
  ];
  return (
    <>
      <div className="mb-8">
        <p className="eyebrow mb-2 text-gold">Operations · order tracker</p>
        <h1 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,3.5vw,2.5rem)] text-paper">
          Orders.
        </h1>
      </div>
      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-xl border border-white/[0.07] p-5">
            <p className="font-[family-name:var(--font-display)] text-2xl text-paper tabular-nums">
              {k.value}
            </p>
            <p className="eyebrow mt-1">{k.label}</p>
          </div>
        ))}
      </div>
      <AdminTable
        headers={["Placed", "Ref", "Customer", "Channel", "Items", "Total", "Status", "Tracking"]}
        rowCount={orders.length}
        empty="No orders yet. This tracker fills automatically once checkout persists paid orders."
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
            <td className="px-4 py-3 text-[0.75rem] text-neutral-300">{o.channel}</td>
            <td className="px-4 py-3 text-neutral-300 tabular-nums">{o.lines.length}</td>
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

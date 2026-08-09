import { listCustomers } from "@/lib/admin-server";
import { AdminDate, StatusPill, AdminTable } from "@/components/admin/AdminUI";

export const dynamic = "force-dynamic";
export const metadata = { title: "Customers" };

export default async function AdminCustomersPage() {
  const users = await listCustomers();
  return (
    <>
      <div className="mb-8">
        <p className="eyebrow mb-2 text-gold">{users.length} accounts</p>
        <h1 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,3.5vw,2.5rem)] text-paper">
          Customers.
        </h1>
        <p className="mt-2 text-[0.875rem] text-neutral-400">
          Everyone with a Beyond Lace account — shoppers, salon partners, ambassadors and staff —
          with their order history and loyalty balance.
        </p>
      </div>
      <AdminTable
        headers={["Joined", "Name", "Email", "Role", "Orders", "Reviews", "Loyalty pts"]}
        rowCount={users.length}
        empty="No customer accounts yet."
      >
        {users.map((u) => (
          <tr key={u.id} className="hover:bg-white/[0.02]">
            <td className="px-4 py-3 text-neutral-400">
              <AdminDate value={u.createdAt} />
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-paper">{u.name ?? "—"}</td>
            <td className="px-4 py-3 text-neutral-300">{u.email}</td>
            <td className="px-4 py-3">
              <StatusPill status={u.role} />
            </td>
            <td className="px-4 py-3 text-neutral-300 tabular-nums">{u._count.orders}</td>
            <td className="px-4 py-3 text-neutral-300 tabular-nums">{u._count.reviews}</td>
            <td className="px-4 py-3 text-neutral-300 tabular-nums">
              {u.loyaltyPoints.toLocaleString()}
            </td>
          </tr>
        ))}
      </AdminTable>
    </>
  );
}

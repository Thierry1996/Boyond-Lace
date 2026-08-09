import { listPayouts, listPayoutMethods } from "@/lib/admin-server";
import { Usd, AdminDate, StatusPill, AdminTable } from "@/components/admin/AdminUI";

export const dynamic = "force-dynamic";
export const metadata = { title: "Payouts" };

export default async function AdminPayoutsPage() {
  const [payouts, methods] = await Promise.all([listPayouts(), listPayoutMethods()]);
  const requested = payouts
    .filter((p) => p.status === "REQUESTED")
    .reduce((s, p) => s + p.amount, 0);
  const paid = payouts.filter((p) => p.status === "PAID").reduce((s, p) => s + p.amount, 0);

  return (
    <>
      <div className="mb-8">
        <p className="eyebrow mb-2 text-gold">
          <Usd cents={requested} /> awaiting release · <Usd cents={paid} /> settled
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,3.5vw,2.5rem)] text-paper">
          Payouts.
        </h1>
      </div>

      <h2 className="mb-3 font-[family-name:var(--font-display)] text-xl text-paper">
        Payout requests
      </h2>
      <AdminTable
        headers={[
          "Requested",
          "Ambassador",
          "Code",
          "Amount",
          "Channel",
          "Destination",
          "Status",
          "Settled",
        ]}
        rowCount={payouts.length}
        empty="No payout requests yet."
      >
        {payouts.map((p) => (
          <tr key={p.id} className="hover:bg-white/[0.02]">
            <td className="px-4 py-3 text-neutral-400">
              <AdminDate value={p.requestedAt} />
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-paper">{p.ambassador.displayName}</td>
            <td className="px-4 py-3 font-mono text-[0.75rem] text-gold">
              {p.ambassador.referralCode}
            </td>
            <td className="px-4 py-3 text-paper">
              <Usd cents={p.amount} />
            </td>
            <td className="px-4 py-3 text-[0.75rem] whitespace-nowrap text-neutral-300">
              {p.channel.replace(/_/g, " ")}
            </td>
            <td className="px-4 py-3 font-mono text-[0.75rem] text-neutral-400">{p.destination}</td>
            <td className="px-4 py-3">
              <StatusPill status={p.status} />
            </td>
            <td className="px-4 py-3 text-neutral-400">
              <AdminDate value={p.settledAt} />
            </td>
          </tr>
        ))}
      </AdminTable>

      <h2 className="mt-12 mb-3 font-[family-name:var(--font-display)] text-xl text-paper">
        Saved payout methods
      </h2>
      <AdminTable
        headers={["Added", "Ambassador", "Code", "Channel", "Destination", "Default", "Verified"]}
        rowCount={methods.length}
        empty="No payout methods on file yet."
      >
        {methods.map((m) => (
          <tr key={m.id} className="hover:bg-white/[0.02]">
            <td className="px-4 py-3 text-neutral-400">
              <AdminDate value={m.createdAt} />
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-paper">{m.ambassador.displayName}</td>
            <td className="px-4 py-3 font-mono text-[0.75rem] text-gold">
              {m.ambassador.referralCode}
            </td>
            <td className="px-4 py-3 text-[0.75rem] whitespace-nowrap text-neutral-300">
              {m.channel.replace(/_/g, " ")}
            </td>
            <td className="px-4 py-3 font-mono text-[0.75rem] text-neutral-400">{m.destination}</td>
            <td className="px-4 py-3 text-neutral-300">{m.isDefault ? "Default" : "—"}</td>
            <td className="px-4 py-3 text-neutral-400">
              <AdminDate value={m.verifiedAt} />
            </td>
          </tr>
        ))}
      </AdminTable>
    </>
  );
}

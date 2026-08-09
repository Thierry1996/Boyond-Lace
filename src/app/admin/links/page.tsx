import { listLinks } from "@/lib/admin-server";
import { AdminDate, AdminTable } from "@/components/admin/AdminUI";

export const dynamic = "force-dynamic";
export const metadata = { title: "Affiliate Links" };

export default async function AdminLinksPage() {
  const rows = await listLinks();
  const totalClicks = rows.reduce((s, l) => s + l.clicks, 0);
  const totalConv = rows.reduce((s, l) => s + l.conversions, 0);
  return (
    <>
      <div className="mb-8">
        <p className="eyebrow mb-2 text-gold">
          {rows.length} links · {totalClicks.toLocaleString()} clicks · {totalConv.toLocaleString()}{" "}
          sales
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,3.5vw,2.5rem)] text-paper">
          Affiliate links.
        </h1>
        <p className="mt-2 text-[0.875rem] text-neutral-400">
          Every shareable link and its live click/conversion count — the source-of-truth for who
          drove a sale.
        </p>
      </div>
      <AdminTable
        headers={[
          "Created",
          "Ambassador",
          "Code",
          "Label",
          "Destination",
          "Clicks",
          "Sales",
          "Conv. rate",
        ]}
        rowCount={rows.length}
        empty="No affiliate links created yet."
      >
        {rows.map((l) => (
          <tr key={l.id} className="hover:bg-white/[0.02]">
            <td className="px-4 py-3 text-neutral-400">
              <AdminDate value={l.createdAt} />
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-paper">{l.ambassador.displayName}</td>
            <td className="px-4 py-3 font-mono text-[0.75rem] text-gold">{l.code}</td>
            <td className="px-4 py-3 text-neutral-300">{l.label}</td>
            <td className="px-4 py-3 font-mono text-[0.75rem] text-neutral-400">{l.targetPath}</td>
            <td className="px-4 py-3 text-neutral-300 tabular-nums">{l.clicks.toLocaleString()}</td>
            <td className="px-4 py-3 text-paper tabular-nums">{l.conversions.toLocaleString()}</td>
            <td className="px-4 py-3 text-neutral-400 tabular-nums">
              {l.clicks > 0 ? `${((l.conversions / l.clicks) * 100).toFixed(1)}%` : "—"}
            </td>
          </tr>
        ))}
      </AdminTable>
    </>
  );
}

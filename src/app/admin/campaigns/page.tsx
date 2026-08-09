import { listCampaigns } from "@/lib/admin-server";
import { AdminDate, AdminTable } from "@/components/admin/AdminUI";

export const dynamic = "force-dynamic";
export const metadata = { title: "Campaigns" };

export default async function AdminCampaignsPage() {
  const rows = await listCampaigns();
  return (
    <>
      <div className="mb-8">
        <p className="eyebrow mb-2 text-gold">{rows.length} logged</p>
        <h1 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,3.5vw,2.5rem)] text-paper">
          Campaigns &amp; content.
        </h1>
        <p className="mt-2 text-[0.875rem] text-neutral-400">
          Self-reported content logs — the supervision and transparency record for every ambassador
          post.
        </p>
      </div>
      <AdminTable
        headers={[
          "Started",
          "Ambassador",
          "Title",
          "Platform",
          "Format",
          "Promotes",
          "Impressions",
          "Clicks",
          "Post",
        ]}
        rowCount={rows.length}
        empty="No campaigns logged yet."
      >
        {rows.map((c) => (
          <tr key={c.id} className="hover:bg-white/[0.02]">
            <td className="px-4 py-3 text-neutral-400">
              <AdminDate value={c.startDate} />
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-paper">{c.ambassador.displayName}</td>
            <td className="px-4 py-3 text-neutral-300">{c.title}</td>
            <td className="px-4 py-3 text-[0.75rem] text-neutral-300">{c.platform}</td>
            <td className="px-4 py-3 text-[0.75rem] whitespace-nowrap text-neutral-400">
              {c.format.replace(/_/g, " ")}
            </td>
            <td className="px-4 py-3 font-mono text-[0.75rem] text-neutral-400">
              {c.promotedSlug ?? "—"}
            </td>
            <td className="px-4 py-3 text-neutral-300 tabular-nums">
              {c.impressions.toLocaleString()}
            </td>
            <td className="px-4 py-3 text-neutral-300 tabular-nums">{c.clicks.toLocaleString()}</td>
            <td className="px-4 py-3">
              {c.postUrl ? (
                <a
                  href={c.postUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold underline-offset-2 hover:underline"
                >
                  open
                </a>
              ) : (
                <span className="text-neutral-500">—</span>
              )}
            </td>
          </tr>
        ))}
      </AdminTable>
    </>
  );
}

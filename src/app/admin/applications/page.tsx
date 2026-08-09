import { listApplications } from "@/lib/admin-server";
import { AdminDate, StatusPill, AdminTable } from "@/components/admin/AdminUI";

export const dynamic = "force-dynamic";
export const metadata = { title: "Applications" };

export default async function AdminApplicationsPage() {
  const rows = await listApplications();
  const pending = rows.filter((r) => r.status === "PENDING").length;
  return (
    <>
      <div className="mb-8">
        <p className="eyebrow mb-2 text-gold">
          {rows.length} received · {pending} pending review
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,3.5vw,2.5rem)] text-paper">
          Applications.
        </h1>
      </div>
      <AdminTable
        headers={[
          "Date",
          "Name",
          "Email",
          "Country",
          "Followers",
          "Niche",
          "Instagram",
          "Proposed tier",
          "Status",
        ]}
        rowCount={rows.length}
        empty="No applications submitted yet."
      >
        {rows.map((a) => (
          <tr key={a.id} className="hover:bg-white/[0.02]">
            <td className="px-4 py-3 text-neutral-400">
              <AdminDate value={a.createdAt} />
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-paper">{a.fullName}</td>
            <td className="px-4 py-3 text-neutral-300">{a.email}</td>
            <td className="px-4 py-3 text-neutral-300">{a.country}</td>
            <td className="px-4 py-3 text-neutral-300 tabular-nums">
              {a.followerCount.toLocaleString()}
            </td>
            <td className="px-4 py-3 text-neutral-300">{a.primaryNiche}</td>
            <td className="px-4 py-3">
              <a
                href={a.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold underline-offset-2 hover:underline"
              >
                view
              </a>
            </td>
            <td className="px-4 py-3 text-[0.75rem] whitespace-nowrap text-neutral-300">
              {a.proposedTier ? a.proposedTier.replace(/_/g, " ") : "—"}
            </td>
            <td className="px-4 py-3">
              <StatusPill status={a.status} />
            </td>
          </tr>
        ))}
      </AdminTable>
    </>
  );
}

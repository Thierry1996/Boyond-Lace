import { getMarketingSignups } from "@/lib/admin-server";
import { AdminDate, AdminTable } from "@/components/admin/AdminUI";

export const dynamic = "force-dynamic";
export const metadata = { title: "Signups & Newsletter" };

export default async function AdminMarketingPage() {
  const { leads, available, bySource } = await getMarketingSignups();
  return (
    <>
      <div className="mb-8">
        <p className="eyebrow mb-2 text-gold">Marketing · {leads.length} subscribers</p>
        <h1 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,3.5vw,2.5rem)] text-paper">
          Signups &amp; newsletter.
        </h1>
        <p className="mt-2 text-[0.875rem] text-neutral-400">
          Every marketing opt-in across the storefront — newsletter, spin-wheel, free-gift and
          contact captures — with the channel each shopper agreed to.
        </p>
      </div>

      {!available && (
        <div className="mb-8 rounded-xl border border-gold/25 bg-gold/[0.04] px-6 py-5 text-[0.875rem] text-neutral-300">
          The subscriber table isn&rsquo;t readable with the current key (it&rsquo;s RLS-locked to
          protect PII). Add a service-role Supabase key for the admin console and this fills with
          the live list — writes from the storefront are already landing in the table.
        </div>
      )}

      {bySource.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-3">
          {bySource.map((s) => (
            <span
              key={s.source}
              className="rounded-full border border-white/[0.09] px-4 py-1.5 text-[0.75rem] text-neutral-300"
            >
              {s.source} · <span className="tabular-nums text-paper">{s.count}</span>
            </span>
          ))}
        </div>
      )}

      <AdminTable
        headers={["Date", "Name", "Email", "Phone", "Role", "Channels", "Source", "Page"]}
        rowCount={leads.length}
        empty={
          available
            ? "No signups yet."
            : "No readable signups — connect a service-role key to view the list."
        }
      >
        {leads.map((l) => (
          <tr key={l.id} className="hover:bg-white/[0.02]">
            <td className="px-4 py-3 text-neutral-400">
              <AdminDate value={l.created_at} />
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-paper">
              {[l.first_name, l.last_name].filter(Boolean).join(" ") || "—"}
            </td>
            <td className="px-4 py-3 text-neutral-300">{l.email ?? "—"}</td>
            <td className="px-4 py-3 text-neutral-300">{l.phone ?? "—"}</td>
            <td className="px-4 py-3 text-[0.75rem] text-neutral-300">{l.role ?? "—"}</td>
            <td className="px-4 py-3 text-[0.6875rem] text-neutral-400">
              {l.marketing_prefs ?? "—"}
            </td>
            <td className="px-4 py-3 text-[0.75rem] text-neutral-300">{l.source ?? "—"}</td>
            <td className="px-4 py-3 font-mono text-[0.6875rem] text-neutral-400">
              {l.page_path ?? "—"}
            </td>
          </tr>
        ))}
      </AdminTable>
    </>
  );
}

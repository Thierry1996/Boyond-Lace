import { requireAdmin, listAdmins } from "@/lib/admin-server";
import { AdminTeamManager } from "@/components/admin/AdminTeamManager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admins & Access" };

export default async function AdminTeamPage() {
  const [me, admins] = await Promise.all([requireAdmin(), listAdmins()]);
  return (
    <>
      <div className="mb-8">
        <p className="eyebrow mb-2 text-gold">Access control</p>
        <h1 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,3.5vw,2.5rem)] text-paper">
          Admins &amp; access.
        </h1>
        <p className="mt-2 max-w-2xl text-[0.875rem] text-neutral-400">
          Admin is total backend control, so there is no public sign-up for it — the first admin is
          set from the database, and existing admins add or remove the rest here.
        </p>
      </div>
      <AdminTeamManager
        admins={admins.map((a) => ({ ...a, createdAt: a.createdAt.toISOString() }))}
        currentAdminId={me.id}
      />
    </>
  );
}

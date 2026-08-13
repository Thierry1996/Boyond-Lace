"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, ShieldCheck, X } from "lucide-react";

/**
 * Grant / revoke admin access from inside the console. Every action posts to the
 * session-gated /api/admin/grant. There is no public signup for this — an
 * existing admin is always in the loop.
 */
export interface AdminRow {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
}

export function AdminTeamManager({
  admins,
  currentAdminId,
}: {
  admins: AdminRow[];
  currentAdminId: string;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ tone: "ok" | "err"; text: string } | null>(null);

  async function post(action: "grant" | "revoke", value: string) {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/grant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value, action }),
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        setMsg({
          tone: "ok",
          text:
            action === "grant"
              ? `Admin access granted to ${value}.`
              : `Access revoked for ${value}.`,
        });
        if (action === "grant") setEmail("");
        router.refresh();
      } else {
        setMsg({ tone: "err", text: json.error ?? "Something went wrong." });
      }
    } catch {
      setMsg({ tone: "err", text: "Network error. Please try again." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Grant form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!busy && email.trim()) post("grant", email.trim());
        }}
        className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-6"
      >
        <p className="eyebrow mb-1 text-gold">Add an admin</p>
        <p className="mb-4 text-[0.8125rem] text-neutral-400">
          Grant full control-centre access to a colleague by work email. They can sign in at
          <span className="font-mono text-neutral-300"> /admin-login</span> immediately.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="colleague@beyondlace.com"
            required
            className="w-full flex-1 rounded-md border border-white/15 bg-white/[0.04] px-4 py-3 text-[0.9375rem] text-paper placeholder:text-neutral-500 focus:border-gold focus:outline-none"
          />
          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-gold px-6 py-3 text-[0.75rem] font-semibold tracking-[0.12em] text-ink uppercase transition-transform duration-300 hover:-translate-y-0.5 disabled:opacity-60"
          >
            <UserPlus size={15} strokeWidth={2} />
            {busy ? "Working…" : "Grant admin"}
          </button>
        </div>
        {msg && (
          <p
            className={`mt-3 text-[0.8125rem] ${msg.tone === "ok" ? "text-emerald-400" : "text-rose-400"}`}
          >
            {msg.text}
          </p>
        )}
      </form>

      {/* Current admins */}
      <div>
        <p className="eyebrow mb-3 text-neutral-500">{admins.length} admins</p>
        <div className="overflow-x-auto rounded-xl border border-white/[0.07]">
          <table className="w-full min-w-[520px] text-left text-[0.8125rem]">
            <thead>
              <tr className="border-b border-white/[0.09]">
                {["Email", "Name", "Added", ""].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-[0.625rem] font-semibold tracking-[0.12em] whitespace-nowrap text-neutral-400 uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {admins.map((a) => (
                <tr key={a.id} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-paper">
                    <span className="inline-flex items-center gap-1.5">
                      <ShieldCheck size={12} className="shrink-0 text-emerald-400" />
                      {a.email}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-300">{a.name ?? "—"}</td>
                  <td className="px-4 py-3 text-neutral-400 tabular-nums">
                    {a.createdAt.slice(0, 10)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {a.id === currentAdminId ? (
                      <span className="text-[0.6875rem] text-neutral-500">You</span>
                    ) : (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => post("revoke", a.email)}
                        className="inline-flex items-center gap-1 rounded-md border border-white/10 px-2.5 py-1.5 text-[0.625rem] tracking-[0.08em] text-neutral-400 uppercase transition-colors hover:border-rose-500/50 hover:text-rose-300 disabled:opacity-50"
                      >
                        <X size={11} /> Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { formatPrice } from "@/lib/commerce";

/** USD from minor units — admin views show the transacted currency, not the
 * shopper's live-converted one. */
export function Usd({ cents }: { cents: number }) {
  return <span className="tabular-nums">{formatPrice(cents)}</span>;
}

/** "2026-08-09" — compact, locale-stable date. */
export function AdminDate({ value }: { value: Date | string | null }) {
  if (!value) return <span className="text-neutral-500">—</span>;
  const d = typeof value === "string" ? new Date(value) : value;
  return <span className="tabular-nums">{d.toISOString().slice(0, 10)}</span>;
}

const TONE: Record<string, string> = {
  APPROVED: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  PAID: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  DELIVERED: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  PENDING: "border-gold/40 bg-gold/10 text-gold",
  IN_REVIEW: "border-gold/40 bg-gold/10 text-gold",
  REQUESTED: "border-gold/40 bg-gold/10 text-gold",
  PROCESSING: "border-sky-500/40 bg-sky-500/10 text-sky-300",
  DECLINED: "border-rose-500/40 bg-rose-500/10 text-rose-300",
  SUSPENDED: "border-rose-500/40 bg-rose-500/10 text-rose-300",
  FAILED: "border-rose-500/40 bg-rose-500/10 text-rose-300",
  REVERSED: "border-rose-500/40 bg-rose-500/10 text-rose-300",
};

/** Status chip, colour-coded by lifecycle stage. */
export function StatusPill({ status }: { status: string }) {
  const tone = TONE[status] ?? "border-white/15 bg-white/5 text-neutral-300";
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-[0.625rem] font-semibold tracking-[0.08em] uppercase ${tone}`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}

/** Responsive table shell — scrolls horizontally inside itself on small screens. */
export function AdminTable({
  headers,
  children,
  empty,
  rowCount,
}: {
  headers: string[];
  children: React.ReactNode;
  empty: string;
  rowCount: number;
}) {
  if (rowCount === 0) {
    return (
      <div className="rounded-xl border border-white/[0.07] px-6 py-16 text-center text-[0.875rem] text-neutral-400">
        {empty}
      </div>
    );
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-white/[0.07]">
      <table className="w-full min-w-[640px] text-left text-[0.8125rem]">
        <thead>
          <tr className="border-b border-white/[0.09]">
            {headers.map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-[0.625rem] font-semibold tracking-[0.12em] whitespace-nowrap text-neutral-400 uppercase"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.05]">{children}</tbody>
      </table>
    </div>
  );
}

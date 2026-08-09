import { getInventory } from "@/lib/admin-server";
import { Usd, AdminTable } from "@/components/admin/AdminUI";

export const dynamic = "force-dynamic";
export const metadata = { title: "Inventory" };

export default async function AdminInventoryPage() {
  const inv = await getInventory();
  const kpis = [
    { label: "SKUs", value: inv.skuCount.toLocaleString() },
    { label: "In stock", value: inv.inStock.toLocaleString() },
    { label: "Out of stock", value: inv.outOfStock.toLocaleString() },
    { label: "Product lines", value: inv.byLine.length.toLocaleString() },
  ];
  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-2 text-gold">Operations · stock</p>
          <h1 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,3.5vw,2.5rem)] text-paper">
            Inventory.
          </h1>
          <p className="mt-2 max-w-2xl text-[0.875rem] text-neutral-400">
            The live catalogue every shopper sees. Stock edits and new SKUs write through once the
            catalogue moves behind the product tables.
          </p>
        </div>
        <span
          className="rounded-full border border-white/15 px-4 py-2 text-[0.6875rem] tracking-[0.1em] text-neutral-400 uppercase"
          title="Write access is enabled when the Prisma-backed catalogue is live"
        >
          Read-only source
        </span>
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
        headers={["SKU", "Product", "Line", "Variants", "Price", "Compare-at", "Stock"]}
        rowCount={inv.rows.length}
        empty="No products in the catalogue."
      >
        {inv.rows.map((r) => (
          <tr key={r.id} className="hover:bg-white/[0.02]">
            <td className="px-4 py-3 font-mono text-[0.75rem] text-gold">{r.sku}</td>
            <td className="px-4 py-3 whitespace-nowrap text-paper">{r.title}</td>
            <td className="px-4 py-3 text-[0.75rem] text-neutral-300 uppercase">{r.line}</td>
            <td className="px-4 py-3 text-neutral-300 tabular-nums">{r.variants}</td>
            <td className="px-4 py-3 text-paper">
              <Usd cents={r.price} />
            </td>
            <td className="px-4 py-3 text-neutral-500">
              {r.compareAtPrice ? <Usd cents={r.compareAtPrice} /> : "—"}
            </td>
            <td className="px-4 py-3">
              <span
                className={`inline-flex rounded-full border px-2.5 py-0.5 text-[0.625rem] font-semibold tracking-[0.08em] uppercase ${
                  r.inStock
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                    : "border-rose-500/40 bg-rose-500/10 text-rose-300"
                }`}
              >
                {r.inStock ? "In stock" : "Waitlist"}
              </span>
            </td>
          </tr>
        ))}
      </AdminTable>
    </>
  );
}

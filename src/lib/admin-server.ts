import "server-only";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/ambassador-server";
import { commerce, type Product } from "@/lib/commerce";
import { getDataClient } from "@/lib/supabase/data";
import type { OrderStatus, User } from "@prisma/client";

/**
 * Admin console data layer — universal, read-only monitoring for Beyond Lace
 * account managers.
 *
 * Gated hard to the ADMIN role: `requireAdmin()` runs before any read, so a
 * signed-out visitor is sent to sign-in and a signed-in non-admin gets a 404
 * (the console never reveals it exists). Every function here is a read — the
 * console observes the ambassador economy end to end (applications, ambassadors,
 * links, campaigns, the commission ledger and payouts) but never mutates it.
 */

/** The signed-in user iff they carry the ADMIN role, else null. Never provisions. */
export async function getCurrentAdmin(): Promise<User | null> {
  const u = await getSessionUser();
  if (!u?.email) return null;
  const user = await db.user.findUnique({ where: { email: u.email } });
  return user?.role === "ADMIN" ? user : null;
}

/** Guard for every admin page/read: redirect signed-out, 404 for non-admins. */
export async function requireAdmin(): Promise<User> {
  const u = await getSessionUser();
  if (!u?.email) redirect("/sign-in");
  const user = await db.user.findUnique({ where: { email: u.email } });
  if (!user || user.role !== "ADMIN") notFound();
  return user;
}

export interface AdminOverview {
  ambassadors: number;
  approvedAmbassadors: number;
  pendingApplications: number;
  totalApplications: number;
  links: number;
  totalClicks: number;
  totalConversions: number;
  commissionByStatus: { status: string; count: number; amount: number }[];
  commissionPendingAmount: number;
  commissionPaidAmount: number;
  payoutByStatus: { status: string; count: number; amount: number }[];
  payoutsRequestedAmount: number;
}

/** Top-of-console KPIs — the whole economy in one glance. */
export async function getAdminOverview(): Promise<AdminOverview> {
  await requireAdmin();
  const [
    ambassadors,
    approvedAmbassadors,
    pendingApplications,
    totalApplications,
    linkAgg,
    commissionGroups,
    payoutGroups,
  ] = await Promise.all([
    db.ambassador.count(),
    db.ambassador.count({ where: { status: "APPROVED" } }),
    db.ambassadorApplication.count({ where: { status: "PENDING" } }),
    db.ambassadorApplication.count(),
    db.affiliateLink.aggregate({ _sum: { clicks: true, conversions: true }, _count: true }),
    db.commissionEntry.groupBy({ by: ["status"], _sum: { amount: true }, _count: { _all: true } }),
    db.payout.groupBy({ by: ["status"], _sum: { amount: true }, _count: { _all: true } }),
  ]);

  const commissionByStatus = commissionGroups.map((g) => ({
    status: g.status,
    count: g._count._all,
    amount: g._sum.amount ?? 0,
  }));
  const payoutByStatus = payoutGroups.map((g) => ({
    status: g.status,
    count: g._count._all,
    amount: g._sum.amount ?? 0,
  }));

  return {
    ambassadors,
    approvedAmbassadors,
    pendingApplications,
    totalApplications,
    links: linkAgg._count,
    totalClicks: linkAgg._sum.clicks ?? 0,
    totalConversions: linkAgg._sum.conversions ?? 0,
    commissionByStatus,
    commissionPendingAmount: commissionByStatus.find((c) => c.status === "PENDING")?.amount ?? 0,
    commissionPaidAmount: commissionByStatus.find((c) => c.status === "PAID")?.amount ?? 0,
    payoutByStatus,
    payoutsRequestedAmount: payoutByStatus.find((p) => p.status === "REQUESTED")?.amount ?? 0,
  };
}

export interface AmbassadorRow {
  id: string;
  displayName: string;
  email: string;
  referralCode: string;
  tier: string;
  status: string;
  commissionBps: number;
  country: string | null;
  links: number;
  clicks: number;
  conversions: number;
  earnedTotal: number;
  createdAt: Date;
}

/** Every ambassador with rolled-up performance — the roster account managers work. */
export async function listAmbassadors(): Promise<AmbassadorRow[]> {
  await requireAdmin();
  const rows = await db.ambassador.findMany({
    orderBy: { createdAt: "desc" },
    take: 500,
    include: {
      user: { select: { email: true } },
      links: { select: { clicks: true, conversions: true } },
      commissions: { select: { amount: true } },
    },
  });
  return rows.map((a) => ({
    id: a.id,
    displayName: a.displayName,
    email: a.user.email,
    referralCode: a.referralCode,
    tier: a.tier,
    status: a.status,
    commissionBps: a.commissionBps,
    country: a.country,
    links: a.links.length,
    clicks: a.links.reduce((s, l) => s + l.clicks, 0),
    conversions: a.links.reduce((s, l) => s + l.conversions, 0),
    earnedTotal: a.commissions.reduce((s, c) => s + c.amount, 0),
    createdAt: a.createdAt,
  }));
}

export async function listApplications() {
  await requireAdmin();
  return db.ambassadorApplication.findMany({ orderBy: { createdAt: "desc" }, take: 500 });
}

export async function listLinks() {
  await requireAdmin();
  return db.affiliateLink.findMany({
    orderBy: { createdAt: "desc" },
    take: 500,
    include: { ambassador: { select: { displayName: true, referralCode: true } } },
  });
}

export async function listCampaigns() {
  await requireAdmin();
  return db.campaign.findMany({
    orderBy: { startDate: "desc" },
    take: 500,
    include: { ambassador: { select: { displayName: true, referralCode: true } } },
  });
}

/** The sale-attribution ledger — which creator sourced which order. */
export async function listCommissions() {
  await requireAdmin();
  return db.commissionEntry.findMany({
    orderBy: { createdAt: "desc" },
    take: 500,
    include: { ambassador: { select: { displayName: true, referralCode: true } } },
  });
}

export async function listPayouts() {
  await requireAdmin();
  return db.payout.findMany({
    orderBy: { requestedAt: "desc" },
    take: 500,
    include: { ambassador: { select: { displayName: true, referralCode: true } } },
  });
}

export async function listPayoutMethods() {
  await requireAdmin();
  return db.payoutMethod.findMany({
    orderBy: { createdAt: "desc" },
    take: 500,
    include: { ambassador: { select: { displayName: true, referralCode: true } } },
  });
}

/* ── Operations: orders, fulfilment, refunds ─────────────────────────────────
   These read the Order graph. Orders persist once the checkout/payment pipeline
   is wired; until then the views render their empty state and are ready to fill.
   Fulfilment and refunds are the same order stream filtered by lifecycle. */

const FULFIL_STATUSES: OrderStatus[] = ["PAID", "IN_PRODUCTION", "DISPATCHED"];
const REFUND_STATUSES: OrderStatus[] = ["RETURN_REQUESTED", "REFUNDED"];

export async function listOrders(statuses?: OrderStatus[]) {
  await requireAdmin();
  return db.order.findMany({
    where: statuses ? { status: { in: statuses } } : undefined,
    orderBy: { placedAt: "desc" },
    take: 500,
    include: {
      user: { select: { email: true, name: true } },
      lines: { include: { variant: { select: { sku: true } } } },
    },
  });
}

export const listFulfilmentQueue = () => listOrders(FULFIL_STATUSES);
export const listRefunds = () => listOrders(REFUND_STATUSES);

export interface OrderStats {
  total: number;
  revenue: number;
  awaitingFulfilment: number;
  refundsOpen: number;
}
export async function getOrderStats(): Promise<OrderStats> {
  await requireAdmin();
  const [count, paid, fulfil, refunds] = await Promise.all([
    db.order.count(),
    db.order.aggregate({ _sum: { total: true }, where: { status: { not: "CANCELLED" } } }),
    db.order.count({ where: { status: { in: FULFIL_STATUSES } } }),
    db.order.count({ where: { status: "RETURN_REQUESTED" } }),
  ]);
  return {
    total: count,
    revenue: paid._sum.total ?? 0,
    awaitingFulfilment: fulfil,
    refundsOpen: refunds,
  };
}

/* ── Customers ───────────────────────────────────────────────────────────── */

export async function listCustomers() {
  await requireAdmin();
  return db.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 500,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      loyaltyPoints: true,
      createdAt: true,
      _count: { select: { orders: true, reviews: true } },
    },
  });
}

/* ── Inventory — read from the live catalogue (the commerce adapter) ─────────
   This is the storefront's real source of truth today. Stock edits/new SKUs
   write through once the catalogue moves behind the Prisma product tables; the
   view already surfaces every SKU, its price and stock state. */

export interface InventoryRow {
  id: string;
  sku: string;
  title: string;
  line: string;
  price: number;
  compareAtPrice?: number;
  variants: number;
  inStock: boolean;
}
export interface InventorySnapshot {
  rows: InventoryRow[];
  skuCount: number;
  inStock: number;
  outOfStock: number;
  byLine: { line: string; count: number }[];
}

export async function getInventory(): Promise<InventorySnapshot> {
  await requireAdmin();
  const products: Product[] = await commerce.getProducts({ limit: 500 });
  const rows: InventoryRow[] = products.map((p) => ({
    id: p.id,
    sku: p.sku,
    title: p.title,
    line: p.line,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    variants: p.options.reduce((n, o) => n * Math.max(1, o.values.length), 1),
    inStock: p.inStock,
  }));
  const byLineMap = new Map<string, number>();
  for (const r of rows) byLineMap.set(r.line, (byLineMap.get(r.line) ?? 0) + 1);
  return {
    rows,
    skuCount: rows.length,
    inStock: rows.filter((r) => r.inStock).length,
    outOfStock: rows.filter((r) => !r.inStock).length,
    byLine: [...byLineMap.entries()].map(([line, count]) => ({ line, count })),
  };
}

/* ── Marketing signups (Supabase email-marketing table) ─────────────────────
   Newsletter + capture leads land in Supabase. The publishable key is RLS-gated,
   so this returns [] if reads are locked — the page then shows a clear note
   rather than a hard error. A service-role read wires in when configured. */

export interface MarketingLead {
  id: string;
  created_at: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  role: string | null;
  marketing_prefs: string | null;
  source: string | null;
  page_path: string | null;
  prize: string | null;
}
export interface MarketingSnapshot {
  leads: MarketingLead[];
  available: boolean;
  bySource: { source: string; count: number }[];
}

export async function getMarketingSignups(): Promise<MarketingSnapshot> {
  await requireAdmin();
  const sb = getDataClient();
  if (!sb) return { leads: [], available: false, bySource: [] };
  try {
    const { data, error } = await sb
      .from("Beyond-Lace email-marketing")
      .select(
        "id, created_at, first_name, last_name, email, phone, role, marketing_prefs, source, page_path, prize",
      )
      .order("created_at", { ascending: false })
      .limit(500);
    if (error || !data) return { leads: [], available: false, bySource: [] };
    const leads = data as MarketingLead[];
    const map = new Map<string, number>();
    for (const l of leads)
      map.set(l.source ?? "unknown", (map.get(l.source ?? "unknown") ?? 0) + 1);
    return {
      leads,
      available: true,
      bySource: [...map.entries()].map(([source, count]) => ({ source, count })),
    };
  } catch {
    return { leads: [], available: false, bySource: [] };
  }
}

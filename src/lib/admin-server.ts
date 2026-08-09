import "server-only";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/ambassador-server";
import type { User } from "@prisma/client";

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

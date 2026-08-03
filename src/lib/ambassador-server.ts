import "server-only";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdFormat, type Ambassador, type Campaign, type AffiliateLink, type PayoutMethod, type SocialPlatform } from "@prisma/client";
import type { CampaignLog, AffiliateLinkInput, PayoutMethodInput } from "@/lib/schemas";

const AD_FORMATS = new Set<string>(Object.values(AdFormat));

/**
 * Server-only ambassador bridge.
 *
 * Auth lives on Neon (Better Auth `user`); the ambassador graph — Ambassador,
 * Campaign, AffiliateLink, PayoutMethod — lives on Prisma Postgres. The two are
 * joined by email: the signed-in user is resolved to a Prisma User + Ambassador,
 * provisioned on first dashboard access so the portal works the moment someone
 * signs in. Keep this out of client components (it imports auth + db).
 */

function genReferralCode(seed: string): string {
  const base =
    seed
      .replace(/[^a-zA-Z]/g, "")
      .slice(0, 3)
      .toUpperCase() || "BL";
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `BL-${base}${rand}`;
}

/** The Better Auth session user, or null when signed out. */
export async function getSessionUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}

/** Resolve (and provision on first access) the current user's Ambassador. */
export async function getCurrentAmbassador(): Promise<Ambassador | null> {
  const u = await getSessionUser();
  if (!u?.email) return null;

  const user = await db.user.upsert({
    where: { email: u.email },
    update: {},
    create: { email: u.email, name: u.name ?? null, role: "AMBASSADOR" },
  });

  const existing = await db.ambassador.findUnique({ where: { userId: user.id } });
  if (existing) return existing;

  return db.ambassador.create({
    data: {
      userId: user.id,
      displayName: u.name || u.email.split("@")[0],
      referralCode: genReferralCode(u.name || u.email),
    },
  });
}

export async function listCampaigns(ambassadorId: string): Promise<Campaign[]> {
  return db.campaign.findMany({
    where: { ambassadorId },
    orderBy: { startDate: "desc" },
    take: 50,
  });
}

export async function listLinks(ambassadorId: string): Promise<AffiliateLink[]> {
  return db.affiliateLink.findMany({
    where: { ambassadorId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export async function getDefaultPayoutMethod(ambassadorId: string): Promise<PayoutMethod | null> {
  return db.payoutMethod.findFirst({
    where: { ambassadorId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
}

export async function createCampaign(ambassadorId: string, d: CampaignLog): Promise<Campaign> {
  return db.campaign.create({
    data: {
      ambassadorId,
      title: d.title,
      platform: d.platform as SocialPlatform,
      format: (AD_FORMATS.has(d.format) ? d.format : AdFormat.STATIC_POST) as AdFormat,
      postUrl: d.postUrl || null,
      startDate: new Date(d.startDate),
      endDate: d.endDate ? new Date(d.endDate) : null,
      impressions: d.impressions ?? 0,
      reactions: d.reactions ?? 0,
      clicks: d.clicks ?? 0,
      adSpend: Math.round((d.adSpendUsd ?? 0) * 100),
    },
  });
}

export async function createLink(
  ambassadorId: string,
  referralCode: string,
  d: AffiliateLinkInput,
): Promise<AffiliateLink> {
  const suffix = Math.random().toString(36).slice(2, 5).toUpperCase();
  const targetPath = d.targetPath.startsWith("/") ? d.targetPath : `/${d.targetPath}`;
  return db.affiliateLink.create({
    data: { ambassadorId, code: `${referralCode}-${suffix}`, targetPath, label: d.label },
  });
}

/** Save a payout destination as the new default (demotes any prior default). */
export async function setPayoutMethod(
  ambassadorId: string,
  d: PayoutMethodInput,
): Promise<PayoutMethod> {
  await db.payoutMethod.updateMany({ where: { ambassadorId }, data: { isDefault: false } });
  return db.payoutMethod.create({
    data: { ambassadorId, channel: d.channel, destination: d.destination, isDefault: true },
  });
}

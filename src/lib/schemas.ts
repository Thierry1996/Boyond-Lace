import { z } from "zod";

/**
 * Shared Zod schemas — the single validation source for both React Hook Form
 * (client) and the API route handlers (server). Phase 1/2 of the locked stack.
 */

export const wholesaleApplicationSchema = z.object({
  businessName: z.string().min(2, "Tell us your business name"),
  businessType: z.enum(["salon", "reseller", "distributor", "stylist"], {
    message: "Select your business type",
  }),
  contactName: z.string().min(2, "Your name is required"),
  email: z.string().email("A valid email is required"),
  phone: z.string().min(7, "A valid phone number is required"),
  country: z.string().min(2, "Country is required"),
  estimatedVolume: z.enum(["50-149", "150-499", "500+"], {
    message: "Select an annual volume tier",
  }),
  message: z.string().max(2000).optional(),
});
export type WholesaleApplication = z.infer<typeof wholesaleApplicationSchema>;

export const contactSchema = z.object({
  name: z.string().min(2, "Your name is required"),
  email: z.string().email("A valid email is required"),
  topic: z.enum(["order", "returns", "fit", "wholesale", "press", "other"], {
    message: "Select a topic",
  }),
  orderNumber: z.string().max(40).optional(),
  message: z.string().min(10, "Tell us a little more — ten characters minimum"),
});
export type ContactMessage = z.infer<typeof contactSchema>;

export const quizLeadSchema = z.object({
  email: z.string().email("A valid email is required"),
  answers: z.record(z.string(), z.string()),
  consent: z.literal(true, { message: "Consent is required to send your match sheet" }),
});
export type QuizLead = z.infer<typeof quizLeadSchema>;

/**
 * Ambassador programme application. Social URLs are required in a checkable
 * shape because they are what the marketing division uses to classify tier.
 */
export const ambassadorApplicationSchema = z.object({
  fullName: z.string().min(2, "Your full name is required"),
  email: z.string().email("A valid email is required"),
  phone: z.string().min(7, "A valid phone number is required"),
  country: z.string().min(2, "Country is required"),
  instagramUrl: z
    .string()
    .url("Enter the full Instagram URL, including https://")
    .refine((u) => /instagram\.com/i.test(u), "That doesn't look like an Instagram URL"),
  tiktokUrl: z
    .string()
    .url("Enter the full TikTok URL")
    .refine((u) => /tiktok\.com/i.test(u), "That doesn't look like a TikTok URL")
    .optional()
    .or(z.literal("")),
  youtubeUrl: z
    .string()
    .url("Enter the full YouTube URL")
    .refine((u) => /youtube\.com|youtu\.be/i.test(u), "That doesn't look like a YouTube URL")
    .optional()
    .or(z.literal("")),
  followerCount: z
    .number({ message: "Enter your follower count as a number" })
    .int()
    .min(0, "Follower count cannot be negative"),
  primaryNiche: z.string().min(2, "Select your primary niche"),
  preferredTier: z.enum(["tier-3", "tier-2", "tier-1"]).optional().or(z.literal("")),
  portfolioUrl: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  message: z.string().max(2000).optional(),
  consent: z.boolean().refine((v) => v, { message: "Confirmation is required to apply" }),
});
export type AmbassadorApplication = z.infer<typeof ambassadorApplicationSchema>;

/** Self-reported campaign / ad log from the ambassador portal. */
export const campaignLogSchema = z.object({
  title: z.string().min(3, "Give the campaign a title"),
  platform: z.enum(["INSTAGRAM", "TIKTOK", "YOUTUBE", "PINTEREST"], {
    message: "Select a platform",
  }),
  format: z.string().min(2, "Select the content format"),
  postUrl: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  startDate: z.string().min(4, "Start date is required"),
  endDate: z.string().optional().or(z.literal("")),
  impressions: z.number().int().min(0).optional(),
  reactions: z.number().int().min(0).optional(),
  clicks: z.number().int().min(0).optional(),
  adSpendUsd: z.number().min(0).optional(),
});
export type CampaignLog = z.infer<typeof campaignLogSchema>;

/** Ambassador payout destination. Validation is per-channel. */
export const payoutMethodSchema = z
  .object({
    channel: z.enum(
      ["PAYPAL", "CASHAPP", "BANK_TRANSFER", "USDC_WALLET", "BTC_WALLET", "ETH_WALLET"],
      { message: "Select a payout channel" },
    ),
    destination: z.string().min(3, "Enter your payout destination"),
  })
  .refine(
    (v) => (v.channel === "PAYPAL" ? /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.destination) : true),
    { path: ["destination"], message: "PayPal requires the email on your account" },
  )
  .refine((v) => (v.channel === "CASHAPP" ? v.destination.startsWith("$") : true), {
    path: ["destination"],
    message: "CashApp destination should start with $",
  });
export type PayoutMethodInput = z.infer<typeof payoutMethodSchema>;

export const shippingSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("A valid email is required"),
  phone: z.string().min(7, "A valid phone number is required"),
  address1: z.string().min(4, "Street address is required"),
  address2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  postalCode: z.string().min(3, "Postal code is required"),
  country: z.string().min(2, "Country is required"),
  discreetPackaging: z.boolean(),
});
export type ShippingDetails = z.infer<typeof shippingSchema>;

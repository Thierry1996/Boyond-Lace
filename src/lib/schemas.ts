import { z } from "zod";

/**
 * Shared Zod schemas — the single validation source for both React Hook Form
 * (client) and the API route handlers (server). Phase 1/2 of the locked stack.
 */

/**
 * Wholesale buyer survey — a lighter qualifying questionnaire than the full
 * application. It captures what the partner team needs to price and prioritise a
 * lead, without the full business profile the application collects.
 */
export const wholesaleSurveySchema = z.object({
  email: z.string().email("A valid email is required"),
  businessType: z.enum(["salon", "stylist", "reseller", "distributor", "new"], {
    message: "Tell us what best describes you",
  }),
  monthlyVolume: z.enum(["sample", "5-50", "50-200", "200-500"], {
    message: "Select an expected monthly volume",
  }),
  channels: z.array(z.string()).min(1, "Select at least one sales channel"),
  textures: z.array(z.string()).min(1, "Select at least one texture"),
  privateLabel: z.enum(["yes", "maybe", "no"]),
  timeline: z.enum(["now", "1-3-months", "exploring"]),
  message: z.string().max(1000).optional(),
});
export type WholesaleSurvey = z.infer<typeof wholesaleSurveySchema>;

export const wholesaleApplicationSchema = z.object({
  businessName: z.string().min(2, "Tell us your business name"),
  businessType: z.enum(["salon", "reseller", "distributor", "stylist"], {
    message: "Select your business type",
  }),
  contactName: z.string().min(2, "Your name is required"),
  email: z.string().email("A valid email is required"),
  phone: z.string().min(7, "A valid phone number is required"),
  country: z.string().min(2, "Country is required"),
  estimatedVolume: z.enum(["5-50", "50-200", "200-500"], {
    message: "Select a volume tier",
  }),
  /** Services Needed — turnkey options the partner wants scoped up front. */
  services: z.array(z.string()).optional(),
  message: z.string().max(2000).optional(),
  consent: z.boolean().refine((v) => v, {
    message: "Please agree before submitting your application",
  }),
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

/**
 * Spin-wheel marketing capture. Email is required; phone is optional. Both
 * consents must be true (the box is the marketing/SMS opt-in; the terms/privacy
 * acknowledgment is the act of submitting). The rest is provenance stored with
 * the lead so the marketing desk knows which prize and page it came from.
 */
export const emailCaptureSchema = z.object({
  email: z.string().email("A valid email is required"),
  /** Full international number, e.g. "+234 8012345678". Required. */
  phone: z.string().min(6, "A valid phone number is required").max(40),
  /** Dial code of the chosen country, e.g. "+234". */
  phoneCountry: z.string().max(8).optional(),
  consentMarketing: z.boolean().refine((v) => v, {
    message: "Please agree to receive messages before spinning",
  }),
  consentTerms: z.boolean().refine((v) => v, { message: "You must accept the terms" }),
  prize: z.string().max(60).optional(),
  source: z.string().max(60).optional(),
  pagePath: z.string().max(300).optional(),
});
export type EmailCapture = z.infer<typeof emailCaptureSchema>;

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

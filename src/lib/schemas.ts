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

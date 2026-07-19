import { describe, expect, it } from "vitest";
import {
  contactSchema,
  quizLeadSchema,
  shippingSchema,
  wholesaleApplicationSchema,
} from "./schemas";

const validWholesale = {
  businessName: "Velvet Rooms Salon",
  businessType: "salon",
  contactName: "A. Partner",
  email: "owner@velvetrooms.example",
  phone: "+1 404 555 0100",
  country: "United States",
  estimatedVolume: "150-499",
};

describe("wholesaleApplicationSchema", () => {
  it("accepts a valid application", () => {
    expect(wholesaleApplicationSchema.safeParse(validWholesale).success).toBe(true);
  });

  it("rejects a bad email", () => {
    const r = wholesaleApplicationSchema.safeParse({ ...validWholesale, email: "not-an-email" });
    expect(r.success).toBe(false);
  });

  it("rejects an unknown volume tier", () => {
    const r = wholesaleApplicationSchema.safeParse({
      ...validWholesale,
      estimatedVolume: "1000000",
    });
    expect(r.success).toBe(false);
  });
});

describe("contactSchema", () => {
  it("requires a minimum message length", () => {
    const r = contactSchema.safeParse({
      name: "A",
      email: "a@b.co",
      topic: "order",
      message: "short",
    });
    expect(r.success).toBe(false);
  });
});

describe("quizLeadSchema", () => {
  it("refuses capture without consent — zero-party means consented", () => {
    const r = quizLeadSchema.safeParse({
      email: "lead@example.com",
      answers: { goal: "everyday" },
      consent: false,
    });
    expect(r.success).toBe(false);
  });

  it("accepts a consented lead", () => {
    const r = quizLeadSchema.safeParse({
      email: "lead@example.com",
      answers: { goal: "everyday", texture: "straight" },
      consent: true,
    });
    expect(r.success).toBe(true);
  });
});

describe("shippingSchema", () => {
  it("accepts a complete address", () => {
    const r = shippingSchema.safeParse({
      fullName: "B. Customer",
      email: "b@example.com",
      phone: "+44 20 7946 0958",
      address1: "1 Mercer Row",
      city: "London",
      postalCode: "EC1A 1AA",
      country: "United Kingdom",
      discreetPackaging: true,
    });
    expect(r.success).toBe(true);
  });
});

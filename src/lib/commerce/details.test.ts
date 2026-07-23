import { describe, expect, it } from "vitest";
import { catalog } from "./catalog";
import { deriveProductDetails } from "./details";
import { getReviews, getRatingBreakdown, getReviewFacets } from "./reviews";

describe("deriveProductDetails", () => {
  const wigs = catalog.filter((p) => ["luxe", "silk"].includes(p.line) && p.price > 0);

  it("produces a substantial, consistent detail sheet for every wig", () => {
    for (const p of wigs) {
      const rows = deriveProductDetails(p);
      // The core rows every wig must expose.
      const labels = rows.map((r) => r.label);
      for (const required of ["Material", "Hair texture", "Lace size", "Density"]) {
        expect(labels, `${p.slug} missing ${required}`).toContain(required);
      }
      expect(rows.length).toBeGreaterThanOrEqual(12);
    }
  });

  it("never emits a row with an empty value", () => {
    for (const p of catalog) {
      for (const row of deriveProductDetails(p)) expect(row.value.trim().length).toBeGreaterThan(0);
    }
  });
});

describe("seeded reviews", () => {
  const p = catalog.find((x) => x.line === "luxe" && x.price > 0)!;

  it("is deterministic per product", () => {
    expect(getReviews(p)).toEqual(getReviews(p));
  });

  it("derives sub-ratings that stay within range", () => {
    for (const prod of catalog) {
      const b = getRatingBreakdown(prod);
      for (const v of [b.quality, b.shipping, b.service]) {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(5);
      }
    }
  });

  it("apportions facet counts under the review total", () => {
    const total = getReviewFacets(p).reduce((s, f) => s + f.count, 0);
    expect(total).toBeLessThanOrEqual(p.reviewCount);
  });
});

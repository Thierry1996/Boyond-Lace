import { describe, expect, it } from "vitest";
import { catalog } from "./catalog";
import { deriveProductDetails } from "./details";
import { getReviews, getRatingBreakdown, getReviewFacets, getQuestions } from "./reviews";

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

  it("tags every review only with labels the facet chips expose, so filtering is real", () => {
    for (const prod of catalog) {
      const chipLabels = new Set(getReviewFacets(prod).map((f) => f.label));
      for (const r of getReviews(prod)) {
        expect(r.tags.length).toBeGreaterThan(0);
        for (const t of r.tags) expect(chipLabels.has(t), `${prod.slug}: ${t}`).toBe(true);
      }
    }
  });
});

describe("seeded Q&A", () => {
  const p = catalog.find((x) => x.line === "luxe" && x.price > 0)!;

  it("is deterministic per product", () => {
    expect(getQuestions(p)).toEqual(getQuestions(p));
  });

  it("leads with a brand answer and fills the rest with shoppers", () => {
    const qs = getQuestions(p);
    expect(qs[0].fromBrand).toBe(true);
    expect(qs[0].answeredBy).toBe("Beyond Lace");
    expect(qs.slice(1).every((q) => !q.fromBrand)).toBe(true);
  });

  it("gives every card a question and an answer", () => {
    for (const q of getQuestions(p)) {
      expect(q.question.trim().length).toBeGreaterThan(0);
      expect(q.answer.trim().length).toBeGreaterThan(0);
    }
  });

  // Regression: a signed-shift seed once indexed the author arrays out of
  // bounds for a single slug, yielding undefined and a build-time crash.
  it("never yields an undefined author on any product", () => {
    for (const prod of catalog) {
      for (const r of getReviews(prod)) {
        expect(r.author, `${prod.slug} review author`).toBeTruthy();
        expect(r.title).toBeTruthy();
        expect(r.body).toBeTruthy();
      }
      for (const q of getQuestions(prod)) {
        expect(q.answeredBy, `${prod.slug} answerer`).toBeTruthy();
        expect(q.askedBy).toBeTruthy();
      }
    }
  });
});

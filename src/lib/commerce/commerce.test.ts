import { describe, expect, it } from "vitest";
import { formatPrice } from "./index";
import { mockAdapter } from "./mock-adapter";
import { catalog } from "./catalog";

describe("formatPrice", () => {
  it("formats whole-dollar minor units without cents", () => {
    expect(formatPrice(89500)).toBe("$895");
  });

  it("keeps cents when present", () => {
    expect(formatPrice(89550)).toBe("$895.50");
  });

  it("formats the $5 Lace Test correctly", () => {
    expect(formatPrice(500)).toBe("$5");
  });
});

describe("mockAdapter.getProducts", () => {
  it("returns the full catalog unfiltered", async () => {
    const all = await mockAdapter.getProducts();
    expect(all.length).toBe(catalog.length);
  });

  it("filters by texture", async () => {
    const curly = await mockAdapter.getProducts({ texture: ["curly"] });
    expect(curly.length).toBeGreaterThan(0);
    expect(curly.every((p) => p.texture === "curly")).toBe(true);
  });

  it("filters by line", async () => {
    const care = await mockAdapter.getProducts({ line: "care" });
    expect(care.length).toBeGreaterThan(0);
    expect(care.every((p) => p.line === "care")).toBe(true);
  });

  it("sorts by price ascending", async () => {
    const sorted = await mockAdapter.getProducts({ sort: "price-asc" });
    const prices = sorted.map((p) => p.price);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  it("respects limit", async () => {
    const four = await mockAdapter.getProducts({ limit: 4 });
    expect(four.length).toBe(4);
  });

  it("every texture filter option has at least one product", async () => {
    for (const texture of [
      "straight",
      "body-wave",
      "deep-wave",
      "curly",
      "kinky-straight",
    ] as const) {
      const hits = await mockAdapter.getProducts({ texture: [texture] });
      expect(hits.length, `no products for texture "${texture}"`).toBeGreaterThan(0);
    }
  });
});

describe("mockAdapter.getRelated", () => {
  it("never recommends the product itself", async () => {
    const related = await mockAdapter.getRelated("the-reinvention-hd-swiss-full-lace");
    expect(related.some((p) => p.slug === "the-reinvention-hd-swiss-full-lace")).toBe(false);
  });

  it("prefers same-avatar products — a medical buyer is not cross-sold capsule drops", async () => {
    const related = await mockAdapter.getRelated("the-restoration-silk-top", 4);
    // Top matches for the medical silk-top should never lead with editorial capsule product.
    expect(related[0].avatar === "medical" || related[0].avatar === "transformation").toBe(true);
  });
});

describe("catalog integrity", () => {
  it("all slugs are unique", () => {
    const slugs = catalog.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("compareAtPrice is always above price when set", () => {
    for (const p of catalog) {
      if (p.compareAtPrice) expect(p.compareAtPrice).toBeGreaterThan(p.price);
    }
  });

  it("launch SKU count stays in the directive's 8–15 hero range (excluding B2B/care)", () => {
    const units = catalog.filter((p) => ["luxe", "silk"].includes(p.line) && p.price > 0);
    expect(units.length).toBeGreaterThanOrEqual(8);
    expect(units.length).toBeLessThanOrEqual(15);
  });
});

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
    const coily = await mockAdapter.getProducts({ texture: ["kinky-curly"] });
    expect(coily.length).toBeGreaterThan(0);
    expect(coily.every((p) => p.texture === "kinky-curly")).toBe(true);
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

  /**
   * A facet the shop offers but cannot fill is a dead end. This list must match
   * the FILTERS.texture options in src/app/shop/page.tsx — if a texture is
   * merchandised, something has to come back.
   */
  it("every merchandised texture returns at least one product", async () => {
    for (const texture of [
      "straight",
      "body-wave",
      "deep-wave",
      "kinky-straight",
      "kinky-curly",
      "jerry-curl",
    ] as const) {
      const hits = await mockAdapter.getProducts({ texture: [texture] });
      expect(hits.length, `no products for texture "${texture}"`).toBeGreaterThan(0);
    }
  });

  it("every merchandised lace construction returns at least one product", async () => {
    for (const lace of [
      "hd-swiss-full",
      "hd-swiss-13x6",
      "hd-swiss-13x4",
      "hd-swiss-7x5",
      "hd-swiss-5x5",
      "closure-4x4",
      "glueless",
      "silk-top",
    ] as const) {
      const hits = await mockAdapter.getProducts({ laceType: [lace] });
      expect(hits.length, `no products for lace "${lace}"`).toBeGreaterThan(0);
    }
  });

  it("every merchandised shade returns at least one product", async () => {
    for (const shade of [
      "natural-black",
      "espresso",
      "brunette",
      "auburn-copper",
      "burgundy-99j",
      "honey-balayage",
      "blonde-613",
      "platinum",
    ] as const) {
      const hits = await mockAdapter.getProducts({ shade: [shade] });
      expect(hits.length, `no products for shade "${shade}"`).toBeGreaterThan(0);
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

  it("all SKU codes are unique", () => {
    const skus = catalog.map((p) => p.sku);
    expect(new Set(skus).size).toBe(skus.length);
  });

  it("every cross-sell slug resolves to a real product", () => {
    const slugs = new Set(catalog.map((p) => p.slug));
    for (const p of catalog) {
      for (const s of p.crossSell ?? []) expect(slugs.has(s)).toBe(true);
    }
  });
});

/**
 * The buying directive is a commitment, not a suggestion. These assert the
 * parts of it that are cheap to break silently later: the assortment being
 * complete, the margin layer actually attaching, and the reseller ladder
 * staying internally coherent.
 */
describe("launch assortment (buying directive)", () => {
  const launch = catalog.filter((p) => p.launchRank != null);

  it("stocks all 20 ranked SKUs", () => {
    expect(launch.length).toBe(20);
  });

  it("ranks are exactly 1 through 20, no gaps or duplicates", () => {
    const ranks = launch.map((p) => p.launchRank!).sort((a, b) => a - b);
    expect(ranks).toEqual(Array.from({ length: 20 }, (_, i) => i + 1));
  });

  it("covers every strategic tier", () => {
    const tiers = new Set(launch.map((p) => p.launchTier));
    expect(tiers).toEqual(
      new Set(["core", "textured", "trans-fit", "trend-colour", "wholesale-bulk", "accessory"]),
    );
  });

  it("carries three trans-fit SKUs, each with all three cap sizes", () => {
    const transFit = launch.filter((p) => p.launchTier === "trans-fit");
    expect(transFit.length).toBe(3);
    for (const p of transFit) {
      expect(p.capConstruction).toBe("reinforced-trans-fit");
      expect(p.capSizes).toEqual(["petite", "average", "large"]);
    }
  });

  it("attaches the margin layer to every wearable unit by default", () => {
    // The directive: default cross-sell, not optional add-on.
    const wearable = launch.filter((p) => p.launchTier !== "accessory" && p.line !== "pro");
    for (const p of wearable) {
      expect(p.crossSell).toContain("beyond-install-kit");
      expect(p.crossSell).toContain("beyond-wig-care-bundle");
    }
  });

  it("prices the accessory layer inside the directive's bands", () => {
    const install = catalog.find((p) => p.slug === "beyond-install-kit")!;
    const care = catalog.find((p) => p.slug === "beyond-wig-care-bundle")!;
    expect(install.price).toBeGreaterThanOrEqual(2500);
    expect(install.price).toBeLessThanOrEqual(4000);
    expect(care.price).toBeGreaterThanOrEqual(3000);
    expect(care.price).toBeLessThanOrEqual(5000);
  });

  it("keeps every reseller break below MAP, so a partner can never be undercut", () => {
    for (const p of catalog) {
      if (!p.wholesale) continue;
      for (const t of p.wholesale.tiers) {
        expect(t.unitPrice).toBeLessThan(p.wholesale.mapPrice);
      }
      // Where creator sampling is offered it sits above the reseller ladder —
      // it is not a back door into wholesale pricing for a single unit.
      if (p.wholesale.creatorSamplePrice != null) {
        expect(p.wholesale.creatorSamplePrice).toBeGreaterThan(p.wholesale.tiers[0].unitPrice);
      }
    }
  });

  it("makes reseller tiers strictly cheaper as volume rises", () => {
    for (const p of catalog) {
      if (!p.wholesale) continue;
      const tiers = [...p.wholesale.tiers].sort((a, b) => a.minQty - b.minQty);
      for (let i = 1; i < tiers.length; i++) {
        expect(tiers[i].unitPrice).toBeLessThan(tiers[i - 1].unitPrice);
      }
    }
  });
});

describe("mockAdapter — wholesale and attachments", () => {
  it("quotes the tier a quantity actually lands in", async () => {
    const q = await mockAdapter.getWholesaleQuote("the-signature-13x4-straight", 50);
    expect(q).not.toBeNull();
    expect(q!.tier.label).toBe("Gold");
    expect(q!.subtotal).toBe(q!.unitPrice * 50);
    expect(q!.belowMoq).toBe(false);
  });

  it("still quotes below MOQ, flagged as indicative", async () => {
    const q = await mockAdapter.getWholesaleQuote("the-signature-13x4-straight", 2);
    expect(q!.belowMoq).toBe(true);
    expect(q!.tier.label).toBe("Bronze");
  });

  it("returns null for SKUs not stocked B2B", async () => {
    expect(await mockAdapter.getWholesaleQuote("lace-test-kit", 10)).toBeNull();
  });

  it("resolves attachments to in-stock kit products", async () => {
    const attachments = await mockAdapter.getAttachments("the-signature-13x4-straight");
    expect(attachments.map((p) => p.slug)).toEqual([
      "beyond-install-kit",
      "beyond-wig-care-bundle",
    ]);
  });

  it("returns the assortment in buying-directive order", async () => {
    const assortment = await mockAdapter.getLaunchAssortment();
    expect(assortment[0].launchRank).toBe(1);
    expect(assortment.at(-1)!.launchRank).toBe(20);
  });
});

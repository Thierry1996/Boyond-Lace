import { describe, expect, it } from "vitest";
import { WHOLESALE_MOQ, WHOLESALE_STEP } from "./channel";
import { mockAdapter } from "./commerce/mock-adapter";

/**
 * The two channels must not conflict. The cheapest way for that to break
 * silently is the wholesale listing quietly including a retail-only SKU, or the
 * quote engine handing out a sub-MOQ trade price. Both are asserted here.
 */
describe("channel separation", () => {
  it("uses a 5-unit first-trial trade minimum", () => {
    expect(WHOLESALE_MOQ).toBe(5);
    expect(WHOLESALE_MOQ % WHOLESALE_STEP).toBe(0);
  });

  it("wholesale listing contains only SKUs stocked for resale", async () => {
    const wholesale = await mockAdapter.getProducts({ wholesaleOnly: true });
    expect(wholesale.length).toBeGreaterThan(0);
    for (const p of wholesale) expect(p.wholesale).toBeTruthy();
  });

  it("retail-only SKUs never appear in the wholesale listing", async () => {
    const wholesale = await mockAdapter.getProducts({ wholesaleOnly: true });
    const slugs = wholesale.map((p) => p.slug);
    // The Lace Test is a $5 retail funnel product, never a trade line.
    expect(slugs).not.toContain("lace-test-kit");
  });

  it("quotes a real break at the first-trial minimum, and the deepest break at its own volume", async () => {
    const wholesale = await mockAdapter.getProducts({ wholesaleOnly: true });
    // Any single-SKU trade unit (skip the assorted reseller pack, which has its
    // own ladder). A first-trial order of five units earns the entry break —
    // never a below-MOQ indicative quote.
    const unit = wholesale.find((p) => p.line === "luxe")!;
    const tiers = [...unit.wholesale!.tiers].sort((a, b) => a.minQty - b.minQty);
    const entry = tiers[0];
    const deepest = tiers[tiers.length - 1];

    const trial = await mockAdapter.getWholesaleQuote(unit.slug, WHOLESALE_MOQ);
    expect(trial!.unitPrice).toBe(entry.unitPrice);
    expect(trial!.belowMoq).toBe(false);

    // The best per-unit price is reached only at the top break's own volume.
    const bulk = await mockAdapter.getWholesaleQuote(unit.slug, deepest.minQty);
    expect(bulk!.unitPrice).toBe(deepest.unitPrice);
    expect(bulk!.unitPrice).toBeLessThan(entry.unitPrice);
  });

  it("keeps the trade unit price below the retail single-unit price", async () => {
    const wholesale = await mockAdapter.getProducts({ wholesaleOnly: true });
    for (const p of wholesale) {
      const quote = await mockAdapter.getWholesaleQuote(p.slug, WHOLESALE_MOQ);
      if (quote) expect(quote.unitPrice).toBeLessThan(p.price);
    }
  });
});

import { describe, expect, it } from "vitest";
import { WHOLESALE_MOQ, WHOLESALE_STEP } from "./channel";
import { mockAdapter } from "./commerce/mock-adapter";

/**
 * The two channels must not conflict. The cheapest way for that to break
 * silently is the wholesale listing quietly including a retail-only SKU, or the
 * quote engine handing out a sub-MOQ trade price. Both are asserted here.
 */
describe("channel separation", () => {
  it("uses a 50-unit trade minimum", () => {
    expect(WHOLESALE_MOQ).toBe(50);
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

  it("a wholesale quote at the trade minimum lands on the deepest tier", async () => {
    const wholesale = await mockAdapter.getProducts({ wholesaleOnly: true });
    // Any single-SKU trade unit (skip the assorted reseller pack, which has its
    // own ladder) resolves to its top break at 50 units.
    const unit = wholesale.find((p) => p.line === "luxe")!;
    const quote = await mockAdapter.getWholesaleQuote(unit.slug, WHOLESALE_MOQ);
    const deepest = [...unit.wholesale!.tiers].sort((a, b) => b.minQty - a.minQty)[0];
    expect(quote!.unitPrice).toBe(deepest.unitPrice);
    expect(quote!.belowMoq).toBe(false);
  });

  it("keeps the trade unit price below the retail single-unit price", async () => {
    const wholesale = await mockAdapter.getProducts({ wholesaleOnly: true });
    for (const p of wholesale) {
      const quote = await mockAdapter.getWholesaleQuote(p.slug, WHOLESALE_MOQ);
      if (quote) expect(quote.unitPrice).toBeLessThan(p.price);
    }
  });
});

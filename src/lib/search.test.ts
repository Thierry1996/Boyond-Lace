import { describe, expect, it } from "vitest";
import { searchSite, searchIndex, MIN_QUERY_LENGTH } from "./search";
import { catalog } from "./commerce/catalog";

describe("searchIndex", () => {
  it("indexes routes from the navigation ecosystem", () => {
    expect(searchIndex.length).toBeGreaterThan(20);
  });

  it("never indexes a filter view, which is not a destination", () => {
    expect(searchIndex.every((d) => !d.href.includes("?"))).toBe(true);
  });

  it("has no duplicate hrefs", () => {
    const hrefs = searchIndex.map((d) => d.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });
});

describe("searchSite", () => {
  it("returns nothing below the live-search threshold", () => {
    const short = "a".repeat(MIN_QUERY_LENGTH - 1);
    expect(searchSite(short, catalog).total).toBe(0);
  });

  it("finds products by title", () => {
    const r = searchSite("crown", catalog);
    expect(r.products.some((p) => p.title.toLowerCase().includes("crown"))).toBe(true);
  });

  it("finds support pages by synonym rather than title text", () => {
    // "refund" appears in no page title — only in the keyword layer.
    const r = searchSite("refund", catalog);
    expect(r.docs.some((d) => d.href.startsWith("/support"))).toBe(true);
  });

  it("ranks a title prefix above a blurb mention", () => {
    const r = searchSite("wholesale", catalog);
    const top = r.docs[0];
    expect(top.title.toLowerCase().startsWith("wholesale")).toBe(true);
  });

  it("respects the result limits it is given", () => {
    const r = searchSite("lace", catalog, { products: 2, docs: 3 });
    expect(r.products.length).toBeLessThanOrEqual(2);
    expect(r.docs.length).toBeLessThanOrEqual(3);
  });

  it("returns an empty result for gibberish rather than throwing", () => {
    const r = searchSite("zzzzqqqq", catalog);
    expect(r.total).toBe(0);
  });
});

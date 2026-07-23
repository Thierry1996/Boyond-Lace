import { describe, expect, it } from "vitest";
import { catalog } from "./catalog";
import { deriveVariations, COLOR_META } from "./variations";
import type { Shade } from "./types";

/**
 * The whole point of the variation system is consistency: every wig presents
 * the same axis anatomy regardless of how its raw options were authored. These
 * assert that normalisation rather than eyeballing twenty PDPs.
 */
describe("deriveVariations", () => {
  const wigs = catalog.filter((p) => ["luxe", "silk"].includes(p.line) && p.price > 0);

  it("orders options canonically — colour before length before density", () => {
    for (const p of wigs) {
      const axes = deriveVariations(p).options.map((o) => o.axis);
      const order = ["style", "lace", "color", "length", "density", "other"];
      const indices = axes.map((a) => order.indexOf(a));
      expect(indices).toEqual([...indices].sort((x, y) => x - y));
    }
  });

  it("gives every colour value a swatch, even when the raw option omits it", () => {
    for (const p of wigs) {
      const color = deriveVariations(p).options.find((o) => o.axis === "color");
      if (color) {
        for (const v of color.values) expect(v.swatch, `${p.slug} ${v.value}`).toBeTruthy();
      }
    }
  });

  it("presents the standard anatomy — every wig shows style, lace and colour", () => {
    for (const p of wigs) {
      const { options, attributes } = deriveVariations(p);
      const axes = new Set([...options.map((o) => o.axis), ...attributes.map((a) => a.axis)]);
      expect(axes.has("style"), `${p.slug} missing style`).toBe(true);
      expect(axes.has("lace"), `${p.slug} missing lace`).toBe(true);
      expect(axes.has("color"), `${p.slug} missing color`).toBe(true);
    }
  });

  it("does not both fix and vary the same axis", () => {
    for (const p of catalog) {
      const { options, attributes } = deriveVariations(p);
      const varied = new Set(options.map((o) => o.axis));
      for (const a of attributes) expect(varied.has(a.axis)).toBe(false);
    }
  });

  it("has a swatch for every shade the catalogue actually sells", () => {
    const shades = new Set<Shade>();
    for (const p of catalog) if (p.shade) shades.add(p.shade);
    for (const s of shades) expect(COLOR_META[s], `no swatch for ${s}`).toBeTruthy();
  });
});

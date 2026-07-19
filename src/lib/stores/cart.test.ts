import { beforeEach, describe, expect, it } from "vitest";
import { useCartStore } from "./cart";
import type { CartLine } from "@/lib/commerce";

const line = (over: Partial<Omit<CartLine, "id">> = {}) => ({
  productId: "bl-luxe-001",
  slug: "the-reinvention-hd-swiss-full-lace",
  title: "The Reinvention",
  selections: { Length: '18"', Shade: "Espresso" },
  unitPrice: 102500,
  quantity: 1,
  image: "aurora",
  ...over,
});

describe("cart store", () => {
  beforeEach(() => {
    useCartStore.getState().clear();
  });

  it("adds a line", () => {
    useCartStore.getState().add(line());
    expect(useCartStore.getState().lines).toHaveLength(1);
  });

  it("merges identical product + selections into one line", () => {
    useCartStore.getState().add(line());
    useCartStore.getState().add(line());
    const lines = useCartStore.getState().lines;
    expect(lines).toHaveLength(1);
    expect(lines[0].quantity).toBe(2);
  });

  it("keeps different selections as separate lines", () => {
    useCartStore.getState().add(line());
    useCartStore.getState().add(line({ selections: { Length: '24"', Shade: "Platinum" } }));
    expect(useCartStore.getState().lines).toHaveLength(2);
  });

  it("setQuantity below 1 removes the line", () => {
    useCartStore.getState().add(line());
    const id = useCartStore.getState().lines[0].id;
    useCartStore.getState().setQuantity(id, 0);
    expect(useCartStore.getState().lines).toHaveLength(0);
  });

  it("subtotal math is unit price × quantity across lines", () => {
    useCartStore.getState().add(line({ quantity: 2 }));
    useCartStore.getState().add(line({ selections: { Length: '12"' }, unitPrice: 89500 }));
    const subtotal = useCartStore
      .getState()
      .lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0);
    expect(subtotal).toBe(102500 * 2 + 89500);
  });
});

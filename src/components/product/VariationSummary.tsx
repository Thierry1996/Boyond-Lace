import { deriveVariations, type Product } from "@/lib/commerce";

/**
 * Read-only variation summary. Renders the full canonical axis set — style,
 * lace, colour, length, density — the same way on every listing, whether the
 * axis is a fixed attribute or a range the unit offers. Used on the wholesale
 * PDP, where a buyer reviews the spec rather than configures a cart line.
 */
function Swatch({ swatch }: { swatch?: string }) {
  if (!swatch) return null;
  return (
    <span
      aria-hidden="true"
      className="inline-block h-3.5 w-3.5 shrink-0 rounded-full border border-white/25"
      style={{ background: swatch }}
    />
  );
}

export function VariationSummary({ product }: { product: Product }) {
  const { options, attributes } = deriveVariations(product);
  if (options.length === 0 && attributes.length === 0) return null;

  return (
    <div className="space-y-5">
      {/* Fixed axes first, so every unit reads with the same anatomy. */}
      {attributes.map((attr) => (
        <div key={attr.axis} className="grid grid-cols-[88px_1fr] items-baseline gap-4">
          <span className="eyebrow">{attr.label}</span>
          <span className="inline-flex items-center gap-2 text-[0.9375rem] text-paper">
            <Swatch swatch={attr.swatch} />
            {attr.value}
          </span>
        </div>
      ))}

      {/* Ranges the unit offers, as non-interactive chips. */}
      {options.map((opt) => (
        <div key={opt.name} className="grid grid-cols-[88px_1fr] items-baseline gap-4">
          <span className="eyebrow pt-1">{opt.name}</span>
          <div className="flex flex-wrap gap-2">
            {opt.values.map((v) => (
              <span
                key={v.value}
                className="inline-flex items-center gap-1.5 border border-white/15 px-3 py-1.5 text-[0.8125rem] text-neutral-200"
              >
                <Swatch swatch={v.swatch} />
                {v.label}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

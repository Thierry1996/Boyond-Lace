import { deriveProductDetails, type Product } from "@/lib/commerce";
import { ProductImage } from "@/components/ui/ProductImage";
import { InfoAccordion } from "./InfoAccordion";

/**
 * Product information — Description and Product Details, as expandable panels.
 *
 * Two things a considered buyer wants after the price: the editorial "what this
 * is", and the exhaustive spec sheet. Both live in an accordion so the buy
 * column stays short and the detail is one tap away rather than a wall.
 */
export function ProductInformation({ product }: { product: Product }) {
  const details = deriveProductDetails(product);
  const image = product.images[1]?.src ?? product.images[0].src;

  const description = (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-[1fr_1.1fr] sm:items-center">
        <div className="overflow-hidden rounded-lg">
          <ProductImage src={image} alt={`${product.title} texture detail`} ratio="4 / 3" />
        </div>
        <div>
          <p className="text-[0.9375rem] leading-relaxed text-neutral-200">{product.tagline}</p>
          <ul className="mt-4 space-y-2">
            {["Low maintenance", "Long lasting", "Natural hair aesthetics"].map((point) => (
              <li key={point} className="flex items-start gap-2.5 text-[0.875rem] text-neutral-400">
                <span className="mt-1.5 inline-block h-1 w-1 shrink-0 rotate-45 bg-gold" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="text-[0.9375rem] leading-[1.85] text-neutral-400">{product.description}</p>
    </div>
  );

  const detailSheet = (
    <dl className="grid gap-x-8 gap-y-0 sm:grid-cols-2">
      {details.map((row) => (
        <div
          key={row.label}
          className="grid grid-cols-[150px_1fr] gap-4 border-b border-white/[0.06] py-3"
        >
          <dt className="text-[0.8125rem] text-neutral-400">{row.label}</dt>
          <dd className="text-[0.875rem] text-neutral-200">{row.value}</dd>
        </div>
      ))}
    </dl>
  );

  return (
    <InfoAccordion
      items={[
        { title: "Description", body: description },
        { title: "Product details", body: detailSheet },
        {
          title: "Shipping & returns",
          body: (
            <div className="space-y-3 text-[0.9375rem] leading-relaxed text-neutral-400">
              <p>
                Complimentary worldwide shipping over $400, in unbranded outer packaging by default.
                Most orders dispatch within 72 hours from our US and China warehouses.
              </p>
              <p>
                Thirty-day returns while the lace is uncut. If shade was the doubt, the $5 Lace Test
                credit is applied to your order automatically.
              </p>
            </div>
          ),
        },
        {
          title: "Care",
          body: (
            <p className="text-[0.9375rem] leading-relaxed text-neutral-400">
              Human hair does not renew itself — storage on a stand and the right cleanser decide
              whether this unit lasts twelve months or thirty. The Care Bundle ships with every
              order; the Beyond Care ritual keeps it on cycle.
            </p>
          ),
        },
      ]}
    />
  );
}

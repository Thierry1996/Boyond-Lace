import Link from "next/link";
import { Truck, RotateCcw, ShieldCheck, CreditCard } from "lucide-react";
import { deriveProductDetails, type Product } from "@/lib/commerce";

/**
 * Seller guarantees — four cards covering shipping, returns, the hair promise,
 * and payment. The first three are links into the pages that own those
 * policies, so a click goes somewhere real; the fourth lists accepted payment
 * methods. Content is drawn from the product where it varies (lifespan, origin)
 * so the promise on a given unit is that unit's, not boilerplate.
 */

const FREE_SHIPPING_THRESHOLD = "$400";

const PAYMENT_METHODS = [
  "Visa",
  "Mastercard",
  "Amex",
  "Discover",
  "PayPal",
  "Apple Pay",
  "Klarna",
  "Afterpay",
  "Alipay",
];

function GuaranteeCard({
  href,
  icon,
  title,
  intro,
  points,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  intro: string;
  points: string[];
}) {
  return (
    <Link
      href={href}
      className="card-lift group flex flex-col border border-white/[0.09] p-7 transition-colors hover:border-gold/40"
    >
      <div className="flex items-center gap-3">
        <span className="text-gold">{icon}</span>
        <h3 className="font-[family-name:var(--font-display)] text-[1.25rem] text-paper">
          {title}
        </h3>
      </div>
      <p className="mt-4 text-[0.875rem] leading-relaxed text-neutral-400">{intro}</p>
      <ul className="mt-4 space-y-2">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-2.5 text-[0.875rem] text-neutral-200">
            <span className="mt-1.5 inline-block h-1 w-1 shrink-0 rotate-45 bg-gold" />
            {p}
          </li>
        ))}
      </ul>
      <span className="mt-6 text-[0.6875rem] tracking-[0.14em] text-gold uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        Read the policy →
      </span>
    </Link>
  );
}

export function SellerGuarantees({ product }: { product: Product }) {
  const details = deriveProductDetails(product);
  const lifespan =
    details.find((d) => d.label === "Lifespan")?.value ?? "18–30 months with Beyond Care";
  const origin = product.origin ?? "Virgin Remy, cuticle intact";

  return (
    <div className="mx-auto max-w-[1440px] px-[4vw]">
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-5">
        <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,3vw,2.5rem)] text-paper">
          Seller guarantees
        </h2>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <GuaranteeCard
          href="/support#shipping"
          icon={<Truck size={22} strokeWidth={1.5} />}
          title="Fast free shipping · 72-hr dispatch"
          intro="US and China dual warehouses, so the fastest route ships your order."
          points={[
            `Complimentary shipping over ${FREE_SHIPPING_THRESHOLD}, worldwide`,
            "72-hour dispatch on in-stock units",
            "US 2–5 business days · Global 5–7 business days",
            "Unbranded outer packaging by default",
          ]}
        />

        <GuaranteeCard
          href="/support#returns"
          icon={<RotateCcw size={22} strokeWidth={1.5} />}
          title="30-day return guarantee"
          intro="Not right? Thirty days to return it while the lace is uncut."
          points={[
            "Full refund or exchange within 30 days",
            "The $5 Lace Test credit is applied to your order automatically",
            "Return while the lace is uncut and the unit unworn",
          ]}
        />

        <GuaranteeCard
          href="/wholesale#sourcing"
          icon={<ShieldCheck size={22} strokeWidth={1.5} />}
          title="100% human hair guarantee"
          intro="One grade, published construction, and a batch you can reorder."
          points={[
            `${origin} — no synthetic or animal blends`,
            `Lasts ${lifespan.toLowerCase()}; safe to dye, tone and style`,
            "Batch-matched: your reorder matches the unit in your hand",
          ]}
        />

        {/* Payment — accepted methods rather than a policy link. */}
        <div className="flex flex-col border border-white/[0.09] p-7">
          <div className="flex items-center gap-3">
            <span className="text-gold">
              <CreditCard size={22} strokeWidth={1.5} />
            </span>
            <h3 className="font-[family-name:var(--font-display)] text-[1.25rem] text-paper">
              Secure &amp; flexible payment
            </h3>
          </div>
          <p className="mt-4 text-[0.875rem] leading-relaxed text-neutral-400">
            PCI-DSS secured checkout. Pay in full or split it — buy-now-pay-later at no extra cost.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {PAYMENT_METHODS.map((m) => (
              <span
                key={m}
                className="rounded border border-white/12 bg-white/[0.04] px-3 py-1.5 text-[0.75rem] text-neutral-200"
              >
                {m}
              </span>
            ))}
          </div>
          <Link
            href="/support#contact"
            className="mt-6 text-[0.6875rem] tracking-[0.14em] text-gold uppercase underline-offset-4 hover:underline"
          >
            Payment questions →
          </Link>
        </div>
      </div>
    </div>
  );
}

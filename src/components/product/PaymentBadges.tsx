import { ShieldCheck, Lock } from "lucide-react";

/**
 * Accepted-payment and security badges.
 *
 * Rendered as our own small typographic marks on card chrome — the standard
 * merchant "we accept" strip — rather than reproductions of the networks' logo
 * artwork. Each is a recognisable wordmark in the brand's colour on a white
 * card, plus two trust badges. Wire real gateway assets in here when the
 * payment integration lands.
 */

/** A white card holding a brand's wordmark. */
function Card({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <span
      role="img"
      aria-label={label}
      className="inline-flex h-8 w-[3.25rem] items-center justify-center rounded bg-white px-1 shadow-sm"
    >
      {children}
    </span>
  );
}

const BRANDS: Array<{ label: string; mark: React.ReactNode }> = [
  {
    label: "Visa",
    mark: (
      <span className="text-[0.8125rem] font-bold tracking-tight text-[#1a1f71] italic">VISA</span>
    ),
  },
  {
    label: "Mastercard",
    mark: (
      <svg viewBox="0 0 40 24" className="h-4" aria-hidden="true">
        <circle cx="15" cy="12" r="9" fill="#eb001b" />
        <circle cx="25" cy="12" r="9" fill="#f79e1b" fillOpacity="0.9" />
      </svg>
    ),
  },
  {
    label: "American Express",
    mark: (
      <span className="rounded-sm bg-[#2e77bc] px-1 text-[0.5rem] font-bold tracking-tight text-white">
        AMEX
      </span>
    ),
  },
  {
    label: "Discover",
    mark: (
      <span className="text-[0.625rem] font-bold text-[#1a1a1a]">
        DISC<span className="text-[#f68121]">●</span>VER
      </span>
    ),
  },
  {
    label: "PayPal",
    mark: (
      <span className="text-[0.75rem] font-bold italic">
        <span className="text-[#003087]">Pay</span>
        <span className="text-[#0070e0]">Pal</span>
      </span>
    ),
  },
  {
    label: "Apple Pay",
    mark: <span className="text-[0.6875rem] font-semibold text-[#000]"> Pay</span>,
  },
  {
    label: "Google Pay",
    mark: (
      <span className="text-[0.6875rem] font-semibold">
        <span className="text-[#4285f4]">G</span>
        <span className="text-[#ea4335]">o</span>
        <span className="text-[#fbbc05]">o</span>
        <span className="text-[#4285f4]">g</span>
        <span className="text-[#34a853]">l</span>
        <span className="text-[#ea4335]">e</span>
        <span className="ml-0.5 text-[#5f6368]">Pay</span>
      </span>
    ),
  },
  {
    label: "Klarna",
    mark: (
      <span className="rounded-sm bg-[#ffb3c7] px-1.5 text-[0.625rem] font-bold text-[#0a0b09]">
        Klarna.
      </span>
    ),
  },
  {
    label: "Afterpay",
    mark: (
      <span className="text-[0.625rem] font-bold text-[#b2fce4] [text-shadow:0_0_1px_#111]">
        afterpay
      </span>
    ),
  },
  {
    label: "Alipay",
    mark: <span className="text-[0.6875rem] font-bold text-[#1677ff]">Alipay</span>,
  },
];

export function PaymentBadges() {
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {BRANDS.map((b) => (
          <Card key={b.label} label={b.label}>
            {b.mark}
          </Card>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-4 text-[0.6875rem] text-neutral-400">
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck size={13} strokeWidth={1.75} className="text-gold" />
          PCI-DSS v3.2.2 compliant
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Lock size={13} strokeWidth={1.75} className="text-gold" />
          256-bit SSL secured
        </span>
      </div>
    </div>
  );
}

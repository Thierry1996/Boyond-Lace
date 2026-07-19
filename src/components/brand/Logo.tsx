/**
 * Logo system — docs/brand/05-visual-identity.md §4.
 *
 * These are typographic stand-ins built to the correct proportions, clear space,
 * and colour rules. Swap for the real vector marks when they land in
 * assets/brand/ — the API here will not need to change.
 */

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-[family-name:var(--font-display)] leading-none ${className}`}
      // Letter-spacing is dropped below 32px per the type rules.
      style={{ letterSpacing: "0.01em" }}
    >
      Beyond Lace
    </span>
  );
}

/**
 * Aurora monogram. The crown jewel — at most once per viewport, never below
 * 48px, never on a light background.
 */
export function MonogramAurora({ size = 48 }: { size?: number }) {
  return (
    <span
      aria-hidden="true"
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Radial bloom, not a box-shadow — the source art's glow is a render. */}
      <span
        className="absolute inset-0 rounded-full opacity-60 blur-xl"
        style={{ background: "var(--grad-aurora)" }}
      />
      <span
        className="relative font-[family-name:var(--font-display)] italic"
        style={{
          fontSize: size * 0.62,
          background: "var(--grad-aurora)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          letterSpacing: "-0.06em",
        }}
      >
        BL
      </span>
    </span>
  );
}

/** Flat gold monogram. Mandatory below 48px — the gradient muddies at small sizes. */
export function MonogramFlat({ size = 32 }: { size?: number }) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex shrink-0 items-center justify-center rounded-[4px] bg-plum-700"
      style={{ width: size, height: size }}
    >
      <span
        className="font-[family-name:var(--font-display)] text-gold"
        style={{ fontSize: size * 0.5, letterSpacing: "-0.04em" }}
      >
        BL
      </span>
    </span>
  );
}

/** Crown / hair-wave icon. Loyalty tiers, community marks, watermarks. */
export function CrownWave({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M6 13.5 9.5 9l3.25 3.5L16 7l3.25 5.5L22.5 9l3.5 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="6" cy="12" r="1.4" fill="currentColor" />
      <circle cx="16" cy="6" r="1.4" fill="currentColor" />
      <circle cx="26" cy="12" r="1.4" fill="currentColor" />
      <path
        d="M5 19c3.5-2 7-2 11 0s7.5 2 11 0M5 24c3.5-2 7-2 11 0s7.5 2 11 0"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

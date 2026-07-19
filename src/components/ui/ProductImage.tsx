/**
 * Placeholder imagery.
 *
 * No photography exists yet, and the brand's photographic system must be locked
 * to hair only (docs/brand/05-visual-identity.md §8 — the name reads as an
 * intimates brand to image models and ad classifiers alike). Rather than ship
 * misleading stock, these render on-brand gradient fields so layout, rhythm, and
 * colour can be judged honestly. Swap for <Image> against the CDN when the
 * shoot lands.
 */

/* Brand Kit v2 hexes — docs/brand/06-brand-kit-v2.md. */
const FIELDS: Record<string, string> = {
  aurora:
    "linear-gradient(135deg, #46215A 0%, #5A2D67 30%, #DCA8B7 62%, #EECAD5 84%, #C9A66B 100%)",
  velvet: "radial-gradient(120% 100% at 30% 0%, #71407F 0%, #46215A 50%, #321528 100%)",
  plum: "linear-gradient(160deg, #5A2D67 0%, #321528 60%, #090909 100%)",
  blush: "linear-gradient(150deg, #F7E7EC 0%, #EECAD5 40%, #DCA8B7 75%, #895898 100%)",
  gold: "linear-gradient(120deg, #321528 0%, #5A2D67 45%, #A9834D 85%, #C9A66B 100%)",
  mono: "linear-gradient(165deg, #1C181C 0%, #121012 55%, #090909 100%)",
  "mono-2": "linear-gradient(165deg, #2A252A 0%, #1C181C 60%, #090909 100%)",
};

export function ProductImage({
  src,
  alt,
  className = "",
  ratio = "3 / 4",
}: {
  src: string;
  alt: string;
  className?: string;
  ratio?: string;
}) {
  return (
    <div
      role="img"
      aria-label={alt}
      className={`relative overflow-hidden bg-neutral-900 ${className}`}
      style={{ aspectRatio: ratio, background: FIELDS[src] ?? FIELDS.plum }}
    >
      {/* Grain keeps large flat gradients from banding on cheap panels. */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}

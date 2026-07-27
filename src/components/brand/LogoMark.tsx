import Image from "next/image";

/** Intrinsic size of the trademark artwork served to the page. */
const MARK_W = 1203;
const MARK_H = 621;

/**
 * Official trademark — the BL monogram, crown and hair-wave lockup with the
 * "Beyond Lace" wordmark, served from /public/brand/trademark-mark.png.
 *
 * The canonical artwork lives at /public/brand/trademark.png (the untouched
 * 1792×2240 original). `trademark-mark.png` is a *lossless* PNG crop of that
 * original — the mark's exact pixels with the black padding and the corner
 * watermark trimmed away, nothing resampled or recompressed. The lockup is
 * gilded gold + rose on a baked-in black ground (opaque RGB, no alpha), so the
 * logo band is deliberately dark in BOTH themes; that is how the mark is drawn.
 *
 * The Image is rendered `unoptimized` on purpose: the brief is to place the
 * trademark without shrinking or compressing it, so the original PNG bytes are
 * served rather than a re-encoded AVIF/WebP. The browser only ever scales it
 * down to the CSS width, never up, so it stays crisp.
 */
export function LogoMark({
  width = 240,
  priority = false,
  className = "",
  showTagline = true,
}: {
  width?: number;
  priority?: boolean;
  className?: string;
  showTagline?: boolean;
  /** @deprecated The artwork is now pre-cropped; retained for call-site compatibility. */
  crop?: boolean;
}) {
  return (
    <span className={`inline-block ${className}`} style={{ maxWidth: width }}>
      <Image
        src="/brand/trademark-mark.png"
        alt="Beyond Lace"
        width={MARK_W}
        height={MARK_H}
        priority={priority}
        unoptimized
        sizes={`${width}px`}
        className="block h-auto w-full"
      />
      <span className="sr-only">
        {showTagline ? "Beyond Lace. Beyond Beautiful." : "Beyond Lace"}
      </span>
    </span>
  );
}

/** Compact monogram for tight spots — footer badges, portal sidebar. */
export function LogoIcon({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <Image
      src="/brand/footer-icon.png"
      alt="Beyond Lace"
      width={size}
      height={size}
      sizes={`${size}px`}
      className={`shrink-0 rounded-md object-contain ${className}`}
    />
  );
}

import Image from "next/image";

/**
 * Official wordmark, served from /public/brand/wordmark.png.
 *
 * The supplied PNGs are opaque RGB with a baked-in black ground — no alpha
 * channel — so the artwork cannot sit on a light surface without showing a
 * black rectangle. Rather than filtering the image (which dulls the gold), the
 * logo band is deliberately dark in BOTH themes. That is also how the mark was
 * designed: gilded gold reads as metal on black and as mustard on parchment.
 *
 * The source files are 1.3–2 MB each; next/image resizes and re-encodes to
 * AVIF/WebP at the requested width, so the wire cost is a fraction of that.
 *
 * When transparent SVG or PNG artwork is available, drop it in at the same path
 * and delete the `bg-ink` wrapper — nothing else needs to change.
 */
export function LogoMark({
  width = 240,
  priority = false,
  className = "",
  showTagline = true,
  crop = true,
}: {
  width?: number;
  priority?: boolean;
  className?: string;
  showTagline?: boolean;
  /**
   * Crop the artwork's baked-in vertical padding. The 16:9 source wraps the
   * wordmark in roughly half a frame of empty black, which forces the masthead
   * to be ~160px tall for ~55px of actual logo. Because the padding is opaque
   * black and the logo band is the same black, cropping to the glyphs is
   * seamless — the mark simply stops carrying dead space. Set false to show
   * the untouched frame (e.g. on a non-black surface).
   */
  crop?: boolean;
}) {
  // Source artwork is 2048×1152 (16:9) with generous internal padding.
  const height = Math.round((width * 1152) / 2048);

  return (
    <span className={`inline-flex flex-col items-center ${className}`}>
      {crop ? (
        // object-cover in a shorter box scales to the width and trims the
        // padding equally top and bottom; the mark is centred in the source.
        <span className="block w-full overflow-hidden" style={{ aspectRatio: "2048 / 560" }}>
          <Image
            src="/brand/wordmark.png"
            alt="Beyond Lace"
            width={width}
            height={height}
            priority={priority}
            sizes={`${width}px`}
            className="h-full w-full object-cover"
          />
        </span>
      ) : (
        <Image
          src="/brand/wordmark.png"
          alt="Beyond Lace"
          width={width}
          height={height}
          priority={priority}
          sizes={`${width}px`}
          className="h-auto w-full object-contain"
        />
      )}
      {showTagline && <span className="sr-only">Beyond Lace. Beyond Beautiful.</span>}
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

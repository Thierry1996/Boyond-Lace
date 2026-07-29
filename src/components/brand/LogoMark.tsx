import Image from "next/image";

/**
 * Official wordmark — the gold "Beyond Lace" lockup, served from
 * /public/brand/wordmark.png.
 *
 * The supplied PNGs are opaque RGB with a baked-in black ground — no alpha
 * channel — so the artwork cannot sit on a light surface without showing a
 * black rectangle. Rather than filtering the image (which dulls the gold), the
 * logo band is deliberately dark in BOTH themes. That is also how the mark was
 * designed: gilded gold reads as metal on black and as mustard on parchment.
 *
 * Rendered `unoptimized`: the original PNG bytes are served rather than a
 * re-encoded AVIF/WebP, so the wordmark is never recompressed — the browser
 * only scales it down to the CSS width.
 *
 * The BL-crown trademark lives at /public/brand/trademark-mark.png and is used
 * in the footer's copyright line (see Footer.tsx), not here.
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
   * to be tall for a short logo. Because the padding is opaque black and the
   * logo band is the same black, cropping to the glyphs is seamless. Set false
   * to show the untouched frame (e.g. on a non-black surface).
   */
  crop?: boolean;
}) {
  // Source artwork is 2048×1152 (16:9). The logo + tagline glyph area
  // occupies roughly the centre 640 px of that 1152 px height.
  // We expose the corrected intrinsic height so Next.js reserves the
  // right amount of space before the image loads, preventing CLS.
  const srcH = Math.round((width * 1152) / 2048);

  return (
    <span className={`inline-flex flex-col items-center ${className}`}>
      {crop ? (
        // Crop to the glyph region only. The 2048:640 ratio matches where
        // the wordmark + tagline actually live inside the source frame.
        // object-[center_55%] aligns to the visual centre of the artwork.
        <span
          className="block w-full overflow-hidden"
          style={{ aspectRatio: "2048 / 640" }}
        >
          <Image
            src="/brand/wordmark.png"
            alt="Beyond Lace"
            width={width}
            height={srcH}
            priority={priority}
            quality={95}
            sizes={`(max-width: 640px) ${Math.round(width * 0.85)}px, ${width}px`}
            className="h-full w-full object-cover object-[center_55%]"
          />
        </span>
      ) : (
        <Image
          src="/brand/wordmark.png"
          alt="Beyond Lace"
          width={width}
          height={srcH}
          priority={priority}
          quality={95}
          sizes={`(max-width: 640px) ${Math.round(width * 0.85)}px, ${width}px`}
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

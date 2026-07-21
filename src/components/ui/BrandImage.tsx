import Image from "next/image";
import { IMAGERY, photoUrl, type ImageryKey } from "@/lib/imagery";

/**
 * Photographic brand image. Wraps next/image against the registry in
 * lib/imagery.ts so art direction stays centralised, and always sits on a plum
 * base colour so a slow or failed remote load degrades to brand tone rather
 * than a white flash.
 */
export function BrandImage({
  name,
  width = 800,
  height,
  className = "",
  imgClassName = "",
  ratio = "1 / 1",
  priority = false,
  sizes = "(max-width: 768px) 50vw, 25vw",
  overlay = true,
}: {
  name: ImageryKey;
  width?: number;
  height?: number;
  className?: string;
  imgClassName?: string;
  ratio?: string;
  priority?: boolean;
  sizes?: string;
  /** Plum→ink scrim so gold/white type stays legible over any photograph. */
  overlay?: boolean;
}) {
  const photo = IMAGERY[name];

  return (
    <div
      className={`relative overflow-hidden bg-plum-900 ${className}`}
      style={{ aspectRatio: ratio }}
    >
      <Image
        src={photoUrl(photo.id, width, height)}
        alt={photo.alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover ${imgClassName}`}
      />
      {overlay && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgb(9 9 9 / 0.85) 0%, rgb(50 21 40 / 0.45) 45%, rgb(50 21 40 / 0.1) 100%)",
          }}
        />
      )}
    </div>
  );
}

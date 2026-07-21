import Link from "next/link";

/**
 * Brand social glyphs as uniform inline SVGs — one visual language across the
 * whole app (ref: brand icon board). Kept as paths rather than mixing icon
 * libraries so stroke weight, sizing, and alignment never drift between
 * platforms lucide does and doesn't ship.
 */

type IconProps = { size?: number; className?: string };

export function InstagramGlyph({ size = 20, className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function WhatsAppGlyph({ size = 20, className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M8.8 8.2c-.2 0-.5 0-.7.3-.2.3-.8.8-.8 1.9s.8 2.2 1 2.4c.1.2 1.6 2.6 4 3.5 2 .8 2.4.6 2.8.6.4 0 1.3-.5 1.5-1.1.2-.5.2-1 .1-1.1l-.7-.4c-.3-.1-1.3-.6-1.5-.7-.2-.1-.4-.1-.5.1l-.7.9c-.1.1-.3.2-.5.1-.3-.1-1.1-.4-2-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5l.4-.5c.1-.2.2-.3.2-.5v-.4c0-.1-.5-1.3-.7-1.7-.2-.4-.4-.4-.5-.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function TikTokGlyph({ size = 20, className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M14 3v10.5a3.5 3.5 0 1 1-3-3.46"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M14 3c.4 2.4 2 4 4.5 4.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function YouTubeGlyph({ size = 20, className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect x="2.5" y="6" width="19" height="12" rx="3.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10.5 9.5v5l4-2.5-4-2.5Z" fill="currentColor" />
    </svg>
  );
}

export function PinterestGlyph({ size = 20, className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M9.5 20c-.4-1.3-.2-2.4 0-3.3l1-4.2s-.3-.6-.3-1.4c0-1.3.8-2.3 1.7-2.3.8 0 1.2.6 1.2 1.4 0 .8-.5 2-.8 3.2-.2.9.4 1.7 1.4 1.7 1.7 0 2.9-2.2 2.9-4.7 0-1.9-1.3-3.4-3.7-3.4a4.2 4.2 0 0 0-4.4 4.2c0 .8.3 1.6.7 2 .1.1.1.2 0 .3l-.2.9c0 .2-.1.2-.3.1-1.2-.5-1.9-2-1.9-3.3 0-2.7 2-5.2 5.7-5.2 3 0 5.3 2.1 5.3 5 0 3-1.9 5.4-4.5 5.4-.9 0-1.7-.5-2-1l-.5 2c-.2.7-.6 1.6-1 2.1Z"
        fill="currentColor"
      />
    </svg>
  );
}

export interface SocialLink {
  label: string;
  href: string;
  Glyph: (p: IconProps) => React.ReactElement;
}

/** Brand handles — @BeyondLace across platforms, per docs/brand strategy. */
export const SOCIAL_LINKS: SocialLink[] = [
  { label: "Instagram", href: "https://instagram.com/beyondlace", Glyph: InstagramGlyph },
  { label: "TikTok", href: "https://tiktok.com/@beyondlace", Glyph: TikTokGlyph },
  { label: "YouTube", href: "https://youtube.com/@beyondlace", Glyph: YouTubeGlyph },
  { label: "Pinterest", href: "https://pinterest.com/beyondlace", Glyph: PinterestGlyph },
  { label: "WhatsApp", href: "https://wa.me/10000000000", Glyph: WhatsAppGlyph },
];

/** Consistent social row — gold glyphs on plum tiles, per the icon board. */
export function SocialRow({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {SOCIAL_LINKS.map(({ label, href, Glyph }) => (
        <Link
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gold/25 bg-plum-900 text-gold transition-colors duration-300 hover:border-gold hover:bg-plum-800"
        >
          <Glyph size={18} />
        </Link>
      ))}
    </div>
  );
}

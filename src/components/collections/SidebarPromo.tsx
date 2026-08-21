"use client";

import Link from "next/link";
import { useState } from "react";

/**
 * Sidebar promotional slot. Renders a promo image/GIF dropped at
 * public/media/images/sidebar/<file> (served from /media/images/sidebar/…).
 * Until the file exists it shows an on-brand placeholder so the slot is visible
 * and positioned, rather than a broken image. Swap the `src` filename per slot.
 */
export function SidebarPromo({
  src = "/media/images/sidebar/promo.gif",
  href = "/sale",
  alt = "Beyond Lace promotion",
  label = "Sidebar promo",
}: {
  src?: string;
  href?: string;
  alt?: string;
  label?: string;
}) {
  const [ok, setOk] = useState(true);

  return (
    <Link
      href={href}
      className="mt-8 block overflow-hidden rounded-lg ring-1 ring-white/[0.08] transition-all duration-300 hover:ring-gold/50"
      aria-label={alt}
    >
      {ok ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="block h-auto w-full" onError={() => setOk(false)} />
      ) : (
        <div className="flex aspect-[4/5] flex-col items-center justify-center gap-2 bg-[linear-gradient(150deg,#46215A_0%,#5A2D67_45%,#895898_100%)] p-6 text-center">
          <span className="text-[0.625rem] tracking-[0.18em] text-blush-200/80 uppercase">
            {label}
          </span>
          <span className="text-[0.75rem] leading-snug text-paper/90">
            Drop a GIF at
            <br />
            <code className="text-[0.6875rem] text-gold">/media/images/sidebar/promo.gif</code>
          </span>
        </div>
      )}
    </Link>
  );
}

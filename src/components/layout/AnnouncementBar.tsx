"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Marquee } from "@/components/motion/interactions";

/**
 * Header row 1 — announcement marquee.
 *
 * Scrolling rather than static so the bar carries several messages without
 * stacking them, and dismissible because a permanently undismissable band is
 * the fastest way to make a premium site feel like a discount one. The
 * dismissal persists, so it does not nag on every navigation.
 */

const NOTICES = [
  { text: "Complimentary worldwide shipping over $400", href: "/legal/shipping-policy" },
  { text: "The Lace Test — $5, credited back in full", href: "/product/lace-test-kit" },
  { text: "30-day returns, lace uncut", href: "/support/returns-portal" },
  { text: "Capsule drops: 200 numbered units, never restocked", href: "/drops" },
  { text: "Salon partners — MOQ 50, MAP protected", href: "/wholesale" },
];

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(true);

  // Read persisted state after mount so server and first client paint agree.
  useEffect(() => {
    try {
      setDismissed(localStorage.getItem("bl.announce.dismissed") === "1");
    } catch {
      setDismissed(false);
    }
  }, []);

  if (dismissed) return null;

  return (
    <div className="relative overflow-hidden bg-plum-900">
      <div className="flex items-center">
        <Marquee speed={52} className="flex-1">
          {NOTICES.map((n, i) => (
            <Link
              key={`${n.text}-${i}`}
              href={n.href}
              className="group/notice flex items-center whitespace-nowrap"
            >
              <span className="px-6 py-2.5 text-[0.75rem] tracking-[0.06em] text-blush-200/85 transition-colors duration-300 group-hover/notice:text-gold-300">
                {n.text}
              </span>
              <span aria-hidden="true" className="h-1 w-1 rotate-45 bg-gold/60" />
            </Link>
          ))}
        </Marquee>

        <button
          type="button"
          onClick={() => {
            setDismissed(true);
            try {
              localStorage.setItem("bl.announce.dismissed", "1");
            } catch {
              /* private mode — dismissal simply won't persist */
            }
          }}
          aria-label="Dismiss announcements"
          className="relative z-10 shrink-0 px-4 py-2.5 text-blush-200/60 transition-colors duration-300 hover:text-gold"
        >
          <X size={14} strokeWidth={1.6} />
        </button>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/**
 * Back-to-top button. Docks at the lower right, just above the support-chat
 * launcher, and fades in once the shopper has scrolled a screenful down. Sits
 * below the chat's z-index so an open chat panel covers it. Smooth-scrolls to
 * the top (respecting reduced-motion). Brand pill with dark-island so the gold
 * mark stays legible in both light and dark modes.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function toTop() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      className={`dark-island fixed right-5 bottom-24 z-[70] grid h-11 w-11 place-items-center rounded-full border border-gold/40 bg-gradient-to-br from-plum-900 to-ink text-gold shadow-[0_10px_30px_-10px_rgba(0,0,0,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:text-gold-400 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <ArrowUp size={18} strokeWidth={2} />
    </button>
  );
}

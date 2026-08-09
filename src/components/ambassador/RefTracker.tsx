"use client";

import { useEffect } from "react";

/**
 * Referral capture. When a shopper arrives from an ambassador's shared link
 * (`…?ref=CODE`), this fires once to record the click and set the attribution
 * cookie server-side, then strips `ref` from the URL so it isn't re-sent or
 * shared onward. Mounted globally; a no-op on every normal page load.
 */
export function RefTracker() {
  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("ref");
    if (!code) return;

    // Only fire once per code per session.
    const key = `bl.ref.tracked.${code}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      /* ignore */
    }

    void fetch("/api/ambassador/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
      keepalive: true,
    }).catch(() => {});

    // Tidy the address bar without a navigation.
    url.searchParams.delete("ref");
    window.history.replaceState({}, "", url.pathname + url.search + url.hash);
  }, []);

  return null;
}

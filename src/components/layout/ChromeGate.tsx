"use client";

import { usePathname } from "next/navigation";

/**
 * Storefront chrome gate. The admin console is a standalone control centre — it
 * must not carry the shopper's header, footer, cart drawer, channel gate or any
 * marketing popup. This wraps the storefront chrome and renders nothing on the
 * `/admin` and `/admin-login` surfaces, so those routes present as their own
 * app. `usePathname` resolves during SSR, so there is no chrome flash.
 */
export function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname && pathname.startsWith("/admin")) return null;
  return <>{children}</>;
}

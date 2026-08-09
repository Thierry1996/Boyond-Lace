import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const metadata: Metadata = {
  title: "Admin Sign-in — Beyond Lace Control Centre",
  robots: { index: false, follow: false },
};

/**
 * The control-centre's own front door. Deliberately not under `/admin` (which is
 * gated), and rendered with no storefront chrome (see ChromeGate), so the admin
 * app stands alone. A dark, focused sign-in — nothing else.
 */
export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1a0b16] via-plum-900 to-ink px-[6vw] py-16">
      <Suspense fallback={null}>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}

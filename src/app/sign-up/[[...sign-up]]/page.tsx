import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";
import { clerkEnabled } from "@/lib/clerk";
import { AuthUnconfigured } from "@/components/auth/AuthUnconfigured";

export const metadata: Metadata = { title: "Create Account" };

export default function SignUpPage() {
  return (
    <div className="surface-velvet flex min-h-[85vh] items-center justify-center px-[4vw] py-20">
      {clerkEnabled ? (
        <SignUp signInUrl="/sign-in" fallbackRedirectUrl="/account" />
      ) : (
        <AuthUnconfigured />
      )}
    </div>
  );
}

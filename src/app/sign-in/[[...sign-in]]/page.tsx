import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";
import { clerkEnabled } from "@/lib/clerk";
import { AuthUnconfigured } from "@/components/auth/AuthUnconfigured";

export const metadata: Metadata = { title: "Sign In" };

export default function SignInPage() {
  return (
    <div className="surface-velvet flex min-h-[85vh] items-center justify-center px-[4vw] py-20">
      {clerkEnabled ? (
        <SignIn signUpUrl="/sign-up" fallbackRedirectUrl="/account" />
      ) : (
        <AuthUnconfigured />
      )}
    </div>
  );
}

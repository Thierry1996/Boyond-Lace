import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = { title: "Sign In" };

export default function SignInPage() {
  return (
    <div className="surface-velvet flex min-h-[85vh] items-center justify-center px-[4vw] py-20">
      <Suspense fallback={null}>
        <AuthForm mode="sign-in" />
      </Suspense>
    </div>
  );
}

import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";

export const metadata: Metadata = { title: "Sign In" };

export default function SignInPage() {
  return (
    <div className="surface-velvet flex min-h-[85vh] items-center justify-center px-[4vw] py-20">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="eyebrow mb-3 text-gold">Welcome back</p>
          <h1 className="text-3xl text-paper">Sign in.</h1>
        </div>
        <div className="flex justify-center">
          <SignIn />
        </div>
      </div>
    </div>
  );
}

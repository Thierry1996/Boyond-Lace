import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";

export const metadata: Metadata = { title: "Create Account" };

export default function SignUpPage() {
  return (
    <div className="surface-velvet flex min-h-[85vh] items-center justify-center px-[4vw] py-20">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="eyebrow mb-3 text-gold">The beginning</p>
          <h1 className="text-3xl text-paper">Create your account.</h1>
        </div>
        <div className="flex justify-center">
          <SignUp />
        </div>
      </div>
    </div>
  );
}

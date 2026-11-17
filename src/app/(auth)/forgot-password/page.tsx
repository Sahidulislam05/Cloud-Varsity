// src/app/(auth)/forgot-password/page.tsx
import Link from "next/link";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Forgot password",
  description:
    "Request a 6-digit password reset code for your CloudVarsity account.",
  path: "/forgot-password",
});

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Forgot password?</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your account email and we will send you a 6-digit reset code.
        </p>
      </div>

      <ForgotPasswordForm />

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Remembered it?{" "}
        <Link
          href="/login"
          className="font-medium text-primary hover:underline"
        >
          Back to log in
        </Link>
      </p>
    </div>
  );
}

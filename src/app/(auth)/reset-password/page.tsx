// src/app/(auth)/reset-password/page.tsx
import Link from "next/link";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { getParam } from "@/lib/search-params";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Reset password",
  description:
    "Set a new password for your CloudVarsity account using the code we emailed you.",
  path: "/reset-password",
});

export default async function ResetPasswordPage(
  props: PageProps<"/reset-password">,
) {
  // The forgot-password page links here with ?email= preselected; untrusted,
  // so it only lands in a validated form field
  const searchParams = await props.searchParams;
  const email = getParam(searchParams, "email") ?? "";

  return (
    <div className="w-full max-w-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          Set a new password
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter the 6-digit code we emailed you and choose a new password.
        </p>
      </div>

      <ResetPasswordForm initialEmail={email} />

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Did not get the code?{" "}
        <Link
          href="/forgot-password"
          className="font-medium text-primary hover:underline"
        >
          Request a new one
        </Link>
      </p>
    </div>
  );
}

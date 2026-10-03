// src/app/(auth)/login/page.tsx
import Link from "next/link";
import { DemoLogin } from "@/components/auth/demo-login";
import { LoginForm } from "@/components/auth/login-form";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Log in",
  description:
    "Log in to your CloudVarsity account, or try the platform instantly with a one-click demo login.",
  path: "/login",
});

export default function LoginPage() {
  return (
    <div className="w-full max-w-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Log in to your CloudVarsity account.
        </p>
      </div>

      <LoginForm />

      <div
        className="my-6 flex items-center gap-3 text-xs text-muted-foreground"
        aria-hidden="true"
      >
        <span className="h-px flex-1 bg-border" />
        OR
        <span className="h-px flex-1 bg-border" />
      </div>

      <DemoLogin />

      <p className="mt-6 text-center text-xs text-muted-foreground">
        New student?{" "}
        <Link
          href="/register"
          className="font-medium text-primary hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}

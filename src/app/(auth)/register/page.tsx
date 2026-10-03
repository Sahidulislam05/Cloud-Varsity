// src/app/(auth)/register/page.tsx
import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";
import { getPrograms } from "@/lib/public-data";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Create an account",
  description:
    "Register as a CloudVarsity student, choose your program and start registering for courses.",
  path: "/register",
});

export default async function RegisterPage() {
  // Server Component এ ডেটা আনছি, তাই ফর্ম খোলার আগেই dropdown ভরা থাকে, client এ আলাদা loading লাগে না
  const programs = (await getPrograms().catch(() => null))?.data ?? [];
  const currentYear = new Date().getFullYear();
  const batchYears = Array.from({ length: 7 }, (_, index) =>
    String(currentYear - index),
  );

  return (
    <div className="w-full max-w-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          Create your student account
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Only students can register here. Staff accounts are created by the
          university administration.
        </p>
      </div>

      <RegisterForm programs={programs} batchYears={batchYears} />

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}

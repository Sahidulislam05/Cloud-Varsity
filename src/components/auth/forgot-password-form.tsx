// src/components/auth/forgot-password-form.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MailCheck, Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormField } from "@/components/shared/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForgotPassword } from "@/hooks/use-password-reset";
import { ApiError } from "@/lib/api-client";
import { applyApiErrors } from "@/lib/form-errors";
import {
  type ForgotPasswordValues,
  forgotPasswordSchema,
} from "@/lib/validation/auth";

export function ForgotPasswordForm() {
  const forgot = useForgotPassword();
  // Set after the request succeeds, switching the form to the "check your
  // email" confirmation view
  const [sentTo, setSentTo] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const busy = isSubmitting || forgot.isPending;

  const onSubmit = async (values: ForgotPasswordValues) => {
    try {
      await forgot.mutateAsync(values);
      setSentTo(values.email);
    } catch (error) {
      if (applyApiErrors(error, setError, ["email"])) return;
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  };

  if (sentTo) {
    return (
      <div className="border border-t-4 border-t-success border-border bg-card p-6 text-center">
        <div className="mx-auto flex size-12 items-center justify-center bg-success/10 text-success">
          <MailCheck className="size-6" aria-hidden="true" />
        </div>
        <h2 className="mt-4 text-xl font-bold tracking-tight">
          Check your email
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          We sent a 6-digit reset code to{" "}
          <span className="font-medium text-foreground">{sentTo}</span>. Use it
          to set a new password.
        </p>
        <Button asChild className="mt-6 w-full">
          <Link href={`/reset-password?email=${encodeURIComponent(sentTo)}`}>
            Enter reset code
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <FormField label="Email" htmlFor="email" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email")}
        />
      </FormField>

      <Button type="submit" className="w-full" disabled={busy}>
        {busy ? (
          <>
            <Loader2 className="animate-spin" /> Sending code…
          </>
        ) : (
          <>
            <Send /> Send reset code
          </>
        )}
      </Button>
    </form>
  );
}

// src/components/auth/reset-password-form.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { PasswordInput } from "@/components/auth/password-input";
import { FormField } from "@/components/shared/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useResetPassword } from "@/hooks/use-password-reset";
import { ApiError } from "@/lib/api-client";
import { applyApiErrors } from "@/lib/form-errors";
import {
  type ResetPasswordValues,
  resetPasswordSchema,
} from "@/lib/validation/auth";

type ResetPasswordFormProps = { initialEmail?: string };

const FIELD_NAMES = ["email", "otp", "newPassword", "confirmPassword"] as const;

export function ResetPasswordForm({ initialEmail }: ResetPasswordFormProps) {
  const reset = useResetPassword();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: initialEmail ?? "",
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const busy = isSubmitting || reset.isPending;

  const onSubmit = async (values: ResetPasswordValues) => {
    try {
      // On success the hook shows a toast and redirects to /login
      await reset.mutateAsync(values);
    } catch (error) {
      if (applyApiErrors(error, setError, FIELD_NAMES)) return;
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  };

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

      <FormField
        label="Reset code"
        htmlFor="otp"
        hint="The 6-digit code we emailed you"
        error={errors.otp?.message}
      >
        <Input
          id="otp"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          className="text-center font-mono tracking-[0.5em]"
          aria-invalid={!!errors.otp}
          aria-describedby={errors.otp ? "otp-error" : undefined}
          {...register("otp")}
        />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="New password"
          htmlFor="newPassword"
          hint="At least 6 characters"
          error={errors.newPassword?.message}
        >
          <PasswordInput
            id="newPassword"
            autoComplete="new-password"
            aria-invalid={!!errors.newPassword}
            aria-describedby={
              errors.newPassword ? "newPassword-error" : undefined
            }
            {...register("newPassword")}
          />
        </FormField>
        <FormField
          label="Confirm password"
          htmlFor="confirmPassword"
          error={errors.confirmPassword?.message}
        >
          <PasswordInput
            id="confirmPassword"
            autoComplete="new-password"
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={
              errors.confirmPassword ? "confirmPassword-error" : undefined
            }
            {...register("confirmPassword")}
          />
        </FormField>
      </div>

      <Button type="submit" className="w-full" disabled={busy}>
        {busy ? (
          <>
            <Loader2 className="animate-spin" /> Updating password…
          </>
        ) : (
          <>
            <KeyRound /> Set new password
          </>
        )}
      </Button>
    </form>
  );
}

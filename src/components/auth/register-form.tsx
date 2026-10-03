// src/components/auth/register-form.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UserPlus } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { PasswordInput } from "@/components/auth/password-input";
import { FormField } from "@/components/shared/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRegister } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api-client";
import { applyApiErrors } from "@/lib/form-errors";

import type { Program } from "@/types/academics";
import { registerSchema, RegisterValues } from "@/lib/validation/auth";

type RegisterFormProps = { programs: Program[]; batchYears: string[] };

const FIELD_NAMES = [
  "name",
  "email",
  "phone",
  "programId",
  "batch",
  "password",
] as const;

export function RegisterForm({ programs, batchYears }: RegisterFormProps) {
  const registration = useRegister();
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      programId: "",
      batch: "",
      password: "",
      confirmPassword: "",
    },
  });

  const busy = isSubmitting || registration.isSuccess;
  const noPrograms = programs.length === 0;

  const onSubmit = async (values: RegisterValues) => {
    try {
      await registration.mutateAsync({
        name: values.name,
        email: values.email,
        password: values.password,
        programId: values.programId,
        batch: Number(values.batch),
        phone: values.phone || undefined,
      });
    } catch (error) {
      if (applyApiErrors(error, setError, FIELD_NAMES)) return;

      const message =
        error instanceof ApiError
          ? error.message
          : "Something went wrong. Please try again.";
      // "This email is already registered" এর মতো মেসেজ আলাদা field নাম ছাড়াই আসে, তাই email ঘরের নিচে বসাই
      if (/email/i.test(message))
        setError("email", { type: "server", message });
      else toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {noPrograms && (
        <div
          role="alert"
          className="border border-warning/40 bg-warning/10 p-3 text-xs"
        >
          Programs could not be loaded right now, so registration is
          unavailable. Please try again in a moment.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Full name"
          htmlFor="name"
          error={errors.name?.message}
        >
          <Input
            id="name"
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            {...register("name")}
          />
        </FormField>
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
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Phone"
          htmlFor="phone"
          optional
          error={errors.phone?.message}
        >
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            {...register("phone")}
          />
        </FormField>
        <FormField
          label="Batch (admission year)"
          htmlFor="batch"
          error={errors.batch?.message}
        >
          <Controller
            control={control}
            name="batch"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id="batch"
                  className="w-full"
                  aria-invalid={!!errors.batch}
                  aria-describedby={errors.batch ? "batch-error" : undefined}
                >
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {batchYears.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>
      </div>

      <FormField
        label="Program"
        htmlFor="programId"
        error={errors.programId?.message}
      >
        <Controller
          control={control}
          name="programId"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={noPrograms}
            >
              <SelectTrigger
                id="programId"
                className="w-full"
                aria-invalid={!!errors.programId}
                aria-describedby={
                  errors.programId ? "programId-error" : undefined
                }
              >
                <SelectValue placeholder="Select your program" />
              </SelectTrigger>
              <SelectContent>
                {programs.map((program) => (
                  <SelectItem key={program.id} value={program.id}>
                    {program.name} ({program.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Password"
          htmlFor="password"
          hint="At least 6 characters"
          error={errors.password?.message}
        >
          <PasswordInput
            id="password"
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
            {...register("password")}
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

      <Button type="submit" className="w-full" disabled={busy || noPrograms}>
        {busy ? (
          <>
            <Loader2 className="animate-spin" /> Creating account…
          </>
        ) : (
          <>
            <UserPlus /> Create account
          </>
        )}
      </Button>
    </form>
  );
}

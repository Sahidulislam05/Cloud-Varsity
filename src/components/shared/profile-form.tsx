"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { useUpdateProfile } from "@/hooks/use-profile";
import { ApiError } from "@/lib/api-client";
import { applyApiErrors } from "@/lib/form-errors";
import type { Profile } from "@/types/student";
import { profileSchema, ProfileValues } from "@/lib/validation/profile";

const GENDER_OPTIONS = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
];

export function ProfileForm({ profile }: { profile: Profile }) {
  const update = useUpdateProfile();
  const {
    register,
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile.name,
      phone: profile.phone ?? "",
      gender: profile.gender ?? "",
    },
  });

  const onSubmit = async (values: ProfileValues) => {
    try {
      await update.mutateAsync({
        name: values.name,
        phone: values.phone,
        gender: values.gender || undefined,
      });
      reset(values); // সংরক্ষিত মানটাই নতুন "পরিষ্কার" অবস্থা, তাই Save আবার বন্ধ হয়ে যাবে
    } catch (error) {
      if (applyApiErrors(error, setError, ["name", "phone", "gender"])) return;
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Could not update your profile",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <FormField label="Full name" htmlFor="name" error={errors.name?.message}>
        <Input
          id="name"
          autoComplete="name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          {...register("name")}
        />
      </FormField>

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
        label="Gender"
        htmlFor="gender"
        optional
        error={errors.gender?.message}
      >
        <Controller
          control={control}
          name="gender"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="gender" className="w-full">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                {GENDER_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </FormField>

      <Button type="submit" disabled={!isDirty || isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" /> Saving…
          </>
        ) : (
          "Save changes"
        )}
      </Button>
    </form>
  );
}

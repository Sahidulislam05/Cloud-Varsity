// src/components/student/profile-view.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, TriangleAlert } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { EmptyState } from "@/components/shared/empty-state";
import { FormField } from "@/components/shared/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyProfile, usePrograms, useUpdateProfile } from "@/hooks/use-student";
import { ApiError } from "@/lib/api-client";
import { applyApiErrors } from "@/lib/form-errors";
import { formatDate } from "@/lib/format";
import type { Profile } from "@/types/student";
import { profileSchema, ProfileValues } from "@/lib/validation/profile";

const GENDER_OPTIONS = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
];

function ProfileForm({ profile }: { profile: Profile }) {
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
    defaultValues: { name: profile.name, phone: profile.phone ?? "", gender: profile.gender ?? "" },
  });

  const onSubmit = async (values: ProfileValues) => {
    try {
      await update.mutateAsync({ name: values.name, phone: values.phone, gender: values.gender || undefined });
      reset(values); 
    } catch (error) {
      if (applyApiErrors(error, setError, ["name", "phone", "gender"])) return;
      toast.error(error instanceof ApiError ? error.message : "Could not update your profile");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <FormField label="Full name" htmlFor="name" error={errors.name?.message}>
        <Input id="name" autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} {...register("name")} />
      </FormField>

      <FormField label="Phone" htmlFor="phone" optional error={errors.phone?.message}>
        <Input id="phone" type="tel" autoComplete="tel" aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "phone-error" : undefined} {...register("phone")} />
      </FormField>

      <FormField label="Gender" htmlFor="gender" optional error={errors.gender?.message}>
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

function AccountDetails({ profile, programName }: { profile: Profile; programName: string | undefined }) {
  const details = [
    { label: "Email", value: profile.email },
    { label: "Student ID", value: profile.studentProfile?.studentId },
    { label: "Program", value: programName },
    { label: "Batch", value: profile.studentProfile?.batch },
    { label: "CGPA", value: profile.studentProfile?.cgpa?.toFixed(2) },
    { label: "Member since", value: formatDate(profile.createdAt) },
  ];

  return (
    <dl className="space-y-3 text-sm">
      {details.map((detail) => (
        <div key={detail.label} className="flex justify-between gap-4">
          <dt className="text-muted-foreground">{detail.label}</dt>
          <dd className="text-right font-medium">{detail.value ?? "—"}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ProfileView() {
  const { data: profile, isLoading, isError, refetch } = useMyProfile();
  const { data: programs } = usePrograms();

  const programName = programs?.find((program) => program.id === profile?.studentProfile?.programId)?.name;

  if (isError) {
    return (
      <EmptyState icon={TriangleAlert} title="Could not load your profile" description="Please try again in a moment.">
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Try again
        </Button>
      </EmptyState>
    );
  }

  return (
    <>
      <DashboardHeader title="Profile & Settings" description="Your account details and personal information." />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="border border-border bg-card p-5">
          <h2 className="mb-4 text-sm font-semibold">Account</h2>
          {isLoading || !profile ? (
            <div className="space-y-3">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
            </div>
          ) : (
            <AccountDetails profile={profile} programName={programName} />
          )}
        </section>

        <section className="border border-border bg-card p-5">
          <h2 className="mb-4 text-sm font-semibold">Edit profile</h2>
          {isLoading || !profile ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : (
            <ProfileForm profile={profile} />
          )}
        </section>
      </div>
    </>
  );
}
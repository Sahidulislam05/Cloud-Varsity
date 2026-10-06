"use client";

import { TriangleAlert } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ProfileForm } from "@/components/shared/profile-form";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDepartments } from "@/hooks/use-academics";
import { useMyProfile } from "@/hooks/use-profile";
import { formatDate } from "@/lib/format";
import type { Profile } from "@/types/student";

function AccountDetails({
  profile,
  departmentName,
}: {
  profile: Profile;
  departmentName: string | undefined;
}) {
  const details = [
    { label: "Email", value: profile.email },
    { label: "Employee ID", value: profile.instructorProfile?.employeeId },
    { label: "Department", value: departmentName },
    { label: "Designation", value: profile.instructorProfile?.designation },
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

export function InstructorProfileView() {
  const { data: profile, isLoading, isError, refetch } = useMyProfile();
  const { data: departments } = useDepartments();

  const departmentName = departments?.find(
    (department) => department.id === profile?.instructorProfile?.departmentId,
  )?.name;

  if (isError) {
    return (
      <EmptyState
        icon={TriangleAlert}
        title="Could not load your profile"
        description="Please try again in a moment."
      >
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Try again
        </Button>
      </EmptyState>
    );
  }

  return (
    <>
      <DashboardHeader
        title="Profile & Settings"
        description="Your account details and personal information."
      />

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
            <AccountDetails profile={profile} departmentName={departmentName} />
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

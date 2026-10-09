// src/components/department-admin/department-scope.tsx
"use client";

import { Building2, TriangleAlert } from "lucide-react";
import { PageSkeleton } from "@/components/dashboard/page-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { useMyProfile } from "@/hooks/use-profile";
import type { Department } from "@/types/academics";

export type DepartmentRef = Pick<Department, "id" | "name" | "code">;

// ইউজারের department না জানা পর্যন্ত (বা না থাকলে) ভেতরের পেজ রেন্ডারই হয় না
export function DepartmentScope({ children }: { children: (department: DepartmentRef) => React.ReactNode }) {
  const { data: profile, isLoading, isError, refetch } = useMyProfile();

  if (isLoading) return <PageSkeleton />;

  if (isError) {
    return (
      <EmptyState icon={TriangleAlert} title="Could not load your department" description="Please try again in a moment.">
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Try again
        </Button>
      </EmptyState>
    );
  }

  if (!profile?.department) {
    return (
      <EmptyState
        icon={Building2}
        title="No department assigned"
        description="Your account is not linked to a department yet. Ask the super admin to assign one."
      />
    );
  }

  return <>{children(profile.department)}</>;
}
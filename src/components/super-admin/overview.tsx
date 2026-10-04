// src/components/super-admin/overview.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import {
  CalendarRange,
  CircleDollarSign,
  ClipboardList,
  GraduationCap,
  Layers,
  Library,
  Presentation,
  Receipt,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { EmptyState } from "@/components/shared/empty-state";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { type ApiResponse, apiClient } from "@/lib/api-client";
import { formatCurrency, formatNumber } from "@/lib/format";
import { useAuthStore } from "@/store/auth-store";
import { TriangleAlert } from "lucide-react";

type DashboardStats = {
  totalStudents: number;
  totalInstructors: number;
  totalCourses: number;
  totalPrograms: number;
  activeSemester: string | null;
  enrolledThisSemester: number;
  totalRevenueCollected: number;
  pendingInvoices: number;
};

export function SuperAdminOverview() {
  const user = useAuthStore((state) => state.user);
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin", "dashboard-stats"],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<DashboardStats>>("/admin/dashboard-stats");
      return res.data.data;
    },
  });

  const firstName = user?.name.split(" ")[0] ?? "";

  return (
    <>
      <DashboardHeader title={`Welcome back, ${firstName}`} description="A live snapshot of the whole university." />

      {isError ? (
        <EmptyState icon={TriangleAlert} title="Could not load statistics" description="The dashboard statistics are unavailable right now.">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Try again
          </Button>
        </EmptyState>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Students" value={data && formatNumber(data.totalStudents)} icon={GraduationCap} isLoading={isLoading} />
          <StatCard label="Instructors" value={data && formatNumber(data.totalInstructors)} icon={Presentation} tone="accent" isLoading={isLoading} />
          <StatCard label="Programs" value={data && formatNumber(data.totalPrograms)} icon={Layers} tone="info" isLoading={isLoading} />
          <StatCard label="Courses" value={data && formatNumber(data.totalCourses)} icon={Library} tone="info" isLoading={isLoading} />
          <StatCard
            label="Enrolled this semester"
            value={data && formatNumber(data.enrolledThisSemester)}
            hint={data?.activeSemester ?? "No semester is ongoing"}
            icon={ClipboardList}
            isLoading={isLoading}
          />
          <StatCard label="Active semester" value={data ? (data.activeSemester ?? "None") : null} icon={CalendarRange} isLoading={isLoading} />
          <StatCard
            label="Revenue collected"
            value={data && formatCurrency(data.totalRevenueCollected)}
            icon={CircleDollarSign}
            tone="success"
            isLoading={isLoading}
          />
          <StatCard label="Pending invoices" value={data && formatNumber(data.pendingInvoices)} icon={Receipt} tone="warning" isLoading={isLoading} />
        </div>
      )}
    </>
  );
}
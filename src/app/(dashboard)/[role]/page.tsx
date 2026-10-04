"use client";

import { LayoutDashboard } from "lucide-react";
import { notFound } from "next/navigation";
import { use } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ROLE_HOME } from "@/lib/roles";
import { useAuthStore } from "@/store/auth-store";

export default function TemporaryRolePage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = use(params);
  const user = useAuthStore((state) => state.user);

  if (!Object.values(ROLE_HOME).includes(`/${role}`)) notFound();

  return (
    <>
      <DashboardHeader title={`Welcome, ${user?.name ?? ""}`} />
      <EmptyState
        icon={LayoutDashboard}
        title="This dashboard is being built"
        description="Pages for this role will appear in the sidebar as they are completed."
      />
    </>
  );
}

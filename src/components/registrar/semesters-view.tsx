"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { SemesterFormDialog } from "@/components/registrar/semester-form-dialog";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { type Column, DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { useSemesters } from "@/hooks/use-academics";
import { useUpdateSemesterStatus } from "@/hooks/use-registrar";
import { formatDate } from "@/lib/format";
import type { Semester } from "@/types/admin";

type NextStep = {
  status: Semester["status"];
  label: string;
  title: string;
  description: string;
  destructive: boolean;
};

const NEXT_STEP: Record<Semester["status"], NextStep | null> = {
  UPCOMING: {
    status: "ONGOING",
    label: "Start semester",
    title: "Start this semester?",
    description: "The semester is marked as ongoing.",
    destructive: false,
  },
  ONGOING: {
    status: "COMPLETED",
    label: "Complete semester",
    title: "Complete this semester?",
    description:
      "Registration closes for all its sections: students can no longer register or drop courses. This cannot be undone.",
    destructive: true,
  },
  COMPLETED: null,
};

export function SemestersView() {
  const { data, isLoading, isFetching, isError, refetch } = useSemesters();
  const updateStatus = useUpdateSemesterStatus();

  const [createOpen, setCreateOpen] = useState(false);
  const [target, setTarget] = useState<Semester | null>(null);
  const step = target ? NEXT_STEP[target.status] : null;

  const columns: Column<Semester>[] = [
    {
      key: "semester",
      header: "Semester",
      cell: (semester) => (
        <span className="font-medium">
          {semester.name} {semester.year}
        </span>
      ),
    },
    {
      key: "period",
      header: "Period",
      className: "hidden sm:table-cell",
      cell: (semester) =>
        `${formatDate(semester.startDate)} – ${formatDate(semester.endDate)}`,
    },
    {
      key: "status",
      header: "Status",
      cell: (semester) => <StatusBadge status={semester.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      cell: (semester) => {
        const next = NEXT_STEP[semester.status];
        if (!next)
          return <span className="text-xs text-muted-foreground">Closed</span>;

        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setTarget(semester)}
          >
            {next.label}
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <DashboardHeader
        title="Semesters"
        description="Create semesters and move them through their lifecycle."
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus /> New semester
          </Button>
        }
      />

      <DataTable
        columns={columns}
        rows={data}
        rowKey={(semester) => semester.id}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        onRetry={() => refetch()}
        caption="Semesters"
        emptyTitle="No semesters yet"
        emptyDescription="Create the first semester so departments can add sections to it."
      />

      <SemesterFormDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />

      <ConfirmDialog
        open={target !== null && step !== null}
        onOpenChange={(open) => !open && setTarget(null)}
        title={step?.title ?? ""}
        description={
          target && step
            ? `${target.name} ${target.year}: ${step.description}`
            : ""
        }
        confirmLabel={step?.label}
        destructive={step?.destructive}
        isPending={updateStatus.isPending}
        onConfirm={() =>
          target &&
          step &&
          updateStatus.mutate(
            { id: target.id, status: step.status },
            { onSuccess: () => setTarget(null) },
          )
        }
      />
    </>
  );
}

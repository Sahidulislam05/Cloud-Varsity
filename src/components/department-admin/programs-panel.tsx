// src/components/department-admin/programs-panel.tsx
"use client";

import { Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { type DepartmentRef } from "@/components/department-admin/department-scope";
import { ProgramFormDialog } from "@/components/department-admin/program-form-dialog";
import { type Column, DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { usePrograms } from "@/hooks/use-academics";
import type { Program } from "@/types/academics";

export function ProgramsPanel({ department }: { department: DepartmentRef }) {
  const { data, isLoading, isFetching, isError, refetch } = usePrograms(
    department.id,
  );
  const [target, setTarget] = useState<Program | "new" | null>(null);

  const columns: Column<Program>[] = [
    {
      key: "program",
      header: "Program",
      cell: (program) => (
        <div>
          <p className="font-medium">{program.name}</p>
          <p className="font-mono text-xs text-muted-foreground">
            {program.code}
          </p>
        </div>
      ),
    },
    {
      key: "duration",
      header: "Duration",
      cell: (program) =>
        `${program.durationSemesters} semesters (${program.durationSemesters / 2} years)`,
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      cell: (program) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => setTarget(program)}
          aria-label={`Edit ${program.name}`}
        >
          <Pencil /> Edit
        </Button>
      ),
    },
  ];

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setTarget("new")}>
          <Plus /> New program
        </Button>
      </div>

      <DataTable
        columns={columns}
        rows={data}
        rowKey={(program) => program.id}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        onRetry={() => refetch()}
        caption="Programs"
        emptyTitle="No programs yet"
        emptyDescription="Create your department's first degree program."
      />

      <ProgramFormDialog
        target={target}
        departmentId={department.id}
        onClose={() => setTarget(null)}
      />
    </>
  );
}

"use client";

import { FilterSelect } from "@/components/shared/filter-select";
import { useSemesters } from "@/hooks/use-academics";

export function SemesterFilter({
  paramName = "semester",
}: {
  paramName?: string;
}) {
  const { data: semesters = [] } = useSemesters();

  return (
    <FilterSelect
      paramName={paramName}
      label="Semester"
      allLabel="All semesters"
      options={semesters.map((semester) => ({
        value: semester.id,
        label: `${semester.name} ${semester.year}`,
      }))}
    />
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/dashboard/page-skeleton";
import { GradeWizard } from "@/components/instructor/grade-wizard";

export const metadata: Metadata = { title: "Grade an exam" };

export default async function GradePage(
  props: PageProps<"/instructor/sections/[id]/grade">,
) {
  const { id } = await props.params;

  return (
    <Suspense fallback={<PageSkeleton />}>
      <GradeWizard sectionId={id} />
    </Suspense>
  );
}

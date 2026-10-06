import type { Metadata } from "next";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/dashboard/page-skeleton";
import { SectionWorkspace } from "@/components/instructor/section-workspace";

export const metadata: Metadata = { title: "Section" };

export default async function SectionPage(
  props: PageProps<"/instructor/sections/[id]">,
) {
  const { id } = await props.params;

  return (
    <Suspense fallback={<PageSkeleton />}>
      <SectionWorkspace sectionId={id} />
    </Suspense>
  );
}

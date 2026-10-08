import type { Metadata } from "next";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/dashboard/page-skeleton";
import { ResultsView } from "@/components/registrar/results-view";

export const metadata: Metadata = { title: "Publish Results" };

export default function RegistrarResultsPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ResultsView />
    </Suspense>
  );
}

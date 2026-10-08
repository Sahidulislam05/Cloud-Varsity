
import type { Metadata } from "next";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/dashboard/page-skeleton";
import { RegistrationsView } from "@/components/registrar/registrations-view";

export const metadata: Metadata = { title: "Registrations" };

export default function RegistrarRegistrationsPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <RegistrationsView />
    </Suspense>
  );
}
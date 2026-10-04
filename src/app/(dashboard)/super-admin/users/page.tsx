import type { Metadata } from "next";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/dashboard/page-skeleton";
import { UsersView } from "@/components/super-admin/users-view";

export const metadata: Metadata = { title: "Users" };

export default function UsersPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <UsersView />
    </Suspense>
  );
}

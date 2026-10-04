import type { Metadata } from "next";
import Link from "next/link";
import { DashboardButton } from "@/components/shared/dashboard-button";
import { StatusPage } from "@/components/shared/status-page";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <StatusPage
      fullPage
      code="404"
      title="Page not found"
      description="The page you are looking for does not exist or may have been moved."
    >
      <Button asChild variant="outline">
        <Link href="/">Back to home</Link>
      </Button>
      <DashboardButton />
    </StatusPage>
  );
}

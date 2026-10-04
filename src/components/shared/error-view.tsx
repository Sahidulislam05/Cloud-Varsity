"use client";

import { RotateCw } from "lucide-react";
import { useEffect } from "react";
import { StatusPage } from "@/components/shared/status-page";
import { Button } from "@/components/ui/button";

type ErrorViewProps = {
  error: Error & { digest?: string };
  retry: () => void;
  fullPage?: boolean;
};

export function ErrorView({ error, retry, fullPage = false }: ErrorViewProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusPage
      fullPage={fullPage}
      code="Oops"
      title="Something went wrong"
      description="An unexpected error occurred while loading this page. Try again, and contact support if it keeps happening."
      detail={error.digest ? `Reference: ${error.digest}` : undefined}
    >
      <Button onClick={() => retry()}>
        <RotateCw /> Try again
      </Button>
    </StatusPage>
  );
}

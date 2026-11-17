// src/app/global-error.tsx
"use client";

import { ErrorView } from "@/components/shared/error-view";
import "./globals.css";

// global-error replaces the root layout when it renders, so it must define
// its own <html> and <body> and pull in the global styles itself
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="en" className="h-full antialiased font-sans">
      <body className="min-h-full flex flex-col">
        <ErrorView error={error} retry={retry} fullPage />
      </body>
    </html>
  );
}

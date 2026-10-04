// src/components/shared/stat-card.tsx
import type { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const TONES = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  info: "bg-info/10 text-info",
  accent: "bg-brand-accent/10 text-brand-accent",
} as const;

type StatCardProps = {
  label: string;
  value: string | number | null | undefined;
  icon: LucideIcon;
  tone?: keyof typeof TONES;
  hint?: string;
  isLoading?: boolean;
};

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "primary",
  hint,
  isLoading = false,
}: StatCardProps) {
  return (
    <div className="flex items-start justify-between gap-3 border border-border bg-card p-4">
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        {isLoading ? (
          <Skeleton className="mt-2 h-7 w-20" />
        ) : (
          <p className="mt-1 truncate text-2xl font-bold tabular-nums">
            {value ?? "—"}
          </p>
        )}
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </div>
      <div
        className={cn(
          "flex size-9 shrink-0 items-center justify-center",
          TONES[tone],
        )}
      >
        <Icon className="size-4" aria-hidden="true" />
      </div>
    </div>
  );
}

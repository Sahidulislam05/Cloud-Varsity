// src/components/shared/status-badge.tsx
import { titleCase } from "@/lib/format";
import { cn } from "@/lib/utils";

type Tone = "success" | "warning" | "danger" | "info" | "neutral";

const TONE_STYLES: Record<Tone, { box: string; dot: string }> = {
  success: { box: "border-success/40 bg-success/10", dot: "bg-success" },
  warning: { box: "border-warning/50 bg-warning/10", dot: "bg-warning" },
  danger: {
    box: "border-destructive/40 bg-destructive/10",
    dot: "bg-destructive",
  },
  info: { box: "border-info/40 bg-info/10", dot: "bg-info" },
  neutral: { box: "border-border bg-muted", dot: "bg-muted-foreground" },
};

const STATUS_TONE: Record<string, Tone> = {
  PAID: "success",
  PENDING: "warning",
  OVERDUE: "danger",
  SUCCESS: "success",
  FAILED: "danger",
  CANCELLED: "neutral",
  ENROLLED: "info",
  DROPPED: "neutral",
  COMPLETED: "success",
  PRESENT: "success",
  LATE: "warning",
  ABSENT: "danger",
  UPCOMING: "info",
  ONGOING: "success",
  ACTIVE: "success",
  INACTIVE: "neutral",
};

type StatusBadgeProps = { status: string; label?: string; className?: string };

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const style = TONE_STYLES[STATUS_TONE[status] ?? "neutral"];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border px-2 py-0.5 text-xs font-medium",
        style.box,
        className,
      )}
    >
      <span className={cn("size-1.5", style.dot)} aria-hidden="true" />
      {label ?? titleCase(status)}
    </span>
  );
}

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const TONES = {
  success: { icon: "bg-success/10 text-success", bar: "border-t-success" },
  danger: {
    icon: "bg-destructive/10 text-destructive",
    bar: "border-t-destructive",
  },
  warning: { icon: "bg-warning/10 text-warning", bar: "border-t-warning" },
  neutral: { icon: "bg-muted text-muted-foreground", bar: "border-t-border" },
} as const;

type PaymentResultProps = {
  tone: keyof typeof TONES;
  icon: LucideIcon;
  title: string;
  description: string;
  spin?: boolean;
  details?: { label: string; value: React.ReactNode }[];
  children?: React.ReactNode;
};

export function PaymentResult({
  tone,
  icon: Icon,
  title,
  description,
  spin = false,
  details,
  children,
}: PaymentResultProps) {
  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-10">
      <div
        role={tone === "danger" ? "alert" : "status"}
        className={cn(
          "w-full max-w-md border border-t-4 border-border bg-card p-6 text-center",
          TONES[tone].bar,
        )}
      >
        <div
          className={cn(
            "mx-auto flex size-12 items-center justify-center",
            TONES[tone].icon,
          )}
        >
          <Icon
            className={cn("size-6", spin && "animate-spin")}
            aria-hidden="true"
          />
        </div>
        <h1 className="mt-4 text-xl font-bold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>

        {details && (
          <dl className="mt-6 space-y-2 border-t border-border pt-4 text-left text-sm">
            {details.map((detail) => (
              <div key={detail.label} className="flex justify-between gap-4">
                <dt className="text-muted-foreground">{detail.label}</dt>
                <dd className="text-right font-medium">{detail.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {children && (
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            {children}
          </div>
        )}
      </div>
    </main>
  );
}

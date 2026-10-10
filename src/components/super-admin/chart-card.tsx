import { Button } from "@/components/ui/button";
import { Skeleton } from "../ui/skeleton";
import { cn } from "cn";


type ChartCardProps = {
  title: string;
  description: string;
  isLoading: boolean;
  isError?: boolean;
  onRetry?: () => void;
  isEmpty: boolean;
  emptyText: string;
  className?: string;
  children: React.ReactNode;
};

export function ChartCard({
  title,
  description,
  isLoading,
  isError = false,
  onRetry,
  isEmpty,
  emptyText,
  className,
  children,
}: ChartCardProps) {
  return (
    <section className={cn("border border-border bg-card p-4", className)}>
      <h2 className="text-sm font-semibold">{title}</h2>
      <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      <div className="mt-4 h-64">
        {isLoading ? (
          <Skeleton className="h-full w-full" />
        ) : isError ? (
          <div
            role="alert"
            className="flex h-full flex-col items-center justify-center gap-2 text-xs text-muted-foreground"
          >
            <p>Could not load this chart.</p>
            {onRetry && (
              <Button size="sm" variant="outline" onClick={onRetry}>
                Try again
              </Button>
            )}
          </div>
        ) : isEmpty ? (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            {emptyText}
          </div>
        ) : (
          children
        )}
      </div>
    </section>
  );
}

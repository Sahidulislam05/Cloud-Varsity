import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type ChartCardProps = {
  title: string;
  description: string;
  isLoading: boolean;
  isEmpty: boolean;
  emptyText: string;
  className?: string;
  children: React.ReactNode;
};

export function ChartCard({
  title,
  description,
  isLoading,
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

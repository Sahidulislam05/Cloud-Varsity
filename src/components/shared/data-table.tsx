import { Inbox, TriangleAlert } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type Column<T> = {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  className?: string;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  rows: T[] | undefined;
  rowKey: (row: T) => string;
  isLoading?: boolean;
  isFetching?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  skeletonRows?: number;
  caption?: string;
  emptyTitle?: string;
  emptyDescription?: string;
};

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  isLoading = false,
  isFetching = false,
  isError = false,
  onRetry,
  skeletonRows = 8,
  caption,
  emptyTitle = "Nothing here yet",
  emptyDescription = "There is no data to show.",
}: DataTableProps<T>) {
  if (isError) {
    return (
      <EmptyState
        icon={TriangleAlert}
        title="Could not load data"
        description="Something went wrong while fetching this list."
      >
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            Try again
          </Button>
        )}
      </EmptyState>
    );
  }

  if (!isLoading && rows?.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  const skeletonKeys = Array.from(
    { length: skeletonRows },
    (_, index) => `skeleton-${index}`,
  );

  return (
    <div
      className={cn(
        "overflow-x-auto border border-border bg-card transition-opacity",
        isFetching && !isLoading && "opacity-60",
      )}
      aria-busy={isLoading || isFetching}
    >
      <Table>
        {caption && <caption className="sr-only">{caption}</caption>}
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key} className={column.className}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? skeletonKeys.map((key) => (
                <TableRow key={key}>
                  {columns.map((column) => (
                    <TableCell key={column.key} className={column.className}>
                      <Skeleton className="h-4 w-full max-w-40" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : rows?.map((row) => (
                <TableRow key={rowKey(row)}>
                  {columns.map((column) => (
                    <TableCell key={column.key} className={column.className}>
                      {column.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}

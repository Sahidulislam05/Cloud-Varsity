import { Pagination } from "@/components/shared/pagination";
import type { ApiResponse } from "@/lib/api-client";

type ListMeta = NonNullable<ApiResponse<unknown>["meta"]>;

export function TablePagination({ meta }: { meta: ListMeta | undefined }) {
  if (!meta || meta.total === 0) return null;

  const from = (meta.page - 1) * meta.limit + 1;
  const to = Math.min(meta.page * meta.limit, meta.total);

  return (
    <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
      <p className="text-xs text-muted-foreground">
        Showing {from}–{to} of {meta.total}
      </p>
      <Pagination page={meta.page} totalPages={meta.totalPages} />
    </div>
  );
}

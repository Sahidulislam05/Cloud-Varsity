"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

type PageItem = { kind: "page"; page: number } | { kind: "gap"; after: number };

function getPageItems(current: number, total: number): PageItem[] {
  const pages = [...new Set([1, current - 1, current, current + 1, total])]
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b);

  const items: PageItem[] = [];
  pages.forEach((page, index) => {
    const previous = pages[index - 1];
    if (previous !== undefined && page - previous > 1)
      items.push({ kind: "gap", after: previous });
    items.push({ kind: "page", page });
  });
  return items;
}

type PaginationProps = { page: number; totalPages: number; anchor?: string };

export function Pagination({ page, totalPages, anchor }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const hrefFor = (target: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (target === 1) params.delete("page");
    else params.set("page", String(target));
    const query = params.toString();
    return `${pathname}${query ? `?${query}` : ""}${anchor ? `#${anchor}` : ""}`;
  };

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-center gap-1"
    >
      {page > 1 ? (
        <Button asChild variant="outline" size="sm">
          <Link href={hrefFor(page - 1)} aria-label="Previous page">
            <ChevronLeft /> Prev
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled aria-label="Previous page">
          <ChevronLeft /> Prev
        </Button>
      )}

      {getPageItems(page, totalPages).map((item) =>
        item.kind === "gap" ? (
          <span
            key={`gap-${item.after}`}
            className="px-1 text-xs text-muted-foreground"
          >
            …
          </span>
        ) : (
          <Button
            key={item.page}
            asChild
            size="sm"
            variant={item.page === page ? "default" : "outline"}
          >
            <Link
              href={hrefFor(item.page)}
              aria-current={item.page === page ? "page" : undefined}
            >
              {item.page}
            </Link>
          </Button>
        ),
      )}

      {page < totalPages ? (
        <Button asChild variant="outline" size="sm">
          <Link href={hrefFor(page + 1)} aria-label="Next page">
            Next <ChevronRight />
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled aria-label="Next page">
          Next <ChevronRight />
        </Button>
      )}
    </nav>
  );
}

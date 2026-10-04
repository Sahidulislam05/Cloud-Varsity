// src/components/super-admin/users-view.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { RoleBadge } from "@/components/dashboard/role-badge";
import { type Column, DataTable } from "@/components/shared/data-table";
import { FilterSelect } from "@/components/shared/filter-select";
import { SearchInput } from "@/components/shared/search-input";
import { StatusBadge } from "@/components/shared/status-badge";
import { TablePagination } from "@/components/shared/table-pagination";
import { useListQuery } from "@/hooks/use-list-query";
import { usePagination } from "@/hooks/use-pagination";
import { formatDate } from "@/lib/format";
import { ROLE_LABEL } from "@/lib/roles";
import type { UserRow } from "@/types/user";

const ROLE_OPTIONS = Object.entries(ROLE_LABEL).map(([value, label]) => ({ value, label }));

const COLUMNS: Column<UserRow>[] = [
  {
    key: "name",
    header: "Name",
    cell: (user) => (
      <div>
        <p className="font-medium">{user.name}</p>
        <p className="text-xs text-muted-foreground">{user.email}</p>
      </div>
    ),
  },
  { key: "role", header: "Role", cell: (user) => <RoleBadge role={user.role} /> },
  { key: "status", header: "Status", cell: (user) => <StatusBadge status={user.isActive ? "ACTIVE" : "INACTIVE"} /> },
  { key: "joined", header: "Joined", className: "hidden md:table-cell", cell: (user) => formatDate(user.createdAt) },
];

export function UsersView() {
  const searchParams = useSearchParams();
  const { page, limit } = usePagination();
  const search = searchParams.get("search") ?? "";
  const role = searchParams.get("role") ?? undefined;

  const { data, isLoading, isFetching, isError, refetch } = useListQuery<UserRow>("users", "/user", {
    page,
    limit,
    search,
    role,
  });

  return (
    <>
      <DashboardHeader title="Users" description="Every account across all six roles." />

      <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_auto]">
        <SearchInput placeholder="Search by name or email" />
        <FilterSelect paramName="role" label="Role" allLabel="All roles" options={ROLE_OPTIONS} />
      </div>

      <DataTable
        columns={COLUMNS}
        rows={data?.data}
        rowKey={(user) => user.id}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        onRetry={() => refetch()}
        caption="Users"
        emptyTitle="No users found"
        emptyDescription="Try a different search term or role filter."
      />
      <TablePagination meta={data?.meta} />
    </>
  );
}
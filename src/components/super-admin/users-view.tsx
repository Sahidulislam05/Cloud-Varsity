"use client";

import { Building2, UserCheck, UserX } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { RoleBadge } from "@/components/dashboard/role-badge";
import { AssignDepartmentDialog } from "@/components/super-admin/assign-department-dialog";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { type Column, DataTable } from "@/components/shared/data-table";
import { FilterSelect } from "@/components/shared/filter-select";
import { SearchInput } from "@/components/shared/search-input";
import { StatusBadge } from "@/components/shared/status-badge";
import { TablePagination } from "@/components/shared/table-pagination";
import { Button } from "@/components/ui/button";
import { useUpdateUserStatus } from "@/hooks/use-admin";
import { useListQuery } from "@/hooks/use-list-query";
import { usePagination } from "@/hooks/use-pagination";
import { formatDate } from "@/lib/format";
import { ROLE_LABEL } from "@/lib/roles";
import { useAuthStore } from "@/store/auth-store";
import type { UserRow } from "@/types/user";

const ROLE_OPTIONS = Object.entries(ROLE_LABEL).map(([value, label]) => ({
  value,
  label,
}));

export function UsersView() {
  const searchParams = useSearchParams();
  const { page, limit } = usePagination();
  const search = searchParams.get("search") ?? "";
  const role = searchParams.get("role") ?? undefined;

  const currentUser = useAuthStore((state) => state.user);
  const updateStatus = useUpdateUserStatus();
  const [target, setTarget] = useState<UserRow | null>(null);
  const [assignTarget, setAssignTarget] = useState<UserRow | null>(null);


  const { data, isLoading, isFetching, isError, refetch } =
    useListQuery<UserRow>("users", "/user", {
      page,
      limit,
      search,
      role,
    });

  const columns: Column<UserRow>[] = [
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
    {
      key: "role",
      header: "Role",
      cell: (user) => <RoleBadge role={user.role} />,
    },
    {
      key: "status",
      header: "Status",
      cell: (user) => (
        <StatusBadge status={user.isActive ? "ACTIVE" : "INACTIVE"} />
      ),
    },
    {
      key: "joined",
      header: "Joined",
      className: "hidden md:table-cell",
      cell: (user) => formatDate(user.createdAt),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      cell: (user) => {
        // backend Super Admin কে deactivate করতে দেয় না, আর নিজেকে নিজে লক-আউট করাও যায় না
        if (user.role === "SUPER_ADMIN" || user.id === currentUser?.userId) {
          return <span className="text-xs text-muted-foreground">—</span>;
        }
        return (
          <div className="flex items-center justify-end gap-2">
            {user.role === "DEPARTMENT_ADMIN" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setAssignTarget(user)}
              >
                <Building2 /> Assign dept
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={() => setTarget(user)}>
              {user.isActive ? (
                <>
                  <UserX /> Deactivate
                </>
              ) : (
                <>
                  <UserCheck /> Activate
                </>
              )}
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <DashboardHeader
        title="Users"
        description="Every account across all six roles."
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_auto]">
        <SearchInput placeholder="Search by name or email" />
        <FilterSelect
          paramName="role"
          label="Role"
          allLabel="All roles"
          options={ROLE_OPTIONS}
        />
      </div>

      <DataTable
        columns={columns}
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

      <AssignDepartmentDialog
        user={assignTarget}
        onClose={() => setAssignTarget(null)}
      />

      <ConfirmDialog
        open={target !== null}
        onOpenChange={(open) => !open && setTarget(null)}
        title={
          target?.isActive ? "Deactivate this user?" : "Activate this user?"
        }
        description={
          target?.isActive
            ? `${target.name} will lose access immediately and cannot log in until the account is activated again.`
            : `${target?.name ?? "This user"} will be able to log in again.`
        }
        confirmLabel={target?.isActive ? "Deactivate" : "Activate"}
        destructive={target?.isActive}
        isPending={updateStatus.isPending}
        onConfirm={() =>
          target &&
          updateStatus.mutate(
            { id: target.id, isActive: !target.isActive },
            { onSuccess: () => setTarget(null) },
          )
        }
      />
    </>
  );
}

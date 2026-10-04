// src/components/dashboard/sidebar.tsx
import { GraduationCap } from "lucide-react";
import Link from "next/link";
import { RoleBadge } from "@/components/dashboard/role-badge";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import type { Role } from "@/store/auth-store";

export function SidebarContent({
  role,
  onNavigate,
}: {
  role: Role;
  onNavigate?: () => void;
}) {
  return (
    <>
      <div className="flex h-14 shrink-0 items-center border-b border-sidebar-border px-4">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-2 font-semibold"
        >
          <GraduationCap
            className="size-5 text-sidebar-primary"
            aria-hidden="true"
          />
          CloudVarsity
        </Link>
      </div>
      <div className="px-4 pt-4 pb-2">
        <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
          Signed in as
        </p>
        <RoleBadge role={role} className="mt-1" />
      </div>
      <SidebarNav role={role} onNavigate={onNavigate} />
    </>
  );
}

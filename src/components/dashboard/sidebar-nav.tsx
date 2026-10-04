// src/components/dashboard/sidebar-nav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, type NavItem } from "@/config/navigation";
import { ROLE_ACCENT, ROLE_HOME } from "@/lib/roles";
import { cn } from "@/lib/utils";
import type { Role } from "@/store/auth-store";

const hasPrefix = (pathname: string, base: string) => pathname === base || pathname.startsWith(`${base}/`);

type SidebarNavProps = { role: Role; onNavigate?: () => void };

export function SidebarNav({ role, onNavigate }: SidebarNavProps) {
  const pathname = usePathname();

  const isActive = (item: NavItem) => {
    const matchesExtra = (item.match ?? []).some((prefix) => hasPrefix(pathname, prefix));
    // role এর হোম ("/student") বাকি সব path এর prefix, তাই এটা শুধু হুবহু মিললেই active
    if (item.href === ROLE_HOME[role]) return pathname === item.href || matchesExtra;
    return hasPrefix(pathname, item.href) || matchesExtra;
  };

  return (
    <nav aria-label="Dashboard" className="flex flex-1 flex-col gap-1 overflow-y-auto px-2 py-2">
      {NAV_ITEMS[role].map((item) => {
        const active = isActive(item);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-2.5 border-l-2 px-3 py-2 text-xs font-medium transition-colors",
              active
                ? cn("bg-sidebar-accent text-sidebar-accent-foreground", ROLE_ACCENT[role].border)
                : "border-l-transparent text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
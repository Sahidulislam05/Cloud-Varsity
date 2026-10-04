"use client";

import { Menu } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SidebarContent } from "@/components/dashboard/sidebar";
import { UserMenu } from "@/components/dashboard/user-menu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { ROLE_HOME } from "@/lib/roles";
import { useAuthStore } from "@/store/auth-store";

const NAV_SKELETON_KEYS = ["nav-a", "nav-b", "nav-c"];

function ShellSkeleton() {
  return (
    <div className="flex flex-1" role="status">
      <span className="sr-only">Loading your dashboard…</span>
      <div className="hidden w-60 shrink-0 border-r border-sidebar-border bg-sidebar p-4 lg:block">
        <Skeleton className="h-6 w-32" />
        <div className="mt-8 space-y-2">
          {NAV_SKELETON_KEYS.map((key) => (
            <Skeleton key={key} className="h-8 w-full" />
          ))}
        </div>
      </div>
      <div className="flex-1 space-y-6 p-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, isHydrating } = useAuthStore();

  const ownHome = user ? ROLE_HOME[user.role] : undefined;
  // proxy.ts শুধু cookie এর আন্দাজে ঠেকায়। এখানে আসল যাচাই-করা user এর role এর সাথে URL মেলাই
  const isOutsideOwnArea =
    Boolean(ownHome) && !pathname.startsWith(ownHome as string);

  useEffect(() => {
    if (isHydrating) return;
    if (!isAuthenticated) router.replace("/login");
    else if (isOutsideOwnArea && ownHome) router.replace(ownHome);
  }, [isHydrating, isAuthenticated, isOutsideOwnArea, ownHome, router]);

  if (isHydrating || !user || isOutsideOwnArea) return <ShellSkeleton />;

  return (
    <div className="flex flex-1">
      <aside className="sticky top-0 hidden h-svh w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex">
        <SidebarContent role={user.role} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-2 border-b border-border bg-background/80 px-4 backdrop-blur">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Open navigation"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-64 gap-0 bg-sidebar p-0 text-sidebar-foreground"
            >
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <SidebarContent
                role={user.role}
                onNavigate={() => setMenuOpen(false)}
              />
            </SheetContent>
          </Sheet>

          <div className="ml-auto">
            <UserMenu />
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}

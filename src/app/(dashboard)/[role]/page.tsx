"use client";

import { LogOut } from "lucide-react";
import { notFound, useRouter } from "next/navigation";
import { use, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/use-auth";
import { ROLE_HOME } from "@/lib/roles";
import { useAuthStore } from "@/store/auth-store";

export default function TemporaryDashboard({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = use(params);
  const router = useRouter();
  const logout = useLogout();
  const { user, isAuthenticated, isHydrating } = useAuthStore();
  const isDashboardPath = Object.values(ROLE_HOME).includes(`/${role}`);

  // Phase 5 এর dashboard layout ঠিক এই guard টাই করবে
  useEffect(() => {
    if (isDashboardPath && !isHydrating && !isAuthenticated)
      router.replace("/login");
  }, [isDashboardPath, isHydrating, isAuthenticated, router]);

  if (!isDashboardPath) notFound();
  if (isHydrating || !user)
    return (
      <p className="p-6 text-sm text-muted-foreground">Loading session…</p>
    );

  return (
    <main className="mx-auto w-full max-w-md p-6">
      <div className="border border-border bg-card p-6">
        <p className="text-xs font-semibold tracking-widest text-primary uppercase">
          Temporary page
        </p>
        <h1 className="mt-2 text-xl font-bold">{user.name}</h1>
        <dl className="mt-4 space-y-1 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Email</dt>
            <dd>{user.email}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Role</dt>
            <dd>{user.role}</dd>
          </div>
        </dl>
        <Button
          variant="outline"
          className="mt-6 w-full"
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
        >
          <LogOut /> Log out
        </Button>
      </div>
    </main>
  );
}

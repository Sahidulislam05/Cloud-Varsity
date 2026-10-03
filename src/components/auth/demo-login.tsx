// src/components/auth/demo-login.tsx
"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useLogin } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api-client";
import { DEMO_ACCOUNTS, type DemoAccount } from "@/lib/demo-accounts";
import { cn } from "@/lib/utils";
import type { Role } from "@/store/auth-store";

export function DemoLogin() {
  const login = useLogin();
  const [activeRole, setActiveRole] = useState<Role | null>(null);
  const busy = login.isPending || login.isSuccess;

  const handleDemoLogin = (account: DemoAccount) => {
    if (!account.email || !account.password) return;

    setActiveRole(account.role);
    login.mutate(
      { email: account.email, password: account.password },
      {
        onError: (error) => {
          setActiveRole(null);
          toast.error(
            error instanceof ApiError
              ? `Demo login failed: ${error.message}`
              : "Demo login failed. Please try again.",
          );
        },
      },
    );
  };

  return (
    <section aria-labelledby="demo-heading">
      <div className="text-center">
        <h2 id="demo-heading" className="text-sm font-semibold">
          Quick Demo Login
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">Sign in instantly as any role to explore its dashboard.</p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {DEMO_ACCOUNTS.map((account) => {
          const Icon = account.icon;
          const configured = Boolean(account.email && account.password);
          const loading = busy && activeRole === account.role;

          return (
            <div
              key={account.role}
              className={cn("flex flex-col gap-3 border border-l-4 border-border bg-card p-3", account.accent)}
            >
              <div className="flex items-start gap-2.5">
                <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold">{account.label}</p>
                  <p className="text-xs text-muted-foreground">{account.description}</p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full"
                disabled={busy || !configured}
                onClick={() => handleDemoLogin(account)}
                aria-label={`Demo login as ${account.label}`}
                title={configured ? undefined : "Demo credentials are not configured"}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" /> Signing in…
                  </>
                ) : (
                  "Demo Login"
                )}
              </Button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
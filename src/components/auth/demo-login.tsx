// src/components/auth/demo-login.tsx
"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useDemoLogin } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api-client";
import { DEMO_ACCOUNTS, IS_DEMO_MODE } from "@/lib/demo-accounts";
import { cn } from "@/lib/utils";
import type { Role } from "@/store/auth-store";

export function DemoLogin() {
  const demoLogin = useDemoLogin();
  const [activeRole, setActiveRole] = useState<Role | null>(null);
  const busy = demoLogin.isPending || demoLogin.isSuccess;

  // Belt-and-braces guard: the login page already skips rendering this
  // component when demo mode is off
  if (!IS_DEMO_MODE) return null;

  const handleDemoLogin = (role: Role) => {
    setActiveRole(role);
    demoLogin.mutate(role, {
      onError: (error) => {
        setActiveRole(null);
        toast.error(
          error instanceof ApiError
            ? `Demo login failed: ${error.message}`
            : "Demo login failed. Please try again.",
        );
      },
    });
  };

  return (
    <section aria-labelledby="demo-heading">
      <div className="text-center">
        <h2 id="demo-heading" className="text-sm font-semibold">
          Quick Demo Login
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Sign in instantly as any role to explore its dashboard.
        </p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {DEMO_ACCOUNTS.map((account) => {
          const Icon = account.icon;
          const loading = busy && activeRole === account.role;

          return (
            <div
              key={account.role}
              className={cn(
                "flex flex-col gap-3 border border-l-4 border-border bg-card p-3",
                account.accent,
              )}
            >
              <div className="flex items-start gap-2.5">
                <Icon
                  className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-semibold">{account.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {account.description}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full"
                disabled={busy}
                onClick={() => handleDemoLogin(account.role)}
                aria-label={`Demo login as ${account.label}`}
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

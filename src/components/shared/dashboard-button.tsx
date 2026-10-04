"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROLE_HOME } from "@/lib/roles";
import { useAuthStore } from "@/store/auth-store";

export function DashboardButton() {
  const user = useAuthStore((state) => state.user);
  if (!user) return null;

  return (
    <Button asChild>
      <Link href={ROLE_HOME[user.role] ?? "/"}>Go to dashboard</Link>
    </Button>
  );
}

"use client";

import { GraduationCap, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ROLE_HOME } from "@/lib/roles";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/programs", label: "Programs" },
  { href: "/contact", label: "Contact" },
];

type AuthActionsProps = { className?: string; onNavigate?: () => void };

function AuthActions({ className, onNavigate }: AuthActionsProps) {
  const { user, isAuthenticated, isHydrating } = useAuthStore();

  if (isHydrating)
    return <div className={cn("h-7 w-28", className)} aria-hidden="true" />;

  if (isAuthenticated && user) {
    return (
      <div className={className}>
        <Button asChild size="sm" onClick={onNavigate}>
          <Link href={ROLE_HOME[user.role] ?? "/login"}>Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      <Button asChild variant="ghost" size="sm" onClick={onNavigate}>
        <Link href="/login">Log in</Link>
      </Button>
      <Button asChild size="sm" onClick={onNavigate}>
        <Link href="/register">Get Started</Link>
      </Button>
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <GraduationCap className="size-6 text-primary" aria-hidden="true" />
          <span>CloudVarsity</span>
        </Link>

        <nav
          aria-label="Main"
          className="hidden items-center gap-6 text-xs font-medium md:flex"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cn(
                "transition-colors hover:text-foreground",
                isActive(link.href)
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <AuthActions className="hidden items-center gap-2 md:flex" />

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Open menu"
            >
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <nav aria-label="Mobile" className="flex flex-col px-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={cn(
                    "border-b border-border py-3 text-sm font-medium",
                    isActive(link.href) ? "text-primary" : "text-foreground",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <AuthActions
              className="mt-6 flex flex-col gap-2 px-4"
              onNavigate={() => setOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

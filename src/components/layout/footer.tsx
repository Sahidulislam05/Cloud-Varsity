import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-muted-foreground">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <GraduationCap className="h-5 w-5 text-primary" />
            CloudVarsity
          </div>
          <nav className="flex gap-6">
            <Link href="/about" className="hover:text-foreground">
              About
            </Link>
            <Link href="/services" className="hover:text-foreground">
              Services
            </Link>
            <Link href="/contact" className="hover:text-foreground">
              Contact
            </Link>
          </nav>
        </div>
        <p className="mt-6 text-xs">
          &copy; {new Date().getFullYear()} CloudVarsity. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

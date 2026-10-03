import {
  ClipboardCheck,
  CreditCard,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

const HIGHLIGHTS = [
  {
    icon: ClipboardCheck,
    text: "Register for courses with live seat availability",
  },
  { icon: ShieldCheck, text: "Role-based access keeps every record protected" },
  { icon: CreditCard, text: "Pay tuition online through SSLCommerz" },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid flex-1 lg:grid-cols-2">
      <aside className="hidden flex-col justify-between bg-linear-to-br from-primary to-brand-accent p-10 text-primary-foreground lg:flex">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <GraduationCap className="size-6" aria-hidden="true" />
          CloudVarsity
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Your university, in one place.
          </h2>
          <ul className="mt-8 space-y-4 text-sm">
            {HIGHLIGHTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <Icon className="size-5 shrink-0" aria-hidden="true" />
                {text}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-primary-foreground/70">
          &copy; {new Date().getFullYear()} CloudVarsity
        </p>
      </aside>

      <main className="flex flex-col items-center justify-center px-4 py-10 sm:px-8">
        <Link
          href="/"
          className="mb-8 flex items-center gap-2 font-semibold lg:hidden"
        >
          <GraduationCap className="size-6 text-primary" aria-hidden="true" />
          CloudVarsity
        </Link>
        {children}
      </main>
    </div>
  );
}

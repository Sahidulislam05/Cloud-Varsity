import { cn } from "@/lib/utils";

type StatusPageProps = {
  code: string;
  title: string;
  description: string;
  detail?: string;
  fullPage?: boolean;
  children?: React.ReactNode;
};

export function StatusPage({
  code,
  title,
  description,
  detail,
  fullPage = false,
  children,
}: StatusPageProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-4 text-center",
        fullPage ? "min-h-svh" : "min-h-[60vh]",
      )}
    >
      <p className="text-6xl font-bold tracking-tight text-primary tabular-nums">
        {code}
      </p>
      <h1 className="mt-4 text-xl font-semibold">{title}</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {description}
      </p>
      {detail && (
        <p className="mt-2 font-mono text-xs text-muted-foreground">{detail}</p>
      )}
      {children && (
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {children}
        </div>
      )}
    </div>
  );
}

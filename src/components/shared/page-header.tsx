type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: PageHeaderProps) {
  return (
    <section className="border-b border-border bg-linear-to-br from-primary/10 via-background to-brand-accent/10">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        {eyebrow && (
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            {description}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}

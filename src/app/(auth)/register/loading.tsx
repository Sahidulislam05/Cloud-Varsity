import { Skeleton } from "@/components/ui/skeleton";

const FIELDS = Array.from({ length: 6 }, (_, index) => `field-${index}`);

export default function Loading() {
  return (
    <div className="w-full max-w-lg space-y-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-80 max-w-full" />
      {FIELDS.map((key) => (
        <Skeleton key={key} className="h-8 w-full" />
      ))}
    </div>
  );
}

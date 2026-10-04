import { ROLE_ACCENT, ROLE_LABEL } from "@/lib/roles";
import { cn } from "@/lib/utils";
import type { Role } from "@/store/auth-store";

export function RoleBadge({
  role,
  className,
}: {
  role: Role;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium",
        className,
      )}
    >
      <span
        className={cn("size-2", ROLE_ACCENT[role].dot)}
        aria-hidden="true"
      />
      {ROLE_LABEL[role]}
    </span>
  );
}

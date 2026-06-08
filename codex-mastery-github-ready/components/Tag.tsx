import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Tag({ children, active = false }: { children: ReactNode; active?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        active ? "border-accent/40 bg-accent/10 text-accent" : "border-line bg-surface/60 text-muted"
      )}
    >
      {children}
    </span>
  );
}

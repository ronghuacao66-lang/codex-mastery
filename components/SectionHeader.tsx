import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  actions?: ReactNode;
};

export function SectionHeader({ eyebrow, title, description, className, actions }: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4 md:flex-row md:items-end md:justify-between", className)}>
      <div className="max-w-3xl">
        {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">{eyebrow}</p> : null}
        <h1 className="mt-2 text-3xl font-semibold tracking-normal text-ink md:text-5xl">{title}</h1>
        {description ? <p className="mt-4 max-w-2xl text-base leading-7 text-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  );
}

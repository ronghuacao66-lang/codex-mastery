import type { ReactNode } from "react";
import { Tag } from "@/components/Tag";
import { cn } from "@/lib/utils";

type ContentCardProps = {
  title: string;
  description?: string;
  meta?: string;
  tags?: string[];
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
};

export function ContentCard({ title, description, meta, tags = [], actions, children, className }: ContentCardProps) {
  return (
    <article
      className={cn(
        "group flex min-h-[220px] flex-col rounded-lg border border-line bg-panel p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[0_24px_80px_rgba(0,113,227,0.12)] dark:shadow-darksoft",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          {meta ? <p className="mb-2 text-xs font-medium text-muted">{meta}</p> : null}
          <h2 className="text-lg font-semibold leading-7 text-ink">{title}</h2>
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
      {description ? <p className="mt-3 text-sm leading-6 text-muted">{description}</p> : null}
      {children ? <div className="mt-4 flex-1 text-sm leading-6 text-muted">{children}</div> : <div className="flex-1" />}
      {tags.length ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {tags.slice(0, 5).map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      ) : null}
    </article>
  );
}

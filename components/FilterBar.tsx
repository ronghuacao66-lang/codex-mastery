"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

type FilterBarProps = {
  query: string;
  onQueryChange: (value: string) => void;
  categories?: string[];
  activeCategory?: string;
  onCategoryChange?: (value: string) => void;
  tags?: string[];
  activeTag?: string;
  onTagChange?: (value: string) => void;
  placeholder?: string;
};

export function FilterBar({
  query,
  onQueryChange,
  categories = [],
  activeCategory = "全部",
  onCategoryChange,
  tags = [],
  activeTag = "全部",
  onTagChange,
  placeholder = "搜索标题、标签、内容"
}: FilterBarProps) {
  const hasFilter = query || activeCategory !== "全部" || activeTag !== "全部";

  return (
    <div className="rounded-lg border border-line bg-panel p-3 shadow-soft dark:shadow-darksoft">
      <div className="flex flex-col gap-3 lg:flex-row">
        <label className="relative block flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={placeholder}
            className="h-11 w-full rounded-md border border-line bg-surface pl-9 pr-3 text-sm text-ink outline-none transition placeholder:text-muted focus:border-accent"
          />
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          {categories.length ? (
            <select
              value={activeCategory}
              onChange={(event) => onCategoryChange?.(event.target.value)}
              className="h-11 rounded-md border border-line bg-surface px-3 text-sm text-ink outline-none focus:border-accent"
              aria-label="分类筛选"
            >
              {["全部", ...categories].map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          ) : null}
          {hasFilter ? (
            <button
              type="button"
              onClick={() => {
                onQueryChange("");
                onCategoryChange?.("全部");
                onTagChange?.("全部");
              }}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-line bg-surface px-3 text-sm text-muted transition hover:text-ink"
            >
              <X className="h-4 w-4" />
              清空
            </button>
          ) : null}
        </div>
      </div>
      {tags.length ? (
        <div className="fine-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
          {["全部", ...tags].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onTagChange?.(tag)}
              className={cn(
                "h-8 shrink-0 rounded-full border px-3 text-xs font-medium transition",
                activeTag === tag
                  ? "border-accent/40 bg-accent/10 text-accent"
                  : "border-line bg-surface text-muted hover:text-ink"
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

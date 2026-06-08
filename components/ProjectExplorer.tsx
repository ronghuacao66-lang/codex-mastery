"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { ContentCard } from "@/components/ContentCard";
import { EmptyState } from "@/components/EmptyState";
import { FavoriteButton } from "@/components/FavoriteButton";
import { FilterBar } from "@/components/FilterBar";
import { useFavorites } from "@/components/useFavorites";
import { matchesSearch, toCopyBlock, unique } from "@/lib/utils";
import type { ProjectItem } from "@/types/content";

export function ProjectExplorer({ items }: { items: ProjectItem[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("全部");
  const [tag, setTag] = useState("全部");
  const { isFavorite, toggleFavorite } = useFavorites();

  const categories = useMemo(() => unique(items.map((item) => item.category)), [items]);
  const tags = useMemo(() => unique(items.flatMap((item) => item.tags)), [items]);
  const filtered = items.filter((item) => {
    const searchable = [
      item.title,
      item.category,
      item.goal,
      item.businessValue,
      item.steps.join(" "),
      item.prompt,
      item.optimizationTips.join(" "),
      item.deliverables.join(" "),
      item.tags.join(" ")
    ].join(" ");
    return (
      matchesSearch(searchable, query) &&
      (category === "全部" || item.category === category) &&
      (tag === "全部" || item.tags.includes(tag))
    );
  });

  return (
    <div className="space-y-6">
      <FilterBar
        query={query}
        onQueryChange={setQuery}
        categories={categories}
        activeCategory={category}
        onCategoryChange={setCategory}
        tags={tags}
        activeTag={tag}
        onTagChange={setTag}
        placeholder="搜索项目、业务价值、步骤"
      />
      {filtered.length ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {filtered.map((item) => (
            <ContentCard
              key={item.id}
              title={item.title}
              meta={`${item.category} / ${item.difficulty} / ${item.duration}`}
              description={item.goal}
              tags={item.tags}
              actions={
                <>
                  <FavoriteButton active={isFavorite(item.id)} onToggle={() => toggleFavorite(item.id)} />
                  <CopyButton value={toCopyBlock(item.title, item.prompt)} />
                </>
              }
            >
              <p className="text-sm leading-6 text-muted">
                <span className="font-semibold text-ink">业务价值：</span>
                {item.businessValue}
              </p>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <ListBlock title="实现步骤" items={item.steps} />
                <ListBlock title="优化建议" items={item.optimizationTips} />
              </div>
            </ContentCard>
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-md border border-line bg-surface p-3">
      <p className="text-xs font-semibold text-ink">{title}</p>
      <ul className="mt-2 space-y-1 text-sm">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}

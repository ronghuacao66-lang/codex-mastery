"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { ContentCard } from "@/components/ContentCard";
import { EmptyState } from "@/components/EmptyState";
import { FavoriteButton } from "@/components/FavoriteButton";
import { FilterBar } from "@/components/FilterBar";
import { useFavorites } from "@/components/useFavorites";
import { matchesSearch, toCopyBlock, unique } from "@/lib/utils";
import type { ToolItem } from "@/types/content";

export function ToolExplorer({ items }: { items: ToolItem[] }) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("全部");
  const { isFavorite, toggleFavorite } = useFavorites();
  const tags = useMemo(() => unique(items.flatMap((item) => item.tags)), [items]);
  const filtered = items.filter((item) => {
    const searchable = [
      item.name,
      item.positioning,
      item.strengths.join(" "),
      item.limitations.join(" "),
      item.bestScenarios.join(" "),
      item.recommendedWorkflow,
      item.tags.join(" ")
    ].join(" ");
    return matchesSearch(searchable, query) && (tag === "全部" || item.tags.includes(tag));
  });

  return (
    <div className="space-y-6">
      <FilterBar query={query} onQueryChange={setQuery} tags={tags} activeTag={tag} onTagChange={setTag} placeholder="搜索工具、场景、优势" />
      {filtered.length ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {filtered.map((item) => (
            <ContentCard
              key={item.id}
              title={item.name}
              meta="AI 工具库"
              description={item.positioning}
              tags={item.tags}
              actions={
                <>
                  <FavoriteButton active={isFavorite(item.id)} onToggle={() => toggleFavorite(item.id)} />
                  <CopyButton value={toCopyBlock(item.name, item.recommendedWorkflow)} label="复制工作流" />
                </>
              }
            >
              <div className="grid gap-3 md:grid-cols-3">
                <ListBlock title="优势" items={item.strengths} />
                <ListBlock title="局限" items={item.limitations} />
                <ListBlock title="最佳场景" items={item.bestScenarios} />
              </div>
              <p className="mt-3 rounded-md border border-line bg-surface p-3">
                <span className="font-semibold text-ink">推荐工作流：</span>
                {item.recommendedWorkflow}
              </p>
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

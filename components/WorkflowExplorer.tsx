"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { ContentCard } from "@/components/ContentCard";
import { EmptyState } from "@/components/EmptyState";
import { FavoriteButton } from "@/components/FavoriteButton";
import { FilterBar } from "@/components/FilterBar";
import { useFavorites } from "@/components/useFavorites";
import { matchesSearch, toCopyBlock, unique } from "@/lib/utils";
import type { WorkflowItem } from "@/types/content";

export function WorkflowExplorer({ items }: { items: WorkflowItem[] }) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("全部");
  const { isFavorite, toggleFavorite } = useFavorites();
  const tags = useMemo(() => unique(items.flatMap((item) => item.tags)), [items]);

  const filtered = items.filter((item) => {
    const searchable = [item.title, item.owner, item.trigger, item.outcome, item.steps.join(" "), item.prompt, item.tags.join(" ")].join(" ");
    return matchesSearch(searchable, query) && (tag === "全部" || item.tags.includes(tag));
  });

  return (
    <div className="space-y-6">
      <FilterBar query={query} onQueryChange={setQuery} tags={tags} activeTag={tag} onTagChange={setTag} placeholder="搜索工作流、角色、产出" />
      {filtered.length ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {filtered.map((item) => (
            <ContentCard
              key={item.id}
              title={item.title}
              meta={`负责人：${item.owner}`}
              description={item.outcome}
              tags={item.tags}
              actions={
                <>
                  <FavoriteButton active={isFavorite(item.id)} onToggle={() => toggleFavorite(item.id)} />
                  <CopyButton value={toCopyBlock(item.title, item.prompt)} />
                </>
              }
            >
              <div className="space-y-3">
                <p>
                  <span className="font-semibold text-ink">触发条件：</span>
                  {item.trigger}
                </p>
                <ListBlock title="执行步骤" items={item.steps} />
                <ListBlock title="检查点" items={item.checkpoints} />
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

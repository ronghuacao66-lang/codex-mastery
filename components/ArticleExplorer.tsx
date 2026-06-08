"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { ContentCard } from "@/components/ContentCard";
import { EmptyState } from "@/components/EmptyState";
import { FavoriteButton } from "@/components/FavoriteButton";
import { FilterBar } from "@/components/FilterBar";
import { useFavorites } from "@/components/useFavorites";
import { matchesSearch, toCopyBlock, unique } from "@/lib/utils";
import type { ArticleItem } from "@/types/content";

export function ArticleExplorer({ items }: { items: ArticleItem[] }) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("全部");
  const { isFavorite, toggleFavorite } = useFavorites();

  const tags = useMemo(() => unique(items.flatMap((item) => item.tags)), [items]);
  const filtered = items.filter((item) => {
    const searchable = [
      item.title,
      item.summary,
      item.level,
      item.coreKnowledge.join(" "),
      item.wrongExample,
      item.rightExample,
      item.bestPractices.join(" "),
      item.tags.join(" ")
    ].join(" ");
    return matchesSearch(searchable, query) && (tag === "全部" || item.tags.includes(tag));
  });

  return (
    <div className="space-y-6">
      <FilterBar
        query={query}
        onQueryChange={setQuery}
        tags={tags}
        activeTag={tag}
        onTagChange={setTag}
        placeholder="搜索章节、知识点、案例"
      />
      {filtered.length ? (
        <div className="space-y-4">
          {filtered.map((item) => (
            <ContentCard
              key={item.id}
              title={`第${item.chapter}章：${item.title}`}
              meta={`${item.level} / ${item.readingMinutes} 分钟阅读`}
              description={item.summary}
              tags={item.tags}
              actions={
                <>
                  <FavoriteButton active={isFavorite(item.id)} onToggle={() => toggleFavorite(item.id)} />
                  <CopyButton value={toCopyBlock(item.title, item.rightExample)} label="复制案例" />
                </>
              }
            >
              <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <div>
                  <p className="text-sm font-semibold text-ink">核心知识</p>
                  <ul className="mt-2 space-y-2">
                    {item.coreKnowledge.map((point) => (
                      <li key={point}>• {point}</li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <ExampleBox title="错误案例" tone="muted" value={item.wrongExample} />
                  <ExampleBox title="正确案例" tone="accent" value={item.rightExample} />
                </div>
              </div>
              <div className="mt-4 rounded-md border border-line bg-surface p-3">
                <p className="text-sm font-semibold text-ink">最佳实践</p>
                <ul className="mt-2 space-y-1 text-sm">
                  {item.bestPractices.map((practice) => (
                    <li key={practice}>• {practice}</li>
                  ))}
                </ul>
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

function ExampleBox({ title, value, tone }: { title: string; value: string; tone: "muted" | "accent" }) {
  return (
    <div className="rounded-md border border-line bg-surface p-3">
      <p className={tone === "accent" ? "text-xs font-semibold text-accent" : "text-xs font-semibold text-muted"}>{title}</p>
      <p className="mt-2 text-sm leading-6 text-ink">{value}</p>
    </div>
  );
}

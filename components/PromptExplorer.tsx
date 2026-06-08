"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { ContentCard } from "@/components/ContentCard";
import { EmptyState } from "@/components/EmptyState";
import { FavoriteButton } from "@/components/FavoriteButton";
import { FilterBar } from "@/components/FilterBar";
import { useFavorites } from "@/components/useFavorites";
import { matchesSearch, toCopyBlock, unique } from "@/lib/utils";
import type { PromptItem } from "@/types/content";

export function PromptExplorer({ items }: { items: PromptItem[] }) {
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
      item.scenario,
      item.prompt,
      item.inputRequirements.join(" "),
      item.outputRequirements.join(" "),
      item.bestPractices.join(" "),
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
        placeholder="搜索 Prompt、场景、标签"
      />
      {filtered.length ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {filtered.map((item) => (
            <ContentCard
              key={item.id}
              title={item.title}
              meta={`${item.kind === "codex" ? "Codex Prompt" : "AI Prompt"} / ${item.category} / ${item.difficulty}`}
              description={item.scenario}
              tags={item.tags}
              actions={
                <>
                  <FavoriteButton active={isFavorite(item.id)} onToggle={() => toggleFavorite(item.id)} />
                  <CopyButton value={toCopyBlock(item.title, item.prompt)} />
                </>
              }
            >
              <div className="rounded-md border border-line bg-surface p-3 text-sm leading-6 text-ink">{item.prompt}</div>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <MiniList title="输入要求" items={item.inputRequirements} />
                <MiniList title="输出要求" items={item.outputRequirements} />
                <MiniList title="最佳实践" items={item.bestPractices} />
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

function MiniList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-xs font-semibold text-ink">{title}</p>
      <ul className="mt-2 space-y-1 text-xs leading-5 text-muted">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}

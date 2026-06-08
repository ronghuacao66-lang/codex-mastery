"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { ContentCard } from "@/components/ContentCard";
import { EmptyState } from "@/components/EmptyState";
import { FavoriteButton } from "@/components/FavoriteButton";
import { FilterBar } from "@/components/FilterBar";
import { useFavorites } from "@/components/useFavorites";
import { matchesSearch, toCopyBlock, unique } from "@/lib/utils";
import type { TemplateItem } from "@/types/content";

export function TemplateExplorer({ items }: { items: TemplateItem[] }) {
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
      item.purpose,
      item.sections.flatMap((section) => [section.name, ...section.fields]).join(" "),
      item.prompt,
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
        placeholder="搜索模板、字段、用途"
      />
      {filtered.length ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {filtered.map((item) => (
            <ContentCard
              key={item.id}
              title={item.title}
              meta={item.category}
              description={item.purpose}
              tags={item.tags}
              actions={
                <>
                  <FavoriteButton active={isFavorite(item.id)} onToggle={() => toggleFavorite(item.id)} />
                  <CopyButton value={toCopyBlock(item.title, formatTemplate(item))} label="复制模板" />
                </>
              }
            >
              <div className="space-y-3">
                {item.sections.map((section) => (
                  <div key={section.name} className="rounded-md border border-line bg-surface p-3">
                    <p className="text-xs font-semibold text-ink">{section.name}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {section.fields.map((field) => (
                        <span key={field} className="rounded-full bg-panel px-2.5 py-1 text-xs text-muted">
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
                <p className="text-sm">
                  <span className="font-semibold text-ink">输出格式：</span>
                  {item.outputFormat}
                </p>
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

function formatTemplate(item: TemplateItem) {
  return [
    item.purpose,
    "",
    ...item.sections.map((section) => `${section.name}\n${section.fields.map((field) => `- ${field}：`).join("\n")}`),
    "",
    `Prompt：${item.prompt}`,
    `输出格式：${item.outputFormat}`
  ].join("\n");
}

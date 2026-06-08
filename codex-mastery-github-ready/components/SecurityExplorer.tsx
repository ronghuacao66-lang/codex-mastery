"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { ContentCard } from "@/components/ContentCard";
import { EmptyState } from "@/components/EmptyState";
import { FavoriteButton } from "@/components/FavoriteButton";
import { FilterBar } from "@/components/FilterBar";
import { useFavorites } from "@/components/useFavorites";
import { matchesSearch, toCopyBlock, unique } from "@/lib/utils";
import type { SecurityScenario } from "@/types/content";

export function SecurityExplorer({ items }: { items: SecurityScenario[] }) {
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState("全部");
  const [tag, setTag] = useState("全部");
  const { isFavorite, toggleFavorite } = useFavorites();

  const domains = useMemo(() => unique(items.map((item) => item.domain)), [items]);
  const tags = useMemo(() => unique(items.flatMap((item) => item.tags)), [items]);
  const filtered = items.filter((item) => {
    const searchable = [
      item.title,
      item.domain,
      item.scenario,
      item.prompt,
      item.inputTemplate.join(" "),
      item.outputTemplate.join(" "),
      item.caseStudy,
      item.tags.join(" ")
    ].join(" ");
    return (
      matchesSearch(searchable, query) &&
      (domain === "全部" || item.domain === domain) &&
      (tag === "全部" || item.tags.includes(tag))
    );
  });

  return (
    <div className="space-y-6">
      <FilterBar
        query={query}
        onQueryChange={setQuery}
        categories={domains}
        activeCategory={domain}
        onCategoryChange={setDomain}
        tags={tags}
        activeTag={tag}
        onTagChange={setTag}
        placeholder="搜索安全场景、Prompt、案例"
      />
      {filtered.length ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {filtered.map((item) => (
            <ContentCard
              key={item.id}
              title={item.title}
              meta={item.domain}
              description={item.scenario}
              tags={item.tags}
              actions={
                <>
                  <FavoriteButton active={isFavorite(item.id)} onToggle={() => toggleFavorite(item.id)} />
                  <CopyButton value={toCopyBlock(item.title, formatSecurityPrompt(item))} />
                </>
              }
            >
              <div className="space-y-3">
                <div className="rounded-md border border-line bg-surface p-3 text-ink">{item.prompt}</div>
                <div className="grid gap-3 md:grid-cols-2">
                  <TemplateBlock title="输入模板" items={item.inputTemplate} />
                  <TemplateBlock title="输出模板" items={item.outputTemplate} />
                </div>
                <p className="rounded-md border border-line bg-surface p-3">
                  <span className="font-semibold text-ink">案例：</span>
                  {item.caseStudy}
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

function TemplateBlock({ title, items }: { title: string; items: string[] }) {
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

function formatSecurityPrompt(item: SecurityScenario) {
  return [
    item.scenario,
    "",
    item.prompt,
    "",
    "输入模板：",
    ...item.inputTemplate.map((line) => `- ${line}`),
    "",
    "输出模板：",
    ...item.outputTemplate.map((line) => `- ${line}`)
  ].join("\n");
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { ContentCard } from "@/components/ContentCard";
import { EmptyState } from "@/components/EmptyState";
import { FavoriteButton } from "@/components/FavoriteButton";
import { FilterBar } from "@/components/FilterBar";
import { useFavorites } from "@/components/useFavorites";
import { matchesSearch, toCopyBlock, unique } from "@/lib/utils";
import type { ProjectItem } from "@/types/content";

const PROJECT_CHECKLIST_KEY = "codex-mastery:project-checklist";

type ProjectChecklistState = Record<string, string[]>;

export function ProjectExplorer({ items }: { items: ProjectItem[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("全部");
  const [tag, setTag] = useState("全部");
  const [checked, setChecked] = useState<ProjectChecklistState>({});
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    const stored = window.localStorage.getItem(PROJECT_CHECKLIST_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as ProjectChecklistState;
      setChecked(parsed && typeof parsed === "object" ? parsed : {});
    } catch {
      setChecked({});
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(PROJECT_CHECKLIST_KEY, JSON.stringify(checked));
  }, [checked]);

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
      item.deliveryChecklist.map((check) => `${check.title} ${check.acceptance} ${check.evidence}`).join(" "),
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
          {filtered.map((item) => {
            const checkedIds = checked[item.id] ?? [];
            return (
              <ContentCard
                key={item.id}
                title={item.title}
                meta={`${item.category} / ${item.difficulty} / ${item.duration}`}
                description={item.goal}
                tags={item.tags}
                actions={
                  <>
                    <FavoriteButton active={isFavorite(item.id)} onToggle={() => toggleFavorite(item.id)} />
                    <CopyButton value={toCopyBlock(item.title, item.prompt)} label="复制 Prompt" />
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
                <div className="mt-3">
                  <ListBlock title="成果物" items={item.deliverables} />
                </div>
                <ProjectChecklist
                  item={item}
                  checkedIds={checkedIds}
                  onToggle={(checkId) => {
                    setChecked((current) => {
                      const currentIds = current[item.id] ?? [];
                      const nextIds = currentIds.includes(checkId)
                        ? currentIds.filter((id) => id !== checkId)
                        : [...currentIds, checkId];
                      return {
                        ...current,
                        [item.id]: nextIds
                      };
                    });
                  }}
                />
              </ContentCard>
            );
          })}
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

function ProjectChecklist({
  item,
  checkedIds,
  onToggle
}: {
  item: ProjectItem;
  checkedIds: string[];
  onToggle: (checkId: string) => void;
}) {
  const completed = item.deliveryChecklist.filter((check) => checkedIds.includes(check.id)).length;
  const total = item.deliveryChecklist.length;
  const progress = total ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="mt-4 rounded-lg border border-line bg-surface p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold text-ink">交付检查清单</p>
          <p className="mt-1 text-xs leading-5 text-muted">
            {completed}/{total} 已完成 · 按验收证据推进项目交付
          </p>
        </div>
        <CopyButton
          value={buildDeliveryChecklistText(item)}
          label="复制清单"
          className="h-8 self-start text-xs"
        />
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line">
        <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${progress}%` }} />
      </div>
      <div className="mt-4 space-y-3">
        {item.deliveryChecklist.map((check) => {
          const active = checkedIds.includes(check.id);
          return (
            <label
              key={check.id}
              className="flex cursor-pointer gap-3 rounded-md border border-line bg-panel p-3 transition hover:border-accent/35"
            >
              <input
                type="checkbox"
                checked={active}
                onChange={() => onToggle(check.id)}
                className="mt-1 h-4 w-4 shrink-0 rounded border-line accent-accent"
              />
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-ink">{check.title}</span>
                <span className="mt-1 block text-xs leading-5 text-muted">
                  <span className="font-semibold text-ink">验收：</span>
                  {check.acceptance}
                </span>
                <span className="mt-1 block text-xs leading-5 text-muted">
                  <span className="font-semibold text-ink">证据：</span>
                  {check.evidence}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

function buildDeliveryChecklistText(item: ProjectItem) {
  return [
    `# ${item.title} 交付检查清单`,
    "",
    `目标：${item.goal}`,
    `业务价值：${item.businessValue}`,
    "",
    "## 成果物",
    ...item.deliverables.map((deliverable) => `- ${deliverable}`),
    "",
    "## 检查项",
    ...item.deliveryChecklist.flatMap((check, index) => [
      `${index + 1}. ${check.title}`,
      `   - 验收：${check.acceptance}`,
      `   - 证据：${check.evidence}`
    ]),
    "",
    "## Codex 实现 Prompt",
    item.prompt
  ].join("\n");
}

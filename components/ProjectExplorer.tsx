"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, CheckCircle2, ClipboardList, Target } from "lucide-react";
import { type ReactNode, useEffect, useMemo, useState } from "react";
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
  const portfolioStats = useMemo(() => buildPortfolioStats(items, checked), [items, checked]);
  const portfolioReport = useMemo(() => buildProjectPortfolioReport(items, checked), [items, checked]);

  return (
    <div className="space-y-6">
      <ProjectPortfolioSummary stats={portfolioStats} report={portfolioReport} />
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
                <div className="mt-4">
                  <Link
                    href={`/projects/${item.id}`}
                    className="inline-flex h-9 items-center gap-2 rounded-md border border-line bg-panel px-3 text-sm font-medium text-ink transition hover:-translate-y-0.5 hover:border-accent/50 hover:text-accent"
                  >
                    查看详情
                    <ArrowRight className="h-4 w-4" />
                  </Link>
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

type ProjectProgress = {
  id: string;
  title: string;
  completed: number;
  total: number;
  progress: number;
};

type PortfolioStats = {
  totalProjects: number;
  completedProjects: number;
  totalChecks: number;
  completedChecks: number;
  overallProgress: number;
  nextProject: ProjectProgress | null;
  topProjects: ProjectProgress[];
};

function ProjectPortfolioSummary({ stats, report }: { stats: PortfolioStats; report: string }) {
  return (
    <section className="rounded-lg border border-line bg-panel p-5 shadow-soft dark:shadow-darksoft">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-muted">
            <BarChart3 className="h-3.5 w-3.5 text-accent" />
            项目组合进度
          </div>
          <h2 className="mt-3 text-xl font-semibold text-ink">8 个实战项目交付总览</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
            基于当前浏览器的交付检查状态，汇总整体进度、已完成项目和下一步建议，适合复制给 Codex 做周复盘或项目推进计划。
          </p>
        </div>
        <CopyButton value={report} label="复制组合报告" />
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <SummaryMetric icon={<Target className="h-4 w-4" />} label="整体完成度" value={`${stats.overallProgress}%`} />
        <SummaryMetric icon={<ClipboardList className="h-4 w-4" />} label="检查项" value={`${stats.completedChecks}/${stats.totalChecks}`} />
        <SummaryMetric icon={<CheckCircle2 className="h-4 w-4" />} label="完成项目" value={`${stats.completedProjects}/${stats.totalProjects}`} />
        <SummaryMetric
          icon={<ArrowRight className="h-4 w-4" />}
          label="建议推进"
          value={stats.nextProject ? stats.nextProject.title : "全部完成"}
          compact
        />
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-line">
        <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${stats.overallProgress}%` }} />
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        {stats.topProjects.map((project) => (
          <div key={project.id} className="rounded-md border border-line bg-surface p-3">
            <div className="flex items-start justify-between gap-3">
              <p className="min-w-0 text-sm font-semibold text-ink">{project.title}</p>
              <span className="shrink-0 rounded-full border border-line bg-panel px-2 py-0.5 text-xs font-semibold text-muted">
                {project.progress}%
              </span>
            </div>
            <p className="mt-2 text-xs leading-5 text-muted">
              {project.completed}/{project.total} 检查项完成
            </p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line">
              <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${project.progress}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SummaryMetric({
  icon,
  label,
  value,
  compact = false
}: {
  icon: ReactNode;
  label: string;
  value: string;
  compact?: boolean;
}) {
  return (
    <div className="rounded-md border border-line bg-surface p-4">
      <p className="flex items-center gap-2 text-xs font-semibold text-muted">
        <span className="text-accent">{icon}</span>
        {label}
      </p>
      <p className={`mt-2 font-semibold text-ink ${compact ? "line-clamp-2 text-sm leading-5" : "text-2xl"}`}>{value}</p>
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

function buildPortfolioStats(items: ProjectItem[], checked: ProjectChecklistState): PortfolioStats {
  const progress = items.map((item) => {
    const checkedIds = checked[item.id] ?? [];
    const completed = item.deliveryChecklist.filter((check) => checkedIds.includes(check.id)).length;
    const total = item.deliveryChecklist.length;
    return {
      id: item.id,
      title: item.title,
      completed,
      total,
      progress: total ? Math.round((completed / total) * 100) : 0
    };
  });
  const totalChecks = progress.reduce((sum, item) => sum + item.total, 0);
  const completedChecks = progress.reduce((sum, item) => sum + item.completed, 0);
  const nextProject = progress
    .filter((item) => item.progress < 100)
    .sort((a, b) => b.progress - a.progress || a.title.localeCompare(b.title, "zh-Hans-CN"))[0] ?? null;

  return {
    totalProjects: items.length,
    completedProjects: progress.filter((item) => item.total > 0 && item.completed === item.total).length,
    totalChecks,
    completedChecks,
    overallProgress: totalChecks ? Math.round((completedChecks / totalChecks) * 100) : 0,
    nextProject,
    topProjects: [...progress]
      .sort((a, b) => b.progress - a.progress || a.title.localeCompare(b.title, "zh-Hans-CN"))
      .slice(0, 3)
  };
}

function buildProjectPortfolioReport(items: ProjectItem[], checked: ProjectChecklistState) {
  const stats = buildPortfolioStats(items, checked);
  const lines = items.map((item) => {
    const checkedIds = checked[item.id] ?? [];
    const completedChecks = item.deliveryChecklist.filter((check) => checkedIds.includes(check.id));
    const pendingChecks = item.deliveryChecklist.filter((check) => !checkedIds.includes(check.id));
    const progress = item.deliveryChecklist.length ? Math.round((completedChecks.length / item.deliveryChecklist.length) * 100) : 0;
    return [
      `## ${item.title}`,
      `- 类别：${item.category}`,
      `- 完成度：${progress}% (${completedChecks.length}/${item.deliveryChecklist.length})`,
      `- 已完成：${completedChecks.length ? completedChecks.map((check) => check.title).join("、") : "暂无"}`,
      `- 下一步：${pendingChecks[0]?.title ?? "进入复盘与优化"}`
    ].join("\n");
  });

  return [
    "# Codex Mastery 项目组合进度报告",
    "",
    `整体完成度：${stats.overallProgress}%`,
    `完成项目：${stats.completedProjects}/${stats.totalProjects}`,
    `检查项进度：${stats.completedChecks}/${stats.totalChecks}`,
    `建议优先推进：${stats.nextProject?.title ?? "全部项目已完成，可进入复盘与案例包装"}`,
    "",
    "说明：本报告基于当前浏览器本地保存的项目交付检查状态生成。",
    "",
    ...lines
  ].join("\n");
}

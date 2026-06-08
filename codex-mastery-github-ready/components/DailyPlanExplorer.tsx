"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { CheckCircle2, ClipboardList, Lightbulb, ListChecks, Timer, TriangleAlert } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";
import { ContentCard } from "@/components/ContentCard";
import { EmptyState } from "@/components/EmptyState";
import { FavoriteButton } from "@/components/FavoriteButton";
import { FilterBar } from "@/components/FilterBar";
import { useFavorites } from "@/components/useFavorites";
import { matchesSearch, toCopyBlock, unique } from "@/lib/utils";
import type { DailyPlanItem } from "@/types/content";

export function DailyPlanExplorer({ items }: { items: DailyPlanItem[] }) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("全部");
  const { isFavorite, toggleFavorite } = useFavorites();
  const tags = useMemo(() => unique(items.flatMap((item) => item.tags)), [items]);

  const filtered = items.filter((item) => {
    const searchable = [
      item.title,
      item.learningGoal,
      item.timebox ?? "",
      item.theory,
      item.coreConcepts?.join(" ") ?? "",
      item.practiceTask,
      item.stepByStep?.join(" ") ?? "",
      item.starterInput?.join(" ") ?? "",
      item.prompt,
      item.deliverable,
      item.acceptanceCriteria?.join(" ") ?? "",
      item.commonMistakes?.join(" ") ?? "",
      item.extensionTask ?? "",
      item.retrospectiveQuestions.join(" "),
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
        placeholder="搜索 Day、目标、任务、Prompt"
      />
      {filtered.length ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {filtered.map((item) => (
            <ContentCard
              key={item.day}
              title={`Day ${item.day} · ${item.title}`}
              meta={weekLabel(item.day)}
              description={item.learningGoal}
              tags={item.tags}
              actions={
                <>
                  <FavoriteButton active={isFavorite(`day-${item.day}`)} onToggle={() => toggleFavorite(`day-${item.day}`)} />
                  <CopyButton value={formatDailyPlan(item)} label="复制当天手册" />
                </>
              }
            >
              <div className="space-y-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <InfoBlock icon={<Timer className="h-4 w-4" />} title="建议用时" value={item.timebox ?? "60-90 分钟"} />
                  <InfoBlock icon={<Lightbulb className="h-4 w-4" />} title="核心理论" value={item.theory} />
                </div>
                <ListBlock icon={<ClipboardList className="h-4 w-4" />} title="今天要掌握" items={item.coreConcepts ?? [item.learningGoal]} />
                <ListBlock icon={<ListChecks className="h-4 w-4" />} title="实战步骤" items={item.stepByStep ?? [item.practiceTask]} ordered />
                <ListBlock title="示例输入 / 准备材料" items={item.starterInput ?? ["当前项目仓库", "你的业务目标", "可运行命令"]} />
                <div className="rounded-md border border-line bg-surface p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold text-ink">当天 Codex Prompt</p>
                    <CopyButton value={toCopyBlock(`Day ${item.day} ${item.title}`, item.prompt)} label="复制Prompt" className="h-8 px-2 text-xs" />
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted">{item.prompt}</p>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <InfoBlock title="成果物" value={item.deliverable} />
                  <InfoBlock title="加餐挑战" value={item.extensionTask ?? "把今天产出的 Prompt 或组件复用到另一个真实任务中。"} />
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <ListBlock icon={<CheckCircle2 className="h-4 w-4" />} title="验收标准" items={item.acceptanceCriteria ?? ["结果可运行", "输出可复制", "验证步骤清晰"]} />
                  <ListBlock icon={<TriangleAlert className="h-4 w-4" />} title="常见错误" items={item.commonMistakes ?? ["任务太大", "缺少上下文", "没有验收标准"]} />
                </div>
                <ListBlock title="复盘问题" items={item.retrospectiveQuestions} />
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

function weekLabel(day: number) {
  if (day <= 7) return "第 1 周 / Codex 基础";
  if (day <= 14) return "第 2 周 / 页面与产品";
  if (day <= 21) return "第 3 周 / 工具与业务";
  return "第 4 周 / Agent 与毕业项目";
}

function InfoBlock({ title, value, icon }: { title: string; value: string; icon?: ReactNode }) {
  return (
    <div className="rounded-md border border-line bg-surface p-3">
      <p className="flex items-center gap-2 text-xs font-semibold text-ink">
        {icon ? <span className="text-accent">{icon}</span> : null}
        {title}
      </p>
      <p className="mt-2 text-sm leading-6 text-muted">{value}</p>
    </div>
  );
}

function ListBlock({
  title,
  items,
  ordered = false,
  icon
}: {
  title: string;
  items: string[];
  ordered?: boolean;
  icon?: ReactNode;
}) {
  const List = ordered ? "ol" : "ul";
  return (
    <div className="rounded-md border border-line bg-surface p-3">
      <p className="flex items-center gap-2 text-xs font-semibold text-ink">
        {icon ? <span className="text-accent">{icon}</span> : null}
        {title}
      </p>
      <List className="mt-2 space-y-1 text-sm leading-6 text-muted">
        {items.map((item, index) => (
          <li key={item}>
            {ordered ? `${index + 1}. ` : "• "}
            {item}
          </li>
        ))}
      </List>
    </div>
  );
}

function formatDailyPlan(item: DailyPlanItem) {
  return [
    `# Day ${item.day} · ${item.title}`,
    "",
    `建议用时：${item.timebox ?? "60-90 分钟"}`,
    `学习目标：${item.learningGoal}`,
    "",
    "## 核心理论",
    item.theory,
    "",
    "## 今天要掌握",
    ...(item.coreConcepts ?? [item.learningGoal]).map((value) => `- ${value}`),
    "",
    "## 实战步骤",
    ...(item.stepByStep ?? [item.practiceTask]).map((value, index) => `${index + 1}. ${value}`),
    "",
    "## 示例输入 / 准备材料",
    ...(item.starterInput ?? ["当前项目仓库", "你的业务目标", "可运行命令"]).map((value) => `- ${value}`),
    "",
    "## Codex Prompt",
    item.prompt,
    "",
    "## 成果物",
    item.deliverable,
    "",
    "## 验收标准",
    ...(item.acceptanceCriteria ?? ["结果可运行", "输出可复制", "验证步骤清晰"]).map((value) => `- ${value}`),
    "",
    "## 常见错误",
    ...(item.commonMistakes ?? ["任务太大", "缺少上下文", "没有验收标准"]).map((value) => `- ${value}`),
    "",
    "## 加餐挑战",
    item.extensionTask ?? "把今天产出的 Prompt 或组件复用到另一个真实任务中。",
    "",
    "## 复盘问题",
    ...item.retrospectiveQuestions.map((value) => `- ${value}`)
  ].join("\n");
}

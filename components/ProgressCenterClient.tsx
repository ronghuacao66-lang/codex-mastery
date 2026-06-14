"use client";

import { BarChart3, CheckCircle2, Circle, ClipboardCheck, RotateCcw, Target, Trophy } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { Tag } from "@/components/Tag";
import { cn } from "@/lib/utils";
import type { DailyPlanItem } from "@/types/content";

const PROGRESS_KEY = "codex-mastery:completed-days";
const PROGRESS_EVENT = "codex-mastery:progress-updated";

export function ProgressCenterClient({ items }: { items: DailyPlanItem[] }) {
  const [completed, setCompleted] = useState<number[]>([]);

  useEffect(() => {
    const stored = window.localStorage.getItem(PROGRESS_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as number[];
      setCompleted(parsed.filter((day) => items.some((item) => item.day === day)).sort((a, b) => a - b));
    } catch {
      setCompleted([]);
    }
  }, [items]);

  useEffect(() => {
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(completed));
    window.dispatchEvent(new Event(PROGRESS_EVENT));
  }, [completed]);

  const completedSet = useMemo(() => new Set(completed), [completed]);
  const allCompleted = completed.length === items.length;
  const nextDay = items.find((item) => !completedSet.has(item.day)) ?? items[items.length - 1];
  const lastCompleted = completed.length ? items.find((item) => item.day === completed[completed.length - 1]) : undefined;
  const progress = Math.round((completed.length / items.length) * 100);
  const weekStats = [1, 2, 3, 4].map((week) => {
    const start = (week - 1) * 7 + 1;
    const end = week === 4 ? 30 : week * 7;
    const weekItems = items.filter((item) => item.day >= start && item.day <= end);
    const done = weekItems.filter((item) => completedSet.has(item.day)).length;
    return { week, start, end, total: weekItems.length, done };
  });

  function toggleDay(day: number) {
    setCompleted((current) => (current.includes(day) ? current.filter((item) => item !== day) : [...current, day].sort((a, b) => a - b)));
  }

  function resetProgress() {
    setCompleted([]);
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-xl border border-line bg-panel shadow-soft dark:shadow-darksoft">
        <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="p-6 md:p-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-muted">
              <BarChart3 className="h-3.5 w-3.5 text-accent" />
              30 天训练进度
            </div>
            <div className="mt-6 flex flex-wrap items-end gap-4">
              <span className="text-6xl font-semibold text-ink">{progress}%</span>
              <span className="pb-2 text-sm text-muted">{completed.length}/{items.length} 天完成</span>
            </div>
            <div className="mt-5 h-2 rounded-full bg-surface">
              <div className="h-2 rounded-full bg-gradient-to-r from-accent to-violet transition-all" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <SummaryBlock
                icon={<Target className="h-4 w-4" />}
                label="下一步"
                title={allCompleted ? "30 天训练已完成" : `Day ${nextDay.day} · ${nextDay.title}`}
                value={allCompleted ? "进入项目实战中心，把训练营成果沉淀为一个可上线项目。" : nextDay.learningGoal}
              />
              <SummaryBlock
                icon={<Trophy className="h-4 w-4" />}
                label="最近完成"
                title={lastCompleted ? `Day ${lastCompleted.day} · ${lastCompleted.title}` : "暂无完成记录"}
                value={lastCompleted ? lastCompleted.deliverable : "从 Day 1 开始完成第一份成果物。"}
              />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => toggleDay(nextDay.day)}
                disabled={allCompleted}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-ink px-3 text-sm font-semibold text-panel transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45"
              >
                <CheckCircle2 className="h-4 w-4" />
                {allCompleted ? "已完成全部" : `完成 Day ${nextDay.day}`}
              </button>
              <CopyButton value={buildProgressReport(items, completedSet, allCompleted ? undefined : nextDay)} label="复制进度报告" className="h-10" />
              <button
                type="button"
                onClick={resetProgress}
                disabled={!completed.length}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-line bg-surface px-3 text-sm font-medium text-muted transition hover:text-ink disabled:cursor-not-allowed disabled:opacity-45"
              >
                <RotateCcw className="h-4 w-4" />
                重置
              </button>
            </div>
          </div>
          <div className="border-t border-line bg-surface p-6 lg:border-l lg:border-t-0 md:p-8">
            <p className="text-sm font-semibold text-ink">周进度</p>
            <div className="mt-4 space-y-3">
              {weekStats.map((item) => {
                const width = item.total ? Math.round((item.done / item.total) * 100) : 0;
                return (
                  <div key={item.week} className="rounded-md border border-line bg-panel p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-ink">第 {item.week} 周</p>
                      <p className="text-xs text-muted">Day {item.start}-{item.end} · {item.done}/{item.total}</p>
                    </div>
                    <div className="mt-3 h-1.5 rounded-full bg-surface">
                      <div className="h-1.5 rounded-full bg-accent transition-all" style={{ width: `${width}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => {
          const done = completedSet.has(item.day);
          return (
            <article
              key={item.day}
              className={cn(
                "rounded-lg border bg-panel p-4 transition hover:-translate-y-0.5 hover:shadow-soft dark:hover:shadow-darksoft",
                done ? "border-accent/35" : "border-line"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag active={done}>Day {item.day}</Tag>
                    <Tag>{weekLabel(item.day)}</Tag>
                  </div>
                  <h2 className="mt-3 text-base font-semibold text-ink">{item.title}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => toggleDay(item.day)}
                  className={cn(
                    "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border transition",
                    done ? "border-accent/40 bg-accent/10 text-accent" : "border-line bg-surface text-muted hover:text-ink"
                  )}
                  title={done ? "标记为未完成" : "标记为完成"}
                  aria-label={done ? `标记 Day ${item.day} 为未完成` : `标记 Day ${item.day} 为完成`}
                >
                  {done ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                </button>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted">{item.learningGoal}</p>
              <div className="mt-4 rounded-md border border-line bg-surface p-3">
                <p className="flex items-center gap-2 text-xs font-semibold text-ink">
                  <ClipboardCheck className="h-4 w-4 text-accent" />
                  成果物
                </p>
                <p className="mt-2 text-sm leading-6 text-muted">{item.deliverable}</p>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="text-xs text-muted">{item.timebox ?? "60-90 分钟"}</span>
                <CopyButton value={buildDaySnippet(item)} label="复制" className="h-8 px-2 text-xs" />
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}

function SummaryBlock({ icon, label, title, value }: { icon: ReactNode; label: string; title: string; value: string }) {
  return (
    <div className="rounded-md border border-line bg-surface p-4">
      <p className="flex items-center gap-2 text-xs font-semibold text-muted">
        <span className="text-accent">{icon}</span>
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-ink">{title}</p>
      <p className="mt-2 text-sm leading-6 text-muted">{value}</p>
    </div>
  );
}

function weekLabel(day: number) {
  if (day <= 7) return "第 1 周";
  if (day <= 14) return "第 2 周";
  if (day <= 21) return "第 3 周";
  return "第 4 周";
}

function buildDaySnippet(item: DailyPlanItem) {
  return [
    `Day ${item.day} · ${item.title}`,
    `目标：${item.learningGoal}`,
    `实操：${item.practiceTask}`,
    `成果物：${item.deliverable}`,
    `Prompt：${item.prompt}`
  ].join("\n");
}

function buildProgressReport(items: DailyPlanItem[], completed: Set<number>, nextDay?: DailyPlanItem) {
  const doneItems = items.filter((item) => completed.has(item.day));
  const pendingItems = items.filter((item) => !completed.has(item.day));
  return [
    "# Codex Mastery 学习进度",
    "",
    `完成进度：${doneItems.length}/${items.length} 天`,
    nextDay ? `下一步：Day ${nextDay.day} · ${nextDay.title}` : "下一步：进入项目实战中心，把训练营成果沉淀为可上线项目。",
    "",
    "## 已完成",
    ...(doneItems.length ? doneItems.map((item) => `- Day ${item.day} · ${item.title}`) : ["- 暂无"]),
    "",
    "## 接下来 3 天",
    ...pendingItems.slice(0, 3).map((item) => `- Day ${item.day} · ${item.title}：${item.deliverable}`)
  ].join("\n");
}

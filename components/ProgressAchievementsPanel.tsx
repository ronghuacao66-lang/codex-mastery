"use client";

import { Award, CheckCircle2, Flame, LockKeyhole, Medal, Sparkles, Target } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { cn } from "@/lib/utils";
import type { DailyPlanItem } from "@/types/content";

const PROGRESS_KEY = "codex-mastery:completed-days";
const PROGRESS_EVENT = "codex-mastery:progress-updated";

type Achievement = {
  id: string;
  title: string;
  description: string;
  requirement: string;
  icon: "spark" | "flame" | "medal" | "award" | "target";
  unlocked: boolean;
};

export function ProgressAchievementsPanel({ items }: { items: DailyPlanItem[] }) {
  const [completed, setCompleted] = useState<number[]>([]);

  useEffect(() => {
    function readProgress() {
      setCompleted(readCompletedDays(items));
    }

    readProgress();
    window.addEventListener("storage", readProgress);
    window.addEventListener(PROGRESS_EVENT, readProgress);
    return () => {
      window.removeEventListener("storage", readProgress);
      window.removeEventListener(PROGRESS_EVENT, readProgress);
    };
  }, [items]);

  const completedSet = useMemo(() => new Set(completed), [completed]);
  const progress = Math.round((completed.length / items.length) * 100);
  const streak = longestConsecutive(completed);
  const currentSegment = currentConsecutiveSegment(completed);
  const achievements = buildAchievements(completedSet, completed.length, streak, items.length);
  const unlockedCount = achievements.filter((item) => item.unlocked).length;
  const nextMilestone = achievements.find((item) => !item.unlocked);
  const nextDay = items.find((item) => !completedSet.has(item.day));
  const weeklyFocus = buildWeeklyFocus(items, completedSet);

  return (
    <section className="overflow-hidden rounded-xl border border-line bg-panel shadow-soft dark:shadow-darksoft">
      <div className="grid gap-0 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="border-b border-line bg-surface p-5 md:p-6 xl:border-b-0 xl:border-r">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-3 py-1 text-xs font-semibold text-muted">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            学习成就
          </div>
          <h2 className="mt-3 text-xl font-semibold text-ink">连续训练与里程碑</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            根据当前浏览器的 30 天完成状态自动生成成就、连续 Day 段和下一步推进建议。
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <MetricCard label="成就解锁" value={`${unlockedCount}/${achievements.length}`} detail={`${progress}% 总进度`} />
            <MetricCard label="最长连续 Day" value={`${streak} 天`} detail={currentSegment || "从任意 Day 开始连续完成"} />
            <MetricCard label="下一里程碑" value={nextMilestone ? nextMilestone.title : "全部解锁"} detail={nextMilestone?.requirement ?? "进入项目实战复盘"} />
          </div>

          <div className="mt-5 rounded-md border border-line bg-panel p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Target className="h-4 w-4 text-accent" />
              今日推进建议
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">
              {nextDay
                ? `优先完成 Day ${nextDay.day}「${nextDay.title}」，成果物是：${nextDay.deliverable}`
                : "30 天训练已完成，建议进入项目实战中心，把成果整理成可展示作品。"}
            </p>
          </div>

          <CopyButton value={buildAchievementReport(completed, achievements, nextDay, streak)} label="复制成就报告" className="mt-4 h-10 w-full justify-center" />
        </div>

        <div className="p-5 md:p-6">
          <div className="grid gap-3 md:grid-cols-2">
            {achievements.map((item) => (
              <article
                key={item.id}
                className={cn(
                  "rounded-lg border p-4 transition",
                  item.unlocked ? "border-accent/35 bg-accent/10" : "border-line bg-surface"
                )}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border",
                      item.unlocked ? "border-accent/35 bg-panel text-accent" : "border-line bg-panel text-muted"
                    )}
                  >
                    {item.unlocked ? achievementIcon(item.icon) : <LockKeyhole className="h-4 w-4" />}
                  </span>
                  <div>
                    <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                      {item.title}
                      {item.unlocked ? <CheckCircle2 className="h-4 w-4 text-accent" /> : null}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-muted">{item.description}</p>
                    <p className="mt-2 text-xs font-medium text-muted">{item.requirement}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-5 grid gap-3 lg:grid-cols-4">
            {weeklyFocus.map((week) => (
              <div key={week.week} className="rounded-md border border-line bg-surface p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-ink">第 {week.week} 周</p>
                  <p className="text-xs text-muted">{week.done}/{week.total}</p>
                </div>
                <p className="mt-2 text-xs leading-5 text-muted">{week.focus}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-md border border-line bg-panel p-4">
      <p className="text-xs font-semibold text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-ink">{value}</p>
      <p className="mt-1 text-xs leading-5 text-muted">{detail}</p>
    </div>
  );
}

function readCompletedDays(items: DailyPlanItem[]) {
  const stored = window.localStorage.getItem(PROGRESS_KEY);
  if (!stored) return [];
  try {
    const validDays = new Set(items.map((item) => item.day));
    const parsed = JSON.parse(stored) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((day): day is number => typeof day === "number" && validDays.has(day)).sort((a, b) => a - b);
  } catch {
    return [];
  }
}

function buildAchievements(completed: Set<number>, doneCount: number, streak: number, total: number): Achievement[] {
  return [
    {
      id: "first-step",
      title: "启动 Codex OS",
      description: "完成第一天训练，建立项目体检和任务表达的基本动作。",
      requirement: "完成 Day 1",
      icon: "spark",
      unlocked: completed.has(1)
    },
    {
      id: "first-week",
      title: "第一周闭环",
      description: "完成 Codex 基础、GCCD、搜索、复制、收藏和周复盘。",
      requirement: "完成 Day 1-7",
      icon: "flame",
      unlocked: rangeDone(completed, 1, 7)
    },
    {
      id: "halfway",
      title: "半程突破",
      description: "训练进入 Debug、类型安全和工具开发阶段，开始具备独立交付能力。",
      requirement: "累计完成 15 天",
      icon: "medal",
      unlocked: doneCount >= 15
    },
    {
      id: "business-ready",
      title: "业务实战就绪",
      description: "完成安全售前和业务价值复盘，能把 Codex 用到真实工作场景。",
      requirement: "完成 Day 20-21",
      icon: "target",
      unlocked: completed.has(20) && completed.has(21)
    },
    {
      id: "streak-seven",
      title: "连续推进者",
      description: "至少连续完成 7 个 Day，形成稳定的学习节奏。",
      requirement: "任意连续 7 天训练完成",
      icon: "flame",
      unlocked: streak >= 7
    },
    {
      id: "graduation",
      title: "Codex Mastery 毕业",
      description: "完整完成 30 天训练，具备独立用 Codex 完成项目的基础能力。",
      requirement: `完成 ${total} 天训练`,
      icon: "award",
      unlocked: doneCount === total
    }
  ];
}

function buildWeeklyFocus(items: DailyPlanItem[], completed: Set<number>) {
  return [1, 2, 3, 4].map((week) => {
    const start = (week - 1) * 7 + 1;
    const end = week === 4 ? 30 : week * 7;
    const weekItems = items.filter((item) => item.day >= start && item.day <= end);
    const done = weekItems.filter((item) => completed.has(item.day)).length;
    const next = weekItems.find((item) => !completed.has(item.day));
    return {
      week,
      total: weekItems.length,
      done,
      focus: next ? `下一项：Day ${next.day} · ${next.title}` : "本周已完成，进入下一阶段。"
    };
  });
}

function longestConsecutive(days: number[]) {
  if (!days.length) return 0;
  let best = 1;
  let current = 1;
  for (let index = 1; index < days.length; index += 1) {
    if (days[index] === days[index - 1] + 1) {
      current += 1;
      best = Math.max(best, current);
    } else {
      current = 1;
    }
  }
  return best;
}

function currentConsecutiveSegment(days: number[]) {
  if (!days.length) return "";
  let start = days[0];
  let end = days[0];
  let bestStart = start;
  let bestEnd = end;

  for (let index = 1; index < days.length; index += 1) {
    if (days[index] === end + 1) {
      end = days[index];
    } else {
      if (end - start > bestEnd - bestStart) {
        bestStart = start;
        bestEnd = end;
      }
      start = days[index];
      end = days[index];
    }
  }

  if (end - start > bestEnd - bestStart) {
    bestStart = start;
    bestEnd = end;
  }

  return bestStart === bestEnd ? `当前最高连续段：Day ${bestStart}` : `当前最高连续段：Day ${bestStart}-${bestEnd}`;
}

function rangeDone(completed: Set<number>, start: number, end: number) {
  for (let day = start; day <= end; day += 1) {
    if (!completed.has(day)) return false;
  }
  return true;
}

function achievementIcon(icon: Achievement["icon"]) {
  if (icon === "flame") return <Flame className="h-4 w-4" />;
  if (icon === "medal") return <Medal className="h-4 w-4" />;
  if (icon === "award") return <Award className="h-4 w-4" />;
  if (icon === "target") return <Target className="h-4 w-4" />;
  return <Sparkles className="h-4 w-4" />;
}

function buildAchievementReport(completed: number[], achievements: Achievement[], nextDay: DailyPlanItem | undefined, streak: number) {
  const unlocked = achievements.filter((item) => item.unlocked);
  return [
    "# Codex Mastery 学习成就报告",
    "",
    `完成天数：${completed.length}/30`,
    `最长连续 Day：${streak}`,
    `已解锁成就：${unlocked.length}/${achievements.length}`,
    "",
    "## 已解锁",
    ...(unlocked.length ? unlocked.map((item) => `- ${item.title}：${item.description}`) : ["- 暂无"]),
    "",
    "## 下一步",
    nextDay ? `Day ${nextDay.day} · ${nextDay.title}：${nextDay.deliverable}` : "进入项目实战中心，完成一个可展示项目。"
  ].join("\n");
}

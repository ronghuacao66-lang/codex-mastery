"use client";

import { ArrowRight, ClipboardList, FilePenLine, RefreshCw, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import type { DailyPlanItem } from "@/types/content";

const PROGRESS_KEY = "codex-mastery:completed-days";
const PROGRESS_EVENT = "codex-mastery:progress-updated";
const REVIEW_DRAFTS_KEY = "codex-mastery:review-drafts";
const DAILY_REVIEW_KIT_ID = "review-daily-codex-training";

type ReviewDrafts = Record<string, Record<string, string>>;

export function TrainingReviewLauncher({ items }: { items: DailyPlanItem[] }) {
  const [completed, setCompleted] = useState<number[]>([]);
  const [synced, setSynced] = useState(false);

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
  const lastCompleted = completed.length ? items.find((item) => item.day === completed[completed.length - 1]) : undefined;
  const nextDay = items.find((item) => !completedSet.has(item.day));
  const reviewDraft = useMemo(() => buildTrainingReviewDraft(lastCompleted, nextDay, completed.length, items.length), [lastCompleted, nextDay, completed.length, items.length]);
  const reviewPrompt = useMemo(() => buildTrainingReviewPrompt(reviewDraft), [reviewDraft]);

  function syncToReviewCenter() {
    const current = readReviewDrafts();
    const nextDrafts: ReviewDrafts = {
      ...current,
      [DAILY_REVIEW_KIT_ID]: reviewDraft
    };
    window.localStorage.setItem(REVIEW_DRAFTS_KEY, JSON.stringify(nextDrafts));
    setSynced(true);
    window.setTimeout(() => setSynced(false), 1400);
  }

  return (
    <section className="rounded-xl border border-line bg-panel p-5 shadow-soft dark:shadow-darksoft md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-muted">
            <FilePenLine className="h-3.5 w-3.5 text-accent" />
            训练复盘启动器
          </div>
          <h2 className="mt-3 text-xl font-semibold text-ink">把今天的训练变成复盘草稿</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
            根据当前 30 天进度生成“每日 Codex 训练复盘”的输入摘要。同步后进入复盘中心继续补充卡点和明日行动。
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <CopyButton value={reviewPrompt} label="复制复盘 Prompt" className="h-10" />
          <button
            type="button"
            onClick={syncToReviewCenter}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-line bg-panel px-3 text-sm font-medium text-ink transition hover:-translate-y-0.5 hover:border-accent/50 hover:text-accent"
          >
            <RefreshCw className="h-4 w-4" />
            {synced ? "已同步" : "同步到复盘中心"}
          </button>
          <Link
            href="/reviews"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-ink px-3 text-sm font-semibold text-panel transition hover:opacity-90"
          >
            去复盘
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-md border border-line bg-surface p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-ink">
            <Sparkles className="h-4 w-4 text-accent" />
            当前训练上下文
          </p>
          <div className="mt-3 space-y-3 text-sm leading-6 text-muted">
            <p>
              <span className="font-semibold text-ink">已完成：</span>
              {completed.length}/{items.length} 天
            </p>
            <p>
              <span className="font-semibold text-ink">最近完成：</span>
              {lastCompleted ? `Day ${lastCompleted.day} · ${lastCompleted.title}` : "暂无完成记录"}
            </p>
            <p>
              <span className="font-semibold text-ink">下一步：</span>
              {nextDay ? `Day ${nextDay.day} · ${nextDay.title}` : "进入项目实战中心完成毕业项目"}
            </p>
          </div>
        </div>

        <div className="rounded-md border border-line bg-surface p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-ink">
            <ClipboardList className="h-4 w-4 text-accent" />
            将写入的复盘输入
          </p>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {Object.entries(reviewDraft).map(([key, value]) => (
              <div key={key} className="rounded-md border border-line bg-panel p-3">
                <p className="text-xs font-semibold text-muted">{fieldLabel(key)}</p>
                <p className="mt-2 text-sm leading-6 text-ink">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
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

function readReviewDrafts(): ReviewDrafts {
  const stored = window.localStorage.getItem(REVIEW_DRAFTS_KEY);
  if (!stored) return {};
  try {
    const parsed = JSON.parse(stored) as unknown;
    return typeof parsed === "object" && parsed !== null && !Array.isArray(parsed) ? (parsed as ReviewDrafts) : {};
  } catch {
    return {};
  }
}

function buildTrainingReviewDraft(lastCompleted: DailyPlanItem | undefined, nextDay: DailyPlanItem | undefined, doneCount: number, total: number) {
  return {
    today_goal: lastCompleted ? `复盘 Day ${lastCompleted.day}「${lastCompleted.title}」：${lastCompleted.learningGoal}` : "从 Day 1 开始训练，并记录第一份 Codex 学习成果。",
    artifact: lastCompleted ? lastCompleted.deliverable : `当前完成进度 ${doneCount}/${total} 天，尚未记录具体成果物。`,
    stuck_point: "请补充今天最卡的一步：任务描述、上下文提供、代码验证、交互检查或复盘表达。",
    next_action: nextDay ? `继续完成 Day ${nextDay.day}「${nextDay.title}」：${nextDay.deliverable}` : "进入项目实战中心，选择一个项目完成端到端交付复盘。"
  };
}

function buildTrainingReviewPrompt(draft: Record<string, string>) {
  return [
    "你是一名 Codex 学习教练，请基于以下训练记录生成一份每日 Codex 训练复盘。",
    "",
    `今日目标：${draft.today_goal}`,
    `完成成果物：${draft.artifact}`,
    `卡点：${draft.stuck_point}`,
    `明日行动：${draft.next_action}`,
    "",
    "要求：",
    "1. 判断我是否真正掌握了今天的能力点。",
    "2. 提炼一个可复用的 Codex 使用经验。",
    "3. 指出一个明天必须验证的问题。",
    "4. 输出中文，结构包括今日结论、有效做法、问题与原因、可复用 Prompt、明日行动。"
  ].join("\n");
}

function fieldLabel(key: string) {
  if (key === "today_goal") return "今日目标";
  if (key === "artifact") return "完成成果物";
  if (key === "stuck_point") return "卡点";
  if (key === "next_action") return "明日行动";
  return key;
}

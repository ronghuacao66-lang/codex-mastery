"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Circle, Copy, Play, PlayCircle, Sparkles, Trophy, WandSparkles } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { StatCard } from "@/components/StatCard";
import { Tag } from "@/components/Tag";
import { cn, toCopyBlock } from "@/lib/utils";
import type { DailyPlanItem, ProjectItem, PromptItem, VideoItem, WorkflowItem } from "@/types/content";

type DashboardClientProps = {
  dailyPlan: DailyPlanItem[];
  prompts: PromptItem[];
  projects: ProjectItem[];
  videos: VideoItem[];
  workflows: WorkflowItem[];
};

const PROGRESS_KEY = "codex-mastery:completed-days";

export function DashboardClient({ dailyPlan, prompts, projects, videos, workflows }: DashboardClientProps) {
  const [completed, setCompleted] = useState<number[]>([]);

  useEffect(() => {
    const stored = window.localStorage.getItem(PROGRESS_KEY);
    if (stored) {
      try {
        setCompleted(JSON.parse(stored) as number[]);
      } catch {
        setCompleted([]);
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(completed));
  }, [completed]);

  const today = dailyPlan.find((item) => !completed.includes(item.day)) ?? dailyPlan[dailyPlan.length - 1];
  const bestPrompt = prompts.find((item) => item.id === "codex-web-content-site") ?? prompts[0];
  const weeklyProject = projects.find((item) => item.id === "project-ai-knowledge-base") ?? projects[0];
  const challenge = dailyPlan.find((item) => item.day === 24) ?? dailyPlan[0];
  const codexPromptCount = prompts.filter((item) => item.kind === "codex").length;
  const aiPromptCount = prompts.filter((item) => item.kind === "ai").length;
  const progress = Math.round((completed.length / dailyPlan.length) * 100);

  const tasks = useMemo(
    () => [
      { id: "theory", label: "读完今日理论", value: today.theory },
      { id: "practice", label: "完成实操任务", value: today.practiceTask },
      { id: "deliverable", label: "交付成果物", value: today.deliverable }
    ],
    [today]
  );

  function toggleDay(day: number) {
    setCompleted((current) => (current.includes(day) ? current.filter((item) => item !== day) : [...current, day].sort((a, b) => a - b)));
  }

  function undoLatestDay() {
    setCompleted((current) => current.slice(0, -1));
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="overflow-hidden rounded-xl border border-line bg-panel shadow-soft dark:shadow-darksoft">
        <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="p-6 md:p-9">
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-muted">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              Learn Codex By Building
            </div>
            <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-normal text-ink md:text-6xl">
              Codex Mastery
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted md:text-lg">
              30 天中文实战平台，从任务委托、Prompt、项目拆解到工具开发和 Agent 构建，把 Codex 用进真实工作流。
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/bootcamp"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-ink px-4 text-sm font-semibold text-panel transition hover:-translate-y-0.5 hover:opacity-90"
              >
                <Play className="h-4 w-4" />
                开始今日训练
              </Link>
              <Link
                href="/task-builder"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-line bg-surface px-4 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:border-accent/50"
              >
                生成 Codex 任务
                <WandSparkles className="h-4 w-4" />
              </Link>
              <Link
                href="/videos"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-line bg-surface px-4 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:border-accent/50"
              >
                看精选视频
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="border-t border-line bg-surface p-6 lg:border-l lg:border-t-0 md:p-9">
            <p className="text-sm font-semibold text-ink">学习进度</p>
            <div className="mt-6 flex items-end gap-4">
              <span className="text-6xl font-semibold text-ink">{progress}%</span>
              <span className="pb-2 text-sm text-muted">{completed.length}/{dailyPlan.length} 天完成</span>
            </div>
            <div className="mt-5 h-2 rounded-full bg-panel">
              <div className="h-2 rounded-full bg-gradient-to-r from-accent to-violet transition-all" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => toggleDay(today.day)}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-line bg-panel px-3 text-sm font-medium text-ink"
              >
                <Circle className="h-4 w-4 text-muted" />
                完成 Day {today.day}
              </button>
              {completed.length ? (
                <button
                  type="button"
                  onClick={undoLatestDay}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-line bg-panel px-3 text-sm font-medium text-muted transition hover:text-ink"
                >
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  撤销最近完成
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Codex Prompt" value={String(codexPromptCount)} hint="覆盖网站、工具、Bug、Agent、办公" />
        <StatCard label="AI Prompt" value={String(aiPromptCount)} hint="覆盖写作、售前、复盘、决策" />
        <StatCard label="实战项目" value="8" hint="从知识库到 Agent 助手" />
        <StatCard label="训练营" value="30天" hint="每天都有成果物" />
        <StatCard label="精选视频" value={String(videos.length)} hint="B站、抖音精选、YouTube、OpenAI Academy" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Panel title="今日学习任务" actionHref="/bootcamp">
          <div className="mb-4">
            <p className="text-sm font-semibold text-ink">Day {today.day} · {today.title}</p>
            <p className="mt-2 text-sm leading-6 text-muted">{today.learningGoal}</p>
          </div>
          <div className="space-y-2">
            {tasks.map((task) => (
              <div key={task.id} className="rounded-md border border-line bg-surface p-3">
                <p className="text-sm font-medium text-ink">{task.label}</p>
                <p className="mt-1 text-sm leading-6 text-muted">{task.value}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="今日最佳 Prompt" actionHref="/prompts">
          <div className="rounded-md border border-line bg-surface p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-ink">{bestPrompt.title}</p>
                <p className="mt-2 text-sm leading-6 text-muted">{bestPrompt.scenario}</p>
              </div>
              <CopyButton value={toCopyBlock(bestPrompt.title, bestPrompt.prompt)} label="复制" />
            </div>
            <p className="mt-4 text-sm leading-6 text-ink">{bestPrompt.prompt}</p>
          </div>
        </Panel>
      </div>

      <Panel title="精选教学视频" actionHref="/videos">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {videos.slice(0, 4).map((video) => (
            <a
              key={video.id}
              href={video.url}
              target="_blank"
              rel="noreferrer"
              className="group rounded-md border border-line bg-surface p-4 transition hover:-translate-y-0.5 hover:border-accent/40"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-panel text-accent">
                  <PlayCircle className="h-4 w-4" />
                </span>
                <span className="text-xs font-medium text-muted">{video.platform}</span>
              </div>
              <p className="mt-4 line-clamp-2 text-sm font-semibold leading-6 text-ink group-hover:text-accent">{video.title}</p>
              <p className="mt-2 text-xs text-muted">{video.stage} / {video.topic}</p>
            </a>
          ))}
        </div>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <Panel title="本周实战项目" actionHref="/projects">
          <div className="rounded-md border border-line bg-surface p-4">
            <p className="text-sm font-semibold text-ink">{weeklyProject.title}</p>
            <p className="mt-2 text-sm leading-6 text-muted">{weeklyProject.businessValue}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {weeklyProject.deliverables.map((item) => (
                <Tag key={item}>{item}</Tag>
              ))}
            </div>
          </div>
        </Panel>

        <Panel title="热门工作流" actionHref="/workflows">
          <div className="grid gap-3 md:grid-cols-2">
            {workflows.slice(0, 4).map((workflow) => (
              <div key={workflow.id} className="rounded-md border border-line bg-surface p-4">
                <p className="text-sm font-semibold text-ink">{workflow.title}</p>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted">{workflow.outcome}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="推荐挑战任务" actionHref="/bootcamp">
        <div className="grid gap-4 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="rounded-md border border-line bg-gradient-to-br from-accent/12 to-violet/12 p-5">
            <Trophy className="h-8 w-8 text-accent" />
            <p className="mt-4 text-lg font-semibold text-ink">Day {challenge.day} · {challenge.title}</p>
            <p className="mt-2 text-sm leading-6 text-muted">{challenge.learningGoal}</p>
          </div>
          <div className="rounded-md border border-line bg-surface p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Copy className="h-4 w-4 text-accent" />
              挑战 Prompt
            </div>
            <p className="mt-3 text-sm leading-6 text-muted">{challenge.prompt}</p>
            <div className="mt-4">
              <CopyButton value={toCopyBlock(challenge.title, challenge.prompt)} />
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}

function Panel({ title, children, actionHref }: { title: string; children: ReactNode; actionHref?: string }) {
  return (
    <section className="rounded-lg border border-line bg-panel p-5 shadow-soft dark:shadow-darksoft">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-ink">{title}</h2>
        {actionHref ? (
          <Link href={actionHref} className={cn("inline-flex items-center gap-1 text-sm font-medium text-accent")}>
            查看全部
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  );
}

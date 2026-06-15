"use client";

import { ArrowRight, BookOpenCheck, ClipboardList, FilePenLine, PlayCircle, Route, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import type { DailyPlanItem, ProjectItem, VideoItem } from "@/types/content";

const PROGRESS_KEY = "codex-mastery:completed-days";
const PROGRESS_EVENT = "codex-mastery:progress-updated";
const WATCHED_KEY = "codex-mastery:watched-videos";
const REVIEW_HISTORY_KEY = "codex-mastery:review-history";
const PROJECT_CHECKLIST_KEY = "codex-mastery:project-checklist";

type ProjectChecklistState = Record<string, string[]>;
type LearningSnapshot = {
  completedDays: number[];
  watchedVideos: string[];
  reviewCount: number;
  projectChecklist: ProjectChecklistState;
};
type Recommendation = {
  title: string;
  description: string;
  href: string;
  action: string;
  icon: "learn" | "video" | "project" | "review";
};

export function LearningPathAdvisor({
  dailyPlan,
  projects,
  videos
}: {
  dailyPlan: DailyPlanItem[];
  projects: ProjectItem[];
  videos: VideoItem[];
}) {
  const [snapshot, setSnapshot] = useState<LearningSnapshot>(() => emptySnapshot());

  useEffect(() => {
    function readSnapshot() {
      setSnapshot({
        completedDays: readNumberArray(PROGRESS_KEY).filter((day) => dailyPlan.some((item) => item.day === day)).sort((a, b) => a - b),
        watchedVideos: readStringArray(WATCHED_KEY).filter((id) => videos.some((item) => item.id === id)),
        reviewCount: readArrayLength(REVIEW_HISTORY_KEY),
        projectChecklist: readProjectChecklist()
      });
    }

    readSnapshot();
    window.addEventListener("storage", readSnapshot);
    window.addEventListener(PROGRESS_EVENT, readSnapshot);
    window.addEventListener("focus", readSnapshot);
    document.addEventListener("visibilitychange", readSnapshot);
    return () => {
      window.removeEventListener("storage", readSnapshot);
      window.removeEventListener(PROGRESS_EVENT, readSnapshot);
      window.removeEventListener("focus", readSnapshot);
      document.removeEventListener("visibilitychange", readSnapshot);
    };
  }, [dailyPlan, videos]);

  const analysis = useMemo(() => buildLearningAnalysis(snapshot, dailyPlan, projects, videos), [snapshot, dailyPlan, projects, videos]);

  return (
    <section className="overflow-hidden rounded-xl border border-line bg-panel shadow-soft dark:shadow-darksoft">
      <div className="grid gap-0 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="border-b border-line bg-surface p-5 md:p-6 xl:border-b-0 xl:border-r">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-3 py-1 text-xs font-semibold text-muted">
            <Route className="h-3.5 w-3.5 text-accent" />
            学习路径推荐
          </div>
          <h2 className="mt-3 text-xl font-semibold text-ink">下一步该做什么</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            根据训练进度、视频观看、复盘历史和项目交付检查，生成下一步行动顺序，让学习从“看内容”转成“交付成果”。
          </p>

          <div className="mt-5 rounded-lg border border-line bg-panel p-4">
            <p className="text-xs font-semibold text-muted">当前阶段</p>
            <p className="mt-2 text-2xl font-semibold text-ink">{analysis.stage}</p>
            <p className="mt-2 text-sm leading-6 text-muted">{analysis.stageReason}</p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Metric label="训练完成" value={`${analysis.trainingProgress}%`} detail={`${snapshot.completedDays.length}/${dailyPlan.length} 天`} />
            <Metric label="视频完成" value={`${analysis.videoProgress}%`} detail={`${snapshot.watchedVideos.length}/${videos.length} 个`} />
            <Metric label="项目检查" value={`${analysis.projectProgress}%`} detail={`${analysis.completedProjectChecks}/${analysis.totalProjectChecks} 项`} />
            <Metric label="复盘沉淀" value={`${snapshot.reviewCount} 篇`} detail={snapshot.reviewCount ? "已有历史复盘" : "建议完成首篇复盘"} />
          </div>

          <CopyButton value={buildAdvisorPrompt(analysis, snapshot)} label="复制下一步 Prompt" className="mt-4 h-10 w-full justify-center" />
        </div>

        <div className="p-5 md:p-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent" />
            <p className="text-sm font-semibold text-ink">推荐行动队列</p>
          </div>
          <div className="mt-4 grid gap-3">
            {analysis.recommendations.map((item, index) => (
              <article key={item.title} className="rounded-lg border border-line bg-surface p-4">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-line bg-panel text-accent">
                    {recommendationIcon(item.icon)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-muted">优先级 {index + 1}</p>
                    <h3 className="mt-1 text-base font-semibold text-ink">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
                    <Link
                      href={item.href}
                      className="mt-3 inline-flex h-9 items-center gap-2 rounded-md border border-line bg-panel px-3 text-sm font-medium text-ink transition hover:-translate-y-0.5 hover:border-accent/50 hover:text-accent"
                    >
                      {item.action}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-md border border-line bg-panel p-3">
      <p className="text-xs font-semibold text-muted">{label}</p>
      <p className="mt-2 text-xl font-semibold text-ink">{value}</p>
      <p className="mt-1 text-xs leading-5 text-muted">{detail}</p>
    </div>
  );
}

function buildLearningAnalysis(snapshot: LearningSnapshot, dailyPlan: DailyPlanItem[], projects: ProjectItem[], videos: VideoItem[]) {
  const completedSet = new Set(snapshot.completedDays);
  const nextDay = dailyPlan.find((item) => !completedSet.has(item.day));
  const nextVideo = videos.find((item) => !snapshot.watchedVideos.includes(item.id));
  const projectProgress = buildProjectProgress(projects, snapshot.projectChecklist);
  const nextProject = projectProgress.find((item) => item.progress > 0 && item.progress < 100) ?? projectProgress.find((item) => item.progress === 0);
  const totalProjectChecks = projectProgress.reduce((sum, item) => sum + item.total, 0);
  const completedProjectChecks = projectProgress.reduce((sum, item) => sum + item.completed, 0);
  const trainingProgress = dailyPlan.length ? Math.round((snapshot.completedDays.length / dailyPlan.length) * 100) : 0;
  const videoProgress = videos.length ? Math.round((snapshot.watchedVideos.length / videos.length) * 100) : 0;
  const projectOverallProgress = totalProjectChecks ? Math.round((completedProjectChecks / totalProjectChecks) * 100) : 0;

  const recommendations: Recommendation[] = [];
  if (nextDay) {
    recommendations.push({
      title: `完成 Day ${nextDay.day} · ${nextDay.title}`,
      description: `先拿到训练成果物：${nextDay.deliverable}`,
      href: "/progress",
      action: "继续训练",
      icon: "learn"
    });
  }
  if (nextProject) {
    recommendations.push({
      title: `推进项目：${nextProject.title}`,
      description: nextProject.completed
        ? `已经完成 ${nextProject.completed}/${nextProject.total} 项检查，下一步补齐剩余验收证据。`
        : "选择一个实战项目作为作品集主线，用 Codex 完成从需求到验证的闭环。",
      href: `/projects/${nextProject.id}`,
      action: "进入项目",
      icon: "project"
    });
  }
  if (snapshot.reviewCount === 0 || snapshot.completedDays.length >= snapshot.reviewCount * 3) {
    recommendations.push({
      title: "沉淀一篇训练复盘",
      description: "把最近一次训练的目标、成果物、卡点和下一步写入复盘中心，形成可复用经验。",
      href: "/reviews",
      action: "去复盘",
      icon: "review"
    });
  }
  if (nextVideo) {
    recommendations.push({
      title: `补充视频：${nextVideo.title}`,
      description: `当前适合补充「${nextVideo.topic}」主题，观看后复制笔记模板沉淀学习产出。`,
      href: "/videos",
      action: "看视频",
      icon: "video"
    });
  }

  return {
    stage: stageName(snapshot.completedDays.length, projectOverallProgress),
    stageReason: stageReason(snapshot.completedDays.length, projectOverallProgress),
    trainingProgress,
    videoProgress,
    projectProgress: projectOverallProgress,
    totalProjectChecks,
    completedProjectChecks,
    recommendations: recommendations.slice(0, 4)
  };
}

function buildProjectProgress(projects: ProjectItem[], checked: ProjectChecklistState) {
  return projects
    .map((project) => {
      const checkedIds = checked[project.id] ?? [];
      const completed = project.deliveryChecklist.filter((item) => checkedIds.includes(item.id)).length;
      const total = project.deliveryChecklist.length;
      return {
        id: project.id,
        title: project.title,
        completed,
        total,
        progress: total ? Math.round((completed / total) * 100) : 0
      };
    })
    .sort((a, b) => b.progress - a.progress || a.title.localeCompare(b.title, "zh-Hans-CN"));
}

function stageName(doneDays: number, projectProgress: number) {
  if (doneDays >= 30 && projectProgress >= 70) return "作品集冲刺期";
  if (doneDays >= 21) return "项目实战期";
  if (doneDays >= 8) return "能力成长期";
  if (doneDays >= 1) return "基础建立期";
  return "启动准备期";
}

function stageReason(doneDays: number, projectProgress: number) {
  if (doneDays >= 30 && projectProgress >= 70) return "训练营已完成，重点应转向项目验收、复盘报告和作品集展示。";
  if (doneDays >= 21) return "你已经进入业务实战阶段，应优先把训练成果落到项目交付和复盘沉淀。";
  if (doneDays >= 8) return "已经完成基础训练，下一步要加强 Debug、组件化、验证和项目拆解。";
  if (doneDays >= 1) return "已经启动训练，当前最重要的是连续完成第一周并形成复盘节奏。";
  return "还没有完成 Day 记录，先完成 Day 1，建立 Codex 学习控制台的第一份成果物。";
}

function recommendationIcon(icon: Recommendation["icon"]) {
  if (icon === "video") return <PlayCircle className="h-4 w-4" />;
  if (icon === "project") return <ClipboardList className="h-4 w-4" />;
  if (icon === "review") return <FilePenLine className="h-4 w-4" />;
  return <BookOpenCheck className="h-4 w-4" />;
}

function buildAdvisorPrompt(
  analysis: ReturnType<typeof buildLearningAnalysis>,
  snapshot: LearningSnapshot
) {
  return [
    "你是一名 Codex 学习教练和项目执行负责人，请基于我的 Codex Mastery 当前状态制定下一步行动计划。",
    "",
    `当前阶段：${analysis.stage}`,
    `训练进度：${snapshot.completedDays.length}/30 天`,
    `视频进度：${snapshot.watchedVideos.length} 个已看`,
    `项目检查：${analysis.completedProjectChecks}/${analysis.totalProjectChecks} 项`,
    `历史复盘：${snapshot.reviewCount} 篇`,
    "",
    "推荐行动：",
    ...analysis.recommendations.map((item, index) => `${index + 1}. ${item.title} - ${item.description}`),
    "",
    "请输出：",
    "1. 今天 90 分钟行动计划。",
    "2. 需要交付的最小成果物。",
    "3. 可以直接交给 Codex 的任务 Prompt。",
    "4. 完成后的验证清单。",
    "5. 明天继续推进的建议。"
  ].join("\n");
}

function emptySnapshot(): LearningSnapshot {
  return {
    completedDays: [],
    watchedVideos: [],
    reviewCount: 0,
    projectChecklist: {}
  };
}

function readNumberArray(key: string) {
  const stored = window.localStorage.getItem(key);
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored) as unknown;
    return Array.isArray(parsed) ? parsed.filter((item): item is number => typeof item === "number") : [];
  } catch {
    return [];
  }
}

function readStringArray(key: string) {
  const stored = window.localStorage.getItem(key);
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored) as unknown;
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function readArrayLength(key: string) {
  const stored = window.localStorage.getItem(key);
  if (!stored) return 0;
  try {
    const parsed = JSON.parse(stored) as unknown;
    return Array.isArray(parsed) ? parsed.length : 0;
  } catch {
    return 0;
  }
}

function readProjectChecklist(): ProjectChecklistState {
  const stored = window.localStorage.getItem(PROJECT_CHECKLIST_KEY);
  if (!stored) return {};
  try {
    const parsed = JSON.parse(stored) as unknown;
    return typeof parsed === "object" && parsed !== null && !Array.isArray(parsed) ? (parsed as ProjectChecklistState) : {};
  } catch {
    return {};
  }
}

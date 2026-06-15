"use client";

import { Archive, BookOpenCheck, ClipboardCheck, FileText, PlayCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { CopyButton } from "@/components/CopyButton";
import type { DailyPlanItem, ProjectItem, VideoItem } from "@/types/content";

const PROGRESS_KEY = "codex-mastery:completed-days";
const PROGRESS_EVENT = "codex-mastery:progress-updated";
const WATCHED_KEY = "codex-mastery:watched-videos";
const REVIEW_HISTORY_KEY = "codex-mastery:review-history";
const PROJECT_CHECKLIST_KEY = "codex-mastery:project-checklist";
const PROJECT_RECORD_KEY = "codex-mastery:project-execution-records";

type ProjectChecklistState = Record<string, string[]>;
type ProjectExecutionRecord = {
  stage?: string;
  completed?: string;
  evidence?: string;
  blockers?: string;
  nextAction?: string;
  notes?: string;
};
type ProjectExecutionRecords = Record<string, ProjectExecutionRecord>;
type ReviewHistoryItem = {
  kitTitle?: string;
  createdAt?: string;
  summary?: string;
  report?: string;
};
type EvidenceSnapshot = {
  completedDays: number[];
  watchedVideos: string[];
  reviewHistory: ReviewHistoryItem[];
  projectChecklist: ProjectChecklistState;
  projectRecords: ProjectExecutionRecords;
};
type EvidenceAnalysis = ReturnType<typeof buildEvidenceAnalysis>;

export function LearningEvidenceVault({
  dailyPlan,
  projects,
  videos
}: {
  dailyPlan: DailyPlanItem[];
  projects: ProjectItem[];
  videos: VideoItem[];
}) {
  const [snapshot, setSnapshot] = useState<EvidenceSnapshot>(() => emptySnapshot());

  useEffect(() => {
    function readSnapshot() {
      setSnapshot({
        completedDays: readNumberArray(PROGRESS_KEY).filter((day) => dailyPlan.some((item) => item.day === day)).sort((a, b) => a - b),
        watchedVideos: readStringArray(WATCHED_KEY).filter((id) => videos.some((item) => item.id === id)),
        reviewHistory: readReviewHistory(),
        projectChecklist: readObject<ProjectChecklistState>(PROJECT_CHECKLIST_KEY, {}),
        projectRecords: readObject<ProjectExecutionRecords>(PROJECT_RECORD_KEY, {})
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

  const analysis = useMemo(() => buildEvidenceAnalysis(snapshot, dailyPlan, projects, videos), [snapshot, dailyPlan, projects, videos]);
  const report = useMemo(() => buildEvidenceReport(analysis), [analysis]);

  return (
    <section className="overflow-hidden rounded-xl border border-line bg-panel shadow-soft dark:shadow-darksoft">
      <div className="grid gap-0 xl:grid-cols-[0.88fr_1.12fr]">
        <div className="border-b border-line bg-surface p-5 md:p-6 xl:border-b-0 xl:border-r">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-3 py-1 text-xs font-semibold text-muted">
            <Archive className="h-3.5 w-3.5 text-accent" />
            学习证据库
          </div>
          <h2 className="mt-3 text-xl font-semibold text-ink">把学习过程变成可交付证据</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            自动汇总训练成果、项目验收、复盘历史和视频笔记进度，形成一份可复制给 Codex 或用于阶段复盘的证据报告。
          </p>

          <div className="mt-5 rounded-lg border border-line bg-panel p-4">
            <p className="text-xs font-semibold text-muted">证据成熟度</p>
            <p className="mt-2 text-3xl font-semibold text-ink">{analysis.score}%</p>
            <p className="mt-2 text-sm leading-6 text-muted">{analysis.level}</p>
            <div className="mt-4 h-2 rounded-full bg-surface">
              <div className="h-2 rounded-full bg-gradient-to-r from-accent to-violet transition-all" style={{ width: `${analysis.score}%` }} />
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <EvidenceMetric label="训练成果" value={`${analysis.training.completed}/${analysis.training.total}`} detail={analysis.training.detail} />
            <EvidenceMetric label="项目验收" value={`${analysis.projects.completedChecks}/${analysis.projects.totalChecks}`} detail={analysis.projects.detail} />
            <EvidenceMetric label="复盘历史" value={`${analysis.reviews.count} 篇`} detail={analysis.reviews.detail} />
            <EvidenceMetric label="视频学习" value={`${analysis.videos.watched}/${analysis.videos.total}`} detail={analysis.videos.detail} />
          </div>

          <CopyButton value={report} label="复制证据报告" className="mt-4 h-10 w-full justify-center" />
        </div>

        <div className="p-5 md:p-6">
          <div className="grid gap-3 md:grid-cols-2">
            <EvidenceBlock
              icon={<BookOpenCheck className="h-4 w-4" />}
              title="训练成果"
              items={analysis.training.items}
              href="/progress"
              action="查看训练"
            />
            <EvidenceBlock
              icon={<ClipboardCheck className="h-4 w-4" />}
              title="项目验收"
              items={analysis.projects.items}
              href="/projects"
              action="查看项目"
            />
            <EvidenceBlock
              icon={<FileText className="h-4 w-4" />}
              title="复盘历史"
              items={analysis.reviews.items}
              href="/reviews"
              action="去复盘"
            />
            <EvidenceBlock
              icon={<PlayCircle className="h-4 w-4" />}
              title="视频学习"
              items={analysis.videos.items}
              href="/videos"
              action="看视频"
            />
          </div>

          <div className="mt-5 rounded-lg border border-line bg-surface p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-ink">
              <ShieldCheck className="h-4 w-4 text-accent" />
              待补证据
            </p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
              {analysis.gaps.map((gap) => (
                <li key={gap}>- {gap}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function EvidenceMetric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-md border border-line bg-panel p-3">
      <p className="text-xs font-semibold text-muted">{label}</p>
      <p className="mt-2 text-xl font-semibold text-ink">{value}</p>
      <p className="mt-1 text-xs leading-5 text-muted">{detail}</p>
    </div>
  );
}

function EvidenceBlock({
  icon,
  title,
  items,
  href,
  action
}: {
  icon: ReactNode;
  title: string;
  items: string[];
  href: string;
  action: string;
}) {
  return (
    <article className="rounded-lg border border-line bg-surface p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-ink">
        <span className="text-accent">{icon}</span>
        {title}
      </div>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
        {items.map((item) => (
          <li key={item}>- {item}</li>
        ))}
      </ul>
      <Link
        href={href}
        className="mt-4 inline-flex h-9 items-center rounded-md border border-line bg-panel px-3 text-sm font-medium text-ink transition hover:-translate-y-0.5 hover:border-accent/50 hover:text-accent"
      >
        {action}
      </Link>
    </article>
  );
}

function buildEvidenceAnalysis(snapshot: EvidenceSnapshot, dailyPlan: DailyPlanItem[], projects: ProjectItem[], videos: VideoItem[]) {
  const completedSet = new Set(snapshot.completedDays);
  const completedDays = dailyPlan.filter((item) => completedSet.has(item.day));
  const projectEvidence = projects.map((project) => {
    const checkedIds = snapshot.projectChecklist[project.id] ?? [];
    const completedChecks = project.deliveryChecklist.filter((check) => checkedIds.includes(check.id));
    const record = snapshot.projectRecords[project.id];
    return {
      id: project.id,
      title: project.title,
      completedChecks,
      totalChecks: project.deliveryChecklist.length,
      record,
      hasRecordEvidence: Boolean(record?.evidence?.trim() || record?.completed?.trim())
    };
  });
  const totalProjectChecks = projectEvidence.reduce((sum, item) => sum + item.totalChecks, 0);
  const completedProjectChecks = projectEvidence.reduce((sum, item) => sum + item.completedChecks.length, 0);
  const projectsWithEvidence = projectEvidence.filter((item) => item.completedChecks.length || item.hasRecordEvidence);
  const watchedVideoItems = videos.filter((item) => snapshot.watchedVideos.includes(item.id));

  const trainingScore = dailyPlan.length ? (completedDays.length / dailyPlan.length) * 30 : 0;
  const projectScore = totalProjectChecks ? (completedProjectChecks / totalProjectChecks) * 35 : 0;
  const reviewScore = Math.min(snapshot.reviewHistory.length, 6) * 4;
  const videoScore = videos.length ? (watchedVideoItems.length / videos.length) * 11 : 0;
  const score = Math.min(100, Math.round(trainingScore + projectScore + reviewScore + videoScore));

  return {
    score,
    level: evidenceLevel(score),
    training: {
      completed: completedDays.length,
      total: dailyPlan.length,
      detail: completedDays.length ? `最近：Day ${completedDays[completedDays.length - 1].day}` : "尚未形成训练证据",
      items: completedDays.length
        ? completedDays.slice(-3).map((item) => `Day ${item.day} · ${item.title}：${item.deliverable}`)
        : ["完成 Day 1 后会自动沉淀第一条训练成果。"]
    },
    projects: {
      completedChecks: completedProjectChecks,
      totalChecks: totalProjectChecks,
      detail: projectsWithEvidence.length ? `${projectsWithEvidence.length} 个项目已有证据` : "尚未形成项目验收证据",
      items: projectsWithEvidence.length
        ? projectsWithEvidence.slice(0, 3).map((project) => {
            const text = project.record?.evidence?.trim() || project.completedChecks[0]?.evidence || "已有检查项完成记录";
            return `${project.title}：${text.slice(0, 90)}`;
          })
        : ["完成项目交付检查或填写项目执行记录后会出现在这里。"]
    },
    reviews: {
      count: snapshot.reviewHistory.length,
      detail: snapshot.reviewHistory.length ? "已有历史复盘" : "尚未保存历史复盘",
      items: snapshot.reviewHistory.length
        ? snapshot.reviewHistory.slice(0, 3).map((item) => `${item.kitTitle || "复盘"}：${(item.summary || item.report || "已保存复盘").slice(0, 90)}`)
        : ["在复盘中心保存历史后会自动沉淀复盘证据。"]
    },
    videos: {
      watched: watchedVideoItems.length,
      total: videos.length,
      detail: watchedVideoItems.length ? "已有观看记录" : "尚未形成视频学习记录",
      items: watchedVideoItems.length
        ? watchedVideoItems.slice(0, 3).map((item) => `${item.title}：${item.learningOutcomes[0]}`)
        : ["标记视频已看后会自动沉淀学习记录。"]
    },
    gaps: buildEvidenceGaps(completedDays.length, completedProjectChecks, snapshot.reviewHistory.length, watchedVideoItems.length)
  };
}

function buildEvidenceGaps(doneDays: number, projectChecks: number, reviewCount: number, watchedCount: number) {
  const gaps: string[] = [];
  if (doneDays < 7) gaps.push("先完成第一周训练，形成至少 7 个可复盘成果物。");
  if (projectChecks < 5) gaps.push("至少完成一个项目的 5 条交付检查项，补齐可验收证据。");
  if (reviewCount < 2) gaps.push("保存至少 2 篇历史复盘，证明你能从执行中提炼方法。");
  if (watchedCount < 3) gaps.push("完成至少 3 个视频学习记录，并复制笔记模板沉淀重点。");
  return gaps.length ? gaps : ["当前证据链完整，下一步可以导出报告并进入作品集整理。"];
}

function evidenceLevel(score: number) {
  if (score >= 85) return "证据链完整，可以进入作品集整理和对外展示。";
  if (score >= 65) return "核心证据已具备，建议补齐项目验收和复盘历史。";
  if (score >= 35) return "已有阶段性证据，但还不足以证明稳定交付能力。";
  return "证据链刚启动，优先完成训练、复盘和一个项目检查清单。";
}

function buildEvidenceReport(analysis: EvidenceAnalysis) {
  return [
    "# Codex Mastery 学习证据报告",
    "",
    `证据成熟度：${analysis.score}%`,
    `结论：${analysis.level}`,
    "",
    "## 训练成果",
    ...analysis.training.items.map((item) => `- ${item}`),
    "",
    "## 项目验收",
    ...analysis.projects.items.map((item) => `- ${item}`),
    "",
    "## 复盘历史",
    ...analysis.reviews.items.map((item) => `- ${item}`),
    "",
    "## 视频学习",
    ...analysis.videos.items.map((item) => `- ${item}`),
    "",
    "## 待补证据",
    ...analysis.gaps.map((gap) => `- ${gap}`)
  ].join("\n");
}

function emptySnapshot(): EvidenceSnapshot {
  return {
    completedDays: [],
    watchedVideos: [],
    reviewHistory: [],
    projectChecklist: {},
    projectRecords: {}
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

function readReviewHistory() {
  const stored = window.localStorage.getItem(REVIEW_HISTORY_KEY);
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored) as unknown;
    return Array.isArray(parsed) ? (parsed as ReviewHistoryItem[]) : [];
  } catch {
    return [];
  }
}

function readObject<T>(key: string, fallback: T) {
  const stored = window.localStorage.getItem(key);
  if (!stored) return fallback;
  try {
    const parsed = JSON.parse(stored) as unknown;
    return typeof parsed === "object" && parsed !== null && !Array.isArray(parsed) ? (parsed as T) : fallback;
  } catch {
    return fallback;
  }
}

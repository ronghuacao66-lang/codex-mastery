"use client";

import { CheckCircle2, Circle, ClipboardList, FileText, RotateCcw, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { Tag } from "@/components/Tag";
import { cn } from "@/lib/utils";
import type { ReviewKit } from "@/types/content";

const REVIEW_DRAFTS_KEY = "codex-mastery:review-drafts";

type Drafts = Record<string, Record<string, string>>;

export function ReviewCenterClient({ kits }: { kits: ReviewKit[] }) {
  const [activeId, setActiveId] = useState(kits[0]?.id ?? "");
  const [drafts, setDrafts] = useState<Drafts>({});

  const activeKit = kits.find((kit) => kit.id === activeId) ?? kits[0];
  const activeDraft = useMemo(() => drafts[activeKit.id] ?? {}, [activeKit.id, drafts]);

  useEffect(() => {
    const stored = window.localStorage.getItem(REVIEW_DRAFTS_KEY);
    if (!stored) return;
    try {
      setDrafts(JSON.parse(stored) as Drafts);
    } catch {
      setDrafts({});
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(REVIEW_DRAFTS_KEY, JSON.stringify(drafts));
  }, [drafts]);

  const completedFields = activeKit.inputFields.filter((field) => (activeDraft[field.key] ?? "").trim().length >= 8).length;
  const fieldProgress = Math.round((completedFields / activeKit.inputFields.length) * 100);
  const report = useMemo(() => buildReviewReport(activeKit, activeDraft), [activeKit, activeDraft]);
  const codexPrompt = useMemo(() => buildCodexPrompt(activeKit, activeDraft), [activeKit, activeDraft]);

  function updateField(key: string, value: string) {
    setDrafts((current) => ({
      ...current,
      [activeKit.id]: {
        ...(current[activeKit.id] ?? {}),
        [key]: value
      }
    }));
  }

  function resetActiveDraft() {
    setDrafts((current) => {
      const next = { ...current };
      delete next[activeKit.id];
      return next;
    });
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[0.88fr_1.12fr]">
      <section className="space-y-5">
        <div className="rounded-lg border border-line bg-panel p-5 shadow-soft dark:shadow-darksoft">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-ink">复盘场景</p>
              <p className="mt-1 text-sm leading-6 text-muted">选择最接近当前工作的复盘模板。</p>
            </div>
            <div className="rounded-md border border-line bg-surface px-3 py-2 text-right">
              <p className="text-lg font-semibold text-ink">{fieldProgress}%</p>
              <p className="text-xs text-muted">输入完整度</p>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {kits.map((kit) => {
              const active = kit.id === activeKit.id;
              return (
                <button
                  key={kit.id}
                  type="button"
                  onClick={() => setActiveId(kit.id)}
                  className={cn(
                    "w-full rounded-md border p-4 text-left transition",
                    active ? "border-accent/50 bg-accent/10" : "border-line bg-surface hover:border-accent/35"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-ink">{kit.title}</p>
                      <p className="mt-2 text-sm leading-6 text-muted">{kit.scenario}</p>
                    </div>
                    {active ? <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-accent" /> : <Circle className="mt-1 h-4 w-4 shrink-0 text-muted" />}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {kit.tags.slice(0, 3).map((tag) => (
                      <Tag key={tag} active={active}>
                        {tag}
                      </Tag>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg border border-line bg-panel p-5 shadow-soft dark:shadow-darksoft">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-ink">复盘输入</p>
              <p className="mt-1 text-sm text-muted">{activeKit.cadence} / {activeKit.owner}</p>
            </div>
            <button
              type="button"
              onClick={resetActiveDraft}
              className="inline-flex h-9 items-center gap-2 rounded-md border border-line bg-surface px-3 text-sm font-medium text-muted transition hover:text-ink"
            >
              <RotateCcw className="h-4 w-4" />
              清空
            </button>
          </div>
          <div className="mt-4 space-y-4">
            {activeKit.inputFields.map((field) => (
              <label key={field.key} className="block">
                <span className="text-sm font-semibold text-ink">{field.label}</span>
                <textarea
                  value={activeDraft[field.key] ?? ""}
                  onChange={(event) => updateField(field.key, event.target.value)}
                  rows={3}
                  placeholder={field.placeholder}
                  className="mt-2 w-full resize-y rounded-md border border-line bg-surface px-3 py-2 text-sm leading-6 text-ink outline-none transition placeholder:text-muted focus:border-accent"
                />
              </label>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="rounded-lg border border-line bg-panel p-5 shadow-soft dark:shadow-darksoft">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-muted">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                {activeKit.goal}
              </div>
              <h2 className="mt-4 text-2xl font-semibold text-ink">{activeKit.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{activeKit.scenario}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <CopyButton value={report} label="复制报告" />
              <CopyButton value={codexPrompt} label="复制给 Codex" />
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-md border border-line bg-surface p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                <ClipboardList className="h-4 w-4 text-accent" />
                复盘问题
              </p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
                {activeKit.reviewQuestions.map((question) => (
                  <li key={question}>• {question}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-md border border-line bg-surface p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                <FileText className="h-4 w-4 text-accent" />
                输出结构
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {activeKit.outputSections.map((section) => (
                  <Tag key={section}>{section}</Tag>
                ))}
              </div>
              <p className="mt-4 text-sm leading-6 text-muted">输入完整后，右下方报告会自动把你的素材整理成结构化复盘。</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-line bg-panel p-5 shadow-soft dark:shadow-darksoft">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-ink">复盘报告草稿</h2>
            <CopyButton value={report} label="复制" />
          </div>
          <pre className="fine-scrollbar max-h-[520px] overflow-auto whitespace-pre-wrap rounded-md border border-line bg-surface p-4 text-sm leading-6 text-ink">
            {report}
          </pre>
        </div>

        <div className="rounded-lg border border-line bg-panel p-5 shadow-soft dark:shadow-darksoft">
          <p className="text-sm font-semibold text-ink">最佳实践</p>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {activeKit.bestPractices.map((practice) => (
              <div key={practice} className="rounded-md border border-line bg-surface p-3 text-sm leading-6 text-muted">
                {practice}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function buildReviewReport(kit: ReviewKit, draft: Record<string, string>) {
  return [
    `# ${kit.title}`,
    "",
    `场景：${kit.scenario}`,
    `节奏：${kit.cadence}`,
    `目标：${kit.goal}`,
    "",
    "## 输入摘要",
    ...kit.inputFields.map((field) => `- ${field.label}：${draft[field.key]?.trim() || "待补充"}`),
    "",
    "## 复盘问题",
    ...kit.reviewQuestions.map((question) => `- ${question}`),
    "",
    "## 输出结构",
    ...kit.outputSections.map((section) => `- ${section}`),
    "",
    "## 下一步",
    "- 复制“给 Codex 的深度复盘 Prompt”，让 Codex 基于以上输入生成正式复盘。",
    "- 将有效规则沉淀到项目文档、AGENTS.md 或下一次任务 Prompt。"
  ].join("\n");
}

function buildCodexPrompt(kit: ReviewKit, draft: Record<string, string>) {
  return [
    kit.codexPrompt,
    "",
    "## 我的输入",
    ...kit.inputFields.map((field) => `### ${field.label}\n${draft[field.key]?.trim() || "待补充"}`),
    "",
    "## 请重点回答",
    ...kit.reviewQuestions.map((question) => `- ${question}`),
    "",
    "## 输出结构",
    ...kit.outputSections.map((section) => `- ${section}`)
  ].join("\n");
}

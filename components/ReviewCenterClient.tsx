"use client";

import { CheckCircle2, Circle, ClipboardList, Download, FileText, History, RotateCcw, Save, Sparkles, Trash2, Upload } from "lucide-react";
import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { Tag } from "@/components/Tag";
import { cn } from "@/lib/utils";
import type { ReviewKit } from "@/types/content";

const REVIEW_DRAFTS_KEY = "codex-mastery:review-drafts";
const REVIEW_HISTORY_KEY = "codex-mastery:review-history";
const MAX_HISTORY_ITEMS = 20;

type Drafts = Record<string, Record<string, string>>;
type ReviewHistoryItem = {
  id: string;
  kitId: string;
  kitTitle: string;
  createdAt: string;
  summary: string;
  report: string;
  codexPrompt: string;
  draft: Record<string, string>;
};
type ImportStatus = {
  tone: "success" | "error";
  message: string;
};
type PendingImport = ParsedReviewImport & {
  importedAt: string;
};
type ParsedReviewImport = {
  kit: ReviewKit;
  draft: Record<string, string>;
  filledCount: number;
};

export function ReviewCenterClient({ kits }: { kits: ReviewKit[] }) {
  const [activeId, setActiveId] = useState(kits[0]?.id ?? "");
  const [drafts, setDrafts] = useState<Drafts>({});
  const [history, setHistory] = useState<ReviewHistoryItem[]>([]);
  const [downloaded, setDownloaded] = useState(false);
  const [savedHistory, setSavedHistory] = useState(false);
  const [importStatus, setImportStatus] = useState<ImportStatus | null>(null);
  const [pendingImport, setPendingImport] = useState<PendingImport | null>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

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
    const stored = window.localStorage.getItem(REVIEW_HISTORY_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as ReviewHistoryItem[];
      setHistory(Array.isArray(parsed) ? parsed.slice(0, MAX_HISTORY_ITEMS) : []);
    } catch {
      setHistory([]);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(REVIEW_DRAFTS_KEY, JSON.stringify(drafts));
  }, [drafts]);

  useEffect(() => {
    window.localStorage.setItem(REVIEW_HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const completedFields = activeKit.inputFields.filter((field) => (activeDraft[field.key] ?? "").trim().length >= 8).length;
  const fieldProgress = Math.round((completedFields / activeKit.inputFields.length) * 100);
  const report = useMemo(() => buildReviewReport(activeKit, activeDraft), [activeKit, activeDraft]);
  const codexPrompt = useMemo(() => buildCodexPrompt(activeKit, activeDraft), [activeKit, activeDraft]);
  const canSaveHistory = activeKit.inputFields.some((field) => (activeDraft[field.key] ?? "").trim().length > 0);

  function updateField(key: string, value: string) {
    setPendingImport(null);
    setDrafts((current) => ({
      ...current,
      [activeKit.id]: {
        ...(current[activeKit.id] ?? {}),
        [key]: value
      }
    }));
  }

  function resetActiveDraft() {
    setPendingImport(null);
    setDrafts((current) => {
      const next = { ...current };
      delete next[activeKit.id];
      return next;
    });
  }

  function saveCurrentReview() {
    if (!canSaveHistory) return;
    saveReviewToHistory(createHistoryItem(activeKit, activeDraft));
  }

  function saveImportedReview() {
    if (!pendingImport) return;
    const item = createHistoryItem(pendingImport.kit, pendingImport.draft, pendingImport.importedAt);
    saveReviewToHistory(item);
    setPendingImport(null);
    setImportStatus({
      tone: "success",
      message: `已将导入的「${pendingImport.kit.title}」另存为历史复盘。`
    });
  }

  function createHistoryItem(kit: ReviewKit, draft: Record<string, string>, createdAt = new Date().toISOString()): ReviewHistoryItem {
    return {
      id: `review-${Date.now()}`,
      kitId: kit.id,
      kitTitle: kit.title,
      createdAt,
      summary: buildHistorySummary(kit, draft),
      report: buildReviewReport(kit, draft),
      codexPrompt: buildCodexPrompt(kit, draft),
      draft
    };
  }

  function saveReviewToHistory(item: ReviewHistoryItem) {
    setHistory((current) => [item, ...current].slice(0, MAX_HISTORY_ITEMS));
    setSavedHistory(true);
    window.setTimeout(() => setSavedHistory(false), 1400);
  }

  function restoreHistory(item: ReviewHistoryItem) {
    setPendingImport(null);
    const nextKit = kits.some((kit) => kit.id === item.kitId) ? item.kitId : activeKit.id;
    setActiveId(nextKit);
    setDrafts((current) => ({
      ...current,
      [nextKit]: item.draft
    }));
  }

  function deleteHistory(id: string) {
    setHistory((current) => current.filter((item) => item.id !== id));
  }

  function downloadMarkdown() {
    const blob = new Blob([report], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${toFileName(activeKit.title)}-${todayKey()}.md`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    window.setTimeout(() => setDownloaded(false), 1400);
  }

  async function importMarkdown(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    setPendingImport(null);
    if (!file) return;

    const isMarkdown = file.name.toLowerCase().endsWith(".md") || file.type.includes("markdown") || file.type.includes("text");
    if (!isMarkdown) {
      setImportStatus({ tone: "error", message: "仅支持导入 Markdown 或纯文本复盘文件。" });
      return;
    }

    try {
      const content = await file.text();
      const parsed = parseReviewMarkdown(content, kits);
      if (!parsed) {
        setImportStatus({ tone: "error", message: "未识别到本站复盘格式，请确认文件包含标题和“输入摘要”。" });
        return;
      }

      setActiveId(parsed.kit.id);
      setDrafts((current) => ({
        ...current,
        [parsed.kit.id]: parsed.draft
      }));
      setImportStatus({
        tone: "success",
        message: `已导入「${parsed.kit.title}」，恢复 ${parsed.filledCount} 个输入字段。`
      });
      setPendingImport({ ...parsed, importedAt: new Date().toISOString() });
    } catch {
      setImportStatus({ tone: "error", message: "读取文件失败，请重新选择 Markdown 文件。" });
      setPendingImport(null);
    }
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
              <input
                ref={importInputRef}
                type="file"
                accept=".md,.markdown,text/markdown,text/plain"
                onChange={importMarkdown}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => importInputRef.current?.click()}
                className="inline-flex h-9 items-center gap-2 rounded-md border border-line bg-panel px-3 text-sm font-medium text-ink transition hover:-translate-y-0.5 hover:border-accent/50 hover:text-accent"
                title="导入已导出的复盘 Markdown"
              >
                <Upload className="h-4 w-4" />
                <span>导入 Markdown</span>
              </button>
              <CopyButton value={report} label="复制报告" />
              <CopyButton value={codexPrompt} label="复制给 Codex" />
              <button
                type="button"
                onClick={saveCurrentReview}
                disabled={!canSaveHistory}
                className="inline-flex h-9 items-center gap-2 rounded-md border border-line bg-panel px-3 text-sm font-medium text-ink transition hover:-translate-y-0.5 hover:border-accent/50 hover:text-accent disabled:cursor-not-allowed disabled:opacity-45"
                title={canSaveHistory ? "保存到历史复盘" : "至少填写一项输入后再保存"}
              >
                <Save className="h-4 w-4" />
                <span>{savedHistory ? "已保存" : "保存历史"}</span>
              </button>
              <button
                type="button"
                onClick={downloadMarkdown}
                className="inline-flex h-9 items-center gap-2 rounded-md border border-line bg-panel px-3 text-sm font-medium text-ink transition hover:-translate-y-0.5 hover:border-accent/50 hover:text-accent"
                title={downloaded ? "已导出" : "导出 Markdown"}
              >
                <Download className="h-4 w-4" />
                <span>{downloaded ? "已导出" : "导出 Markdown"}</span>
              </button>
            </div>
          </div>
          {importStatus ? (
            <div
              className={cn(
                "mt-4 flex flex-col gap-3 rounded-md border px-3 py-2 text-sm leading-6 md:flex-row md:items-center md:justify-between",
                importStatus.tone === "success"
                  ? "border-accent/35 bg-accent/10 text-ink"
                  : "border-red-400/35 bg-red-500/10 text-ink"
              )}
            >
              <span>{importStatus.message}</span>
              {pendingImport && importStatus.tone === "success" ? (
                <button
                  type="button"
                  onClick={saveImportedReview}
                  className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-md border border-accent/35 bg-panel px-3 text-sm font-medium text-ink transition hover:-translate-y-0.5 hover:border-accent/60 hover:text-accent"
                  title="将刚导入的复盘内容另存到历史列表"
                >
                  <Save className="h-4 w-4" />
                  另存为历史
                </button>
              ) : null}
            </div>
          ) : null}

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
            <div className="flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={saveCurrentReview}
                disabled={!canSaveHistory}
                className="inline-flex h-9 items-center gap-2 rounded-md border border-line bg-panel px-3 text-sm font-medium text-ink transition hover:-translate-y-0.5 hover:border-accent/50 hover:text-accent disabled:cursor-not-allowed disabled:opacity-45"
                title={canSaveHistory ? "保存到历史复盘" : "至少填写一项输入后再保存"}
              >
                <Save className="h-4 w-4" />
                <span>{savedHistory ? "已保存" : "保存"}</span>
              </button>
              <button
                type="button"
                onClick={() => importInputRef.current?.click()}
                className="inline-flex h-9 items-center gap-2 rounded-md border border-line bg-panel px-3 text-sm font-medium text-ink transition hover:-translate-y-0.5 hover:border-accent/50 hover:text-accent"
                title="导入已导出的复盘 Markdown"
              >
                <Upload className="h-4 w-4" />
                <span>导入</span>
              </button>
              <CopyButton value={report} label="复制" />
              <button
                type="button"
                onClick={downloadMarkdown}
                className="inline-flex h-9 items-center gap-2 rounded-md border border-line bg-panel px-3 text-sm font-medium text-ink transition hover:-translate-y-0.5 hover:border-accent/50 hover:text-accent"
                title={downloaded ? "已导出" : "下载当前报告"}
              >
                <Download className="h-4 w-4" />
                <span>{downloaded ? "已导出" : "下载"}</span>
              </button>
            </div>
          </div>
          <pre className="fine-scrollbar max-h-[520px] overflow-auto whitespace-pre-wrap rounded-md border border-line bg-surface p-4 text-sm leading-6 text-ink">
            {report}
          </pre>
        </div>

        <div className="rounded-lg border border-line bg-panel p-5 shadow-soft dark:shadow-darksoft">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                <History className="h-4 w-4 text-accent" />
                历史复盘
              </p>
              <p className="mt-1 text-sm leading-6 text-muted">本地保存最近 {MAX_HISTORY_ITEMS} 条复盘，可继续编辑、复制或删除。</p>
            </div>
            <div className="rounded-md border border-line bg-surface px-3 py-2 text-right">
              <p className="text-lg font-semibold text-ink">{history.length}</p>
              <p className="text-xs text-muted">已保存</p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {history.length ? (
              history.map((item) => (
                <article key={item.id} className="rounded-md border border-line bg-surface p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink">{item.kitTitle}</p>
                      <p className="mt-1 text-xs text-muted">{formatDateTime(item.createdAt)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteHistory(item.id)}
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-line bg-panel text-muted transition hover:border-accent/40 hover:text-accent"
                      aria-label={`删除 ${item.kitTitle}`}
                      title="删除"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">{item.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => restoreHistory(item)}
                      className="inline-flex h-9 items-center gap-2 rounded-md border border-line bg-panel px-3 text-sm font-medium text-ink transition hover:-translate-y-0.5 hover:border-accent/50 hover:text-accent"
                    >
                      <RotateCcw className="h-4 w-4" />
                      继续编辑
                    </button>
                    <CopyButton value={item.report} label="复制报告" />
                    <CopyButton value={item.codexPrompt} label="复制 Prompt" />
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-md border border-dashed border-line bg-surface p-5 text-sm leading-6 text-muted">
                还没有历史复盘。填写任意复盘输入后，点击“保存历史”即可把当前报告保存到本地浏览器。
              </div>
            )}
          </div>
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

function buildHistorySummary(kit: ReviewKit, draft: Record<string, string>) {
  const filled = kit.inputFields
    .map((field) => draft[field.key]?.trim())
    .find((value) => value && value.length > 0);
  return filled ? filled.slice(0, 120) : kit.scenario;
}

function toFileName(value: string) {
  return value
    .trim()
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 42) || "codex-review";
}

function todayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");
  return `${year}${month}${day}`;
}

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "时间未知";
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const hour = `${date.getHours()}`.padStart(2, "0");
  const minute = `${date.getMinutes()}`.padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day} ${hour}:${minute}`;
}

function parseReviewMarkdown(content: string, kits: ReviewKit[]): ParsedReviewImport | null {
  const normalized = content.replace(/\r\n/g, "\n").trim();
  if (normalized.length < 20) return null;

  const title = normalized.match(/^#\s+(.+?)\s*$/m)?.[1]?.trim();
  const exactKit = title ? kits.find((kit) => kit.title === title) : undefined;
  const candidates = exactKit ? [exactKit, ...kits.filter((kit) => kit.id !== exactKit.id)] : kits;
  const inputSummary = extractMarkdownSection(normalized, "输入摘要");

  const ranked = candidates
    .map((kit) => {
      const draft = {
        ...parseInputSummarySection(inputSummary, kit),
        ...parseHeadingFieldBlocks(normalized, kit)
      };
      const filledCount = kit.inputFields.filter((field) => (draft[field.key] ?? "").trim().length > 0).length;
      const titleScore = exactKit?.id === kit.id ? 10 : 0;
      return { kit, draft, filledCount, score: titleScore + filledCount };
    })
    .sort((a, b) => b.score - a.score);

  const best = ranked[0];
  if (!best || best.filledCount === 0) return null;
  if (!exactKit && best.filledCount < 2) return null;
  return {
    kit: best.kit,
    draft: best.draft,
    filledCount: best.filledCount
  };
}

function extractMarkdownSection(content: string, title: string) {
  const escapedTitle = escapeRegExp(title);
  const match = content.match(new RegExp(`^##\\s+${escapedTitle}\\s*$`, "m"));
  if (!match || match.index === undefined) return "";

  const start = match.index + match[0].length;
  const rest = content.slice(start);
  const nextHeading = rest.search(/^##\s+/m);
  return (nextHeading >= 0 ? rest.slice(0, nextHeading) : rest).trim();
}

function parseInputSummarySection(section: string, kit: ReviewKit) {
  const draft: Record<string, string> = {};
  if (!section) return draft;

  const lines = section.split("\n");
  let activeKey: string | null = null;
  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const matchedField = kit.inputFields.find((field) => line.startsWith(`- ${field.label}：`) || line.startsWith(`- ${field.label}:`));
    if (matchedField) {
      activeKey = matchedField.key;
      const value = line.replace(new RegExp(`^-\\s+${escapeRegExp(matchedField.label)}[：:]\\s*`), "").trim();
      draft[activeKey] = normalizeImportedValue(value);
      continue;
    }

    if (!activeKey || line.startsWith("- ") || line.startsWith("#")) continue;
    const continuation = line.trim();
    if (!continuation) continue;
    draft[activeKey] = [draft[activeKey], continuation].filter(Boolean).join("\n");
  }

  return draft;
}

function parseHeadingFieldBlocks(content: string, kit: ReviewKit) {
  const draft: Record<string, string> = {};
  for (const field of kit.inputFields) {
    const heading = content.match(new RegExp(`^###\\s+${escapeRegExp(field.label)}\\s*$`, "m"));
    if (!heading || heading.index === undefined) continue;
    const start = heading.index + heading[0].length;
    const rest = content.slice(start);
    const nextHeading = rest.search(/^###?\s+/m);
    const value = (nextHeading >= 0 ? rest.slice(0, nextHeading) : rest).trim();
    const normalized = normalizeImportedValue(value);
    if (normalized) draft[field.key] = normalized;
  }
  return draft;
}

function normalizeImportedValue(value: string) {
  const trimmed = value.trim();
  return trimmed === "待补充" ? "" : trimmed;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

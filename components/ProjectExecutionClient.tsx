"use client";

import { CheckCircle2, Download, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import type { ProjectItem } from "@/types/content";

const PROJECT_CHECKLIST_KEY = "codex-mastery:project-checklist";
const PROJECT_RECORD_KEY = "codex-mastery:project-execution-records";

type ProjectChecklistState = Record<string, string[]>;
type ProjectExecutionRecord = {
  stage: string;
  completed: string;
  evidence: string;
  blockers: string;
  nextAction: string;
  notes: string;
};
type ProjectExecutionRecords = Record<string, ProjectExecutionRecord>;

const emptyRecord: ProjectExecutionRecord = {
  stage: "",
  completed: "",
  evidence: "",
  blockers: "",
  nextAction: "",
  notes: ""
};

export function ProjectExecutionClient({ project }: { project: ProjectItem }) {
  const [checked, setChecked] = useState<ProjectChecklistState>({});
  const [records, setRecords] = useState<ProjectExecutionRecords>({});
  const [saved, setSaved] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const checkedIds = useMemo(() => checked[project.id] ?? [], [checked, project.id]);
  const record = records[project.id] ?? emptyRecord;
  const completed = project.deliveryChecklist.filter((check) => checkedIds.includes(check.id)).length;
  const progress = Math.round((completed / project.deliveryChecklist.length) * 100);
  const exportText = useMemo(() => buildExecutionRecord(project, record, checkedIds), [project, record, checkedIds]);

  useEffect(() => {
    const checklist = window.localStorage.getItem(PROJECT_CHECKLIST_KEY);
    if (checklist) {
      try {
        const parsed = JSON.parse(checklist) as ProjectChecklistState;
        setChecked(parsed && typeof parsed === "object" ? parsed : {});
      } catch {
        setChecked({});
      }
    }

    const storedRecords = window.localStorage.getItem(PROJECT_RECORD_KEY);
    if (storedRecords) {
      try {
        const parsed = JSON.parse(storedRecords) as ProjectExecutionRecords;
        setRecords(parsed && typeof parsed === "object" ? parsed : {});
      } catch {
        setRecords({});
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(PROJECT_CHECKLIST_KEY, JSON.stringify(checked));
  }, [checked]);

  useEffect(() => {
    window.localStorage.setItem(PROJECT_RECORD_KEY, JSON.stringify(records));
  }, [records]);

  function toggleCheck(checkId: string) {
    setChecked((current) => {
      const currentIds = current[project.id] ?? [];
      const nextIds = currentIds.includes(checkId)
        ? currentIds.filter((id) => id !== checkId)
        : [...currentIds, checkId];
      return {
        ...current,
        [project.id]: nextIds
      };
    });
  }

  function updateRecord(key: keyof ProjectExecutionRecord, value: string) {
    setRecords((current) => ({
      ...current,
      [project.id]: {
        ...(current[project.id] ?? emptyRecord),
        [key]: value
      }
    }));
  }

  function markSaved() {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1400);
  }

  function downloadMarkdown() {
    const blob = new Blob([exportText], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${toFileName(project.title)}-执行记录-${todayKey()}.md`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    window.setTimeout(() => setDownloaded(false), 1400);
  }

  return (
    <section className="space-y-5">
      <div className="rounded-lg border border-line bg-panel p-5 shadow-soft dark:shadow-darksoft">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold text-ink">执行记录</p>
            <p className="mt-1 text-sm leading-6 text-muted">记录当前阶段、完成证据、风险和下一步，导出为项目交付 Markdown。</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={markSaved}
              className="inline-flex h-9 items-center gap-2 rounded-md border border-line bg-panel px-3 text-sm font-medium text-ink transition hover:-translate-y-0.5 hover:border-accent/50 hover:text-accent"
            >
              <Save className="h-4 w-4" />
              {saved ? "已保存" : "保存草稿"}
            </button>
            <CopyButton value={exportText} label="复制记录" />
            <button
              type="button"
              onClick={downloadMarkdown}
              className="inline-flex h-9 items-center gap-2 rounded-md border border-line bg-panel px-3 text-sm font-medium text-ink transition hover:-translate-y-0.5 hover:border-accent/50 hover:text-accent"
            >
              <Download className="h-4 w-4" />
              {downloaded ? "已导出" : "导出 Markdown"}
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <RecordField label="当前阶段" value={record.stage} placeholder="例如：MVP 验证 / 页面开发 / 交付复盘" onChange={(value) => updateRecord("stage", value)} />
          <RecordField label="下一步行动" value={record.nextAction} placeholder="例如：补移动端验证并提交 Vercel 部署" onChange={(value) => updateRecord("nextAction", value)} />
          <RecordField label="已完成内容" value={record.completed} placeholder="列出已完成的页面、组件、数据和交互。" onChange={(value) => updateRecord("completed", value)} />
          <RecordField label="验证证据" value={record.evidence} placeholder="例如：typecheck、lint、build、Playwright、截图。" onChange={(value) => updateRecord("evidence", value)} />
          <RecordField label="风险 / 卡点" value={record.blockers} placeholder="列出当前阻塞、技术债、未知信息或人工判断点。" onChange={(value) => updateRecord("blockers", value)} />
          <RecordField label="补充说明" value={record.notes} placeholder="记录项目取舍、待确认问题或复盘结论。" onChange={(value) => updateRecord("notes", value)} />
        </div>
      </div>

      <div className="rounded-lg border border-line bg-panel p-5 shadow-soft dark:shadow-darksoft">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-ink">交付检查进度</p>
            <p className="mt-1 text-sm leading-6 text-muted">{completed}/{project.deliveryChecklist.length} 已完成，列表页和详情页共用同一进度。</p>
          </div>
          <div className="rounded-md border border-line bg-surface px-3 py-2 text-right">
            <p className="text-lg font-semibold text-ink">{progress}%</p>
            <p className="text-xs text-muted">完成度</p>
          </div>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-line">
          <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-4 space-y-3">
          {project.deliveryChecklist.map((check) => {
            const active = checkedIds.includes(check.id);
            return (
              <label
                key={check.id}
                className="flex cursor-pointer gap-3 rounded-md border border-line bg-surface p-3 transition hover:border-accent/35"
              >
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() => toggleCheck(check.id)}
                  className="mt-1 h-4 w-4 shrink-0 rounded border-line accent-accent"
                />
                <span className="min-w-0">
                  <span className="flex items-center gap-2 text-sm font-semibold text-ink">
                    {active ? <CheckCircle2 className="h-4 w-4 text-accent" /> : null}
                    {check.title}
                  </span>
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

      <div className="rounded-lg border border-line bg-panel p-5 shadow-soft dark:shadow-darksoft">
        <p className="text-sm font-semibold text-ink">导出预览</p>
        <pre className="fine-scrollbar mt-4 max-h-[420px] overflow-auto whitespace-pre-wrap rounded-md border border-line bg-surface p-4 text-sm leading-6 text-ink">
          {exportText}
        </pre>
      </div>
    </section>
  );
}

function RecordField({
  label,
  value,
  placeholder,
  onChange
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-ink">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        placeholder={placeholder}
        className="mt-2 w-full resize-y rounded-md border border-line bg-surface px-3 py-2 text-sm leading-6 text-ink outline-none transition placeholder:text-muted focus:border-accent"
      />
    </label>
  );
}

function buildExecutionRecord(project: ProjectItem, record: ProjectExecutionRecord, checkedIds: string[]) {
  const completedChecks = project.deliveryChecklist.filter((check) => checkedIds.includes(check.id));
  const pendingChecks = project.deliveryChecklist.filter((check) => !checkedIds.includes(check.id));
  return [
    `# ${project.title} 执行记录`,
    "",
    `项目目标：${project.goal}`,
    `业务价值：${project.businessValue}`,
    `当前阶段：${record.stage.trim() || "待补充"}`,
    "",
    "## 已完成内容",
    record.completed.trim() || "待补充",
    "",
    "## 验证证据",
    record.evidence.trim() || "待补充",
    "",
    "## 已完成检查项",
    ...(completedChecks.length ? completedChecks.map((check) => `- ${check.title}：${check.evidence}`) : ["- 待补充"]),
    "",
    "## 未完成检查项",
    ...(pendingChecks.length ? pendingChecks.map((check) => `- ${check.title}：${check.acceptance}`) : ["- 无"]),
    "",
    "## 风险 / 卡点",
    record.blockers.trim() || "待补充",
    "",
    "## 下一步行动",
    record.nextAction.trim() || "待补充",
    "",
    "## 补充说明",
    record.notes.trim() || "待补充",
    "",
    "## Codex 实现 Prompt",
    project.prompt
  ].join("\n");
}

function toFileName(value: string) {
  return value
    .trim()
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 42) || "codex-project";
}

function todayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");
  return `${year}${month}${day}`;
}

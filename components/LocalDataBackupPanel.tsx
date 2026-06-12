"use client";

import { Database, Download, RotateCcw, ShieldCheck, Upload } from "lucide-react";
import { type ChangeEvent, useMemo, useRef, useState } from "react";

const BACKUP_VERSION = 1;
const BACKUP_KEYS = [
  { key: "codex-mastery:completed-days", label: "30 天训练进度", type: "array" },
  { key: "codex-mastery:favorites", label: "收藏资源", type: "array" },
  { key: "codex-mastery:watched-videos", label: "视频观看记录", type: "array" },
  { key: "codex-mastery:review-drafts", label: "复盘草稿", type: "object" },
  { key: "codex-mastery:review-history", label: "复盘历史", type: "array" },
  { key: "codex-mastery:project-checklist", label: "项目交付检查", type: "object" },
  { key: "codex-mastery:project-execution-records", label: "项目执行记录", type: "object" },
  { key: "codex-mastery:theme", label: "深色模式设置", type: "string" }
] as const;

type BackupKey = (typeof BACKUP_KEYS)[number]["key"];
type BackupData = Partial<Record<BackupKey, unknown>>;
type BackupFile = {
  app: "Codex Mastery";
  version: number;
  exportedAt: string;
  data: BackupData;
};
type ImportStatus = {
  tone: "success" | "error";
  message: string;
};

export function LocalDataBackupPanel() {
  const [exported, setExported] = useState(false);
  const [importStatus, setImportStatus] = useState<ImportStatus | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const keyLabels = useMemo(() => BACKUP_KEYS.map((item) => item.label).join("、"), []);

  function collectBackupData(): BackupData {
    const data: BackupData = {};
    for (const item of BACKUP_KEYS) {
      const raw = window.localStorage.getItem(item.key);
      if (raw === null) continue;
      data[item.key] = item.type === "string" ? raw : safeParse(raw);
    }
    return data;
  }

  function exportBackup() {
    const backup: BackupFile = {
      app: "Codex Mastery",
      version: BACKUP_VERSION,
      exportedAt: new Date().toISOString(),
      data: collectBackupData()
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `codex-mastery-backup-${todayKey()}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setExported(true);
    window.setTimeout(() => setExported(false), 1400);
  }

  async function importBackup(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    setImportStatus(null);
    if (!file) return;

    const isJson = file.name.toLowerCase().endsWith(".json") || file.type.includes("json");
    if (!isJson) {
      setImportStatus({ tone: "error", message: "仅支持导入本站导出的 JSON 备份文件。" });
      return;
    }

    try {
      const parsed = JSON.parse(await file.text()) as Partial<BackupFile>;
      if (parsed.app !== "Codex Mastery" || typeof parsed.data !== "object" || parsed.data === null) {
        setImportStatus({ tone: "error", message: "未识别到 Codex Mastery 备份结构，未覆盖本地数据。" });
        return;
      }

      let restored = 0;
      for (const item of BACKUP_KEYS) {
        if (!Object.prototype.hasOwnProperty.call(parsed.data, item.key)) continue;
        const value = parsed.data[item.key];
        if (!isValidValue(item.type, value)) continue;
        window.localStorage.setItem(item.key, item.type === "string" ? String(value) : JSON.stringify(value));
        restored += 1;
      }

      if (!restored) {
        setImportStatus({ tone: "error", message: "备份文件中没有可恢复的学习数据。" });
        return;
      }

      setImportStatus({ tone: "success", message: `已恢复 ${restored} 类本地学习数据。刷新页面后，各模块会读取最新状态。` });
    } catch {
      setImportStatus({ tone: "error", message: "读取备份失败，请确认文件是有效 JSON。" });
    }
  }

  return (
    <section className="rounded-xl border border-line bg-panel p-5 shadow-soft dark:shadow-darksoft md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-muted">
            <Database className="h-3.5 w-3.5 text-accent" />
            本地学习档案
          </div>
          <h2 className="mt-3 text-xl font-semibold text-ink">备份与恢复</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
            导出当前浏览器里的学习进度、收藏、视频观看、复盘、项目检查和执行记录。导入会覆盖这些本地状态，但不会上传到服务器。
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input ref={inputRef} type="file" accept="application/json,.json" onChange={importBackup} className="hidden" />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-line bg-panel px-3 text-sm font-medium text-ink transition hover:-translate-y-0.5 hover:border-accent/50 hover:text-accent"
          >
            <Upload className="h-4 w-4" />
            导入备份
          </button>
          <button
            type="button"
            onClick={exportBackup}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-ink px-3 text-sm font-semibold text-panel transition hover:opacity-90"
          >
            <Download className="h-4 w-4" />
            {exported ? "已导出" : "导出备份"}
          </button>
        </div>
      </div>

      {importStatus ? (
        <div
          className={`mt-4 rounded-md border px-3 py-2 text-sm leading-6 ${
            importStatus.tone === "success"
              ? "border-accent/35 bg-accent/10 text-ink"
              : "border-red-400/35 bg-red-500/10 text-ink"
          }`}
        >
          {importStatus.message}
        </div>
      ) : null}

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <div className="rounded-md border border-line bg-surface p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-ink">
            <ShieldCheck className="h-4 w-4 text-accent" />
            备份范围
          </p>
          <p className="mt-2 text-sm leading-6 text-muted">{keyLabels}</p>
        </div>
        <div className="rounded-md border border-line bg-surface p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-ink">
            <RotateCcw className="h-4 w-4 text-accent" />
            恢复规则
          </p>
          <p className="mt-2 text-sm leading-6 text-muted">
            只恢复本站白名单数据。导入完成后建议刷新页面；如果文件格式不正确，当前数据不会被覆盖。
          </p>
        </div>
      </div>
    </section>
  );
}

function safeParse(value: string) {
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

function isValidValue(type: (typeof BACKUP_KEYS)[number]["type"], value: unknown) {
  if (type === "array") return Array.isArray(value);
  if (type === "object") return typeof value === "object" && value !== null && !Array.isArray(value);
  return typeof value === "string";
}

function todayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");
  return `${year}${month}${day}`;
}

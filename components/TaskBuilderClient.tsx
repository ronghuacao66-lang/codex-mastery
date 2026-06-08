"use client";

import { CheckCircle2, Circle, RotateCcw, WandSparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { Tag } from "@/components/Tag";
import { cn } from "@/lib/utils";
import type { TaskBuilderPreset, TaskBuilderState } from "@/types/content";

const emptyState: TaskBuilderState = {
  role: "你是一名资深软件工程师和 Codex 专家。",
  goal: "",
  context: "",
  constraints: "",
  dod: "",
  outputFormat: "",
  verification: ""
};

const checks: Array<{ key: keyof TaskBuilderState; title: string; hint: string }> = [
  { key: "goal", title: "Goal", hint: "目标是否是一个明确结果" },
  { key: "context", title: "Context", hint: "是否说明项目、用户、现状和关键文件" },
  { key: "constraints", title: "Constraint", hint: "是否写清技术、范围和禁止事项" },
  { key: "dod", title: "Definition of Done", hint: "是否能被命令、页面或人工步骤验证" },
  { key: "verification", title: "Verification", hint: "是否要求 Codex 验证并说明结果" }
];

export function TaskBuilderClient({ presets }: { presets: TaskBuilderPreset[] }) {
  const firstPreset = presets[0];
  const [state, setState] = useState<TaskBuilderState>(firstPreset?.state ?? emptyState);
  const [activePreset, setActivePreset] = useState(firstPreset?.id ?? "");

  const completedChecks = checks.filter((check) => state[check.key].trim().length >= 12);
  const score = Math.round((completedChecks.length / checks.length) * 100);

  const prompt = useMemo(() => {
    return [
      state.role.trim(),
      "",
      "请完成以下 Codex 工程任务。",
      "",
      "## Goal",
      state.goal.trim() || "请填写任务目标。",
      "",
      "## Context",
      state.context.trim() || "请填写项目上下文。",
      "",
      "## Constraint",
      state.constraints.trim() || "请填写限制条件。",
      "",
      "## Definition of Done",
      state.dod.trim() || "请填写完成标准。",
      "",
      "## Output Format",
      state.outputFormat.trim() || "请说明你希望 Codex 如何汇报结果。",
      "",
      "## Verification",
      state.verification.trim() || "请说明需要执行哪些验证命令或人工检查。"
    ].join("\n");
  }, [state]);

  function updateField(key: keyof TaskBuilderState, value: string) {
    setState((current) => ({ ...current, [key]: value }));
  }

  function applyPreset(id: string) {
    const preset = presets.find((item) => item.id === id);
    if (!preset) return;
    setActivePreset(id);
    setState(preset.state);
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
      <section className="space-y-5">
        <div className="rounded-lg border border-line bg-panel p-5 shadow-soft dark:shadow-darksoft">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-ink">任务场景</p>
              <p className="mt-1 text-sm text-muted">选择一个接近当前工作的起点。</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setActivePreset("");
                setState(emptyState);
              }}
              className="inline-flex h-9 items-center gap-2 rounded-md border border-line bg-surface px-3 text-sm font-medium text-muted transition hover:text-ink"
            >
              <RotateCcw className="h-4 w-4" />
              清空
            </button>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {presets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset.id)}
                className={cn(
                  "rounded-md border p-4 text-left transition",
                  activePreset === preset.id ? "border-accent/50 bg-accent/10" : "border-line bg-surface hover:border-accent/35"
                )}
              >
                <span className="text-sm font-semibold text-ink">{preset.title}</span>
                <span className="mt-3 flex flex-wrap gap-2">
                  {preset.tags.map((tag) => (
                    <Tag key={tag} active={activePreset === preset.id}>
                      {tag}
                    </Tag>
                  ))}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-line bg-panel p-5 shadow-soft dark:shadow-darksoft">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-ink">任务质量</p>
              <p className="mt-1 text-sm text-muted">{score >= 80 ? "可以交给 Codex 执行" : "继续补齐关键信息"}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-semibold text-ink">{score}%</p>
              <p className="text-xs text-muted">{completedChecks.length}/{checks.length}</p>
            </div>
          </div>
          <div className="mt-5 h-2 rounded-full bg-surface">
            <div className="h-2 rounded-full bg-gradient-to-r from-accent to-violet transition-all" style={{ width: `${score}%` }} />
          </div>
          <div className="mt-5 space-y-3">
            {checks.map((check) => {
              const done = state[check.key].trim().length >= 12;
              return (
                <div key={check.key} className="flex items-start gap-3 rounded-md border border-line bg-surface p-3">
                  {done ? <CheckCircle2 className="mt-0.5 h-4 w-4 text-accent" /> : <Circle className="mt-0.5 h-4 w-4 text-muted" />}
                  <div>
                    <p className="text-sm font-medium text-ink">{check.title}</p>
                    <p className="mt-1 text-xs leading-5 text-muted">{check.hint}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="rounded-lg border border-line bg-panel p-5 shadow-soft dark:shadow-darksoft">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="角色" value={state.role} onChange={(value) => updateField("role", value)} />
            <Field label="Goal" value={state.goal} onChange={(value) => updateField("goal", value)} />
            <Field label="Context" value={state.context} onChange={(value) => updateField("context", value)} rows={5} />
            <Field label="Constraint" value={state.constraints} onChange={(value) => updateField("constraints", value)} rows={5} />
            <Field label="Definition of Done" value={state.dod} onChange={(value) => updateField("dod", value)} rows={5} />
            <Field label="Output Format" value={state.outputFormat} onChange={(value) => updateField("outputFormat", value)} rows={5} />
            <div className="md:col-span-2">
              <Field label="Verification" value={state.verification} onChange={(value) => updateField("verification", value)} rows={4} />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-line bg-panel p-5 shadow-soft dark:shadow-darksoft">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <WandSparkles className="h-4 w-4 text-accent" />
              <h2 className="text-lg font-semibold text-ink">生成结果</h2>
            </div>
            <CopyButton value={prompt} label="复制任务" />
          </div>
          <pre className="fine-scrollbar max-h-[520px] overflow-auto whitespace-pre-wrap rounded-md border border-line bg-surface p-4 text-sm leading-6 text-ink">
            {prompt}
          </pre>
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  rows = 4
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-ink">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        className="mt-2 w-full resize-y rounded-md border border-line bg-surface px-3 py-2 text-sm leading-6 text-ink outline-none transition placeholder:text-muted focus:border-accent"
      />
    </label>
  );
}

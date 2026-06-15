"use client";

import { AlertCircle, CheckCircle2, Circle, Lightbulb, RotateCcw, WandSparkles } from "lucide-react";
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

type ScoreDimension = {
  id: string;
  title: string;
  score: number;
  max: number;
  status: "good" | "warn" | "weak";
  evidence: string;
  suggestion: string;
};

export function TaskBuilderClient({ presets }: { presets: TaskBuilderPreset[] }) {
  const firstPreset = presets[0];
  const [state, setState] = useState<TaskBuilderState>(firstPreset?.state ?? emptyState);
  const [activePreset, setActivePreset] = useState(firstPreset?.id ?? "");

  const quality = useMemo(() => evaluateTaskQuality(state), [state]);

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
              <p className="mt-1 text-sm text-muted">{quality.score >= 82 ? "可以交给 Codex 执行" : "继续补齐关键信息"}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-semibold text-ink">{quality.score}%</p>
              <p className="text-xs text-muted">{quality.level}</p>
            </div>
          </div>
          <div className="mt-5 h-2 rounded-full bg-surface">
            <div className="h-2 rounded-full bg-gradient-to-r from-accent to-violet transition-all" style={{ width: `${quality.score}%` }} />
          </div>
          <div className="mt-5 grid gap-3">
            {quality.dimensions.map((dimension) => {
              const done = dimension.status === "good";
              return (
                <div key={dimension.id} className="rounded-md border border-line bg-surface p-3">
                  <div className="flex items-start gap-3">
                    {done ? <CheckCircle2 className="mt-0.5 h-4 w-4 text-accent" /> : dimension.status === "warn" ? <AlertCircle className="mt-0.5 h-4 w-4 text-accent" /> : <Circle className="mt-0.5 h-4 w-4 text-muted" />}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium text-ink">{dimension.title}</p>
                        <p className="text-xs font-semibold text-muted">
                          {dimension.score}/{dimension.max}
                        </p>
                      </div>
                      <div className="mt-2 h-1.5 rounded-full bg-panel">
                        <div className="h-1.5 rounded-full bg-accent transition-all" style={{ width: `${Math.round((dimension.score / dimension.max) * 100)}%` }} />
                      </div>
                      <p className="mt-2 text-xs leading-5 text-muted">{dimension.evidence}</p>
                      {dimension.status !== "good" ? <p className="mt-1 text-xs leading-5 text-muted">建议：{dimension.suggestion}</p> : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-5 grid gap-3 rounded-md border border-line bg-surface p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Lightbulb className="h-4 w-4 text-accent" />
              下一步改进
            </p>
            <ul className="space-y-2 text-sm leading-6 text-muted">
              {quality.nextActions.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
            <CopyButton value={buildQualityReport(quality, state)} label="复制评分报告" className="h-9 justify-center" />
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

function evaluateTaskQuality(state: TaskBuilderState) {
  const dimensions: ScoreDimension[] = [
    scoreGoal(state.goal),
    scoreContext(state.context),
    scoreConstraints(state.constraints),
    scoreDod(state.dod),
    scoreVerification(state.verification),
    scoreOutputFormat(state.outputFormat)
  ];
  const total = dimensions.reduce((sum, item) => sum + item.score, 0);
  const max = dimensions.reduce((sum, item) => sum + item.max, 0);
  const score = Math.round((total / max) * 100);
  const weak = dimensions.filter((item) => item.status !== "good").slice(0, 3);
  return {
    score,
    level: score >= 90 ? "优秀" : score >= 82 ? "可执行" : score >= 65 ? "需补齐" : "风险较高",
    dimensions,
    nextActions: weak.length ? weak.map((item) => `${item.title}：${item.suggestion}`) : ["当前任务结构完整，可以交给 Codex 执行，并要求它先读代码、再给计划、最后验证。"]
  };
}

function scoreGoal(value: string): ScoreDimension {
  const text = normalize(value);
  let score = 0;
  if (text.length >= 20) score += 7;
  if (hasAny(text, ["实现", "修复", "生成", "新增", "优化", "完成", "检查", "迁移"])) score += 5;
  if (hasAny(text, ["用户", "页面", "功能", "项目", "工具", "报告", "上线", "交付"])) score += 4;
  if (hasAny(text, ["让", "帮助", "用于", "目标", "结果"])) score += 2;
  return buildDimension("goal", "目标清晰度", score, 18, text ? "目标越像可交付结果，Codex 越容易规划。" : "缺少任务目标。", "写清要交付什么、服务谁、完成后能看到什么结果。");
}

function scoreContext(value: string): ScoreDimension {
  const text = normalize(value);
  let score = 0;
  if (text.length >= 45) score += 6;
  if (hasAny(text, ["Next.js", "React", "TypeScript", "Tailwind", "组件", "页面", "路由", "JSON"])) score += 5;
  if (hasAny(text, ["现有", "当前", "已经", "用户", "场景", "入口", "文件", "目录"])) score += 5;
  if (hasAny(text, ["data", "localStorage", "API", "部署", "Vercel", "移动端", "深色模式"])) score += 4;
  return buildDimension("context", "上下文密度", score, 20, text ? "上下文需要覆盖技术栈、现状和关键边界。" : "缺少项目上下文。", "补充项目技术栈、现有结构、关键文件、目标用户和当前问题。");
}

function scoreConstraints(value: string): ScoreDimension {
  const text = normalize(value);
  let score = 0;
  if (text.length >= 35) score += 5;
  if (hasAny(text, ["不要", "禁止", "不引入", "只修改", "保持", "避免"])) score += 5;
  if (hasAny(text, ["移动端", "深色", "中文", "性能", "安全", "响应式", "类型"])) score += 3;
  if (hasAny(text, ["无关", "重构", "占位", "数据库", "后端", "外部"])) score += 3;
  return buildDimension("constraints", "约束边界", score, 16, text ? "约束用于防止 Codex 扩大范围或破坏现有风格。" : "缺少限制条件。", "写清禁止事项、影响范围、技术边界和必须保留的设计规则。");
}

function scoreDod(value: string): ScoreDimension {
  const text = normalize(value);
  let score = 0;
  if (text.length >= 35) score += 5;
  if (hasAny(text, ["页面", "按钮", "报告", "文件", "组件", "数据", "导出", "复制"])) score += 5;
  if (hasAny(text, ["可访问", "通过", "显示", "支持", "无横向", "成功", "正确"])) score += 4;
  if (hasAny(text, ["空状态", "错误", "移动端", "桌面", "边界", "刷新"])) score += 4;
  return buildDimension("dod", "完成标准", score, 18, text ? "完成标准应该能被页面、命令或人工检查验证。" : "缺少 Definition of Done。", "把验收条件写成可观察结果，例如入口可见、复制可用、移动端无横向滚动。");
}

function scoreVerification(value: string): ScoreDimension {
  const text = normalize(value);
  let score = 0;
  if (text.length >= 25) score += 4;
  if (hasAny(text, ["typecheck", "lint", "build", "test", "audit", "npm run"])) score += 6;
  if (hasAny(text, ["浏览器", "Playwright", "移动端", "375", "桌面", "人工", "截图"])) score += 4;
  if (hasAny(text, ["说明", "结果", "证据", "失败", "修复", "通过"])) score += 4;
  return buildDimension("verification", "验证计划", score, 18, text ? "验证计划需要覆盖命令和真实用户路径。" : "缺少验证计划。", "写明要运行的命令、要打开的页面、移动端检查和失败时如何处理。");
}

function scoreOutputFormat(value: string): ScoreDimension {
  const text = normalize(value);
  let score = 0;
  if (text.length >= 18) score += 3;
  if (hasAny(text, ["计划", "文件", "说明", "验证", "风险", "总结", "列表"])) score += 4;
  if (hasAny(text, ["按", "结构", "输出", "包括", "格式"])) score += 3;
  return buildDimension("output", "输出格式", score, 10, text ? "输出格式让 Codex 的交付说明更稳定。" : "缺少输出格式。", "指定输出顺序，例如改动计划、文件列表、实现说明、验证结果和残留风险。");
}

function buildDimension(id: string, title: string, score: number, max: number, evidence: string, suggestion: string): ScoreDimension {
  const percent = score / max;
  return {
    id,
    title,
    score,
    max,
    evidence,
    suggestion,
    status: percent >= 0.78 ? "good" : percent >= 0.45 ? "warn" : "weak"
  };
}

function buildQualityReport(quality: ReturnType<typeof evaluateTaskQuality>, state: TaskBuilderState) {
  return [
    "# Codex Prompt 质量评分报告",
    "",
    `总分：${quality.score}%`,
    `等级：${quality.level}`,
    "",
    "## 维度得分",
    ...quality.dimensions.map((item) => `- ${item.title}：${item.score}/${item.max}。${item.status === "good" ? "已达标" : item.suggestion}`),
    "",
    "## 下一步改进",
    ...quality.nextActions.map((item) => `- ${item}`),
    "",
    "## 当前任务摘要",
    `Goal：${state.goal || "未填写"}`,
    `Context：${state.context || "未填写"}`,
    `Constraint：${state.constraints || "未填写"}`,
    `Definition of Done：${state.dod || "未填写"}`,
    `Verification：${state.verification || "未填写"}`
  ].join("\n");
}

function normalize(value: string) {
  return value.trim();
}

function hasAny(value: string, keywords: string[]) {
  const lower = value.toLowerCase();
  return keywords.some((keyword) => lower.includes(keyword.toLowerCase()));
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

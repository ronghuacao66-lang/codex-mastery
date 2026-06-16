"use client";

import { AlertCircle, CalendarDays, ClipboardList, FileText, RotateCcw, Sparkles, Users } from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";

type MinutesState = {
  topic: string;
  date: string;
  attendees: string;
  rawNotes: string;
};

type ActionItem = {
  task: string;
  owner: string;
  deadline: string;
  source: string;
};

const fallbackText = "待确认";

const initialState: MinutesState = {
  topic: "客户周例会 - 项目上线准备",
  date: new Date().toISOString().slice(0, 10),
  attendees: "张伟、李娜、王强、客户项目经理",
  rawNotes:
    "本次会议主要同步项目上线前准备情况，客户希望本周完成验收材料。\n结论：上线范围保持当前版本，不再临时增加新功能。\n张伟负责整理部署检查清单，周五前发给客户确认。\n李娜跟进培训材料和交付文档，截止时间待确认。\n风险：客户内网访问 Vercel 域名不稳定，可能影响演示。\n待确认：是否需要准备中国大陆可访问的备用部署地址。"
};

export function MeetingMinutesGenerator() {
  const [state, setState] = useState<MinutesState>(initialState);
  const minutes = useMemo(() => buildMinutes(state), [state]);

  function updateField(key: keyof MinutesState, value: string) {
    setState((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
      <section className="space-y-5">
        <div className="rounded-lg border border-line bg-panel p-5 shadow-soft dark:shadow-darksoft">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-ink">会议信息</p>
              <p className="mt-1 text-sm leading-6 text-muted">暂不接外部模型，所有内容由本地模板和关键词规则整理。</p>
            </div>
            <button
              type="button"
              onClick={() => setState({ topic: "", date: "", attendees: "", rawNotes: "" })}
              className="inline-flex h-9 shrink-0 items-center gap-2 rounded-md border border-line bg-surface px-3 text-sm font-medium text-muted transition hover:text-ink"
            >
              <RotateCcw className="h-4 w-4" />
              清空
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              icon={<FileText className="h-4 w-4" />}
              label="会议主题"
              value={state.topic}
              onChange={(value) => updateField("topic", value)}
              placeholder="例如：客户周例会 - 项目上线准备"
            />
            <TextField
              icon={<CalendarDays className="h-4 w-4" />}
              label="会议日期"
              value={state.date}
              onChange={(value) => updateField("date", value)}
              placeholder="例如：2026-06-16"
            />
            <div className="md:col-span-2">
              <TextField
                icon={<Users className="h-4 w-4" />}
                label="参会人"
                value={state.attendees}
                onChange={(value) => updateField("attendees", value)}
                placeholder="例如：张伟、李娜、客户项目经理"
              />
            </div>
            <div className="md:col-span-2">
              <TextAreaField
                label="原始记录"
                value={state.rawNotes}
                onChange={(value) => updateField("rawNotes", value)}
                placeholder="粘贴会议录音转写、手写纪要或聊天记录。建议包含结论、负责人、截止时间、风险和待确认事项。"
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-line bg-panel p-5 shadow-soft dark:shadow-darksoft">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent" />
            <h2 className="text-lg font-semibold text-ink">结构化检查</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Metric label="关键结论" value={minutes.conclusions.length} />
            <Metric label="行动项" value={minutes.actions.length} />
            <Metric label="风险与问题" value={minutes.risks.length + minutes.openQuestions.length} />
          </div>
          <div className="mt-4 rounded-md border border-line bg-surface p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-ink">
              <AlertCircle className="h-4 w-4 text-accent" />
              模板规则
            </p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
              <li>- 包含“结论、决定、确认、同意”等关键词的内容会进入关键结论。</li>
              <li>- 包含“负责、跟进、完成、提交、截止”等关键词的内容会进入行动项。</li>
              <li>- 未识别到负责人或截止时间时，表格会自动标注“待确认”。</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="rounded-lg border border-line bg-panel p-5 shadow-soft dark:shadow-darksoft">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-accent" />
              <h2 className="text-lg font-semibold text-ink">生成结果</h2>
            </div>
            <CopyButton value={minutes.markdown} label="复制 Markdown" />
          </div>
          <pre className="fine-scrollbar max-h-[720px] overflow-auto whitespace-pre-wrap rounded-md border border-line bg-surface p-4 text-sm leading-6 text-ink">
            {minutes.markdown}
          </pre>
        </div>
      </section>
    </div>
  );
}

function buildMinutes(state: MinutesState) {
  const topic = state.topic.trim() || fallbackText;
  const date = state.date.trim() || fallbackText;
  const attendees = state.attendees.trim() || fallbackText;
  const lines = splitNotes(state.rawNotes);
  const conclusions = pickLines(lines, ["结论", "决定", "确认", "同意", "通过", "范围", "原则", "方案"]).slice(0, 5);
  const actions = buildActionItems(lines);
  const risks = pickLines(lines, ["风险", "阻塞", "依赖", "延期", "不稳定", "不足", "争议", "成本", "权限"]).slice(0, 5);
  const openQuestions = pickLines(lines, ["待确认", "需要确认", "未定", "问题", "疑问", "是否", "能否"]).slice(0, 5);
  const finalConclusions = conclusions.length ? conclusions : buildFallbackConclusions(lines);
  const finalRisks = risks.length ? risks : ["暂无明确风险；建议会后继续确认资源、时间和外部依赖。"];
  const finalQuestions = openQuestions.length ? openQuestions : ["暂无明确待确认问题。"];
  const background = buildBackground(topic, date, attendees, lines);

  const markdown = [
    `# ${topic}会议纪要`,
    "",
    "## 基本信息",
    "",
    `- 会议主题：${topic}`,
    `- 会议日期：${date}`,
    `- 参会人：${attendees}`,
    "",
    "## 会议背景",
    "",
    background,
    "",
    "## 关键结论",
    "",
    ...finalConclusions.map((item) => `- ${cleanLine(item)}`),
    "",
    "## 行动项",
    "",
    "| 序号 | 行动项 | 负责人 | 截止时间 | 来源记录 |",
    "| --- | --- | --- | --- | --- |",
    ...actions.map((item, index) => `| ${index + 1} | ${escapeTable(item.task)} | ${escapeTable(item.owner)} | ${escapeTable(item.deadline)} | ${escapeTable(item.source)} |`),
    "",
    "## 风险",
    "",
    ...finalRisks.map((item) => `- ${cleanLine(item)}`),
    "",
    "## 待确认问题",
    "",
    ...finalQuestions.map((item) => `- ${cleanLine(item)}`)
  ].join("\n");

  return {
    conclusions: finalConclusions,
    actions,
    risks: finalRisks,
    openQuestions: finalQuestions,
    markdown
  };
}

function buildBackground(topic: string, date: string, attendees: string, lines: string[]) {
  const backgroundLine = pickLines(lines, ["背景", "目标", "目的", "本次会议", "同步", "讨论"])[0];
  if (backgroundLine) return cleanLine(backgroundLine);
  return `${date}，${attendees}围绕“${topic}”进行同步和讨论。本纪要根据原始记录整理，用于沉淀会议背景、关键结论、行动项、风险和待确认问题。`;
}

function buildFallbackConclusions(lines: string[]) {
  const candidates = lines.filter((line) => line.length >= 8).slice(0, 3);
  return candidates.length ? candidates : ["原始记录中未识别到明确结论，建议会后补充确认。"];
}

function buildActionItems(lines: string[]): ActionItem[] {
  const actionLines = pickLines(lines, ["行动", "负责", "跟进", "完成", "提交", "输出", "整理", "推进", "截止", "安排"]);
  if (!actionLines.length) {
    return [
      {
        task: "待确认后补充具体行动项",
        owner: fallbackText,
        deadline: fallbackText,
        source: "原始记录中未识别到明确行动项"
      }
    ];
  }

  return actionLines.slice(0, 8).map((line) => ({
    task: inferTask(line),
    owner: inferOwner(line),
    deadline: inferDeadline(line),
    source: cleanLine(line)
  }));
}

function inferTask(line: string) {
  return (
    cleanLine(line)
      .replace(/^(行动项|任务|安排|待办)[:：-]?/, "")
      .replace(/(负责人|责任人|owner)[:：]?\S+/gi, "")
      .replace(/(截止|截止时间|ddl|deadline)[:：]?\S+/gi, "")
      .trim() || cleanLine(line)
  );
}

function inferOwner(line: string) {
  const patterns = [
    /(?:由|请|负责人[:：]?|责任人[:：]?|owner[:：]?)([\u4e00-\u9fa5A-Za-z0-9·]{2,12})/i,
    /([\u4e00-\u9fa5A-Za-z0-9·]{2,12})(?:负责|牵头|跟进|完成|提交|输出|整理|推进)/,
    /@([\u4e00-\u9fa5A-Za-z0-9_.-]{2,24})/
  ];
  const match = patterns.map((pattern) => line.match(pattern)).find(Boolean);
  return match?.[1] ? trimPunctuation(match[1]) : fallbackText;
}

function inferDeadline(line: string) {
  const match = line.match(/(\d{4}[-/.年]\d{1,2}[-/.月]\d{1,2}日?|\d{1,2}[-/.月]\d{1,2}日?|今天|明天|后天|周[一二三四五六日天]前?|本周[一二三四五六日天]?前?|下周[一二三四五六日天]?前?|本月底|月底|下月底|会后\d+天内|T\+\d+)/);
  return match?.[1] ? trimPunctuation(match[1]) : fallbackText;
}

function splitNotes(rawNotes: string) {
  return rawNotes
    .split(/\n|；|;/)
    .map((line) => cleanLine(line))
    .filter(Boolean);
}

function pickLines(lines: string[], keywords: string[]) {
  return lines.filter((line) => keywords.some((keyword) => line.includes(keyword)));
}

function cleanLine(value: string) {
  return value.replace(/^\s*[-*•\d.、]+/, "").trim();
}

function trimPunctuation(value: string) {
  return value.replace(/[，。；、:：\s]+$/g, "").trim();
}

function escapeTable(value: string) {
  return value.replace(/\|/g, "\\|").replace(/\n/g, " ");
}

function TextField({
  icon,
  label,
  value,
  onChange,
  placeholder
}: {
  icon: ReactNode;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="flex items-center gap-2 text-sm font-semibold text-ink">
        {icon}
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 h-10 w-full rounded-md border border-line bg-surface px-3 text-sm text-ink outline-none transition placeholder:text-muted focus:border-accent"
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-ink">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={13}
        placeholder={placeholder}
        className="mt-2 w-full resize-y rounded-md border border-line bg-surface px-3 py-2 text-sm leading-6 text-ink outline-none transition placeholder:text-muted focus:border-accent"
      />
    </label>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-line bg-surface p-4">
      <p className="text-2xl font-semibold text-ink">{value}</p>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </div>
  );
}

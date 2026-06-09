import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(root, "data");
const contentDir = path.join(root, "content");

const collections = [
  ["articles.json", "Codex Academy 知识文章"],
  ["daily-plan.json", "30 天训练营"],
  ["prompts.json", "Prompt Center"],
  ["projects.json", "项目实战中心"],
  ["reviews.json", "复盘中心"],
  ["security.json", "安全售前专区"],
  ["task-presets.json", "Codex 任务生成器预设"],
  ["templates.json", "模板中心"],
  ["tools.json", "AI 工具库"],
  ["videos.json", "视频精选"],
  ["workflows.json", "工作流中心"]
];

const labels = {
  acceptanceCriteria: "验收标准",
  bestPractices: "最佳实践",
  bestScenarios: "最佳场景",
  businessValue: "业务价值",
  caseStudy: "案例",
  category: "分类",
  chapter: "章节",
  checkpoints: "检查点",
  commonMistakes: "常见错误",
  context: "上下文",
  constraints: "限制条件",
  coreConcepts: "核心概念",
  coreKnowledge: "核心知识",
  creator: "创作者",
  day: "天数",
  deliverable: "成果物",
  deliverables: "成果物",
  difficulty: "难度",
  dod: "完成标准",
  domain: "领域",
  duration: "时长",
  extensionTask: "进阶任务",
  goal: "目标",
  id: "ID",
  inputFields: "输入字段",
  inputRequirements: "输入要求",
  inputTemplate: "输入模板",
  key: "字段键",
  kind: "类型",
  learningGoal: "学习目标",
  learningOutcomes: "学习收获",
  level: "级别",
  limitations: "局限",
  name: "名称",
  noteTemplate: "笔记模板",
  optimizationTips: "优化建议",
  outcome: "输出结果",
  outputFormat: "输出格式",
  outputRequirements: "输出要求",
  outputTemplate: "输出模板",
  owner: "负责人",
  platform: "平台",
  positioning: "定位",
  practiceTask: "实操任务",
  prompt: "Prompt",
  purpose: "用途",
  readingMinutes: "阅读时长",
  recommendedWorkflow: "推荐工作流",
  reviewQuestions: "复盘问题",
  retrospectiveQuestions: "复盘问题",
  rightExample: "正确案例",
  role: "角色",
  scenario: "使用场景",
  sections: "章节结构",
  stage: "阶段",
  starterInput: "起始输入",
  state: "预设内容",
  stepByStep: "执行步骤",
  steps: "实现步骤",
  strengths: "优势",
  summary: "摘要",
  tags: "标签",
  theory: "理论",
  timebox: "建议用时",
  title: "标题",
  topic: "主题",
  trigger: "触发条件",
  url: "链接",
  verification: "验证方式",
  whyWatch: "推荐理由",
  workflow: "工作流",
  wrongExample: "错误案例"
};

function labelFor(key) {
  return labels[key] ?? key;
}

function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isScalar(value) {
  return value === null || ["string", "number", "boolean"].includes(typeof value);
}

function scalarToText(value) {
  if (value === null) return "无";
  return String(value);
}

function renderScalar(value) {
  const text = scalarToText(value);
  if (text.length > 120 || text.includes("\n")) {
    return ["", text, ""];
  }
  return [text];
}

function renderArray(values, depth) {
  if (values.length === 0) return ["- 无"];
  if (values.every(isScalar)) {
    return values.map((value) => `- ${scalarToText(value)}`);
  }

  return values.flatMap((value, index) => {
    if (isRecord(value)) {
      const title = value.name ?? value.title ?? value.id ?? `项目 ${index + 1}`;
      return [`${"#".repeat(depth)} ${title}`, "", ...renderRecord(value, depth + 1)];
    }
    return renderValue(value, depth);
  });
}

function renderRecord(record, depth) {
  return Object.entries(record).flatMap(([key, value]) => {
    if (key === "id" || key === "title" || value === undefined) return [];

    const label = labelFor(key);
    if (isScalar(value)) {
      const rendered = renderScalar(value);
      if (rendered.length === 1) return [`**${label}:** ${rendered[0]}`, ""];
      return [`**${label}:**`, ...rendered, ""];
    }

    return [`**${label}:**`, "", ...renderValue(value, depth), ""];
  });
}

function renderValue(value, depth) {
  if (Array.isArray(value)) return renderArray(value, depth);
  if (isRecord(value)) return renderRecord(value, depth);
  return renderScalar(value);
}

function titleOf(item, index) {
  if (isRecord(item)) {
    if (typeof item.day === "number") return `Day ${item.day} · ${item.title ?? ""}`.trim();
    return String(item.title ?? item.name ?? item.id ?? `条目 ${index + 1}`);
  }
  return `条目 ${index + 1}`;
}

function slugFromFile(filename) {
  return filename.replace(/\.json$/, ".md");
}

async function exportCollection(filename, title) {
  const raw = await readFile(path.join(dataDir, filename), "utf8");
  const data = JSON.parse(raw);
  const items = Array.isArray(data) ? data : Object.values(data);
  const lines = [
    `# ${title}`,
    "",
    `> 本文件由 \`npm run export:content\` 从 \`data/${filename}\` 生成。JSON 是页面渲染的数据源，Markdown 是可读备份。`,
    "",
    `共 ${items.length} 条内容。`,
    ""
  ];

  items.forEach((item, index) => {
    lines.push(`## ${titleOf(item, index)}`, "");
    if (isRecord(item)) {
      lines.push(...renderRecord(item, 3));
    } else {
      lines.push(...renderValue(item, 3), "");
    }
  });

  await writeFile(path.join(contentDir, slugFromFile(filename)), `${lines.join("\n").replace(/\n{4,}/g, "\n\n\n")}\n`, "utf8");
}

async function main() {
  await mkdir(contentDir, { recursive: true });
  await Promise.all(collections.map(([filename, title]) => exportCollection(filename, title)));

  const indexLines = [
    "# Codex Mastery 内容备份",
    "",
    "本目录保存从 `data/*.json` 导出的 Markdown 内容，便于人工审阅、GitHub diff 和内容备份。",
    "",
    "## 生成方式",
    "",
    "```bash",
    "npm run export:content",
    "```",
    "",
    "## 内容文件",
    "",
    ...collections.map(([filename, title]) => `- [${title}](./${slugFromFile(filename)})：来自 \`data/${filename}\``),
    "",
    "维护原则：优先修改 `data/*.json`，再运行导出命令同步 `content/*.md`。"
  ];

  await writeFile(path.join(contentDir, "README.md"), `${indexLines.join("\n")}\n`, "utf8");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

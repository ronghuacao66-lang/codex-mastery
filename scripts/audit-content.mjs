import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const dataFiles = {
  articles: "data/articles.json",
  dailyPlan: "data/daily-plan.json",
  prompts: "data/prompts.json",
  projects: "data/projects.json",
  reviews: "data/reviews.json",
  security: "data/security.json",
  taskPresets: "data/task-presets.json",
  templates: "data/templates.json",
  tools: "data/tools.json",
  videos: "data/videos.json",
  workflows: "data/workflows.json"
};

const contentFiles = [
  "content/README.md",
  "content/articles.md",
  "content/daily-plan.md",
  "content/prompts.md",
  "content/projects.md",
  "content/reviews.md",
  "content/security.md",
  "content/task-presets.md",
  "content/templates.md",
  "content/tools.md",
  "content/videos.md",
  "content/workflows.md"
];

const requiredCounts = [
  ["Codex prompts", (data) => data.prompts.filter((item) => item.kind === "codex").length, 30],
  ["AI prompts", (data) => data.prompts.filter((item) => item.kind === "ai").length, 20],
  ["Daily plan days", (data) => data.dailyPlan.length, 30],
  ["Projects", (data) => data.projects.length, 8],
  ["Workflows", (data) => data.workflows.length, 5],
  ["Templates", (data) => data.templates.length, 5],
  ["Articles", (data) => data.articles.length, 10],
  ["Videos", (data) => data.videos.length, 10],
  ["Tools", (data) => data.tools.length, 7]
];

const fieldRules = [
  ["prompts", ["id", "kind", "title", "category", "difficulty", "scenario", "prompt", "inputRequirements", "outputRequirements", "bestPractices", "tags"]],
  ["dailyPlan", ["day", "title", "learningGoal", "theory", "practiceTask", "prompt", "deliverable", "retrospectiveQuestions", "tags"]],
  ["projects", ["id", "title", "category", "difficulty", "duration", "goal", "businessValue", "steps", "prompt", "optimizationTips", "deliverables", "deliveryChecklist", "tags"]],
  ["workflows", ["id", "title", "owner", "trigger", "outcome", "steps", "prompt", "checkpoints", "tags"]],
  ["templates", ["id", "title", "category", "purpose", "sections", "prompt", "outputFormat", "tags"]],
  ["articles", ["id", "chapter", "title", "summary", "readingMinutes", "level", "coreKnowledge", "wrongExample", "rightExample", "bestPractices", "tags"]],
  ["videos", ["id", "title", "platform", "creator", "url", "duration", "stage", "topic", "summary", "whyWatch", "learningOutcomes", "noteTemplate", "linkStatus", "tags"]],
  ["tools", ["id", "name", "positioning", "strengths", "limitations", "bestScenarios", "recommendedWorkflow", "tags"]],
  ["security", ["id", "title", "domain", "scenario", "prompt", "inputTemplate", "outputTemplate", "caseStudy", "tags"]],
  ["reviews", ["id", "title", "scenario", "owner", "cadence", "goal", "inputFields", "reviewQuestions", "outputSections", "codexPrompt", "bestPractices", "tags"]],
  ["taskPresets", ["id", "title", "tags", "state"]]
];

const taskStateFields = ["role", "goal", "context", "constraints", "dod", "outputFormat", "verification"];

const failures = [];
const warnings = [];

function fail(message) {
  failures.push(message);
}

function warn(message) {
  warnings.push(message);
}

async function readJson(relativePath) {
  const raw = await readFile(path.join(root, relativePath), "utf8");
  return JSON.parse(raw);
}

function isNonEmpty(value) {
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value === "boolean") return true;
  if (Array.isArray(value)) return value.length > 0;
  if (value && typeof value === "object") return Object.keys(value).length > 0;
  return false;
}

function checkCollectionFields(name, items, fields) {
  if (!Array.isArray(items)) {
    fail(`${name} must be an array`);
    return;
  }

  items.forEach((item, index) => {
    fields.forEach((field) => {
      if (!isNonEmpty(item?.[field])) {
        fail(`${name}[${index}].${field} is empty`);
      }
    });
  });
}

function checkNestedContent(data) {
  data.projects.forEach((project, projectIndex) => {
    project.deliveryChecklist.forEach((checkpoint, checkpointIndex) => {
      ["id", "title", "acceptance", "evidence"].forEach((field) => {
        if (!isNonEmpty(checkpoint[field])) {
          fail(`projects[${projectIndex}].deliveryChecklist[${checkpointIndex}].${field} is empty`);
        }
      });
    });
  });

  data.templates.forEach((template, templateIndex) => {
    template.sections.forEach((section, sectionIndex) => {
      if (!isNonEmpty(section.name)) {
        fail(`templates[${templateIndex}].sections[${sectionIndex}].name is empty`);
      }
      if (!isNonEmpty(section.fields)) {
        fail(`templates[${templateIndex}].sections[${sectionIndex}].fields is empty`);
      }
    });
  });

  data.taskPresets.forEach((preset, presetIndex) => {
    taskStateFields.forEach((field) => {
      if (!isNonEmpty(preset.state?.[field])) {
        fail(`taskPresets[${presetIndex}].state.${field} is empty`);
      }
    });
  });
}

function checkVideoPolicy(videos) {
  videos.forEach((video, index) => {
    if (video.platform !== "Bilibili") {
      fail(`videos[${index}].platform must be Bilibili`);
    }
    if (!String(video.url).startsWith("https://www.bilibili.com/video/BV")) {
      fail(`videos[${index}].url must be a Bilibili BV video URL`);
    }
    if (video.linkStatus?.status !== "ok") {
      fail(`videos[${index}].linkStatus.status must be ok`);
    }
  });
}

async function checkFilesExist(files) {
  await Promise.all(
    files.map(async (relativePath) => {
      try {
        await access(path.join(root, relativePath));
      } catch {
        fail(`${relativePath} is missing`);
      }
    })
  );
}

async function checkContentBackups(data) {
  const markdownFiles = (await readdir(path.join(root, "content"))).filter((file) => file.endsWith(".md"));
  if (markdownFiles.length !== contentFiles.length) {
    warn(`content contains ${markdownFiles.length} Markdown files; expected ${contentFiles.length}`);
  }

  const expectedCounts = {
    "articles.md": data.articles.length,
    "daily-plan.md": data.dailyPlan.length,
    "prompts.md": data.prompts.length,
    "projects.md": data.projects.length,
    "reviews.md": data.reviews.length,
    "security.md": data.security.length,
    "task-presets.md": data.taskPresets.length,
    "templates.md": data.templates.length,
    "tools.md": data.tools.length,
    "videos.md": data.videos.length,
    "workflows.md": data.workflows.length
  };

  await Promise.all(
    Object.entries(expectedCounts).map(async ([filename, count]) => {
      const body = await readFile(path.join(root, "content", filename), "utf8");
      if (!body.includes("本文件由 `npm run export:content`")) {
        fail(`content/${filename} is missing generated-file marker`);
      }
      if (!body.includes(`共 ${count} 条内容。`)) {
        fail(`content/${filename} count does not match data source count ${count}`);
      }
    })
  );
}

const data = {};
await checkFilesExist([...Object.values(dataFiles), ...contentFiles]);

for (const [key, relativePath] of Object.entries(dataFiles)) {
  try {
    data[key] = await readJson(relativePath);
  } catch (error) {
    fail(`${relativePath} cannot be parsed: ${error.message}`);
  }
}

if (failures.length === 0) {
  requiredCounts.forEach(([label, getCount, expected]) => {
    const actual = getCount(data);
    if (actual < expected) fail(`${label} count ${actual} is lower than required ${expected}`);
  });

  fieldRules.forEach(([name, fields]) => checkCollectionFields(name, data[name], fields));
  checkNestedContent(data);
  checkVideoPolicy(data.videos);
  await checkContentBackups(data);
}

if (warnings.length) {
  warnings.forEach((message) => console.warn(`WARN\t${message}`));
}

if (failures.length) {
  failures.forEach((message) => console.error(`FAIL\t${message}`));
  console.error(`\nContent audit failed: ${failures.length} issue(s).`);
  process.exit(1);
}

console.log("Content audit passed.");
console.log(`- Prompts: ${data.prompts.length} total, ${data.prompts.filter((item) => item.kind === "codex").length} Codex, ${data.prompts.filter((item) => item.kind === "ai").length} AI`);
console.log(`- Daily plan: ${data.dailyPlan.length} days`);
console.log(`- Projects: ${data.projects.length}`);
console.log(`- Workflows: ${data.workflows.length}`);
console.log(`- Templates: ${data.templates.length}`);
console.log(`- Articles: ${data.articles.length}`);
console.log(`- Videos: ${data.videos.length} Bilibili`);
console.log(`- Content backups: ${contentFiles.length} Markdown files`);

import articlesRaw from "@/data/articles.json";
import dailyPlanRaw from "@/data/daily-plan.json";
import projectsRaw from "@/data/projects.json";
import promptsRaw from "@/data/prompts.json";
import securityRaw from "@/data/security.json";
import taskPresetsRaw from "@/data/task-presets.json";
import templatesRaw from "@/data/templates.json";
import toolsRaw from "@/data/tools.json";
import videosRaw from "@/data/videos.json";
import workflowsRaw from "@/data/workflows.json";
import type {
  ArticleItem,
  DailyPlanItem,
  ProjectItem,
  PromptItem,
  SecurityScenario,
  TaskBuilderPreset,
  TemplateItem,
  ToolItem,
  VideoItem,
  WorkflowItem
} from "@/types/content";

export const articles = articlesRaw as ArticleItem[];
export const dailyPlan = dailyPlanRaw as DailyPlanItem[];
export const projects = projectsRaw as ProjectItem[];
export const prompts = promptsRaw as PromptItem[];
export const securityScenarios = securityRaw as SecurityScenario[];
export const taskPresets = taskPresetsRaw as TaskBuilderPreset[];
export const templates = templatesRaw as TemplateItem[];
export const tools = toolsRaw as ToolItem[];
export const videos = videosRaw as VideoItem[];
export const workflows = workflowsRaw as WorkflowItem[];

export const codexPrompts = prompts.filter((prompt) => prompt.kind === "codex");
export const aiPrompts = prompts.filter((prompt) => prompt.kind === "ai");

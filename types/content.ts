export type Difficulty = "入门" | "进阶" | "高阶";

export type PromptKind = "codex" | "ai";

export type PromptItem = {
  id: string;
  kind: PromptKind;
  title: string;
  category: string;
  difficulty: Difficulty;
  scenario: string;
  prompt: string;
  inputRequirements: string[];
  outputRequirements: string[];
  bestPractices: string[];
  tags: string[];
};

export type ProjectItem = {
  id: string;
  title: string;
  category: string;
  difficulty: Difficulty;
  duration: string;
  goal: string;
  businessValue: string;
  steps: string[];
  prompt: string;
  optimizationTips: string[];
  deliverables: string[];
  tags: string[];
};

export type WorkflowItem = {
  id: string;
  title: string;
  owner: string;
  trigger: string;
  outcome: string;
  steps: string[];
  prompt: string;
  checkpoints: string[];
  tags: string[];
};

export type TemplateItem = {
  id: string;
  title: string;
  category: string;
  purpose: string;
  sections: {
    name: string;
    fields: string[];
  }[];
  prompt: string;
  outputFormat: string;
  tags: string[];
};

export type ArticleItem = {
  id: string;
  chapter: number;
  title: string;
  summary: string;
  readingMinutes: number;
  level: Difficulty;
  coreKnowledge: string[];
  wrongExample: string;
  rightExample: string;
  bestPractices: string[];
  tags: string[];
};

export type DailyPlanItem = {
  day: number;
  title: string;
  timebox?: string;
  learningGoal: string;
  theory: string;
  coreConcepts?: string[];
  practiceTask: string;
  stepByStep?: string[];
  starterInput?: string[];
  prompt: string;
  deliverable: string;
  acceptanceCriteria?: string[];
  commonMistakes?: string[];
  extensionTask?: string;
  retrospectiveQuestions: string[];
  tags: string[];
};

export type SecurityScenario = {
  id: string;
  title: string;
  domain: "零信任" | "SASE" | "数据安全" | "XDR" | "MSS";
  scenario: string;
  prompt: string;
  inputTemplate: string[];
  outputTemplate: string[];
  caseStudy: string;
  tags: string[];
};

export type ToolItem = {
  id: string;
  name: string;
  positioning: string;
  strengths: string[];
  limitations: string[];
  bestScenarios: string[];
  recommendedWorkflow: string;
  tags: string[];
};

export type VideoItem = {
  id: string;
  title: string;
  platform: "Bilibili" | "OpenAI Academy";
  creator: string;
  url: string;
  duration: string;
  stage: "入门" | "进阶" | "高阶";
  topic: string;
  summary: string;
  whyWatch: string;
  learningOutcomes: string[];
  noteTemplate: string;
  linkStatus?: {
    status: "ok";
    checkedAt: string;
    httpCode?: string;
    note: string;
  };
  tags: string[];
};

export type TaskBuilderState = {
  role: string;
  goal: string;
  context: string;
  constraints: string;
  dod: string;
  outputFormat: string;
  verification: string;
};

export type TaskBuilderPreset = {
  id: string;
  title: string;
  tags: string[];
  state: TaskBuilderState;
};

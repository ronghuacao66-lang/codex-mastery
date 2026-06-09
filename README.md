# Codex Mastery

`Codex Mastery` 是一个面向中国用户的中文 Codex 学习与实战平台。它不是 AI 导航站、AI 资讯站、AI 百科站、工具收录站或普通课程页，而是一个以 `Learn Codex By Building` 为核心的 30 天实战控制台。

用户可以通过本项目学习 Codex 任务拆解、Prompt 设计、项目开发、Agent 原型、工作流自动化和安全售前场景落地。

## 功能模块

- 首页：Codex 学习控制台，包含今日任务、今日最佳 Prompt、本周项目、学习进度、热门工作流和挑战任务。
- Codex Academy：10 篇中文知识文章，覆盖 Codex 基础、工具对比、GCCD、任务拆解、AGENTS.md、项目管理、Debug、Agent 和效率提升。
- Codex 任务生成器：把模糊需求整理成 Goal、Context、Constraint、Definition of Done 和 Verification。
- Prompt Center：30 条 Codex Prompt 和 22 条通用 AI Prompt，支持搜索、筛选、收藏和复制。
- 视频精选：只保留 Bilibili 中当前确认存在的教学视频清单。
- 30 天训练营：Day 1-Day 30，每天包含学习目标、理论、实操任务、Prompt、成果物和复盘问题。
- 学习进度中心：管理 30 天完成状态、周进度、下一步任务和可复制的学习进度报告。
- 复盘中心：把每日训练、Prompt 迭代、项目交付、Bug 修复和安全售前拜访沉淀成复盘报告，支持保存历史、导出 Markdown 和重新导入继续编辑。
- 项目实战中心：8 个高价值项目，包括 AI 学习助手、AI 知识库、AI 售前助手、客户画像助手、竞品分析助手、会议纪要助手、方案生成助手、Agent 助手，并提供可勾选交付检查清单、项目详情页和执行记录 Markdown 导出。
- 安全售前专区：面向零信任、SASE、数据安全、XDR、MSS 的售前 Prompt 和模板。
- 工作流中心：客户拜访、售前方案、竞品分析、项目复盘、会议纪要 5 套工作流。
- 模板中心：客户分析、竞品分析、项目复盘、售前方案、Prompt 设计 5 套模板。
- AI 工具库：ChatGPT、Codex、Claude、Gemini、Cursor、Claude Code、NotebookLM 的定位、优势、局限和推荐工作流。

## 技术栈

- Next.js App Router
- React
- TypeScript
- TailwindCSS
- 本地 JSON + Markdown 内容

## 本地运行

```bash
npm install
npm run dev
```

默认访问：

```bash
http://localhost:3000
```

## 构建验证

```bash
npm run typecheck
npm run lint
npm run audit:videos
npm run build
```

本地同时开着 `npm run dev` 时，不建议直接执行生产构建检查，因为 dev server 和 `next build` 都会读写 `.next`。如果构建后 `localhost:3000` 短暂出现 500，按下面方式恢复：

```bash
# 先停止 npm run dev
rm -rf .next
npm run dev
```

## 内容存储

页面渲染数据集中存放在 `data/*.json`：

- `data/articles.json`：Codex Academy 文章。
- `data/daily-plan.json`：30 天训练营。
- `data/prompts.json`：Codex Prompt 和 AI Prompt。
- `data/projects.json`：项目实战中心。
- `data/reviews.json`：复盘中心。
- `data/security.json`：安全售前专区。
- `data/task-presets.json`：Codex 任务生成器预设。
- `data/templates.json`：模板中心。
- `data/tools.json`：AI 工具库。
- `data/videos.json`：视频精选。
- `data/workflows.json`：工作流中心。

可读备份存放在 `content/*.md`。修改 JSON 后运行：

```bash
npm run export:content
```

该命令会从 `data/*.json` 重新生成 `content/*.md`，便于 GitHub diff、人工审阅和内容备份。

视频资源要求当前可访问。新增或替换视频后运行：

```bash
npm run audit:videos
```

如果巡检失败，需要删除或替换不可访问视频，再部署。

## Vercel 部署

本项目符合 GitHub + Vercel 直接部署要求：

- 不依赖数据库。
- 不依赖私有环境变量。
- 不需要自定义服务器。
- 使用 `npm run build` 完成生产构建。
- Vercel Framework Preset 选择 `Next.js`。
- Node.js 版本建议 `20.x` 或更高。

详细部署步骤见 [DEPLOY.md](./DEPLOY.md)。

## 维护原则

- 中文主体，面向中国用户。
- 不写占位内容，内容必须可学习、可复制、可实践。
- 新增内容优先写入 `data/*.json`，再同步导出 `content/*.md`。
- 页面组件只负责渲染、搜索、筛选、收藏、复制等交互。
- 提交 GitHub 前至少执行 `npm run typecheck`、`npm run lint`、`npm run build`。

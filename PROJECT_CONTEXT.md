# PROJECT_CONTEXT

## 项目名称

Codex Mastery

## 项目定位

面向中文用户的 Codex / AI 工作流学习与实践站点，采用内容数据驱动方式展示 Academy、Prompts、Projects、Tools、Templates、Workflows、Security Presales、Videos、Bootcamp、Task Builder 等模块。

## 技术栈

- Next.js App Router
- React
- TypeScript
- TailwindCSS
- 本地 JSON 数据文件

## 目录约定

- `app/`：页面路由和全局布局。
- `components/`：可复用 UI 与客户端交互组件。
- `data/`：站点内容 JSON 数据。
- `content/`：由数据导出的 Markdown 内容。
- `lib/`：内容加载和通用工具函数。
- `types/`：内容数据类型。
- `scripts/`：内容导出等辅助脚本。

## 项目规则

- 主要语言为中文。
- UI 风格保持极简、专业、克制，参考 Apple、OpenAI、Linear。
- 新增内容优先写入 `data/*.json`，再通过类型和组件渲染。
- 修改后优先执行 `npm run typecheck`、`npm run lint`、`npm run build`。

## 当前可信来源

- 本文件及 `TASK_STATE.md`、`DECISIONS.md`、`CHANGELOG_AI.md` 为项目状态可信来源。
- 当前目录已初始化为 Git 仓库，主分支为 `main`，远程为 `git@github.com:ronghuacao66-lang/codex-mastery.git`。
- 当前公网部署地址为 `https://ronghuacao66-lang-codex-mastery.vercel.app`。

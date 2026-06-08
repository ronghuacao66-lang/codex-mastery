# DECISIONS

## 2026-06-08 初始化项目记忆机制

### 决策内容

在项目根目录创建并维护 `PROJECT_CONTEXT.md`、`TASK_STATE.md`、`DECISIONS.md`、`CHANGELOG_AI.md`。

### 决策原因

用户提供的项目规则要求优先保证项目状态不丢失，并支持会话压缩、切换账号、切换模型或系统重启后的持续接管。

### 被否决方案

- 仅依赖聊天上下文：不符合项目规则，且无法跨会话可靠恢复。
- 仅依赖 Git 历史：当前目录不是 Git 仓库，无法使用。

### 后续影响

- 后续每次阶段性进展都需要更新 `TASK_STATE.md`。
- 重要架构、数据、API、权限、部署和技术选型决策需要记录到本文件。
- 修改代码或内容时需要同步更新 `CHANGELOG_AI.md`。

## 2026-06-08 切换为项目执行负责人工作流

### 决策内容

从本轮开始，按用户确认的项目执行负责人流程推进项目：

- 先理解需求、识别缺失信息和风险。
- 大规模开发前输出计划并等待确认。
- 一次只执行一个明确任务。
- 每个任务结束后更新 `PROJECT_STATE.md`。
- 重要产品、技术和流程决策继续记录到 `DECISIONS.md`。
- 任务变长或上下文风险升高时创建 `HANDOVER.md`。

### 决策原因

当前项目已经具备可运行基础，但后续还涉及内容质量、交互体验、部署和持续维护。若继续以快速改代码方式推进，容易出现状态丢失、目标漂移和变更不可追溯的问题。

### 被否决方案

- 直接继续重构页面：未经过用户确认，且会扩大风险。
- 删除旧状态文件：可能丢失历史上下文。
- 同时推进多个大型任务：不符合用户要求的一次一个任务原则。

### 后续影响

- `PROJECT_STATE.md` 成为当前项目状态的主记录。
- `TASK_STATE.md` 作为历史兼容文件保留，但不再作为唯一状态源。
- 后续每次任务结束必须更新 `PROJECT_STATE.md`。
- 大范围功能、架构、部署或内容策略调整前必须先确认。

## 2026-06-08 明确本地构建与开发服务隔离规则

### 决策内容

本地执行生产构建检查时，优先停止 `npm run dev`，再运行 `npm run build`。如果构建后 `localhost:3000` 出现 500，按以下方式恢复：

```bash
rm -rf .next
npm run dev
```

### 决策原因

健康检查中发现：`next dev` 与 `next build` 同时读写 `.next` 时，开发服务可能出现 React Server Components manifest 不一致，导致首页短暂 500。干净构建和生产服务验证均通过，说明不是业务代码错误，而是本地运行流程问题。

### 被否决方案

- 忽略该问题：会导致用户再次遇到“网址打不开”。
- 修改业务代码规避：根因不在页面代码，修改业务代码会引入无关风险。
- 删除生产构建检查：会降低 Vercel 部署前的质量把关。

### 后续影响

- README 和 DEPLOY 已记录恢复方法。
- 后续健康检查需要区分 dev server 验证和生产构建验证。
- 结束任务前必须保证 `localhost:3000` 恢复可访问。

## 2026-06-08 首页学习进度增加撤销入口

### 决策内容

首页学习进度保留“完成 Day X”的主操作，并新增“撤销最近完成”次级操作。Prompt 统计从固定数字改为基于 `prompts` 数据动态计算。

### 决策原因

移动端与交互体验检查发现：首页完成 Day 1 后会直接推进到 Day 2，用户缺少可见的撤销入口。动态统计可以避免 `data/prompts.json` 已有 22 条 AI Prompt 但首页仍显示 20 的数据不一致。

### 被否决方案

- 保持原样：用户误点后无法从首页直接恢复。
- 做复杂日历式进度管理：超出本轮检查范围，会扩大改动。
- 继续写死统计数字：后续内容扩展时容易再次不一致。

### 后续影响

- 首页进度交互更可恢复。
- 首页统计会随数据变化自动更新。
- 后续如需要完整进度管理，可在确认后单独设计“进度中心”。

## 2026-06-08 本地 Git 初始化并暂缓远程创建

### 决策内容

在当前项目目录初始化本地 Git 仓库，使用 `main` 作为默认分支，并配置仓库本地提交身份：

```text
Codex Mastery <codex-mastery@local>
```

远程 GitHub 仓库创建和 push 暂缓，等待 GitHub CLI 安装/登录，或等待用户提供 GitHub 空仓库地址。

### 决策原因

用户已授权执行本地 Git 初始化和首次提交，但本机未安装 `gh` GitHub CLI，无法直接检查登录状态、创建 GitHub 仓库或推送。创建 GitHub 账号涉及第三方注册、邮箱/手机号/验证码和服务条款确认，不能由我代替用户完成。

### 被否决方案

- 继续尝试创建 GitHub 账号：涉及用户身份和第三方账号注册，不适合由自动化代办。
- 修改全局 Git 用户配置：会影响用户机器上的其他项目。
- 在没有远程仓库地址的情况下猜测 push 目标：不可执行且风险高。

### 后续影响

- 当前项目从本地 Git 历史开始受保护。
- 如果后续安装并登录 `gh`，可以继续自动创建仓库并推送。
- 如果用户提供 GitHub 空仓库 URL，可以直接配置 `origin` 并推送。

## 2026-06-08 调整本机电源策略以支持 Codex 长任务

### 决策内容

按用户要求，在本机 macOS 上通过 `pmset` 调整电源策略，降低 Codex 长任务因合盖或空闲睡眠中断的风险：

```bash
pmset -a sleep 0 displaysleep 0 disksleep 0 disablesleep 1
```

### 决策原因

用户希望 MacBook 合盖后不影响 Codex 继续运行任务。Codex 当前虽持有空闲睡眠断言，但空闲睡眠断言通常不能完全覆盖合盖触发的系统睡眠，因此需要系统级电源策略配合。

### 被否决方案

- 仅依赖 Codex 进程的 `NoIdleSleepAssertion`：只能降低空闲睡眠风险，不能充分保证合盖场景。
- 仅运行 `caffeinate`：适合临时防止空闲睡眠，但对合盖场景不如系统级策略明确。
- 安装第三方常驻工具：当前需求可先通过 macOS 原生命令满足，无需引入额外依赖。

### 后续影响

- 合盖长时间运行会增加发热和耗电风险，建议连接电源并保持散热。
- 如需恢复默认电源策略，可运行 `sudo pmset restoredefaults`。
- 后续长任务前可用 `pmset -g custom` 和 `pmset -g assertions` 检查当前状态。

## 2026-06-09 Vercel 直接部署策略

### 决策内容

在 GitHub push 仍受认证阻塞时，优先尝试通过 Vercel CLI 直接从本地项目部署到已有 Vercel 项目 `crh-s-projects/codex-mastery`。CLI 通过 `npx --yes vercel@latest` 启动，不要求全局安装。

### 决策原因

用户要求接管 Vercel 项目并完成公网部署。当前本地项目已经通过 `npm run typecheck`、`npm run lint` 和 `npm run build`，代码本身具备部署条件；GitHub 自动推送暂时卡在认证层，因此 Vercel CLI 直传是最短可行路径。

### 被否决方案

- 在聊天中索要 Vercel 密码、验证码或长期 token：风险过高，不符合账号安全原则。
- 绕过 Vercel 官方授权流程：不可接受。
- 在未完成本地构建验证前直接部署：会把可在本地发现的问题推到公网环境。

### 后续影响

- 部署前继续以本地质量门禁为准：`npm run typecheck`、`npm run lint`、`npm run build`。
- 如果 Vercel CLI 未登录，需要用户在 Vercel 官方授权页面完成确认，或由用户本人创建临时 `VERCEL_TOKEN`。
- 部署成功后需要验证公网 URL 返回 200，并更新 `PROJECT_STATE.md`、`TASK_STATE.md`、`CHANGELOG_AI.md`。

## 2026-06-09 使用 vercel.json 固定 Next.js 部署配置

### 决策内容

在项目根目录新增 `vercel.json`，显式声明：

- `framework`: `nextjs`
- `buildCommand`: `npm run build`
- `installCommand`: `npm install`
- `outputDirectory`: `null`

并通过 `vercel deploy --prod --yes --force --scope crh-s-projects` 重新部署到 `crh-s-projects/ronghuacao66-lang-codex-mastery`。

### 决策原因

Vercel 项目远端设置显示 `Framework Preset: Other`，输出目录为“存在 `public` 则使用 `public`，否则使用 `.`”。这会让 Next.js App Router 项目有被当成普通静态项目处理的风险，表现为主域名显示 `404: NOT_FOUND`。仓库内 `vercel.json` 可以把部署配置固化到代码中，避免 GitHub 导入或后续部署时丢失 Next.js 框架识别。

### 被否决方案

- 只依赖 Vercel Dashboard 手动设置：不可追溯，且后续换账号或重新导入时容易丢失。
- 只重新部署不改配置：可能再次生成错误产物或错误路由。
- 将项目改为静态导出：当前应用使用 Next.js App Router，无需为了部署绕开框架能力。

### 后续影响

- `vercel.json` 必须提交到 GitHub。
- 后续 Vercel 自动部署应读取该文件并按 Next.js 构建。
- Vercel Dashboard 仍可能显示项目级 `Framework Preset: Other`，但仓库配置优先保障部署产物正确。

## 2026-06-09 合并 GitHub 网页上传历史但保留本地正确结构

### 决策内容

远程 GitHub 仓库 `origin/main` 可读取，但其历史来自网页上传，当前文件位于旧的 `codex-mastery-github-ready/` 嵌套目录，并包含旧 zip。为了后续可以普通 push，本地执行：

```bash
git merge --allow-unrelated-histories -s ours origin/main -m "Merge remote upload history"
```

该合并记录远程历史为第二父提交，但保留本地正确项目根目录结构。

### 决策原因

本地历史和远程网页上传历史无共同祖先。若不处理，后续即使 GitHub 凭据可用，普通 push 也会因非 fast-forward 被拒绝；若直接强推，会覆盖远程历史。`ours` 合并可以保留远程历史，同时让本地 `main` 成为远程 `main` 的后代。

### 被否决方案

- 强推覆盖远程：风险更高，不符合默认安全策略。
- 合并远程文件树：会把旧的嵌套目录和 zip 带回项目，破坏根目录结构。
- 继续只提供手动上传包：无法形成可追溯 GitHub 提交历史。

### 后续影响

- 后续 GitHub 凭据可用后，`git push -u origin main` 应可作为 fast-forward push 执行。
- push 成功后，远程仓库根目录会变为当前正确项目结构，并包含 `vercel.json`。

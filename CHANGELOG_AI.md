# CHANGELOG_AI

## 2026-06-09 00:58 定位 Vercel 404 与 macOS 权限阻塞

### 修改文件

- `PROJECT_STATE.md`
- `TASK_STATE.md`
- `HANDOVER.md`
- `CHANGELOG_AI.md`

### 修改内容

- 根据用户截图修正目标 Vercel 项目为 `crh-s-projects/ronghuacao66-lang-codex-mastery`。
- 记录公网地址 `https://ronghuacao66-lang-codex-mastery.vercel.app` 当前显示 `404: NOT_FOUND`。
- 记录 Vercel CLI 设备授权页已打开，验证码 `TJVP-JCLJ` 正确，页面存在 `Allow` 授权按钮。
- 记录当前 macOS 弹窗要求用户允许 `Codex.app` 控制 `Google Chrome.app`，否则无法继续点击 Vercel 授权按钮。
- 记录自动点击 macOS 权限弹窗未生效，需要用户手动点击蓝色“允许”。

### 修改原因

用户反馈公网地址无法打开并要求直接修复。排查确认本地构建已通过，公网不可用的直接原因是 Vercel 尚未完成有效部署；当前推进部署时被本机 macOS 权限确认阻塞。

### 风险说明

- 不点击 macOS “允许”就无法使用浏览器登录态完成 Vercel CLI 授权。
- 即使允许 Chrome 控制，后续 Vercel 页面仍可能需要用户本人完成密码、验证码或安全确认。

## 2026-06-09 00:48 Vercel 部署前验证与上下文交接保护

### 修改文件

- `eslint.config.mjs`
- `HANDOVER.md`
- `PROJECT_STATE.md`
- `TASK_STATE.md`
- `DECISIONS.md`
- `CHANGELOG_AI.md`

### 修改内容

- 新增 `HANDOVER.md`，记录当前部署状态、已完成内容、未完成内容、风险和下一步计划。
- 将 ESLint 忽略范围补充为包含 `release/**`，避免备用交付目录影响 `npm run lint`。
- 记录 2026-06-09 部署前验证结果：`npm run typecheck`、`npm run lint`、`npm run build` 均通过。
- 记录 Vercel CLI `54.9.1` 可通过 `npx --yes vercel@latest` 启动。
- 记录 Vercel CLI 当前无本机凭据，设备授权流程未完成，公网部署暂时阻塞于账号认证。
- 在决策记录中补充 Vercel 直接部署策略。

### 修改原因

用户要求接管 Vercel 项目并完成部署，同时要求不要丢失上下文。当前系统级上下文压缩不可由模型关闭，因此用项目文件固化部署状态和下一步动作。

### 风险说明

- Vercel 账号认证需要用户在官方页面完成，不能在聊天中索要或保存密码、验证码或长期 token。
- 当前尚未完成 `vercel deploy --prod`，不能视为已获得公网访问地址。

## 2026-06-08 19:35 设置本机电源策略支持 Codex 长任务

### 修改文件

- `TASK_STATE.md`
- `PROJECT_STATE.md`
- `DECISIONS.md`
- `CHANGELOG_AI.md`

### 修改内容

- 记录本机 macOS 电源策略已调整为降低 Codex 长任务因合盖或空闲睡眠中断的风险。
- 记录 `pmset` 验证结果：Battery Power 与 AC Power 下 `sleep`、`displaysleep`、`disksleep` 均为 `0`。
- 在决策记录中补充本次系统级电源策略选择、原因、被否决方案和后续影响。

### 修改原因

用户要求设置 MacBook 合盖后不影响 Codex 继续运行任务；项目规则要求重要状态和决策可持久化、可接管。

### 风险说明

- 合盖长时间运行可能导致发热和耗电增加，建议连接电源并保持散热。
- 该设置为本机系统级配置，不属于业务代码变更。

## 2026-06-08 16:30 初始化项目记忆文件

### 修改文件

- `PROJECT_CONTEXT.md`
- `TASK_STATE.md`
- `DECISIONS.md`
- `CHANGELOG_AI.md`

### 修改内容

- 新增项目上下文、任务状态、决策记录和 AI 修改日志文件。
- 记录当前项目技术栈、目录约定、恢复状态、用户输入不确定性和后续计划。

### 修改原因

满足用户提供的永续开发模式要求，确保项目状态可恢复、可追溯。

### 风险说明

- 当前项目不是 Git 仓库，无法通过版本历史核验此前变更。
- 用户输入“Settings -> Devices / Mobile Access”尚未明确为具体开发任务。

## 2026-06-08 19:09 建立项目执行负责人状态记录

### 修改文件

- `PROJECT_STATE.md`
- `TASK_STATE.md`
- `DECISIONS.md`
- `CHANGELOG_AI.md`

### 修改内容

- 新增 `PROJECT_STATE.md`，记录当前目标、完成情况、进度、风险、待办、下一步和最近验证。
- 在 `DECISIONS.md` 追加“切换为项目执行负责人工作流”的决策。
- 将 `TASK_STATE.md` 更新为历史兼容状态文件，避免旧任务目标误导后续恢复。
- 记录本轮治理变更。

### 修改原因

用户确认采用项目执行负责人工作流，要求维护 `PROJECT_STATE.md` 和 `DECISIONS.md`，并在每个任务结束后更新项目状态。

### 风险说明

- 本轮未进行业务页面改造。
- 当前目录仍不是 Git 仓库，文件变更尚未形成 Git 版本历史。
- 本地网址是否可访问仍取决于 `next dev -p 3000` 是否持续运行。

## 2026-06-08 19:20 项目健康检查与本地运行修复

### 修改文件

- `README.md`
- `DEPLOY.md`
- `DECISIONS.md`
- `PROJECT_STATE.md`
- `CHANGELOG_AI.md`

### 修改内容

- 补充本地构建验证注意事项：不要在 `npm run dev` 运行时直接混用生产构建产物。
- 补充 `localhost:3000` 首页 500 的恢复方式：停止 dev server，删除 `.next`，重新运行 `npm run dev`。
- 记录“本地构建与开发服务隔离规则”的决策。
- 记录本次健康检查结果和风险。

### 修改原因

健康检查中发现 `next dev` 与 `next build` 同时读写 `.next` 会导致 dev server manifest 短暂不一致，首页出现 500。干净生产构建和生产服务验证均通过，说明需要修复的是本地运行流程和文档。

### 风险说明

- 本轮未修改业务页面和内容数据。
- 当前目录仍不是 Git 仓库，建议部署前初始化 Git 并提交。
- 本地开发服务需要保持运行，`localhost:3000` 才能访问。

## 2026-06-08 19:35 移动端与交互体验检查

### 修改文件

- `components/DashboardClient.tsx`
- `DECISIONS.md`
- `PROJECT_STATE.md`
- `TASK_STATE.md`
- `CHANGELOG_AI.md`

### 修改内容

- 首页 Prompt 统计从固定数字改为基于 `prompts` 数据动态计算。
- 首页学习进度新增“撤销最近完成”按钮，避免误点完成后无法从首页恢复。
- 完成桌面端核心交互检查：深色模式、学习进度、Prompt 搜索/筛选/收藏/复制、任务生成器预设/复制、视频搜索/筛选/已看/复制、训练营搜索/标签/复制。
- 完成移动端 375×812 布局检查：主要页面无页面级横向溢出，移动端导航、Prompt 搜索和深色模式可用。

### 修改原因

用户要求执行移动端与交互体验检查。检查中发现首页进度缺少撤销入口、首页 AI Prompt 统计与数据不一致，因此做了小范围修复。

### 验证结果

- `npm run typecheck`：通过。
- `npm run lint`：通过。
- `npm audit --omit=dev`：0 个漏洞。
- `npm run build`：通过。
- 主要路由在 `localhost:3000` 均返回 200。

### 风险说明

- 本轮没有进行大规模页面重构。
- 移动端检查使用 375×812 视口，后续如需更严格质量门槛，可增加 390×844、430×932、768×1024 等断点。
- 当前目录仍不是 Git 仓库。

## 2026-06-08 19:45 GitHub + Vercel 上线准备：本地 Git 初始化

### 修改文件

- `.git/`
- `PROJECT_STATE.md`
- `TASK_STATE.md`
- `DECISIONS.md`
- `CHANGELOG_AI.md`

### 修改内容

- 初始化本地 Git 仓库，默认分支为 `main`。
- 配置仓库本地提交身份：`Codex Mastery <codex-mastery@local>`。
- 检查 GitHub CLI：本机未安装 `gh`，无法自动创建远程仓库或推送。
- 更新项目状态、任务状态、决策记录和变更日志。

### 修改原因

用户授权执行本地 Git 初始化和首次提交，并要求推进 GitHub + Vercel 上线准备。

### 风险说明

- 本机没有 GitHub CLI，远程仓库创建和 push 暂时阻塞。
- GitHub 账号注册需要用户本人完成，不能由自动化代办。
- 当前 Git 提交身份为仓库本地配置，不影响全局 Git 配置。

## 2026-06-08 19:58 GitHub CLI 安装受网络阻塞

### 修改文件

- `PROJECT_STATE.md`
- `TASK_STATE.md`
- `CHANGELOG_AI.md`

### 修改内容

- 记录继续远程发布时的阻塞点。
- 记录两次 `gh` 安装尝试失败：
  - `brew install gh` 卡在 Homebrew 自动更新，随后 API 请求连接被重置。
  - `HOMEBREW_NO_AUTO_UPDATE=1 HOMEBREW_NO_INSTALL_FROM_API=1 brew install gh` 卡在克隆 `homebrew-core`，最终出现 `early EOF`。
- 清理半截 `homebrew-core` tap 目录，避免 Homebrew 留下不完整状态。

### 修改原因

用户要求继续 GitHub + Vercel 上线准备。远程仓库创建需要 GitHub CLI 或明确的 GitHub 仓库地址，但当前机器没有 `gh`，安装又受网络阻塞。

### 风险说明

- 本地 Git 仓库和首次提交已完成，不受影响。
- 远程 GitHub 仓库创建和 Vercel 导入仍需用户完成 GitHub CLI 登录，或提供 GitHub 空仓库地址。

## 2026-06-08 20:20 生成 GitHub 手动上传备用包

### 修改文件

- `.gitignore`
- `PROJECT_STATE.md`
- `TASK_STATE.md`
- `CHANGELOG_AI.md`
- `release/codex-mastery-github-ready.zip`

### 修改内容

- 使用 `git archive` 生成 GitHub 手动上传备用包：`release/codex-mastery-github-ready.zip`。
- 将 `release/` 加入 `.gitignore`，避免把本地交付压缩包提交到仓库。
- 更新项目状态和任务状态，记录远程发布阻塞时的备用交付路径。

### 修改原因

当前机器无法安装 `gh`，也没有 GitHub 仓库 URL。生成 zip 可以让用户通过 GitHub 网页手动上传项目文件，作为无法使用 CLI 推送时的备用方案。

### 风险说明

- zip 包是本地交付物，不在 Git 历史中。
- 手动上传 GitHub 不保留本地 Git 提交历史；如果需要保留提交历史，仍建议安装/登录 `gh` 或提供远程仓库 URL 后用 `git push`。

## 2026-06-08 20:40 GitHub HTTPS 与 SSH 认证均不可用

### 修改文件

- `PROJECT_STATE.md`
- `TASK_STATE.md`
- `CHANGELOG_AI.md`

### 修改内容

- 记录已配置 GitHub remote：`https://github.com/ronghuacao66-lang/codex-mastery.git`。
- 记录 HTTPS push 失败原因：当前机器没有可用 GitHub 凭据。
- 记录 SSH 认证失败原因：`git@github.com: Permission denied (publickey).`

### 修改原因

用户提供 GitHub 用户名并要求继续。已尝试 HTTPS 和 SSH 两条不依赖 `gh` 的远程发布路径，但当前机器缺少 GitHub 认证能力。

### 风险说明

- 本地 Git 历史完整，项目本身可运行。
- GitHub 远程 push 仍阻塞在认证层。
- 继续远程发布需要用户完成 HTTPS token/credential 认证、配置 SSH key，或通过 GitHub 网页上传 zip。

## 2026-06-08 20:50 直接下载 GitHub CLI 失败

### 修改文件

- `PROJECT_STATE.md`
- `TASK_STATE.md`
- `CHANGELOG_AI.md`

### 修改内容

- 记录尝试通过 GitHub release 直接下载 `gh` 预编译包。
- 清理下载尝试产生的 `.local-tools` 临时目录。

### 修改原因

用户要求继续由我处理远程发布。我在 Homebrew 失败后尝试绕过 Homebrew，直接下载 GitHub CLI release。

### 风险说明

- 下载 `https://github.com/cli/cli/releases/download/v2.93.0/gh_2.93.0_macOS_arm64.zip` 时连接 GitHub 443 超时。
- 当前环境无法自动安装 `gh`，远程发布仍需要用户完成认证或网页登录上传。

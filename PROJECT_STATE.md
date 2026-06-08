# PROJECT_STATE

## 更新时间

2026-06-09 01:58 CST

## 当前目标

以项目执行负责人方式推进 `Codex Mastery`：保持项目状态可追溯，完成稳定交付、内容质量、交互体验、公网部署和后续 GitHub 推送。

## 当前完成

- 本地站点已恢复访问：`http://localhost:3000`。
- 当前开发服务正在运行：`next dev -p 3000`。
- 关键页面 HTTP 检查通过：
  - `/`
  - `/bootcamp`
  - `/task-builder`
  - `/prompts`
  - `/videos`
  - `/academy`
  - `/projects`
- 最近一次 `npm run build` 已通过。
- 已具备 GitHub + Vercel 部署文档：
  - `README.md`
  - `DEPLOY.md`
- 内容已集中在 `data/*.json`：
  - `articles.json`：10 条
  - `daily-plan.json`：30 条
  - `projects.json`：8 条
  - `prompts.json`：52 条，其中 Codex Prompt 30 条、AI Prompt 22 条
  - `security.json`：6 条
  - `task-presets.json`：4 条
  - `templates.json`：5 条
  - `tools.json`：7 条
  - `videos.json`：12 条
  - `workflows.json`：5 条
- 已生成 `content/*.md` 作为可读备份。
- 第二项任务“项目健康检查”：已完成。
- 第三项任务“移动端与交互体验检查”：已完成。
- 第四项任务“GitHub + Vercel 上线准备”：进行中，本地 Git 已初始化并完成历史提交；Vercel 直接公网部署已完成，GitHub 远程推送仍等待认证。
- 已创建 `HANDOVER.md`，用于应对上下文压缩、会话中断或账号切换后的项目接管。
- 已修复 ESLint 误扫描 `release/**` 的问题，避免本地备用压缩包解压目录影响 `npm run lint`。
- 2026-06-09 部署前质量门禁已通过：
  - `npm run typecheck`：通过
  - `npm run lint`：通过
  - `npm run build`：通过
- 已确认 Vercel CLI 可通过 `npx --yes vercel@latest` 启动，版本为 `54.9.1`。
- 已完成 Vercel CLI 登录，当前账号为 `ronghuacao66-lang`，当前团队为 `crh-s-projects`。
- 已根据用户截图修正目标 Vercel 项目为 `crh-s-projects/ronghuacao66-lang-codex-mastery`。
- 已通过 Vercel CLI 关联正确项目：`crh-s-projects/ronghuacao66-lang-codex-mastery`。
- 已新增 `vercel.json`，显式声明 Next.js 部署、`npm run build`、`npm install` 和自动输出目录，避免项目远端 `Framework Preset: Other` 导致产物路由异常。
- 已完成 Vercel Production 强制部署：
  - 主域名：`https://ronghuacao66-lang-codex-mastery.vercel.app`
  - 最新部署域名：`https://ronghuacao66-lang-codex-mastery-ly0ja227e-crh-s-projects.vercel.app`
  - Vercel inspect：`Ready`
  - 生产别名：已绑定主域名和 `crh-s-projects` 团队域名。
- 已在 Chrome 中打开主域名，当前标签标题为 `Codex Mastery`，不再是 Vercel `404: NOT_FOUND`。
- 已创建本轮本地 Git 提交：`Fix Vercel Next.js deployment`。
- 已确认 GitHub 远程仓库可读取，远程 `main` 当前来自网页上传历史，包含旧的 `codex-mastery-github-ready/` 嵌套目录结构。
- 已将远程上传历史以 `ours` 策略合并进本地 `main`，保留本地正确项目根目录结构，后续 GitHub 凭据可用后可普通 fast-forward push，无需强推。
- 已重新生成最新 GitHub 手动上传备用包：`release/codex-mastery-github-ready.zip`，包内包含 `vercel.json`。
- 已安装 GitHub CLI：`gh 2.93.0`。
- 已尝试 GitHub CLI Web 授权，设备码流程可打开，但两次均在本机与 GitHub OAuth token 交换阶段超时。
- 已清理 GitHub CLI 半成品无效登录状态。
- 已生成本项目专用 SSH key：
  - 私钥：`~/.ssh/codex_maturity_github_ed25519`
  - 公钥：`~/.ssh/codex_maturity_github_ed25519.pub`
  - 指纹：`SHA256:8iEptsOWnqTxPfbT2S3HiNjOEpGvdpRZ+WpYVMFqejY`
- 已将公钥复制到剪贴板，并打开 GitHub SSH key 添加页面；当前 Chrome 需要用户登录 GitHub 后添加该公钥。
- 已配置 `~/.ssh/config`，让 `github.com` 使用该项目专用 SSH key。
- 本次健康检查结论：
  - `npm run typecheck`：通过
  - `npm run lint`：通过
  - `npm run build`：通过
  - `npm audit --omit=dev`：0 个漏洞
  - `npm ci --dry-run`：通过
  - `npm run export:content`：通过，`content/*.md` 未发生变化
  - 生产服务 `next start -p 3001`：主要路由均返回 200
  - 开发服务 `next dev -p 3000`：已恢复，主要路由均返回 200
- 本次交互体验检查结论：
  - 首页深色模式切换：通过
  - 首页学习进度完成/撤销：通过，已新增“撤销最近完成”
  - 首页 Prompt 复制：通过
  - Prompt Center 搜索、分类筛选、收藏、复制：通过
  - Codex 任务生成器预设切换与复制：通过
  - 视频页搜索、平台筛选、阶段筛选、标记已看、复制笔记：通过
  - 30 天训练营搜索、标签筛选、复制当天手册：通过
  - 移动端 375×812 全主要页面无页面级横向溢出
  - 移动端导航、Prompt 搜索、深色模式：通过
- 已建立或保留项目记忆文件：
  - `PROJECT_CONTEXT.md`
  - `PROJECT_STATE.md`
  - `TASK_STATE.md`
  - `DECISIONS.md`
  - `CHANGELOG_AI.md`
- Git 状态：
  - 已在当前目录初始化 Git 仓库。
  - 当前分支：`main`。
  - 已配置仓库本地提交身份：`Codex Mastery <codex-mastery@local>`。
  - 已完成首次提交：`Initial Codex Mastery deployment`。
  - 已安装 `gh` GitHub CLI `2.93.0`。
  - 已尝试通过 Homebrew 安装 `gh`，但网络访问 Homebrew/GitHub 资源失败：
    - `formula.jws.json` 下载连接被重置。
    - `homebrew-core` 克隆出现 `early EOF`。
  - 已生成 GitHub 手动上传备用包：`release/codex-mastery-github-ready.zip`；2026-06-09 01:36 CST 已重新生成，包含 `vercel.json`。
  - 已根据用户提供的 GitHub 用户名配置远程地址：
    - `origin`: `https://github.com/ronghuacao66-lang/codex-mastery.git`
  - 已尝试 `git push -u origin main`，但失败：
    - `fatal: could not read Username for 'https://github.com': terminal prompts disabled`
    - 2026-06-09 01:35 CST 再次尝试失败：`fatal: could not read Username for 'https://github.com': Device not configured`
  - 已尝试 GitHub SSH 认证，但失败：
    - `git@github.com: Permission denied (publickey).`
  - 已尝试直接下载 GitHub CLI release `v2.93.0`，但连接 GitHub 443 超时。
  - 已确认 `gh auth status` 当前仍未登录，原因是 OAuth token 交换超时。
  - 已生成并配置项目专用 SSH key，但公钥尚未添加到 GitHub，`ssh -T git@github.com` 当前仍返回 `Permission denied (publickey)`。
- 本机 macOS 电源策略已调整，降低 Codex 长任务因合盖或空闲睡眠中断的风险：
  - Battery Power：`sleep 0`、`displaysleep 0`、`disksleep 0`
  - AC Power：`sleep 0`、`displaysleep 0`、`disksleep 0`

## 当前进度

- 项目治理基线：已建立。
- 第一项任务“建立项目状态与决策记录”：已完成。
- 第二项任务“项目健康检查”：已完成。
- 第三项任务“移动端与交互体验检查”：已完成。
- 第四项任务“GitHub + Vercel 上线准备”：本地构建验证已通过；Vercel 直接部署已完成；本轮部署修复已提交到本地 Git；远程上传历史已合并入本地提交图；GitHub 推送仍阻塞于认证。
- 尚未开始新的业务功能开发或大规模重构。

## 当前风险

- 当前目录已初始化 Git，但尚未成功推送到 GitHub 远程仓库。
- GitHub 远程 `main` 当前不是最终结构，仍是网页上传产生的旧结构；本地 `main` 已整理为可普通 push 的正确结构。
- GitHub CLI `gh` 已安装，但 GitHub OAuth token 交换在本机网络下超时，CLI 仍未登录。
- GitHub SSH key 已在本机生成并配置，但用户尚未将公钥添加到 GitHub 账号。
- Git remote 已配置，但当前机器没有 GitHub 认证凭据，无法 push。
- 当前机器也没有可用的 GitHub SSH key，无法通过 SSH push。
- 当前环境访问 GitHub release 下载通道超时，无法由我自动补装 `gh`。
- Vercel 项目远端设置仍显示 `Framework Preset: Other`，但仓库内 `vercel.json` 已显式覆盖 Next.js 部署配置；后续 GitHub 自动部署应保留该文件。
- 本机 `curl` 访问 Vercel 域名仍出现超时，疑似本机网络到 Vercel 边缘节点不稳定；Vercel CLI inspect 与 Chrome 标签标题已验证部署可用。
- 不应在聊天中索要或保存 Vercel 密码、验证码或长期 token；认证应由用户在 Vercel 官方页面完成。
- 系统级上下文压缩不可由模型关闭，当前已通过 `HANDOVER.md` 和状态文件保护关键上下文。
- `localhost:3000` 依赖本机开发服务；服务停止后本地网址会打不开。
- 公网稳定访问仍依赖 GitHub + Vercel 部署完成。
- 外部视频链接可能随平台规则变化失效，需要后续定期巡检。
- 旧状态文件曾记录过与当前项目无关的目标，已通过本轮状态更新纠偏。
- 本地执行 `npm run build` 时不应与 `npm run dev` 混用同一个 `.next`；若首页 500，需要停止 dev server、删除 `.next` 并重启。
- 合盖长时间运行 Codex 会增加发热和耗电风险，建议连接电源并保持散热。

## 待办事项

1. 用户在 Chrome 打开的 GitHub 页面登录账号，并将剪贴板中的公钥添加为 SSH key。
2. 添加完成后执行 `ssh -T git@github.com` 验证 SSH 认证。
3. 验证通过后将 remote 改为 SSH 并执行 `git push -u origin main`。
4. 若暂时无法使用 Git CLI 推送，可用 `release/codex-mastery-github-ready.zip` 通过 GitHub 网页手动上传最新项目文件。
3. 定期巡检外部视频链接。
4. 可选增强：设计完整学习进度中心。

## 下一步行动

当前下一步为“等待用户添加 GitHub SSH key 后完成 push”：

- 目标：将本地 `main` 分支推送到 `git@github.com:ronghuacao66-lang/codex-mastery.git`。
- 输入：用户在 GitHub 账号中添加本机生成的公钥。
- 输出：GitHub 远程仓库包含最新项目文件和 `vercel.json`。
- 验收标准：`ssh -T git@github.com` 认证通过，`git push -u origin main` 成功，GitHub 仓库可访问。

## 最近验证

- `npm run build`：通过。
- 关键路由 HTTP 检查：通过。
- 浏览器打开首页：通过。
- 本轮状态文件自查：通过。
- 本轮项目健康检查：通过，已修复本地 dev server 运行态污染问题。
- 本轮移动端与交互体验检查：通过，已修复首页进度撤销和统计动态化问题。
- 本轮本机电源策略检查：`pmset -g custom` 确认 Battery Power 与 AC Power 下 `sleep`、`displaysleep`、`disksleep` 均为 `0`。
- 2026-06-09 部署前验证：
  - `npm run typecheck`：通过。
  - `npm run lint`：通过。
  - `npm run build`：通过。
  - `npx --yes vercel@latest --version`：返回 `54.9.1`。
  - `npx --yes vercel@latest whoami`：返回 `ronghuacao66-lang`。
  - `npx --yes vercel@latest project inspect ronghuacao66-lang-codex-mastery --scope crh-s-projects`：确认项目存在，远端 Framework Preset 仍显示 `Other`。
  - `npx --yes vercel@latest inspect ronghuacao66-lang-codex-mastery.vercel.app --scope crh-s-projects`：最新 Production Deployment 为 `Ready`，主域名已作为 alias 绑定。
  - `npx --yes vercel@latest inspect ronghuacao66-lang-codex-mastery-ly0ja227e-crh-s-projects.vercel.app --logs --scope crh-s-projects`：Vercel 远端 Next.js 构建通过，生成 14 个静态页面。
  - Chrome 打开 `https://ronghuacao66-lang-codex-mastery.vercel.app/?verify=20260609`：标签标题为 `Codex Mastery`。
  - `curl -I -L --max-time 30 https://ronghuacao66-lang-codex-mastery.vercel.app/`：本机网络超时，未作为失败判据。
- 2026-06-09 01:29 CST 提交前验证：
  - `npm run typecheck`：通过。
  - `npm run lint`：通过。
  - `npm run build`：通过，生成 14 个 App Router 页面。
- 2026-06-09 01:31 CST：本轮部署修复已创建本地 Git 提交。
- 2026-06-09 01:35 CST：`git push -u origin main` 仍因本机 GitHub HTTPS 凭据不可用失败。
- 2026-06-09 01:36 CST：已重新生成 `release/codex-mastery-github-ready.zip`，确认包内包含 `vercel.json`。
- 2026-06-09 01:38 CST：已合并远程网页上传历史，保留本地正确文件树，后续 push 不需要强推。
- 2026-06-09 01:40 CST 远程历史合并后验证：
  - `npm run typecheck`：通过。
  - `npm run lint`：通过。
  - `npm run build`：通过，生成 14 个 App Router 页面。
- 2026-06-09 01:58 CST：
  - `HOMEBREW_NO_AUTO_UPDATE=1 brew install gh`：成功，安装 `gh 2.93.0`。
  - `gh auth login --web --clipboard --scopes repo`：两次失败，原因是 `https://github.com/login/oauth/access_token` token 交换超时。
  - `ssh-keygen -t ed25519`：已生成项目专用 SSH key。
  - `ssh -o BatchMode=yes -T git@github.com`：当前失败，原因是公钥尚未添加到 GitHub。
- 2026-06-09 02:01 CST SSH 方案记录后验证：
  - `npm run typecheck`：通过。
  - `npm run lint`：通过。
  - `npm run build`：通过，生成 14 个 App Router 页面。

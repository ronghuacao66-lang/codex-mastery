# PROJECT_STATE

## 更新时间

2026-06-09 00:58 CST

## 当前目标

以项目执行负责人方式推进 `Codex Mastery`：先建立可追溯的项目状态与决策记录，再按单任务节奏继续完成稳定交付、内容质量、交互体验和公网部署。

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
- 第四项任务“GitHub + Vercel 上线准备”：进行中，本地 Git 已初始化并完成首次提交；当前正在处理 Vercel 公网部署。
- 已创建 `HANDOVER.md`，用于应对上下文压缩、会话中断或账号切换后的项目接管。
- 已修复 ESLint 误扫描 `release/**` 的问题，避免本地备用压缩包解压目录影响 `npm run lint`。
- 2026-06-09 部署前质量门禁已通过：
  - `npm run typecheck`：通过
  - `npm run lint`：通过
  - `npm run build`：通过
- 已确认 Vercel CLI 可通过 `npx --yes vercel@latest` 启动，版本为 `54.9.1`。
- 已尝试 Vercel CLI 登录，CLI 返回 `No existing credentials found` 并进入设备授权流程。
- 已打开 Vercel 设备授权页，但 CLI 未收到授权完成信号，当前无法继续远程部署。
- 已根据用户截图修正目标 Vercel 项目为 `crh-s-projects/ronghuacao66-lang-codex-mastery`。
- 已确认公网地址 `https://ronghuacao66-lang-codex-mastery.vercel.app` 当前显示 `404: NOT_FOUND`，需要完成有效 Production Deployment。
- 已重新发起 Vercel CLI 设备授权，授权页已打开，验证码为 `TJVP-JCLJ`。
- 已截屏确认授权页存在 Vercel `Allow` 按钮，但被 macOS 权限弹窗阻挡。
- 当前 macOS 弹窗要求用户允许 `Codex.app` 控制 `Google Chrome.app`；自动点击蓝色“允许”未生效，需要用户手动点击。
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
  - 本机未安装 `gh` GitHub CLI，暂不能自动创建 GitHub 远程仓库或推送。
  - 已尝试通过 Homebrew 安装 `gh`，但网络访问 Homebrew/GitHub 资源失败：
    - `formula.jws.json` 下载连接被重置。
    - `homebrew-core` 克隆出现 `early EOF`。
  - 已生成 GitHub 手动上传备用包：`release/codex-mastery-github-ready.zip`。
  - 已根据用户提供的 GitHub 用户名配置远程地址：
    - `origin`: `https://github.com/ronghuacao66-lang/codex-mastery.git`
  - 已尝试 `git push -u origin main`，但失败：
    - `fatal: could not read Username for 'https://github.com': terminal prompts disabled`
  - 已尝试 GitHub SSH 认证，但失败：
    - `git@github.com: Permission denied (publickey).`
  - 已尝试直接下载 GitHub CLI release `v2.93.0`，但连接 GitHub 443 超时。
- 本机 macOS 电源策略已调整，降低 Codex 长任务因合盖或空闲睡眠中断的风险：
  - Battery Power：`sleep 0`、`displaysleep 0`、`disksleep 0`
  - AC Power：`sleep 0`、`displaysleep 0`、`disksleep 0`

## 当前进度

- 项目治理基线：已建立。
- 第一项任务“建立项目状态与决策记录”：已完成。
- 第二项任务“项目健康检查”：已完成。
- 第三项任务“移动端与交互体验检查”：已完成。
- 第四项任务“GitHub + Vercel 上线准备”：本地构建验证已通过；GitHub 推送阻塞于认证；Vercel 直接部署当前阻塞于 macOS 允许 Codex 控制 Chrome 的系统权限确认。
- 尚未开始新的业务功能开发或大规模重构。

## 当前风险

- 当前目录已初始化 Git，但尚未推送到 GitHub 远程仓库。
- GitHub CLI `gh` 未安装，远程仓库创建和自动推送暂时阻塞。
- Homebrew 安装 `gh` 失败，当前需要用户手动完成 GitHub CLI 安装/登录，或提供 GitHub 空仓库 URL。
- Git remote 已配置，但当前机器没有 GitHub 认证凭据，无法 push。
- 当前机器也没有可用的 GitHub SSH key，无法通过 SSH push。
- 当前环境访问 GitHub release 下载通道超时，无法由我自动补装 `gh`。
- Vercel CLI 当前没有本机登录凭据，设备授权页未完成确认，无法继续执行 `vercel deploy --prod`。
- macOS 当前弹出“Codex.app 想要控制 Google Chrome.app”的权限提示。该提示需要用户手动点击蓝色“允许”，自动点击未生效。
- 不应在聊天中索要或保存 Vercel 密码、验证码或长期 token；认证应由用户在 Vercel 官方页面完成。
- 系统级上下文压缩不可由模型关闭，当前已通过 `HANDOVER.md` 和状态文件保护关键上下文。
- `localhost:3000` 依赖本机开发服务；服务停止后本地网址会打不开。
- 公网稳定访问仍依赖 GitHub + Vercel 部署完成。
- 外部视频链接可能随平台规则变化失效，需要后续定期巡检。
- 旧状态文件曾记录过与当前项目无关的目标，已通过本轮状态更新纠偏。
- 本地执行 `npm run build` 时不应与 `npm run dev` 混用同一个 `.next`；若首页 500，需要停止 dev server、删除 `.next` 并重启。
- 合盖长时间运行 Codex 会增加发热和耗电风险，建议连接电源并保持散热。

## 待办事项

1. 等待用户确认下一项任务。
2. 用户完成 GitHub HTTPS token/credential 认证，或配置 GitHub SSH key 后，继续执行 `git push -u origin main`。
3. 若暂时无法使用 Git CLI 推送，可用 `release/codex-mastery-github-ready.zip` 通过 GitHub 网页手动上传。
4. 推送或上传 GitHub 后导入 Vercel。
5. 完成 Vercel CLI 设备授权，或提供用户本人创建的临时 `VERCEL_TOKEN` 后继续部署。
6. 定期巡检外部视频链接。
7. 可选增强：设计完整学习进度中心。

## 下一步行动

当前下一步仍为“完成 Vercel 认证并部署”：

- 目标：将本地已验证通过的项目部署到 Vercel 项目 `crh-s-projects/ronghuacao66-lang-codex-mastery`。
- 输入：当前项目文件、Vercel 账号登录状态或用户本人提供的部署 token。
- 输出：可公开访问的 `*.vercel.app` 地址。
- 验收标准：`npm run build` 通过，`vercel deploy --prod` 成功，公网 URL 返回 200。

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
  - `npx --yes vercel@latest whoami`：未登录，进入设备授权流程，授权未完成。
  - 2026-06-09 00:54 CST：Vercel 授权页已打开，但 macOS 权限弹窗阻止 Codex 操作 Chrome。

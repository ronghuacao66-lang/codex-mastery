# TASK_STATE

## 状态说明

本文件为历史兼容状态文件。当前项目主状态请以 `PROJECT_STATE.md` 为准。

## 当前目标

按用户确认的项目执行负责人工作流推进 `Codex Mastery`。当前已完成项目状态治理、项目健康检查、移动端与交互体验检查，正在执行 GitHub + Vercel 上线准备；本地构建已通过，Vercel 直接公网部署已完成，本轮部署修复已提交到本地 Git，GitHub 推送仍等待认证。

## 当前完成

- 已创建 `PROJECT_STATE.md`。
- 已在 `DECISIONS.md` 记录项目执行负责人工作流切换。
- 已确认本地开发服务在 `http://localhost:3000` 可访问。
- 已确认关键页面返回 200。
- 已完成项目健康检查。
- 已记录本地构建与开发服务隔离规则。
- 已完成移动端与交互体验检查。
- 已修复首页学习进度撤销入口和 Prompt 统计动态化问题。
- 已初始化本地 Git 仓库，分支为 `main`。
- 已完成本地首次提交：`Initial Codex Mastery deployment`。
- 本机未安装 `gh` GitHub CLI，远程仓库创建和自动推送暂时阻塞。
- 已尝试通过 Homebrew 安装 `gh`，但因 Homebrew/GitHub 网络失败未完成。
- 已生成 GitHub 手动上传备用包：`release/codex-mastery-github-ready.zip`。
- 已配置远程地址：`https://github.com/ronghuacao66-lang/codex-mastery.git`。
- 已尝试 push，但因当前机器没有 GitHub 认证凭据失败。
- 已尝试 SSH 方式访问 GitHub，但因没有可用 public key 失败。
- 已尝试直接下载 GitHub CLI release，但 GitHub 443 连接超时。
- 已按用户要求设置本机 macOS 电源策略，降低 Codex 长任务因合盖或空闲睡眠中断的风险。
- 已创建 `HANDOVER.md`，用于上下文压缩或会话中断后的项目接管。
- 已修复 ESLint 忽略规则，避免 `release/**` 备用交付目录影响 lint。
- 已完成 2026-06-09 部署前验证：`npm run typecheck`、`npm run lint`、`npm run build` 均通过。
- 已确认 Vercel CLI `54.9.1` 可通过 `npx --yes vercel@latest` 启动。
- 已完成 Vercel CLI 登录，当前账号为 `ronghuacao66-lang`。
- 已根据用户截图修正目标 Vercel 项目为 `crh-s-projects/ronghuacao66-lang-codex-mastery`。
- 已关联 Vercel 项目：`crh-s-projects/ronghuacao66-lang-codex-mastery`。
- 已新增 `vercel.json`，强制使用 Next.js 部署配置并避免 Vercel 远端 `Framework Preset: Other` 导致路由异常。
- 已完成 Vercel Production 部署：
  - 主域名：`https://ronghuacao66-lang-codex-mastery.vercel.app`
  - 最新部署域名：`https://ronghuacao66-lang-codex-mastery-ly0ja227e-crh-s-projects.vercel.app`
  - 状态：`Ready`
- Chrome 打开主域名后标题为 `Codex Mastery`，不再是 Vercel `404: NOT_FOUND` 页面。

## 当前进度

- 当前任务：GitHub + Vercel 上线准备。
- 任务状态：本地构建通过；Vercel 直接部署完成；本轮部署修复已提交到本地 Git；GitHub push 阻塞于认证。

## 当前风险

- 当前目录已初始化 Git，但尚未推送到 GitHub 远程。
- 本地访问依赖 `next dev -p 3000` 持续运行。
- 后续公网访问需要完成 GitHub + Vercel 部署。
- 不建议在 dev server 运行时直接混用 `npm run build` 产物。
- 本机缺少 GitHub CLI，无法自动创建远程仓库。
- Homebrew 安装 `gh` 失败，需要手动安装/登录 GitHub CLI，或提供 GitHub 空仓库地址。
- `release/` 是本地交付物目录，已加入 `.gitignore`，不会提交进仓库。
- 当前 remote 已配置，下一步只差 GitHub 认证和仓库可访问性。
- SSH remote 路径也需要先配置 GitHub SSH key。
- 当前环境无法稳定访问 GitHub CLI 下载资源。
- 合盖长时间运行 Codex 会增加发热和耗电风险，建议连接电源并保持散热。
- Vercel 远端项目设置仍显示 `Framework Preset: Other`，后续必须保留仓库内 `vercel.json`。
- 本机 `curl` 到 Vercel 域名仍超时，疑似本机网络问题；Vercel CLI inspect 和 Chrome 标题已验证生产部署可用。
- 不应在聊天中索要或保存 Vercel 密码、验证码或长期 token。
- 系统级上下文压缩不可由模型关闭，必须依赖项目状态文件和 `HANDOVER.md` 保持可接管。

## 本轮环境维护

- 2026-06-08 19:35 CST：已执行 `pmset -a sleep 0 displaysleep 0 disksleep 0 disablesleep 1`。
- 验证结果：`pmset -g custom` 显示 Battery Power 与 AC Power 下 `sleep`、`displaysleep`、`disksleep` 均为 `0`。
- 恢复方式：如需恢复默认电源策略，可运行 `sudo pmset restoredefaults`。

## 下一步动作

GitHub 侧仍需要完成 HTTPS token/credential 认证，或配置 GitHub SSH key，才能继续远程 push。
如果暂时无法使用 Git CLI 推送，可以通过 GitHub 网页上传项目文件，但需要重新生成包含 `vercel.json` 的最新备用包。

## 最近验证

- 2026-06-09 01:29 CST：
  - `npm run typecheck`：通过。
  - `npm run lint`：通过。
  - `npm run build`：通过。
- 2026-06-09 01:31 CST：本轮部署修复已创建本地 Git 提交。

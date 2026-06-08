# PROJECT_STATE

## 更新时间

2026-06-08 19:50 CST

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
- 第四项任务“GitHub + Vercel 上线准备”：进行中，本地 Git 已初始化并完成首次提交。
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
- 本机 macOS 电源策略已调整，降低 Codex 长任务因合盖或空闲睡眠中断的风险：
  - Battery Power：`sleep 0`、`displaysleep 0`、`disksleep 0`
  - AC Power：`sleep 0`、`displaysleep 0`、`disksleep 0`

## 当前进度

- 项目治理基线：已建立。
- 第一项任务“建立项目状态与决策记录”：已完成。
- 第二项任务“项目健康检查”：已完成。
- 第三项任务“移动端与交互体验检查”：已完成。
- 第四项任务“GitHub + Vercel 上线准备”：本地 Git 提交已完成，远程推送阻塞于 GitHub CLI/仓库地址。
- 尚未开始新的业务功能开发或大规模重构。

## 当前风险

- 当前目录已初始化 Git，但尚未推送到 GitHub 远程仓库。
- GitHub CLI `gh` 未安装，远程仓库创建和自动推送暂时阻塞。
- `localhost:3000` 依赖本机开发服务；服务停止后本地网址会打不开。
- 公网稳定访问仍依赖 GitHub + Vercel 部署完成。
- 外部视频链接可能随平台规则变化失效，需要后续定期巡检。
- 旧状态文件曾记录过与当前项目无关的目标，已通过本轮状态更新纠偏。
- 本地执行 `npm run build` 时不应与 `npm run dev` 混用同一个 `.next`；若首页 500，需要停止 dev server、删除 `.next` 并重启。
- 合盖长时间运行 Codex 会增加发热和耗电风险，建议连接电源并保持散热。

## 待办事项

1. 等待用户确认下一项任务。
2. 安装并登录 GitHub CLI，或由用户在 GitHub 创建空仓库后提供远程地址。
3. 推送 GitHub 后导入 Vercel。
4. 定期巡检外部视频链接。
5. 可选增强：设计完整学习进度中心。
6. 任务变长时创建 `HANDOVER.md`。

## 下一步行动

建议下一项任务为“GitHub + Vercel 上线准备”：

- 目标：把当前项目纳入 Git 版本管理，并准备推送 GitHub 导入 Vercel。
- 输入：当前项目文件、README、DEPLOY、构建结果。
- 输出：Git 初始化/提交准备、部署前检查清单。
- 验收标准：本地构建通过，仓库文件干净，部署步骤明确。

## 最近验证

- `npm run build`：通过。
- 关键路由 HTTP 检查：通过。
- 浏览器打开首页：通过。
- 本轮状态文件自查：通过。
- 本轮项目健康检查：通过，已修复本地 dev server 运行态污染问题。
- 本轮移动端与交互体验检查：通过，已修复首页进度撤销和统计动态化问题。
- 本轮本机电源策略检查：`pmset -g custom` 确认 Battery Power 与 AC Power 下 `sleep`、`displaysleep`、`disksleep` 均为 `0`。

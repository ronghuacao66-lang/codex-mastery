# PROJECT_STATE

## 2026-06-16 仓库入口状态可观测性

### 当前目标

让 GitHub 仓库首页直接展示公网访问地址、GitHub Actions 验收状态和部署前总验收命令，降低用户或新 AI 接管时确认项目健康状态的成本。

### 当前完成

- 已在 `README.md` 顶部增加 GitHub Actions `Verify` 状态徽章。
- 已在 `README.md` 顶部新增“项目状态”区。
- 已明确展示：
  - 公网访问地址 `https://ronghuacao66-lang-codex-mastery.vercel.app`。
  - GitHub Actions Verify 工作流入口。
  - GitHub + Vercel 静态部署口径。
  - 交付前总验收命令 `npm run verify`。
- 已通过本地 `npm run verify`。
- 已提交并推送 `dd564fe Add repository status entry`。
- GitHub Actions `Verify` 对提交 `dd564fe` 已完成，结论为 `success`。
- Vercel Production 部署 `https://ronghuacao66-lang-codex-mastery-bmi8ak5nf-crh-s-projects.vercel.app` 已确认 `Ready`。
- 主域名 `https://ronghuacao66-lang-codex-mastery.vercel.app` 已确认指向最新 Production Ready 部署。

### 当前风险

- README 徽章状态依赖 GitHub Actions 页面和网络访问。
- 当前工作区仍保留未跟踪 `outputs/` 交付物，本轮不会提交。

### 下一步行动

本轮仓库入口状态可观测性增强已完成。后续继续小范围闭环优化或处理用户反馈缺陷。

## 2026-06-16 GitHub Actions 自动验收

### 当前目标

将本地 `npm run verify` 验收流程接入 GitHub Actions，确保 push 到 `main` 或提交 PR 时自动执行完整检查，降低只在本机验证的风险。

### 当前完成

- 已新增 `.github/workflows/verify.yml`。
- 工作流触发条件：
  - push 到 `main`。
  - pull request 指向 `main`。
- 工作流步骤：
  - Checkout 仓库。
  - 使用 Node.js 20。
  - 使用 npm cache。
  - 执行 `npm ci`。
  - 执行 `npm run verify`。
- 已设置 concurrency，同一 ref 的新任务会取消旧任务。
- 已更新 `README.md` 和 `DEPLOY.md`，说明 GitHub Actions 验收流程。
- 已通过本地 `npm run verify`。
- 已提交并推送 `ad6eb90 Add GitHub verification workflow`。
- GitHub Actions `Verify` 已完成，结论为 `success`。
- Vercel Production 已确认 `Ready`。
- 主域名 `https://ronghuacao66-lang-codex-mastery.vercel.app` 已指向当前 Production Ready 部署。

### 当前风险

- CI 中的 `audit:videos` 会访问 Bilibili 接口，可能受到网络波动影响。
- 当前工作区仍保留未跟踪 `outputs/` 交付物，本轮不会提交。

### 下一步行动

本轮 GitHub Actions 自动验收能力已完成。后续推送到 `main` 或 PR 到 `main` 会自动执行 `npm run verify`。

## 2026-06-16 标准化总验收命令

### 当前目标

将部署前分散执行的内容导出、内容审计、类型检查、Lint、视频审计和生产构建收束为一个固定命令，减少交付前漏跑验证的风险。

### 当前完成

- 已在 `package.json` 新增 `npm run verify`。
- `verify` 顺序为：`export:content -> audit:content -> typecheck -> lint -> audit:videos -> build`。
- 已更新 `README.md`，将 `npm run verify` 作为优先构建验证命令。
- 已更新 `DEPLOY.md`，将 GitHub + Vercel 部署前检查改为 `npm run verify`。
- 已通过 `npm run verify`：
  - `export:content`：通过。
  - `audit:content`：通过，52 条 Prompt、30 天训练营、8 个项目、5 套工作流、5 套模板、10 篇文章、10 条 Bilibili 视频、12 个 Markdown 备份文件。
  - `typecheck`：通过。
  - `lint`：通过。
  - `audit:videos`：通过，10 条 Bilibili 视频均返回 `code=0`。
  - `build`：通过，生成 24 个 App Router 页面。

### 当前风险

- `verify` 包含 `audit:videos`，会依赖 Bilibili 当前接口状态；这是为了确保视频清单不含失效链接。
- 当前工作区仍保留未跟踪 `outputs/` 交付物，本轮不会提交。

### 下一步行动

提交并推送本轮标准化总验收命令，等待 Vercel Production 自动部署确认。

## 2026-06-16 内容审计脚本化

### 当前目标

把上一轮手工内容完整性 QA 固化为可重复执行的项目命令，避免后续新增内容、更新视频或部署前只能依赖临时脚本检查。

### 当前完成

- 已新增 `scripts/audit-content.mjs`。
- 已新增 `npm run audit:content`。
- 审计范围包括：
  - `data/*.json` 必要文件存在并可解析。
  - Prompt、30 天训练营、项目、工作流、模板、文章、视频、工具等数量满足交付要求。
  - 核心字段按 `types/content.ts` 口径检查非空。
  - 项目交付检查项、模板章节、任务生成器预设等嵌套结构检查非空。
  - 视频数据只允许 Bilibili，且链接为 BV 视频 URL，`linkStatus.status` 为 `ok`。
  - `content/*.md` 备份文件存在、包含自动生成标记和正确条目数量。
- 已更新 `README.md` 和 `DEPLOY.md`，把 `npm run audit:content` 纳入构建验证和部署前检查流程。
- 已通过 `npm run audit:content`。
- 已通过 `npm run export:content`，未产生 `content/*.md` 差异。
- 已通过 `npm run typecheck`。
- 已通过 `npm run audit:videos`，10 条 Bilibili 视频均返回 `code=0`。
- 已通过 `npm run lint`。
- 已通过 `npm run build`，生成 24 个 App Router 页面。
- 已提交并推送 `39750a7 Add content audit script` 到 `origin/main`。
- 已确认 Vercel Production 部署为 `Ready`。
- 已确认主域名 `https://ronghuacao66-lang-codex-mastery.vercel.app` 指向当前 Production Ready 部署。

### 当前风险

- `audit:content` 是结构化内容审计，不替代人工判断内容质量。
- 视频实时可访问性仍由 `npm run audit:videos` 单独检查。
- 当前工作区仍保留未跟踪 `outputs/` 交付物，本轮不会提交。

### 下一步行动

本轮内容审计脚本化已完成。后续内容更新时按 `export:content -> audit:content -> audit:videos -> build` 流程验证。

## 2026-06-15 内容完整性与部署验证 QA

### 当前目标

确认 `Codex Mastery` 的内容资产没有丢失，`data/*.json` 与 `content/*.md` 保持同步，并再次验证 GitHub + Vercel 可部署链路。

### 当前完成

- 已重新运行 `npm run export:content`，`content/*.md` 与 `data/*.json` 无未同步差异。
- 已完成内容数量和关键字段审计：
  - Prompt：52 条，其中 30 条 Codex Prompt、22 条通用 AI Prompt。
  - 30 天训练营：30 天完整内容。
  - 项目实战：8 个项目。
  - 工作流：5 套。
  - 模板：5 套。
  - Academy 文章：10 篇。
  - 视频精选：10 条，全部为 Bilibili。
  - AI 工具库：7 个工具。
  - 安全售前：6 个场景。
  - 复盘中心：5 套。
  - 任务生成器预设：4 套。
- 已确认 `data/*.json` 和 `content/*.md` 必要文件存在。
- 已确认核心内容字段非空，字段口径以 `types/content.ts` 为准。
- 已通过 `npm run typecheck`。
- 已通过 `npm run audit:videos`，10 条 Bilibili 视频均返回 `code=0`。
- 已通过 `npm run lint`。
- 已通过 `npm run build`，生成 24 个 App Router 页面。
- GitHub 推送已完成，`origin/main` 已包含本轮 QA 与部署确认记录。
- Vercel Production 部署已确认 `Ready`。
- Vercel alias 已确认：`https://ronghuacao66-lang-codex-mastery.vercel.app` 指向当前 Production Ready 部署。

### 当前风险

- 本轮是内容资产和部署链路 QA，不新增产品功能。
- 视频可访问性依赖 Bilibili 当前接口状态，后续新增或替换视频仍需运行 `npm run audit:videos`。
- 当前终端直接 `curl` Vercel 页面内容超时，但 Vercel API 部署状态和 alias 绑定均正常；如浏览器仍异常，应优先检查本地网络、DNS 或缓存。
- 当前工作区仍保留未跟踪 `outputs/` 交付物，本轮不会提交。

### 下一步行动

本轮内容完整性、构建和部署确认已完成。后续只处理用户反馈的具体缺陷或小范围闭环优化。

## 2026-06-15 六小时闭环版关键交互 QA

### 当前目标

在核心路由 QA 后继续验证关键交互，确保用户能完成搜索、收藏、复制、标记视频、推进学习进度和切换主题。

### 当前完成

- 已在本地生产服务下完成关键交互 QA。
- 已验证首页深色模式切换可同步页面状态。
- 已验证 Prompt Center 搜索、收藏和复制反馈。
- 已验证视频精选搜索和标记已看状态切换。
- 已验证学习进度中心可完成当前 Day，并保留学习证据库展示。
- 交互过程中未发现页面控制台错误。

### 当前风险

- 本轮是关键路径交互 QA，不覆盖所有按钮和所有数据组合。
- 浏览器自动化沙箱不直接读取 localStorage，本轮以用户可见状态为验证依据。
- 当前工作区仍保留未跟踪 `outputs/` 交付物，本轮不会提交。

### 下一步行动

提交并推送交互 QA 记录，等待 Vercel Production 部署确认。

## 2026-06-15 六小时闭环版全站 QA

### 当前目标

对 `Codex Mastery` 六小时闭环版做交付前冒烟 QA，确认核心页面在桌面和移动端都能正常访问和展示。

### 当前完成

- 已在本地生产服务下完成桌面 1280×720 核心路由检查。
- 已在本地生产服务下完成移动端 375×812 核心路由检查。
- 已检查 14 个核心路由：首页、Academy、任务生成器、Prompt、视频、30 天、项目、项目详情、安全售前、工作流、模板、工具库、复盘、进度。
- 检查结果：核心标题和文案可见，无 404，无横向溢出，无页面控制台错误。

### 当前风险

- 本轮 QA 是核心路由冒烟检查，不覆盖所有按钮的深度交互。
- 当前工作区仍保留未跟踪 `outputs/` 交付物，本轮不会提交。

### 下一步行动

提交并推送 QA 记录，等待 Vercel Production 部署确认。

## 2026-06-15 六小时闭环交付与学习证据库

### 当前目标

按用户最新要求，将 `Codex Mastery` 收束为 6 小时内可完成的闭环交付版本。当前重点是让学习平台不仅能提供内容和任务，还能把用户的学习过程沉淀成可复制、可复盘、可继续交给 Codex 推进的证据报告。

### 当前完成

- 已新增 `components/LearningEvidenceVault.tsx`。
- 已在 `/progress` 接入“学习证据库”面板。
- 面板聚合训练进度、视频观看、复盘历史、项目检查和项目执行记录。
- 已展示证据成熟度、训练成果、项目验收、复盘历史、视频学习和待补证据。
- 已支持复制 Markdown 学习证据报告。
- 已确认该能力不新增账号、数据库、后端接口、环境变量或新的 localStorage key。
- Browser 已验证桌面 1280×720 和移动端 375×812 均正常且无横向溢出。
- `npm run typecheck` 已通过。
- `npm run audit:videos` 已通过，10 条 Bilibili 视频均返回 `code=0`。
- `npm run lint` 已通过。
- `npm run build` 已通过，生成 24 个 App Router 页面。
- GitHub 提交 `014ce28 Add learning evidence vault` 已推送到 `origin/main`。
- Vercel Production 部署 `https://ronghuacao66-lang-codex-mastery-n70485dhc-crh-s-projects.vercel.app` 已为 `Ready`，主域名 alias 已绑定。

### 当前风险

- 证据成熟度采用本地启发式评分，只用于学习复盘，不代表认证结果。
- 跨设备学习资产仍需要通过本地学习档案备份与恢复完成。
- 当前工作区仍保留未跟踪 `outputs/` 交付物，本轮不会提交。

### 下一步行动

本轮功能已完成。六小时交付版后续只处理闭环 QA 和明显缺陷，不再继续扩张新模块。

## 2026-06-15 学习路径智能推荐

### 当前目标

继续完善 `Codex Mastery` 的学习操作系统能力，让 `/progress` 能根据用户当前学习资产主动推荐下一步行动。

### 当前完成

- 已新增 `components/LearningPathAdvisor.tsx`。
- 已在 `/progress` 接入“学习路径推荐”面板。
- 面板只读聚合已有本地状态：
  - `codex-mastery:completed-days`
  - `codex-mastery:watched-videos`
  - `codex-mastery:review-history`
  - `codex-mastery:project-checklist`
- 已展示当前阶段、训练完成、视频完成、项目检查和复盘沉淀。
- 已生成推荐行动队列：
  - 继续训练
  - 推进项目
  - 沉淀复盘
  - 补充视频
- 已支持复制“下一步 Prompt”，用于让 Codex 生成 90 分钟行动计划、最小成果物、任务 Prompt 和验证清单。
- 已更新 README、DECISIONS、TASK_STATE、CHANGELOG_AI 和 HANDOVER。
- 已创建并推送功能提交 `8986d2a Add learning path advisor`。
- Vercel Production 部署 `https://ronghuacao66-lang-codex-mastery-960om4q61-crh-s-projects.vercel.app` 已为 `Ready`。
- 主域名 alias 已绑定：`https://ronghuacao66-lang-codex-mastery.vercel.app`。
- `npm run typecheck` 已通过。
- `npm run audit:videos`、`npm run lint`、`npm run build` 已通过。
- Browser 已验证桌面 1280×720 和移动端 375×812 均正常且无横向溢出。

### 当前风险

- 推荐是本地启发式规则，不等同于 AI 个性化学习规划。
- 推荐依赖当前浏览器 localStorage，跨设备仍需使用本地学习档案备份与恢复。
- 当前工作区仍保留未跟踪 `outputs/` 交付物，本轮不会提交。

### 下一步行动

本轮功能已完成。下一步继续推进新的独立能力时，仍需先恢复项目状态文件并确认工作区范围。

## 2026-06-15 Prompt 质量评分器

### 当前目标

继续完善 `Codex Mastery` 的 Prompt 训练能力，让 `/task-builder` 从“任务生成器”升级为“任务生成 + Prompt 质量评分”的训练工具。

### 当前完成

- 已增强 `components/TaskBuilderClient.tsx`。
- `/task-builder` 现在按 6 个维度评估 Codex Prompt：
  - 目标清晰度
  - 上下文密度
  - 约束边界
  - 完成标准
  - 验证计划
  - 输出格式
- 每个维度显示得分、状态、证据说明和改进建议。
- 总分显示为优秀、可执行、需补齐或风险较高。
- 新增下一步改进建议。
- 新增复制评分报告。
- 已更新 README、DECISIONS、TASK_STATE、CHANGELOG_AI 和 HANDOVER。
- 已创建并推送功能提交 `4aecb29 Add prompt quality scoring`。
- Vercel Production 部署 `https://ronghuacao66-lang-codex-mastery-qeemn6c2t-crh-s-projects.vercel.app` 已为 `Ready`。
- 主域名 alias 已绑定：`https://ronghuacao66-lang-codex-mastery.vercel.app`。
- `npm run typecheck` 已通过。
- `npm run audit:videos`、`npm run lint`、`npm run build` 已通过。
- Playwright CLI 已验证桌面默认预设、清空低分状态和移动端 375×812 均正常且无横向溢出。

### 当前风险

- 评分是本地启发式训练反馈，不是模型执行成功率保证。
- 当前不保存评分历史，避免增加新的本地状态和备份范围。
- 当前工作区仍保留未跟踪 `outputs/` 交付物，本轮不会提交。

### 下一步行动

本轮功能已完成。下一步继续推进新的独立能力时，仍需先恢复项目状态文件并确认工作区范围。

## 2026-06-14 训练复盘启动器

### 当前目标

继续完善 `Codex Mastery` 的学习结果沉淀能力，让用户从 `/progress` 直接生成每日训练复盘草稿，并进入 `/reviews` 继续复盘。

### 当前完成

- 已新增 `components/TrainingReviewLauncher.tsx`。
- 已在 `/progress` 接入“训练复盘启动器”。
- 面板会基于当前完成状态生成：
  - 今日目标
  - 完成成果物
  - 卡点
  - 明日行动
- 支持复制复盘 Prompt。
- 支持同步到复盘中心草稿 `review-daily-codex-training`。
- 支持一键进入 `/reviews`。
- 已更新 README、DECISIONS、TASK_STATE、CHANGELOG_AI 和 HANDOVER。
- 已创建并推送功能提交 `606ad5e Add training review launcher`。
- Vercel Production 部署 `https://ronghuacao66-lang-codex-mastery-badr57vy7-crh-s-projects.vercel.app` 已为 `Ready`。
- 主域名 alias 已绑定：`https://ronghuacao66-lang-codex-mastery.vercel.app`。
- `npm run typecheck` 已通过。
- `npm run audit:videos`、`npm run lint`、`npm run build` 已通过。
- Playwright CLI 已验证桌面同步草稿成功，复盘中心可读取草稿，桌面和移动端 375×812 均无横向溢出。

### 当前风险

- 同步会覆盖每日训练复盘模板当前草稿。
- 草稿只代表当前浏览器 localStorage 状态。
- 当前工作区仍保留未跟踪 `outputs/` 交付物，本轮不会提交。

### 下一步行动

本轮功能已完成。下一步继续推进新的独立能力时，仍需先恢复项目状态文件并确认工作区范围。

## 2026-06-14 学习成就与连续训练

### 当前目标

继续完善 `Codex Mastery` 的学习闭环，让 `/progress` 不只展示完成百分比，还能反馈学习成就、连续推进和下一里程碑。

### 当前完成

- 已新增 `components/ProgressAchievementsPanel.tsx`。
- 已在 `/progress` 接入“学习成就与连续训练”面板。
- 面板基于 `codex-mastery:completed-days` 推导 6 个成就：
  - 启动 Codex OS
  - 第一周闭环
  - 半程突破
  - 业务实战就绪
  - 连续推进者
  - Codex Mastery 毕业
- 已显示成就解锁数量、最长连续 Day、下一里程碑、今日推进建议和每周下一项。
- 已支持复制学习成就报告。
- 已在 `ProgressCenterClient` 写入进度后广播本地事件，让成就面板同页实时更新。
- 已更新 README、DECISIONS、TASK_STATE、CHANGELOG_AI 和 HANDOVER。
- 已创建并推送功能提交 `f02a21b Add progress achievements panel`。
- Vercel Production 部署 `https://ronghuacao66-lang-codex-mastery-dqa0226ys-crh-s-projects.vercel.app` 已为 `Ready`。
- 主域名 alias 已绑定：`https://ronghuacao66-lang-codex-mastery.vercel.app`。
- `npm run typecheck` 已通过。
- `npm run audit:videos`、`npm run lint`、`npm run build` 已通过。
- Playwright CLI 已验证桌面和移动端 375×812 均无横向溢出。

### 当前风险

- 成就数据只代表当前浏览器 localStorage 状态。
- 连续训练按 Day 编号连续段计算，不等同于自然日签到。
- 当前工作区仍保留未跟踪 `outputs/` 交付物，本轮不会提交。

### 下一步行动

本轮功能已完成。下一步继续推进新的独立能力时，仍需先恢复项目状态文件并确认工作区范围。

## 2026-06-14 备份导入预览与选择性恢复

### 当前目标

继续完善 `Codex Mastery` 的个人学习资产保护能力，让本地备份恢复从“选择文件即覆盖”升级为“预览后选择性确认恢复”。

### 当前完成

- 已在 `components/LocalDataBackupPanel.tsx` 中新增备份预览状态。
- 选择备份文件后，页面会显示可恢复数据类、文件名和导出时间。
- 支持全选、清空、取消和单项勾选恢复范围。
- 点击“确认恢复”后只恢复用户勾选的数据类，未勾选数据不会覆盖本地状态。
- 已更新 README、DECISIONS、TASK_STATE、CHANGELOG_AI 和 HANDOVER。
- 已创建并推送功能提交 `8e8994d Add backup restore preview`。
- Vercel Production 部署 `https://ronghuacao66-lang-codex-mastery-bwjy2okax-crh-s-projects.vercel.app` 已为 `Ready`。
- 主域名 alias 已绑定：`https://ronghuacao66-lang-codex-mastery.vercel.app`。
- `npm run typecheck` 已通过。
- `npm run audit:videos`、`npm run lint`、`npm run build` 已通过。
- Playwright CLI 已验证桌面端上传备份后不提前覆盖 localStorage，确认后只恢复勾选的 2 类数据，未勾选主题保持原值。
- Playwright CLI 已验证桌面 1280 和移动 375×812 均无横向溢出。

### 当前风险

- 备份文件可能包含用户复盘内容和项目执行记录，应由用户自行保管，不建议公开分享。
- 恢复完成后页面提示用户刷新，让各模块重新读取最新状态。
- 当前工作区仍保留未跟踪 `outputs/` 交付物，本轮不会提交。

### 下一步行动

本轮功能已完成。下一步继续推进新的独立能力时，仍需先恢复项目状态文件并确认工作区范围。

## 2026-06-13 本地学习档案备份与恢复

### 当前目标

继续完善 `Codex Mastery` 的个人学习资产保护能力，让用户可以导出和导入浏览器本地保存的学习进度、复盘、项目记录等数据。

### 当前完成

- 已新增 `components/LocalDataBackupPanel.tsx`。
- 已在 `/progress` 学习进度中心接入“本地学习档案：备份与恢复”面板。
- 支持导出白名单 localStorage 数据为 JSON 文件。
- 支持导入本站备份 JSON，并只恢复白名单 key。
- 备份范围覆盖：30 天训练进度、收藏资源、视频观看记录、复盘草稿、复盘历史、项目交付检查、项目执行记录和主题设置。
- 错误格式文件不会覆盖当前本地数据。
- 已更新 README、DECISIONS、TASK_STATE、CHANGELOG_AI 和 HANDOVER。
- `npm run typecheck` 已通过。
- `npm run audit:videos`、`npm run lint`、`npm run build` 已通过。
- Playwright 已验证桌面导出备份、导入恢复 7 类本地数据成功，移动端 375×812 无横向溢出。
- 终端已校验备份 JSON 结构包含 `app = Codex Mastery`、`version = 1` 和白名单数据。

### 当前风险

- 备份文件可能包含用户复盘内容和项目执行记录，应由用户自行保管，不建议公开分享。
- 导入备份会覆盖本地同名学习状态，导入后需要刷新页面让各模块重新读取。
- 当前工作区仍保留未跟踪 `outputs/` 交付物，本轮不会提交。

### 下一步行动

当前本轮开发与验证已完成。下一步可提交并推送本轮网站能力变更；提交时需排除不属于本轮网站能力的 `outputs/` 交付物。

## 2026-06-13 项目组合进度总览

### 当前目标

继续完善 `Codex Mastery` 项目实战中心，让用户在 `/projects` 页面直接看到 8 个项目的组合交付进度，并能复制整体进度报告。

### 当前完成

- 已在 `/projects` 顶部新增项目组合进度总览。
- 总览展示整体完成度、检查项完成数、完成项目数和建议优先推进项目。
- 展示进度最高的 3 个项目，帮助用户快速判断当前推进状态。
- 支持复制“Codex Mastery 项目组合进度报告”。
- 报告基于当前浏览器的 `codex-mastery:project-checklist` 本地状态生成。
- 已更新 README、DECISIONS、TASK_STATE、CHANGELOG_AI 和 HANDOVER。
- `npm run typecheck` 已通过。
- `npm run audit:videos`、`npm run lint`、`npm run build` 已通过。
- Playwright 已验证桌面项目组合总览数值正确、复制入口存在，移动端 375×812 无横向溢出。

### 当前风险

- 项目组合总览只代表当前浏览器 localStorage 状态，不跨设备同步。
- 当前工作区仍保留未跟踪 `outputs/` 交付物，本轮不会提交。

### 下一步行动

当前本轮开发与验证已完成。下一步可提交并推送本轮网站能力变更；提交时需排除不属于本轮网站能力的 `outputs/` 交付物。

## 2026-06-13 项目执行记录导入 Markdown

### 当前目标

继续完善 `Codex Mastery` 项目实战中心闭环，让用户导出的项目执行记录 Markdown 可以重新导入项目详情页继续编辑。

### 当前完成

- 已在 `/projects/[id]` 执行记录区新增“导入 Markdown”按钮。
- 支持导入本站导出的项目执行记录 Markdown。
- 可恢复当前阶段、已完成内容、验证证据、风险 / 卡点、下一步行动和补充说明。
- 可根据“已完成检查项”标题恢复交付检查清单进度。
- 错误格式文件不会覆盖当前记录。
- 已更新 README、DECISIONS、TASK_STATE、CHANGELOG_AI 和 HANDOVER。
- `npm run typecheck` 已通过。
- `npm run audit:videos`、`npm run lint`、`npm run build` 已通过。
- Playwright 已验证桌面导入执行记录和 2 个检查项成功，移动端 375×812 无横向溢出。

### 当前风险

- 检查项恢复依赖标题匹配；用户手工大幅改写检查项标题后可能无法完整恢复。
- 项目执行记录和检查项仍保存在当前浏览器 localStorage，清理浏览器数据会丢失。
- 当前工作区仍保留未跟踪 `outputs/` 交付物，本轮不会提交。

### 下一步行动

当前本轮开发与验证已完成。下一步可提交并推送本轮网站能力变更；提交时需排除不属于本轮网站能力的 `outputs/` 交付物。

## 2026-06-13 复盘中心导入后另存历史

### 当前目标

继续完善 `Codex Mastery` 网站复盘中心闭环，让用户导入本地 Markdown 复盘后，可以直接把导入内容沉淀为历史记录。

### 当前完成

- 已在 `/reviews` 导入成功提示中新增“另存为历史”操作。
- 导入成功后会保留本次导入快照；点击“另存为历史”会写入 `codex-mastery:review-history`。
- 保留原有隐私策略：导入不会自动保存历史，必须用户手动确认。
- 已更新 README、DECISIONS、TASK_STATE、CHANGELOG_AI 和 HANDOVER。
- `npm run typecheck` 已通过。
- `npm run audit:videos`、`npm run lint`、`npm run build` 已通过。
- Playwright 已验证桌面导入后另存历史成功，移动端 375×812 无横向溢出。

### 当前风险

- 导入后提示中的“另存为历史”保存的是导入时的快照；如果用户继续编辑，应使用页面原有“保存历史”按钮保存编辑后的版本。
- 历史复盘仍保存在当前浏览器 localStorage，清理浏览器数据会丢失。
- 当前工作区已有 2026-06-12 文档交付相关未提交变更和 `outputs/` 目录，本轮不会回滚或覆盖。

### 下一步行动

当前本轮开发与验证已完成。下一步可提交并推送本轮网站能力变更；提交时需排除不属于本轮网站能力的 `outputs/` 交付物。

## 2026-06-12 提效小工具教程文档

### 当前目标

生成用户要求的《提效小工具使用教程》Word 文档，覆盖魔法梯子、GPT Plus 共享会员、WorkBuddy 和 Codex 的使用方法。

### 当前完成

- 已生成最终 Word 文档：`outputs/efficiency-tools-guide/提效小工具使用教程.docx`。
- 已生成可追溯脚本：`outputs/efficiency-tools-guide/generate_efficiency_tools_guide.py`。
- 已使用 Microsoft Word 导出 PDF 并通过 Poppler 渲染 8 页 PNG 完成视觉检查。
- 已修复首轮第 9 页孤立尾页问题。
- 已更新 `TASK_STATE.md`、`DECISIONS.md`、`CHANGELOG_AI.md` 和本文件。

### 当前风险

- 文档引用的外部链接、价格和服务规则未进行实时网页核验，后续可能变化。
- 第三方 GPT Plus 共享会员与网络连接工具存在隐私、合规、稳定性、封号和售后风险，文档已明确提示。
- Documents 标准 `render_docx.py` 因本机 LibreOffice 依赖缺失未能直接运行，本轮改用 Word 导出 PDF 后渲染检查。

### 下一步行动

当前文档交付任务已完成。若后续需要改版，优先修改生成脚本并重新生成 DOCX，再重复 PDF/PNG 视觉检查。

## 更新时间

2026-06-12 14:30 CST

## 当前目标

以项目执行负责人方式推进 `Codex Mastery`：保持项目状态可追溯，完成稳定交付、内容质量、交互体验、公网部署和后续 GitHub 推送。

## 当前完成

- 本地站点已恢复访问：`http://localhost:3000`。
- 本地开发服务已按需停止；如需本地预览，可运行 `npm run dev -- -p 3000`。
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
  - `reviews.json`：5 条
  - `security.json`：6 条
  - `task-presets.json`：4 条
  - `templates.json`：5 条
  - `tools.json`：7 条
  - `videos.json`：10 条，均为当前 Bilibili 接口检查可存在资源
  - `workflows.json`：5 条
- 已生成 `content/*.md` 作为可读备份。
- 第二项任务“项目健康检查”：已完成。
- 第三项任务“移动端与交互体验检查”：已完成。
- 第四项任务“GitHub + Vercel 上线准备”：已完成；本地 Git、GitHub 推送、Vercel 自动部署均已打通。
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
- 2026-06-09 06:23 CST 已再次测试 SSH，结果仍为 `Permission denied (publickey)`，说明公钥尚未添加到 GitHub 或尚未生效。
- 2026-06-09 06:23 CST 已重新将项目专用 SSH 公钥复制到剪贴板，并再次打开 GitHub SSH key 添加页面。
- 2026-06-09 06:50 CST 已确认 GitHub SSH 认证通过：
  - `ssh -T git@github.com` 返回 `Hi ronghuacao66-lang! You've successfully authenticated, but GitHub does not provide shell access.`
- 已将 `origin` 切换为 SSH remote：
  - `git@github.com:ronghuacao66-lang/codex-mastery.git`
- 已完成 GitHub push：
  - `git push -u origin main`
  - 远程 `origin/main` 当前指向 `55cceb3`
- 已完成视频精选链接巡检与交互标记：
  - `data/videos.json` 为每条视频新增 `linkStatus`。
  - Bilibili 链接命令行 HTTP 检查返回 200，标记为“链接可访问”。
  - YouTube 链接在当前本机命令行网络下超时，标记为“网络不可判定”，等待可访问 YouTube 的网络或浏览器复核。
  - 抖音精选链接命令行 HTTP 检查返回 404，标记为“疑似失效”，保留供人工复核。
  - OpenAI Academy 旧链接返回 404，已替换为当前可访问的官方链接 `https://academy.openai.com/en/public/videos/introduction-to-codex-2026-03-02`。
  - 视频卡片已新增链接状态徽标，用户可以在页面上直接识别外部链接健康状态。
  - `content/videos.md` 已重新由数据导出，保留链接状态备份。
- 已提交并推送视频链接巡检更新：
  - 本地提交：`4ef9b62 Add video link health status`
  - GitHub `origin/main`：`4ef9b62679f31c243fcea25819c0db8833a5dc1e`
- GitHub push 已触发 Vercel Production 自动部署：
  - 最新部署：`https://ronghuacao66-lang-codex-mastery-g1qrmaj9m-crh-s-projects.vercel.app`
  - 状态：`Ready`
  - 主域名 alias：`https://ronghuacao66-lang-codex-mastery.vercel.app`
- 已处理视频精选中两个疑似失效的抖音链接：
  - 删除旧的 404 抖音精选 URL 引用。
  - 替换为两个命令行 HTTP 检查返回 200 的 Bilibili 中文教程资源。
  - 更新 `/videos` 页面说明，不再声称当前包含抖音精选资源。
  - 重新导出 `content/videos.md`。
  - 当前 `data/videos.json` 和 `content/videos.md` 中已无 `likely_broken` 状态。
- 按用户最新要求，已移除当前无法确认正常打开播放的视频：
  - 删除 3 条 `network_or_timeout` 的 YouTube 视频。
  - 当前视频中心只保留 9 条 `linkStatus.status = ok` 的视频。
  - 当前视频平台为 Bilibili 与 OpenAI Academy。
  - `data/videos.json`、`content/videos.md` 和 `/videos` 页面说明已同步。
- 已提交并推送“去除不可确认播放视频”更新：
  - 本地提交：`9a2496e Remove unverified video links`
  - GitHub `origin/main`：`9a2496ed7866d47a2d9a09f1772c46e10764cff5`
- GitHub push 已触发 Vercel Production 自动部署：
  - 最新部署：`https://ronghuacao66-lang-codex-mastery-cclt03ssh-crh-s-projects.vercel.app`
  - 状态：`Ready`
  - 主域名 alias：`https://ronghuacao66-lang-codex-mastery.vercel.app`
- 已新增视频资源巡检命令：
  - `npm run audit:videos`
  - 当前 9 条视频全部返回 HTTP 200。
  - README 已更新为当前实际视频平台：Bilibili 与 OpenAI Academy。
- 已完成全站当前文案一致性清理：
  - 首页“精选视频”统计提示改为 Bilibili、OpenAI Academy。
  - 视频中心默认推荐从已删除的 YouTube id 改为当前存在的 Bilibili 入门视频。
  - `VideoItem` 平台类型收窄为当前实际平台：Bilibili、OpenAI Academy。
  - 视频链接状态类型收窄为当前对外保留的 `ok`。
- 已按用户最新要求将视频中心改为只保留 Bilibili：
  - 删除 OpenAI Academy 视频条目。
  - 删除 6 条 Bilibili 接口返回 `-404`、浏览器显示“视频不见了”的旧 BV 链接。
  - 当前 `data/videos.json` 保留 10 条 Bilibili 视频。
  - `npm run audit:videos` 已升级为 Bilibili 视频信息接口校验，要求返回 `code=0`。
  - `content/videos.md` 已重新导出。
- 已新增学习进度中心：
  - 新增 `/progress` 页面。
  - 复用首页已有 `codex-mastery:completed-days` 本地进度状态。
  - 支持总进度、下一步任务、最近完成、周进度、30 天完成网格。
  - 支持标记完成、取消完成、重置进度、复制学习进度报告和复制单日摘要。
  - 已从桌面/移动导航和首页接入。
- 已新增复盘中心：
  - 新增 `/reviews` 页面。
  - 新增 `data/reviews.json`，包含 5 套复盘模板。
  - 支持每日训练、Prompt 迭代、项目交付、Bug 修复、安全售前拜访复盘。
  - 支持动态输入、自动生成复盘报告、复制报告、复制给 Codex 的深度复盘 Prompt。
  - 支持将当前复盘报告导出为本地 Markdown 文件。
  - 支持导入本地 Markdown 复盘文件并恢复输入草稿。
  - 支持将当前复盘保存到本地历史列表，并从历史记录继续编辑、复制或删除。
  - 复盘草稿保存在本地浏览器 `codex-mastery:review-drafts`。
  - 复盘历史保存在本地浏览器 `codex-mastery:review-history`，最多保留 20 条。
  - 已从桌面/移动导航和首页接入。
- 已增强项目实战中心：
  - 8 个项目均已新增结构化 `deliveryChecklist`。
  - 每个项目包含 5 条交付检查项，覆盖验收标准和证据要求。
  - `/projects` 页面支持勾选交付检查项、显示完成进度和复制项目交付清单。
  - `/projects/[id]` 页面支持查看项目详情、填写执行记录、复制记录和导出 Markdown。
  - 项目交付进度保存在本地浏览器 `codex-mastery:project-checklist`。
  - 项目执行记录保存在本地浏览器 `codex-mastery:project-execution-records`。
  - `content/projects.md` 已由 `data/projects.json` 重新导出。
- 已完成移动端导航优化：
  - 移动端常用入口固定为控制台、任务、30天、进度、复盘。
  - 新增顶部“模块”按钮。
  - 新增移动端“全部模块”抽屉，包含全站模块入口。
  - “全部模块”抽屉已升级为分组列表，显示当前模块、模块说明，并支持 Esc 关闭和背景滚动锁定。
  - 桌面侧边栏保持不变。
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
  - 已根据用户提供的 GitHub 用户名配置并最终切换远程地址：
    - `origin`: `git@github.com:ronghuacao66-lang/codex-mastery.git`
  - 已尝试 `git push -u origin main`，但失败：
    - `fatal: could not read Username for 'https://github.com': terminal prompts disabled`
    - 2026-06-09 01:35 CST 再次尝试失败：`fatal: could not read Username for 'https://github.com': Device not configured`
  - 已尝试 GitHub SSH 认证，但失败：
    - `git@github.com: Permission denied (publickey).`
  - 已尝试直接下载 GitHub CLI release `v2.93.0`，但连接 GitHub 443 超时。
  - 已确认 `gh auth status` 当前仍未登录，原因是 OAuth token 交换超时。
  - 已生成并配置项目专用 SSH key，公钥已添加到 GitHub，SSH 认证通过。
- 本机 macOS 电源策略已于 2026-06-16 10:24 CST 按用户要求重新调整，已开启“合盖不影响 Codex 继续跑任务”的系统级设置：
  - Battery Power：`sleep 0`、`displaysleep 0`、`disksleep 0`
  - AC Power：`sleep 0`、`displaysleep 0`、`disksleep 0`
  - `SleepDisabled`：`true`

## 当前进度

- 项目治理基线：已建立。
- 第一项任务“建立项目状态与决策记录”：已完成。
- 第二项任务“项目健康检查”：已完成。
- 第三项任务“移动端与交互体验检查”：已完成。
- 第四项任务“GitHub + Vercel 上线准备”：已完成。
- 第五项任务“视频资源可用性治理”：已完成，当前只保留 10 条 Bilibili 视频并提供 `npm run audit:videos`。
- 第六项任务“学习进度中心”：已完成、提交、推送并上线。
- 当前任务“视频中心纯 Bilibili 与失效链接修复”：已完成、提交、推送并上线。
- 第七项任务“复盘中心”：已完成、提交、推送并由 Vercel 部署为 Ready。
- 第八项任务“移动端导航优化”：已完成、提交、推送并由 Vercel 部署为 Ready。
- 第九项任务“复盘中心导出 Markdown”：已完成、提交、推送并由 Vercel 部署为 Ready。
- 第十项任务“移动端全部模块抽屉优化”：已完成、提交、推送并由 Vercel 部署为 Ready。
- 第十一项任务“复盘中心历史列表”：已完成、提交、推送并由 Vercel 部署为 Ready。
- 第十二项任务“项目实战中心交付检查清单”：已完成、提交、推送并由 Vercel 部署为 Ready。
- 第十三项任务“复盘中心导入 Markdown”：已完成、提交、推送并由 Vercel 部署为 Ready。
- 第十四项任务“项目实战详情页与执行记录导出”：已完成、提交、推送并由 Vercel 部署为 Ready。

## 当前风险

- GitHub 远程 `main` 已更新为本地整理后的正确项目结构，当前通过 SSH remote 推送。
- 当前视频中心只展示 Bilibili；不展示 OpenAI Academy、YouTube、抖音精选或任何 `network_or_timeout` / `likely_broken` 视频。
- Bilibili 普通页面 HTTP 200 不能证明视频存在，后续必须以 `npm run audit:videos` 的接口校验结果为准。
- Vercel 项目远端设置仍显示 `Framework Preset: Other`，但仓库内 `vercel.json` 已显式覆盖 Next.js 部署配置；后续 GitHub 自动部署应保留该文件。
- 本机 `curl` 访问 Vercel 域名仍出现超时，疑似本机网络到 Vercel 边缘节点不稳定；Vercel CLI inspect 与 Chrome 标签标题已验证部署可用。
- 不应在聊天中索要或保存 Vercel 密码、验证码或长期 token；认证应由用户在 Vercel 官方页面完成。
- 系统级上下文压缩不可由模型关闭，当前已通过 `HANDOVER.md` 和状态文件保护关键上下文。
- `localhost:3000` 依赖本机开发服务；服务停止后本地网址会打不开。
- 外部视频链接可能随平台规则变化失效，需要后续定期巡检。
- 移动端全部模块抽屉文字更多，需要验证小屏滚动、关闭交互和无横向溢出。
- 复盘报告导出依赖浏览器下载能力；移动端保存位置由系统决定。
- 复盘历史只保存在当前浏览器 localStorage，清理浏览器数据会丢失。
- 复盘历史可能包含用户填写内容，当前设计不上传服务器。
- 复盘 Markdown 导入优先兼容本站导出的报告和 Codex Prompt 字段块，用户大幅改写结构后可能无法识别。
- 项目交付检查进度只保存在当前浏览器 localStorage，清理浏览器数据会丢失。
- 项目执行记录只保存在当前浏览器 localStorage，清理浏览器数据会丢失。
- 项目卡片信息密度提升，后续继续增加项目字段时应考虑详情页或分层展示。
- 旧状态文件曾记录过与当前项目无关的目标，已通过本轮状态更新纠偏。
- 本地执行 `npm run build` 时不应与 `npm run dev` 混用同一个 `.next`；若首页 500，需要停止 dev server、删除 `.next` 并重启。
- 本机已重新开启合盖长时间运行 Codex 的系统级设置；合盖运行会增加发热和耗电风险，不应直接放入包内长时间运行。

## 待办事项

1. 可选：为复盘中心增加导入后的“另存为历史”自动提示。
2. 可选：为项目执行记录增加导入能力。
3. 后续新增视频前必须运行 `npm run audit:videos`。

## 下一步行动

当前下一步可选为“为复盘中心增加导入后的另存提示，或为项目执行记录增加导入能力”：

- 目标：继续提升平台真实使用体验。
- 输入：当前代码、数据与状态文件。
- 输出：后续小步改进和可追溯状态记录。
- 验收标准：相关变更继续通过 `npm run audit:videos`、`npm run typecheck`、`npm run lint`、`npm run build`。

## 最近验证

- `npm run build`：通过。
- 关键路由 HTTP 检查：通过。
- 浏览器打开首页：通过。
- 本轮状态文件自查：通过。
- 本轮项目健康检查：通过，已修复本地 dev server 运行态污染问题。
- 本轮移动端与交互体验检查：通过，已修复首页进度撤销和统计动态化问题。
- 2026-06-16 10:24 本机电源策略检查：`pmset -g custom` 确认 Battery Power 与 AC Power 下 `sleep`、`displaysleep`、`disksleep` 均为 `0`；`/Library/Preferences/com.apple.PowerManagement.plist` 确认 `SleepDisabled` 为 `true`。
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
- 2026-06-09 06:23 CST：
  - `ssh -o BatchMode=yes -T git@github.com`：失败，`Permission denied (publickey)`。
  - `pbcopy < ~/.ssh/codex_maturity_github_ed25519.pub`：已重新复制公钥到剪贴板。
  - `npm run typecheck`：通过。
  - `npm run lint`：通过。
  - `npm run build`：通过，生成 14 个 App Router 页面。
- 2026-06-09 06:50 CST：
  - `ssh -T git@github.com`：认证通过。
  - `git remote set-url origin git@github.com:ronghuacao66-lang/codex-mastery.git`：已完成。
  - `git push -u origin main`：成功，`origin/main` 指向 `55cceb3`。
  - `npx --yes vercel@54.9.1 inspect ronghuacao66-lang-codex-mastery.vercel.app --scope crh-s-projects`：主域名 Production Deployment 状态为 `Ready`。
  - `npm run typecheck`：通过。
  - `npm run lint`：通过。
  - `npm run build`：通过，生成 14 个 App Router 页面。
- 2026-06-09 07:13 CST：
  - `npm run export:content`：通过，已更新 `content/videos.md`。
  - `npm run typecheck`：通过。
  - `npm run lint`：通过。
  - `npm run build`：通过，生成 14 个 App Router 页面。
  - `curl -I http://localhost:3000/videos`：本地视频页返回 200。
  - 本地 `next dev -p 3000` 验证完成后已停止。
- 2026-06-09 07:19 CST：
  - `git push`：成功，`origin/main` 指向 `4ef9b62`。
  - Vercel 自动 Production 部署：`Ready`。
  - 主域名 alias：已绑定最新部署。
- 2026-06-09 07:30 CST：
  - 替换两个 404 抖音精选链接：完成。
  - 删除 3 条当前无法确认正常播放的 YouTube 视频：完成。
  - 当前视频数据：9 条，平台为 Bilibili 与 OpenAI Academy，所有 `linkStatus.status` 均为 `ok`。
  - `rg network_or_timeout|manual_review|likely_broken|YouTube|youtube.com|抖音精选|douyin`：未发现残留于视频数据、导出内容和视频页说明。
  - `npm run export:content`：通过。
  - `npm run typecheck`：通过。
  - `npm run lint`：通过。
  - `npm run build`：通过，生成 14 个 App Router 页面。
- 2026-06-09 07:37 CST：
  - `git push`：成功，`origin/main` 指向 `9a2496e`。
  - Vercel 自动 Production 部署：`Ready`。
  - 主域名 alias：已绑定最新部署。
- 2026-06-09 07:45 CST：
  - `npm run audit:videos`：通过，9 条视频均返回 HTTP 200。
  - `npm run typecheck`：通过。
  - `npm run lint`：通过。
  - `npm run build`：通过。
- 2026-06-09 07:50 CST：
  - 当前文案一致性扫描：发现并修复首页视频平台提示、视频默认推荐 id、视频平台类型定义不一致。
  - `rg YouTube|youtube|抖音精选|douyin|network_or_timeout|likely_broken|manual_review app components data types content README.md scripts package.json`：无残留。
  - `npm run audit:videos`：通过。
  - `npm run typecheck`：通过。
  - `npm run lint`：通过。
  - `npm run build`：通过。
- 2026-06-09 13:38 CST：
  - `npm run export:content`：通过。
  - `npm run audit:videos`：通过，10 条 Bilibili 视频均返回 `code=0`。
  - 站点运行内容残留检查：无 OpenAI Academy、YouTube、抖音精选、失效 BV、异常视频状态残留。
- 2026-06-09 13:48 CST：
  - `npm run typecheck`：通过。
  - `npm run lint`：通过。
  - `npm run build`：通过，生成 15 个 App Router 页面。
  - 本地生产服务：`/`、`/videos`、`/progress` 均返回 200。
  - Browser 验证：`/videos` 显示 10 个 Bilibili 链接，无 OpenAI Academy 和旧失效 BV；`/progress` 显示学习进度中心和复制进度报告按钮。
- 2026-06-09 13:55 CST：
  - `git push`：成功，`origin/main` 指向 `5f14618`。
  - Vercel Production 部署：`https://ronghuacao66-lang-codex-mastery-j3h0tbrmi-crh-s-projects.vercel.app`，状态 `Ready`。
  - 主域名 alias：`https://ronghuacao66-lang-codex-mastery.vercel.app` 已绑定最新部署。
  - 公网 Browser 验证：`/videos` 显示 10 个 Bilibili 链接，无 OpenAI Academy 和旧失效 BV；`/progress` 显示学习进度中心和复制进度报告按钮。
- 2026-06-09 14:15 CST：
  - `npm run export:content`：通过，已生成 `content/reviews.md`。
  - `npm run audit:videos`：通过，10 条 Bilibili 视频均返回 `code=0`。
  - `npm run typecheck`：通过。
  - `npm run lint`：通过。
  - `npm run build`：通过，生成 16 个 App Router 页面。
  - Browser 验证：`/reviews` 显示复盘中心、核心复盘模板、动态输入框、复制报告和复制给 Codex 按钮。
- 2026-06-09 14:24 CST：
  - `git push`：成功，`origin/main` 指向 `700c239`。
  - Vercel Production 部署：`https://ronghuacao66-lang-codex-mastery-axx00df6p-crh-s-projects.vercel.app`，状态 `Ready`。
  - 主域名 alias：`https://ronghuacao66-lang-codex-mastery.vercel.app` 已绑定最新部署。
  - 公网 Browser 与 `curl` 从本机网络访问 `/reviews` 超时；该问题与此前本机到 Vercel 边缘节点超时现象一致，未作为构建失败判据。
- 2026-06-09 15:46 CST：
  - `npm run audit:videos`：通过，10 条 Bilibili 视频均返回 `code=0`。
  - `npm run typecheck`：通过。
  - `npm run lint`：通过。
  - `npm run build`：通过，生成 16 个 App Router 页面。
  - Browser 375×812 验证：首页无页面级横向溢出，常用入口显示为控制台、任务、30天、进度、复盘，全部模块抽屉可打开。
  - Browser 375×812 验证：`/reviews` 无页面级横向溢出，复盘中心正常显示输入框。
- 2026-06-09 15:55 CST：
  - `git push`：成功，`origin/main` 指向 `31f0558`。
  - Vercel Production 部署：`https://ronghuacao66-lang-codex-mastery-lqwybjxvv-crh-s-projects.vercel.app`，状态 `Ready`。
  - 主域名 alias：`https://ronghuacao66-lang-codex-mastery.vercel.app` 已绑定最新部署。
- 2026-06-09 17:43 CST：
  - `npm run audit:videos`：通过，10 条 Bilibili 视频均返回 `code=0`。
  - `npm run typecheck`：通过。
  - `npm run lint`：通过。
  - `npm run build`：通过，生成 16 个 App Router 页面。
  - Playwright 桌面验证：`/reviews` 显示“导出 Markdown”和“下载”两个入口。
  - Playwright 下载验证：生成文件名 `每日-Codex-训练复盘-20260609.md`，内容为当前复盘报告 Markdown。
  - Playwright 375×812 验证：无页面级横向溢出，下载入口数量为 2。
- 2026-06-09 17:52 CST：
  - `git push`：成功，`origin/main` 指向 `b8378dd`。
  - Vercel Production 部署：`https://ronghuacao66-lang-codex-mastery-6fk72u5oz-crh-s-projects.vercel.app`，状态 `Ready`。
  - 主域名 alias：`https://ronghuacao66-lang-codex-mastery.vercel.app` 已绑定最新部署。
- 2026-06-09 21:45 CST：
  - `npm run audit:videos`：通过，10 条 Bilibili 视频均返回 `code=0`。
  - `npm run typecheck`：通过。
  - `npm run lint`：通过。
  - `npm run build`：通过，生成 16 个 App Router 页面。
  - Playwright 375×812 浅色模式验证：首页抽屉无横向溢出，背景滚动锁定为 `hidden`，13 个模块入口可见，Esc 可关闭。
  - Playwright 375×812 深色模式验证：`/reviews` 抽屉无横向溢出，当前模块显示为复盘，三个分组均可见。
- 2026-06-09 22:00 CST：
  - `git push`：成功，`origin/main` 指向 `886e9dd`。
  - Vercel Production 部署：`https://ronghuacao66-lang-codex-mastery-qkx9idfb6-crh-s-projects.vercel.app`，状态 `Ready`。
  - 主域名 alias：`https://ronghuacao66-lang-codex-mastery.vercel.app` 已绑定最新部署。
- 2026-06-09 22:15 CST：
  - `npm run audit:videos`：通过，10 条 Bilibili 视频均返回 `code=0`。
  - `npm run typecheck`：通过。
  - `npm run lint`：通过。
  - `npm run build`：通过，生成 16 个 App Router 页面。
  - Playwright 375×812 验证：保存 1 条历史复盘成功，历史记录包含复盘报告和 Codex Prompt。
  - Playwright 375×812 验证：继续编辑可恢复输入，删除后历史数量为 0，页面无横向溢出。
- 2026-06-09 22:23 CST：
  - `git push`：成功，`origin/main` 指向 `b676d68`。
  - Vercel Production 部署：`https://ronghuacao66-lang-codex-mastery-qz87ourlb-crh-s-projects.vercel.app`，状态 `Ready`。
  - 主域名 alias：`https://ronghuacao66-lang-codex-mastery.vercel.app` 已绑定最新部署。
- 2026-06-09 22:36 CST：
  - `npm run export:content`：通过，已更新 `content/projects.md`。
  - `npm run audit:videos`：通过，10 条 Bilibili 视频均返回 `code=0`。
  - `npm run typecheck`：通过。
  - `npm run lint`：通过。
  - `npm run build`：通过，生成 16 个 App Router 页面。
  - Playwright 桌面验证：`/projects` 显示 8 个“交付检查清单”，包含验收与证据字段。
  - Playwright 交互验证：勾选状态写入 `codex-mastery:project-checklist`，刷新后保持。
  - Playwright 375×812 验证：`/projects` 无页面级横向溢出，`scrollWidth = clientWidth = 375`。
  - `git push`：成功，`origin/main` 指向 `9eb363d`。
  - Vercel Production 部署：`https://ronghuacao66-lang-codex-mastery-3s1npllh4-crh-s-projects.vercel.app`，状态 `Ready`。
  - 主域名 alias：`https://ronghuacao66-lang-codex-mastery.vercel.app` 已绑定最新部署。
- 2026-06-09 22:57 CST：
  - `npm run audit:videos`：通过，10 条 Bilibili 视频均返回 `code=0`。
  - `npm run typecheck`：通过。
  - `npm run lint`：通过。
  - `npm run build`：通过，生成 16 个 App Router 页面。
  - Playwright 桌面验证：上传本站导出格式 Markdown 后，恢复 4 个输入字段并写入 `codex-mastery:review-drafts`。
  - Playwright 错误文件验证：上传非本站格式 Markdown 时显示错误提示，且不会覆盖已有草稿。
  - Playwright 375×812 验证：`/reviews` 无页面级横向溢出，`scrollWidth = clientWidth = 375`。
  - `git push`：成功，`origin/main` 指向 `dd2ce98`。
  - Vercel Production 部署：`https://ronghuacao66-lang-codex-mastery-eojwwd59f-crh-s-projects.vercel.app`，状态 `Ready`。
  - 主域名 alias：`https://ronghuacao66-lang-codex-mastery.vercel.app` 已绑定最新部署。
- 2026-06-09 23:14 CST：
  - `npm run audit:videos`：通过，10 条 Bilibili 视频均返回 `code=0`。
  - `npm run typecheck`：通过。
  - `npm run lint`：通过。
  - `npm run build`：通过，生成 24 个 App Router 页面，其中 8 个 `/projects/[id]` 静态详情页。
  - Playwright 桌面验证：`/projects` 显示 8 个“查看详情”入口，详情页显示执行记录、交付检查进度和导出预览。
  - Playwright 交互验证：填写执行记录、勾选检查项后写入 localStorage，刷新后仍保留。
  - Playwright 下载验证：导出文件名为 `AI学习助手-执行记录-20260609.md`。
  - Playwright 375×812 验证：项目详情页无页面级横向溢出，`scrollWidth = clientWidth = 375`。
  - `git push`：成功，`origin/main` 指向 `4ab2c77`。
  - Vercel Production 部署：`https://ronghuacao66-lang-codex-mastery-l3k85zw8m-crh-s-projects.vercel.app`，状态 `Ready`。
  - 主域名 alias：`https://ronghuacao66-lang-codex-mastery.vercel.app` 已绑定最新部署。

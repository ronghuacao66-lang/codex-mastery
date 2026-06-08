# Codex Mastery 内容备份

本目录保存从 `data/*.json` 导出的 Markdown 内容，便于人工审阅、GitHub diff 和内容备份。

## 生成方式

```bash
npm run export:content
```

## 内容文件

- [Codex Academy 知识文章](./articles.md)：来自 `data/articles.json`
- [30 天训练营](./daily-plan.md)：来自 `data/daily-plan.json`
- [Prompt Center](./prompts.md)：来自 `data/prompts.json`
- [项目实战中心](./projects.md)：来自 `data/projects.json`
- [安全售前专区](./security.md)：来自 `data/security.json`
- [Codex 任务生成器预设](./task-presets.md)：来自 `data/task-presets.json`
- [模板中心](./templates.md)：来自 `data/templates.json`
- [AI 工具库](./tools.md)：来自 `data/tools.json`
- [视频精选](./videos.md)：来自 `data/videos.json`
- [工作流中心](./workflows.md)：来自 `data/workflows.json`

维护原则：优先修改 `data/*.json`，再运行导出命令同步 `content/*.md`。

# Codex Mastery 项目规则

## 技术栈

- Next.js App Router
- React
- TypeScript
- TailwindCSS
- 本地 JSON 数据文件

## 目录约定

- `app/`：页面路由和全局布局。
- `components/`：可复用 UI 和客户端交互组件。
- `data/`：站点内容数据，必须写真实可用中文内容，不写占位文案。
- `lib/`：内容加载和通用工具函数。
- `types/`：内容数据类型。

## 运行命令

- 安装依赖：`npm install`
- 本地开发：`npm run dev`
- 类型检查：`npm run typecheck`
- 构建：`npm run build`
- 代码检查：`npm run lint`

## UI 要求

- 主体语言为中文，面向中国用户。
- 风格参考 Apple、OpenAI、Linear：极简、专业、克制。
- 颜色以黑、白、灰为主，少量蓝紫强调。
- 支持深色模式和移动端。
- 不使用廉价赛博朋克、霓虹灯、复杂背景或花哨动画。

## 数据规则

- 新增内容优先写入 `data/*.json`，再通过类型和组件渲染。
- Prompt 必须包含使用场景、正文、输入要求、输出要求和最佳实践。
- Academy 文章必须包含核心知识、错误案例、正确案例和最佳实践。
- 安全售前内容必须符合中国企业客户沟通语境，未知信息要标注，不编造事实。

## 验证流程

修改代码后优先运行：

1. `npm run typecheck`
2. `npm run lint`
3. `npm run build`

如果当前环境无法执行命令，交付说明必须明确说明未能验证的原因。

# Codex Mastery 部署指南

本文档用于把当前项目上传到 GitHub，并通过 Vercel 获得公网访问地址，例如 `https://your-project.vercel.app`。

## 1. 本地检查

在项目根目录执行：

```bash
npm install
npm run export:content
npm run typecheck
npm run lint
npm run build
```

全部通过后再上传 GitHub。

如果本地正在运行 `npm run dev`，建议先停止开发服务，再执行生产构建检查。`next dev` 和 `next build` 都会读写 `.next`，混用时可能导致 `localhost:3000` 短暂 500。恢复方式：

```bash
# 先停止 npm run dev
rm -rf .next
npm run dev
```

## 2. 初始化 Git 仓库

如果当前目录还不是 Git 仓库，执行：

```bash
git init
git add .
git commit -m "Initial Codex Mastery deployment"
git branch -M main
```

如果已经是 Git 仓库，只需要提交当前改动：

```bash
git add .
git commit -m "Prepare Vercel deployment"
```

## 3. 推送到 GitHub

先在 GitHub 创建一个空仓库，例如 `codex-mastery`，不要勾选自动生成 README。

然后在本地执行：

```bash
git remote add origin https://github.com/<your-name>/codex-mastery.git
git push -u origin main
```

如果已经配置过远程仓库，直接执行：

```bash
git push
```

## 4. 导入 Vercel

进入 Vercel Dashboard，选择 `Add New Project`，导入 GitHub 上的 `codex-mastery` 仓库。

推荐配置：

- Framework Preset：`Next.js`
- Install Command：`npm install`
- Build Command：`npm run build`
- Output Directory：保持默认，不要填写
- Root Directory：仓库根目录
- Node.js Version：`20.x` 或更高
- Environment Variables：无需配置

点击 Deploy 后，Vercel 会自动安装依赖、执行生产构建，并生成公网地址。

## 5. 部署后检查

部署完成后打开 Vercel 分配的域名，检查这些页面：

- `/`
- `/academy`
- `/task-builder`
- `/prompts`
- `/bootcamp`
- `/projects`
- `/presales`
- `/workflows`
- `/templates`
- `/tools`
- `/videos`

重点验证：

- 页面可正常打开。
- 搜索和筛选可用。
- 收藏按钮可点击。
- 复制按钮可复制内容。
- 深色模式可切换。
- 移动端没有横向滚动。

## 6. 内容维护流程

内容源文件在 `data/*.json`，Markdown 备份在 `content/*.md`。

修改内容时按这个顺序：

```bash
# 1. 修改 data/*.json
# 2. 重新生成 Markdown 备份
npm run export:content

# 3. 验证构建
npm run typecheck
npm run lint
npm run build

# 4. 提交并推送
git add data content
git commit -m "Update Codex Mastery content"
git push
```

Vercel 连接 GitHub 后，每次 push 到默认分支都会自动重新部署。

## 7. 常见问题

### Vercel 构建失败：Node 版本不匹配

在 Vercel Project Settings 中把 Node.js Version 设置为 `20.x` 或更高。项目 `package.json` 已声明：

```json
{
  "engines": {
    "node": ">=20.0.0"
  }
}
```

### Vercel 要求环境变量

本项目不需要环境变量。如果 Vercel 页面提示环境变量，可以直接跳过。

### Output Directory 怎么填

保持默认，不要填写。Next.js 项目由 Vercel 自动识别构建输出。

### content/*.md 是否需要手动编辑

不建议直接编辑。请优先修改 `data/*.json`，再运行 `npm run export:content` 重新生成 Markdown 备份。

### 本地首页突然 500 怎么办

如果刚运行过 `npm run build`，同时 `npm run dev` 也在运行，可能是 `.next` 目录被生产构建和开发服务混用。处理方式：

```bash
# 停止当前 dev server 后执行
rm -rf .next
npm run dev
```

恢复后重新访问 `http://localhost:3000`。

## 8. 官方文档

- [Vercel Next.js 部署文档](https://vercel.com/docs/frameworks/nextjs)
- [Vercel 构建配置文档](https://vercel.com/docs/deployments/configure-a-build)
- [Next.js 部署文档](https://nextjs.org/docs/app/building-your-application/deploying)

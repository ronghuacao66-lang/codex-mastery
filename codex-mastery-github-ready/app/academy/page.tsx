import { ArticleExplorer } from "@/components/ArticleExplorer";
import { SectionHeader } from "@/components/SectionHeader";
import { articles } from "@/lib/content";

export default function AcademyPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <SectionHeader
        eyebrow="Module 01"
        title="Codex Academy"
        description="全站最重要模块。用 10 篇中文知识文章掌握 Codex 的任务委托、工具差异、GCCD、任务拆解、AGENTS.md、项目管理、Debug、Agent 和效率提升。"
      />
      <ArticleExplorer items={articles} />
    </div>
  );
}

import { SectionHeader } from "@/components/SectionHeader";
import { ToolExplorer } from "@/components/ToolExplorer";
import { tools } from "@/lib/content";

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <SectionHeader
        eyebrow="Module 08"
        title="AI工具库"
        description="不是工具导航站，而是帮助中国用户理解 ChatGPT、Codex、Claude、Gemini、Cursor、Claude Code、NotebookLM 的定位、优势、局限和推荐工作流。"
      />
      <ToolExplorer items={tools} />
    </div>
  );
}

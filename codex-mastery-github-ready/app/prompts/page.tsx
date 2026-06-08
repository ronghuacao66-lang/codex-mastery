import { PromptExplorer } from "@/components/PromptExplorer";
import { SectionHeader } from "@/components/SectionHeader";
import { prompts } from "@/lib/content";

export default function PromptsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <SectionHeader
        eyebrow="Module 02"
        title="Prompt Center"
        description="30 条 Codex Prompt 和 20 条通用 AI Prompt。覆盖网站开发、工具开发、Bug 修复、Agent 开发、自动化办公、售前方案、复盘和决策。"
      />
      <PromptExplorer items={prompts} />
    </div>
  );
}

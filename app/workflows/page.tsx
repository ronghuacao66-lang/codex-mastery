import { SectionHeader } from "@/components/SectionHeader";
import { WorkflowExplorer } from "@/components/WorkflowExplorer";
import { workflows } from "@/lib/content";

export default function WorkflowsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <SectionHeader
        eyebrow="Module 06"
        title="工作流中心"
        description="5 套可落地工作流：客户拜访、售前方案、竞品分析、项目复盘、会议纪要。每套都能直接复制 Prompt 开始使用。"
      />
      <WorkflowExplorer items={workflows} />
    </div>
  );
}

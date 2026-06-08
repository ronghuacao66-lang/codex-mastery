import { SectionHeader } from "@/components/SectionHeader";
import { TaskBuilderClient } from "@/components/TaskBuilderClient";
import { taskPresets } from "@/lib/content";

export default function TaskBuilderPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <SectionHeader
        eyebrow="Practice Lab"
        title="Codex任务生成器"
        description="把模糊需求整理成 Goal、Context、Constraint、Definition of Done 和 Verification，生成可直接复制给 Codex 的工程任务。"
      />
      <TaskBuilderClient presets={taskPresets} />
    </div>
  );
}

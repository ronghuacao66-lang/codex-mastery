import { DailyPlanExplorer } from "@/components/DailyPlanExplorer";
import { SectionHeader } from "@/components/SectionHeader";
import { dailyPlan } from "@/lib/content";

export default function BootcampPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <SectionHeader
        eyebrow="Module 03"
        title="30天训练营"
        description="每天都有学习目标、理论、实操任务、Prompt、成果物和复盘问题。目标是 30 天后独立完成项目开发，并能把 Codex 用进真实工作流。"
      />
      <DailyPlanExplorer items={dailyPlan} />
    </div>
  );
}

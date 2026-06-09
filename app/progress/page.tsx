import { ProgressCenterClient } from "@/components/ProgressCenterClient";
import { SectionHeader } from "@/components/SectionHeader";
import { dailyPlan } from "@/lib/content";

export default function ProgressPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <SectionHeader
        eyebrow="Learning Progress"
        title="学习进度中心"
        description="集中管理 30 天训练营进度，查看下一步任务、周完成情况、成果物和可复制的学习进度报告。"
      />
      <ProgressCenterClient items={dailyPlan} />
    </div>
  );
}

import { LocalDataBackupPanel } from "@/components/LocalDataBackupPanel";
import { LearningEvidenceVault } from "@/components/LearningEvidenceVault";
import { LearningPathAdvisor } from "@/components/LearningPathAdvisor";
import { ProgressAchievementsPanel } from "@/components/ProgressAchievementsPanel";
import { ProgressCenterClient } from "@/components/ProgressCenterClient";
import { SectionHeader } from "@/components/SectionHeader";
import { TrainingReviewLauncher } from "@/components/TrainingReviewLauncher";
import { dailyPlan, projects, videos } from "@/lib/content";

export default function ProgressPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <SectionHeader
        eyebrow="Learning Progress"
        title="学习进度中心"
        description="集中管理 30 天训练营进度，查看下一步任务、周完成情况、成果物和可复制的学习进度报告。"
      />
      <ProgressCenterClient items={dailyPlan} />
      <LearningPathAdvisor dailyPlan={dailyPlan} projects={projects} videos={videos} />
      <LearningEvidenceVault dailyPlan={dailyPlan} projects={projects} videos={videos} />
      <ProgressAchievementsPanel items={dailyPlan} />
      <TrainingReviewLauncher items={dailyPlan} />
      <LocalDataBackupPanel />
    </div>
  );
}

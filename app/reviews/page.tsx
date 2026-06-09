import { ReviewCenterClient } from "@/components/ReviewCenterClient";
import { SectionHeader } from "@/components/SectionHeader";
import { reviewKits } from "@/lib/content";

export default function ReviewsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <SectionHeader
        eyebrow="Review System"
        title="复盘中心"
        description="把每日训练、Prompt 迭代、项目交付、Bug 修复和安全售前拜访沉淀成可复制的复盘报告与下一步 Codex 任务。"
      />
      <ReviewCenterClient kits={reviewKits} />
    </div>
  );
}

import { SectionHeader } from "@/components/SectionHeader";
import { VideoCenterClient } from "@/components/VideoCenterClient";
import { videos } from "@/lib/content";

export default function VideosPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <SectionHeader
        eyebrow="Learning Media"
        title="视频精选"
        description="精选 Bilibili 中当前确认存在的 Codex / Prompt / Agent 教学视频，按学习阶段组织，配套笔记模板、学习产出和链接健康状态。"
      />
      <VideoCenterClient items={videos} />
    </div>
  );
}

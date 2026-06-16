import { MeetingMinutesGenerator } from "@/components/MeetingMinutesGenerator";
import { SectionHeader } from "@/components/SectionHeader";

export default function MeetingMinutesPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <SectionHeader
        eyebrow="Office Automation"
        title="会议纪要生成器"
        description="输入会议主题、日期、参会人和原始记录，用本地模板逻辑生成会议背景、关键结论、行动项、风险和待确认问题。"
      />
      <MeetingMinutesGenerator />
    </div>
  );
}

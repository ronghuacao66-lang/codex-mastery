import { SecurityExplorer } from "@/components/SecurityExplorer";
import { SectionHeader } from "@/components/SectionHeader";
import { securityScenarios } from "@/lib/content";

export default function PresalesPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <SectionHeader
        eyebrow="Module 05"
        title="安全售前专区"
        description="面向零信任、SASE、数据安全、XDR、MSS 的中国企业售前场景。每个场景包含 Prompt、输入模板、输出模板和案例。"
      />
      <SecurityExplorer items={securityScenarios} />
    </div>
  );
}

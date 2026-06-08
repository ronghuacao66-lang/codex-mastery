import { SectionHeader } from "@/components/SectionHeader";
import { TemplateExplorer } from "@/components/TemplateExplorer";
import { templates } from "@/lib/content";

export default function TemplatesPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <SectionHeader
        eyebrow="Module 07"
        title="模板中心"
        description="客户分析、竞品分析、项目复盘、售前方案、Prompt 设计五套模板。用于把一次性 Prompt 升级为稳定工作方法。"
      />
      <TemplateExplorer items={templates} />
    </div>
  );
}

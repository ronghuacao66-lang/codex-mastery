import { ProjectExplorer } from "@/components/ProjectExplorer";
import { SectionHeader } from "@/components/SectionHeader";
import { projects } from "@/lib/content";

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <SectionHeader
        eyebrow="Module 04"
        title="项目实战中心"
        description="8 个高价值项目，从 AI 学习助手、知识库、售前助手到 Agent 助手。每个项目都包含目标、业务价值、步骤、Prompt 和优化建议。"
      />
      <ProjectExplorer items={projects} />
    </div>
  );
}

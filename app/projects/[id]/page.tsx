import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyButton } from "@/components/CopyButton";
import { ProjectExecutionClient } from "@/components/ProjectExecutionClient";
import { SectionHeader } from "@/components/SectionHeader";
import { Tag } from "@/components/Tag";
import { projects } from "@/lib/content";

type ProjectDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ id: project.id }));
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = projects.find((item) => item.id === id);
  if (!project) return {};
  return {
    title: `${project.title} · 项目实战中心`,
    description: project.goal
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;
  const project = projects.find((item) => item.id === id);
  if (!project) notFound();

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <SectionHeader
        eyebrow="Project Detail"
        title={project.title}
        description={project.goal}
        actions={
          <Link
            href="/projects"
            className="inline-flex h-10 items-center gap-2 rounded-md border border-line bg-panel px-3 text-sm font-medium text-ink transition hover:-translate-y-0.5 hover:border-accent/50 hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            返回项目
          </Link>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="space-y-5">
          <div className="rounded-lg border border-line bg-panel p-5 shadow-soft dark:shadow-darksoft">
            <div className="flex flex-wrap gap-2">
              <Tag active>{project.category}</Tag>
              <Tag>{project.difficulty}</Tag>
              <Tag>{project.duration}</Tag>
            </div>
            <p className="mt-5 text-sm leading-6 text-muted">
              <span className="font-semibold text-ink">业务价值：</span>
              {project.businessValue}
            </p>
          </div>

          <DetailBlock title="实现步骤" items={project.steps} />
          <DetailBlock title="成果物" items={project.deliverables} />
          <DetailBlock title="优化建议" items={project.optimizationTips} />

          <div className="rounded-lg border border-line bg-panel p-5 shadow-soft dark:shadow-darksoft">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-ink">Codex 实现 Prompt</p>
              <CopyButton value={project.prompt} label="复制 Prompt" />
            </div>
            <pre className="fine-scrollbar mt-4 max-h-80 overflow-auto whitespace-pre-wrap rounded-md border border-line bg-surface p-4 text-sm leading-6 text-ink">
              {project.prompt}
            </pre>
          </div>
        </section>

        <ProjectExecutionClient project={project} />
      </div>
    </div>
  );
}

function DetailBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-line bg-panel p-5 shadow-soft dark:shadow-darksoft">
      <p className="text-sm font-semibold text-ink">{title}</p>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}

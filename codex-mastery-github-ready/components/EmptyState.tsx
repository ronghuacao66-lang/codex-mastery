import { SearchX } from "lucide-react";

export function EmptyState({ title = "没有找到匹配内容", description = "请调整搜索词、分类或标签后再试。" }) {
  return (
    <div className="rounded-lg border border-dashed border-line bg-panel p-8 text-center">
      <SearchX className="mx-auto h-8 w-8 text-muted" />
      <p className="mt-3 text-base font-semibold text-ink">{title}</p>
      <p className="mt-2 text-sm text-muted">{description}</p>
    </div>
  );
}

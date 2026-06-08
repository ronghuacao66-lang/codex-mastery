"use client";

import { ArrowUpRight, CheckCircle2, Clock3, Copy, PlayCircle, Search, Sparkles, Video } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { EmptyState } from "@/components/EmptyState";
import { FavoriteButton } from "@/components/FavoriteButton";
import { Tag } from "@/components/Tag";
import { useFavorites } from "@/components/useFavorites";
import { cn, matchesSearch, unique } from "@/lib/utils";
import type { VideoItem } from "@/types/content";

const WATCHED_KEY = "codex-mastery:watched-videos";

const platformStyles: Record<VideoItem["platform"], string> = {
  Bilibili: "from-sky-500/18 to-cyan-400/10",
  "OpenAI Academy": "from-emerald-500/16 to-accent/10"
};

const linkStatusStyles: Record<NonNullable<VideoItem["linkStatus"]>["status"], string> = {
  ok: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
};

const linkStatusLabels: Record<NonNullable<VideoItem["linkStatus"]>["status"], string> = {
  ok: "链接可访问"
};

export function VideoCenterClient({ items }: { items: VideoItem[] }) {
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState("全部");
  const [stage, setStage] = useState("全部");
  const [watched, setWatched] = useState<string[]>([]);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    const stored = window.localStorage.getItem(WATCHED_KEY);
    if (stored) {
      try {
        setWatched(JSON.parse(stored) as string[]);
      } catch {
        setWatched([]);
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(WATCHED_KEY, JSON.stringify(watched));
  }, [watched]);

  const platforms = useMemo(() => unique(items.map((item) => item.platform)), [items]);
  const stages = useMemo(() => unique(items.map((item) => item.stage)), [items]);
  const watchedSet = useMemo(() => new Set(watched), [watched]);

  const filtered = items.filter((item) => {
    const searchable = [
      item.title,
      item.platform,
      item.creator,
      item.stage,
      item.topic,
      item.summary,
      item.whyWatch,
      item.learningOutcomes.join(" "),
      item.tags.join(" ")
    ].join(" ");
    return (
      matchesSearch(searchable, query) &&
      (platform === "全部" || item.platform === platform) &&
      (stage === "全部" || item.stage === stage)
    );
  });

  const featured = items.find((item) => item.id === "video-bili-official-codex-starter") ?? items[0];
  const progress = Math.round((watched.length / items.length) * 100);

  function toggleWatched(id: string) {
    setWatched((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-xl border border-line bg-panel shadow-soft dark:shadow-darksoft">
        <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
          <div className={cn("bg-gradient-to-br p-6 md:p-8", platformStyles[featured.platform])}>
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-panel/80 px-3 py-1 text-xs font-semibold text-muted backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              今日推荐视频
            </div>
            <h2 className="mt-5 max-w-2xl text-3xl font-semibold text-ink md:text-4xl">{featured.title}</h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted md:text-base">{featured.whyWatch}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Tag>{featured.platform}</Tag>
              <Tag>{featured.stage}</Tag>
              <Tag>{featured.topic}</Tag>
            </div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href={featured.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-ink px-4 text-sm font-semibold text-panel transition hover:opacity-90"
              >
                <PlayCircle className="h-4 w-4" />
                打开视频
              </a>
              <CopyButton value={buildNote(featured)} label="复制笔记" className="h-11 justify-center" />
            </div>
          </div>
          <div className="border-t border-line bg-surface p-6 lg:border-l lg:border-t-0 md:p-8">
            <p className="text-sm font-semibold text-ink">观看进度</p>
            <div className="mt-5 flex items-end gap-3">
              <span className="text-5xl font-semibold text-ink">{progress}%</span>
              <span className="pb-1 text-sm text-muted">{watched.length}/{items.length} 已看</span>
            </div>
            <div className="mt-5 h-2 rounded-full bg-panel">
              <div className="h-2 rounded-full bg-gradient-to-r from-accent to-violet transition-all" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {platforms.map((name) => (
                <div key={name} className="rounded-md border border-line bg-panel p-3">
                  <p className="text-xs text-muted">{name}</p>
                  <p className="mt-1 text-lg font-semibold text-ink">{items.filter((item) => item.platform === name).length}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-line bg-panel p-3 shadow-soft dark:shadow-darksoft">
        <div className="flex flex-col gap-3 lg:flex-row">
          <label className="relative block flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索平台、主题、学习产出"
              className="h-11 w-full rounded-md border border-line bg-surface pl-9 pr-3 text-sm text-ink outline-none transition placeholder:text-muted focus:border-accent"
            />
          </label>
          <Segmented value={platform} values={["全部", ...platforms]} onChange={setPlatform} label="平台" />
          <Segmented value={stage} values={["全部", ...stages]} onChange={setStage} label="阶段" />
        </div>
      </section>

      {filtered.length ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {filtered.map((item) => {
            const done = watchedSet.has(item.id);
            const linkStatus = item.linkStatus;
            return (
              <article
                key={item.id}
                className="group overflow-hidden rounded-lg border border-line bg-panel shadow-soft transition hover:-translate-y-0.5 hover:border-accent/40 dark:shadow-darksoft"
              >
                <div className={cn("h-2 bg-gradient-to-r", platformStyles[item.platform])} />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Tag>{item.platform}</Tag>
                        <Tag>{item.stage}</Tag>
                        {linkStatus ? (
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold",
                              linkStatusStyles[linkStatus.status]
                            )}
                            title={`${linkStatus.note}（${linkStatus.checkedAt}${linkStatus.httpCode ? ` · HTTP ${linkStatus.httpCode}` : ""}）`}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            {linkStatusLabels[linkStatus.status]}
                          </span>
                        ) : null}
                        <span className="inline-flex items-center gap-1 text-xs text-muted">
                          <Clock3 className="h-3.5 w-3.5" />
                          {item.duration}
                        </span>
                      </div>
                      <h2 className="mt-3 text-xl font-semibold leading-7 text-ink">{item.title}</h2>
                      <p className="mt-1 text-sm text-muted">{item.creator}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <FavoriteButton active={isFavorite(item.id)} onToggle={() => toggleFavorite(item.id)} />
                      <button
                        type="button"
                        onClick={() => toggleWatched(item.id)}
                        className={cn(
                          "inline-flex h-9 w-9 items-center justify-center rounded-md border border-line bg-panel text-muted transition hover:border-accent/50 hover:text-accent",
                          done && "border-accent/40 bg-accent/10 text-accent"
                        )}
                        title={done ? "标记未看" : "标记已看"}
                        aria-label={done ? "标记未看" : "标记已看"}
                      >
                        <CheckCircle2 className={cn("h-4 w-4", done && "fill-current")} />
                      </button>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-muted">{item.summary}</p>
                  <p className="mt-3 rounded-md border border-line bg-surface p-3 text-sm leading-6 text-ink">
                    <span className="font-semibold">推荐理由：</span>
                    {item.whyWatch}
                  </p>

                  <div className="mt-4 grid gap-3 md:grid-cols-[0.9fr_1.1fr]">
                    <div className="rounded-md border border-line bg-surface p-3">
                      <p className="flex items-center gap-2 text-xs font-semibold text-ink">
                        <Video className="h-4 w-4 text-accent" />
                        学习产出
                      </p>
                      <ul className="mt-2 space-y-1 text-sm leading-6 text-muted">
                        {item.learningOutcomes.map((outcome) => (
                          <li key={outcome}>• {outcome}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-md border border-line bg-surface p-3">
                      <p className="flex items-center gap-2 text-xs font-semibold text-ink">
                        <Copy className="h-4 w-4 text-accent" />
                        笔记模板
                      </p>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted">{item.noteTemplate}</p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-ink px-3 text-sm font-semibold text-panel transition hover:opacity-90"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                      打开视频
                    </a>
                    <CopyButton value={buildNote(item)} label="复制笔记" className="justify-center" />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState title="没有找到视频" description="换个平台、阶段或关键词再试。" />
      )}
    </div>
  );
}

function Segmented({
  value,
  values,
  onChange,
  label
}: {
  value: string;
  values: string[];
  onChange: (value: string) => void;
  label: string;
}) {
  return (
    <div className="fine-scrollbar flex max-w-full gap-1 overflow-x-auto rounded-md border border-line bg-surface p-1" aria-label={label}>
      {values.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          className={cn(
            "h-9 shrink-0 rounded px-3 text-xs font-semibold transition",
            value === item ? "bg-panel text-ink shadow-sm" : "text-muted hover:text-ink"
          )}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

function buildNote(item: VideoItem) {
  return [
    `# ${item.title}`,
    "",
    `平台：${item.platform}`,
    `作者：${item.creator}`,
    `链接：${item.url}`,
    `主题：${item.topic}`,
    "",
    "## 为什么看",
    item.whyWatch,
    "",
    "## 学习产出",
    ...item.learningOutcomes.map((outcome) => `- ${outcome}`),
    "",
    "## 我的笔记",
    item.noteTemplate
  ].join("\n");
}

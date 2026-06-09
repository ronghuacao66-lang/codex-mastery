"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  BarChart3,
  BookOpen,
  Boxes,
  BriefcaseBusiness,
  CheckSquare,
  ClipboardList,
  Command,
  LayoutDashboard,
  Library,
  Menu,
  Moon,
  PlayCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Sun,
  Workflow,
  X
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "控制台", icon: LayoutDashboard, group: "学习路径", description: "今日任务、最佳 Prompt、项目进度总览" },
  { href: "/academy", label: "Academy", icon: BookOpen, group: "学习路径", description: "Codex 核心知识、案例和最佳实践" },
  { href: "/videos", label: "视频精选", icon: PlayCircle, group: "学习路径", description: "已校验可访问的 Bilibili 教学视频" },
  { href: "/bootcamp", label: "30天", icon: CheckSquare, group: "学习路径", description: "从入门到项目交付的每日训练" },
  { href: "/progress", label: "进度", icon: BarChart3, group: "学习路径", description: "管理 30 天学习完成情况和下一步" },
  { href: "/reviews", label: "复盘", icon: ClipboardList, group: "学习路径", description: "沉淀训练、项目和售前复盘报告" },
  { href: "/task-builder", label: "任务生成器", icon: Command, group: "实战产出", description: "用 GCCD 生成可执行 Codex 任务" },
  { href: "/prompts", label: "Prompt", icon: Command, group: "实战产出", description: "Codex 与 AI Prompt 模板库" },
  { href: "/projects", label: "项目", icon: Boxes, group: "实战产出", description: "8 个高价值真实项目实战" },
  { href: "/workflows", label: "工作流", icon: Workflow, group: "实战产出", description: "客户拜访、方案、竞品和纪要流程" },
  { href: "/templates", label: "模板", icon: Library, group: "实战产出", description: "客户分析、竞品、复盘和方案模板" },
  { href: "/presales", label: "安全售前", icon: ShieldCheck, group: "业务工具", description: "零信任、SASE、XDR、MSS 售前场景" },
  { href: "/tools", label: "工具库", icon: BriefcaseBusiness, group: "业务工具", description: "ChatGPT、Codex、Claude、Cursor 等对比" }
];

const mobilePrimaryItems = navItems.filter((item) => ["/", "/bootcamp", "/progress", "/reviews", "/task-builder"].includes(item.href));
const mobileModuleGroups = ["学习路径", "实战产出", "业务工具"].map((group) => ({
  group,
  items: navItems.filter((item) => item.group === group)
}));

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("codex-mastery:theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const next = saved ? saved === "dark" : prefersDark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileMenuOpen(false);
    }

    window.addEventListener("keydown", handleKeydown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [mobileMenuOpen]);

  function toggleTheme() {
    setDark((current) => {
      const next = !current;
      document.documentElement.classList.toggle("dark", next);
      window.localStorage.setItem("codex-mastery:theme", next ? "dark" : "light");
      return next;
    });
  }

  const activeLabel = useMemo(() => {
    return navItems.find((item) => (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)))?.label ?? "Codex Mastery";
  }, [pathname]);
  const activeItem = useMemo(() => {
    return navItems.find((item) => (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href))) ?? navItems[0];
  }, [pathname]);
  const ActiveIcon = activeItem.icon;

  return (
    <div className="min-h-screen">
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-[244px] border-r border-line bg-panel/86 px-3 py-4 backdrop-blur-xl lg:block">
        <Link href="/" className="mb-7 flex items-center gap-3 rounded-lg px-2 py-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-ink text-panel">
            <Sparkles className="h-4 w-4" />
          </span>
          <span>
            <span className="block text-sm font-semibold text-ink">Codex Mastery</span>
            <span className="block text-xs text-muted">Learn by Building</span>
          </span>
        </Link>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted transition",
                  active ? "bg-surface text-ink" : "hover:bg-surface/70 hover:text-ink"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <header className="sticky top-0 z-20 border-b border-line bg-panel/82 backdrop-blur-xl lg:ml-[244px]">
        <div className="flex h-16 items-center justify-between gap-3 px-4 md:px-8">
          <div className="min-w-0">
            <p className="text-xs text-muted">Codex Mastery</p>
            <p className="truncate text-sm font-semibold text-ink">{activeLabel}</p>
          </div>
          <div className="hidden h-10 min-w-[280px] items-center gap-2 rounded-md border border-line bg-surface px-3 text-sm text-muted md:flex">
            <Search className="h-4 w-4" />
            30天路径 / 项目实战 / 安全售前
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-line bg-surface px-3 text-sm font-semibold text-ink transition hover:border-accent/50 lg:hidden"
              aria-label="打开全部模块"
            >
              <Menu className="h-4 w-4" />
              模块
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-line bg-surface text-muted transition hover:text-ink"
              title={dark ? "切换浅色模式" : "切换深色模式"}
              aria-label={dark ? "切换浅色模式" : "切换深色模式"}
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <nav className="grid grid-cols-5 gap-1 border-t border-line px-3 py-2 lg:hidden">
          {mobilePrimaryItems.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex h-10 min-w-0 flex-col items-center justify-center gap-0.5 rounded-md px-1 text-[11px] font-semibold transition",
                  active ? "bg-surface text-ink" : "text-muted hover:text-ink"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.label === "任务生成器" ? "任务" : item.label}</span>
              </Link>
            );
          })}
        </nav>
      </header>

      {mobileMenuOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="全部模块">
          <button
            type="button"
            aria-label="关闭全部模块"
            className="absolute inset-0 bg-ink/32 backdrop-blur-md"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute inset-x-3 top-16 max-h-[calc(100vh-5rem)] overflow-hidden rounded-xl border border-line bg-panel shadow-soft dark:shadow-darksoft">
            <div className="border-b border-line bg-surface/60 px-4 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-ink text-panel">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink">全部模块</p>
                    <p className="mt-1 text-xs leading-5 text-muted">按学习路径、实战产出和业务工具快速进入。</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-line bg-panel text-muted transition hover:text-ink"
                  aria-label="关闭全部模块"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4 rounded-lg border border-line bg-panel p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">正在浏览</p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-accent/30 bg-accent/10 text-accent">
                    <ActiveIcon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{activeItem.label}</p>
                    <p className="truncate text-xs text-muted">{activeItem.description}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="fine-scrollbar max-h-[calc(100vh-18rem)] overflow-auto p-4">
              <div className="space-y-5">
                {mobileModuleGroups.map(({ group, items }) => (
                  <section key={group}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="text-xs font-semibold text-ink">{group}</p>
                      <p className="text-[11px] text-muted">{items.length} 个模块</p>
                    </div>
                    <div className="space-y-2">
                      {items.map((item) => {
                        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                              "flex items-center gap-3 rounded-lg border p-3 transition",
                              active
                                ? "border-accent/45 bg-accent/10 text-accent"
                                : "border-line bg-surface text-muted hover:border-accent/35 hover:text-ink"
                            )}
                          >
                            <span
                              className={cn(
                                "flex h-10 w-10 shrink-0 items-center justify-center rounded-md border bg-panel",
                                active ? "border-accent/30 text-accent" : "border-line"
                              )}
                            >
                              <Icon className="h-4 w-4" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="flex items-center gap-2">
                                <span className="truncate text-sm font-semibold">{item.label}</span>
                                {active ? (
                                  <span className="shrink-0 rounded-full border border-accent/25 bg-panel px-2 py-0.5 text-[10px] font-semibold text-accent">
                                    当前
                                  </span>
                                ) : null}
                              </span>
                              <span className="mt-1 block line-clamp-2 text-xs leading-5 text-muted">{item.description}</span>
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <main className="px-4 py-6 md:px-8 md:py-9 lg:ml-[244px]">{children}</main>
    </div>
  );
}

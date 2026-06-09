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
  Command,
  LayoutDashboard,
  Library,
  Moon,
  PlayCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Sun,
  Workflow
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "控制台", icon: LayoutDashboard },
  { href: "/academy", label: "Academy", icon: BookOpen },
  { href: "/task-builder", label: "任务生成器", icon: Command },
  { href: "/prompts", label: "Prompt", icon: Command },
  { href: "/videos", label: "视频精选", icon: PlayCircle },
  { href: "/bootcamp", label: "30天", icon: CheckSquare },
  { href: "/progress", label: "进度", icon: BarChart3 },
  { href: "/projects", label: "项目", icon: Boxes },
  { href: "/presales", label: "安全售前", icon: ShieldCheck },
  { href: "/workflows", label: "工作流", icon: Workflow },
  { href: "/templates", label: "模板", icon: Library },
  { href: "/tools", label: "工具库", icon: BriefcaseBusiness }
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("codex-mastery:theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const next = saved ? saved === "dark" : prefersDark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  }, []);

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
        <nav className="fine-scrollbar flex gap-1 overflow-x-auto border-t border-line px-3 py-2 lg:hidden">
          {navItems.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex h-9 shrink-0 items-center gap-2 rounded-md px-3 text-xs font-medium transition",
                  active ? "bg-surface text-ink" : "text-muted hover:text-ink"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="px-4 py-6 md:px-8 md:py-9 lg:ml-[244px]">{children}</main>
    </div>
  );
}

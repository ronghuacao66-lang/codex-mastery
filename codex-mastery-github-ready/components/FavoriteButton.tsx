"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type FavoriteButtonProps = {
  active: boolean;
  onToggle: () => void;
};

export function FavoriteButton({ active, onToggle }: FavoriteButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-md border border-line bg-panel text-muted transition hover:-translate-y-0.5 hover:border-accent/50 hover:text-accent",
        active && "border-accent/40 bg-accent/10 text-accent"
      )}
      title={active ? "取消收藏" : "收藏"}
      aria-label={active ? "取消收藏" : "收藏"}
    >
      <Star className={cn("h-4 w-4", active && "fill-current")} />
    </button>
  );
}

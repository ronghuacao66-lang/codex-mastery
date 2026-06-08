import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

export function matchesSearch(text: string, query: string) {
  const q = normalizeText(query);
  if (!q) {
    return true;
  }
  return normalizeText(text).includes(q);
}

export function unique(values: string[]) {
  return Array.from(new Set(values)).filter(Boolean).sort((a, b) => a.localeCompare(b, "zh-CN"));
}

export function toCopyBlock(title: string, body: string) {
  return `${title}\n\n${body}`.trim();
}

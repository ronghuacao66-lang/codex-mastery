"use client";

import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "codex-mastery:favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored) as string[]);
      } catch {
        setFavorites([]);
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const favoriteSet = useMemo(() => new Set(favorites), [favorites]);

  function toggleFavorite(id: string) {
    setFavorites((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  return {
    favorites,
    favoriteSet,
    isFavorite: (id: string) => favoriteSet.has(id),
    toggleFavorite
  };
}

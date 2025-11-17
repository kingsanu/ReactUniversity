"use client";

import { useState, useEffect } from "react";
import {
  getFavoritesForUser,
  addFavorite,
  removeFavorite,
} from "@/services/careerService";
import { useGlobalStore } from "@/store/useGlobalStore";

export function useFavorites() {
  const { user } = useGlobalStore();
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    if (user.id) {
      getFavoritesForUser(user.id).then((r) => setFavorites(r.favorites || []));
    }
  }, [user.id]);

  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent;
      if (!custom?.detail?.userId || custom.detail.userId !== user.id) return;
      // reload favorites
      getFavoritesForUser(user.id!).then((r) =>
        setFavorites(r.favorites || [])
      );
    };

    window.addEventListener("favorites_updated", handler as EventListener);
    return () =>
      window.removeEventListener("favorites_updated", handler as EventListener);
  }, [user.id]);

  const toggleFavorite = async (careerId: string) => {
    if (!user.id) return false;
    if (favorites.includes(careerId)) {
      await removeFavorite(user.id, careerId);
      setFavorites((s) => s.filter((x) => x !== careerId));
      return false;
    }
    await addFavorite(user.id, careerId);
    setFavorites((s) => [...s, careerId]);
    return true;
  };

  return { favorites, toggleFavorite };
}

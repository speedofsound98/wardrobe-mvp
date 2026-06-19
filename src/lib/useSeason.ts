"use client";

import { useEffect, useState } from "react";

export type SeasonMode = "all" | "summer" | "winter";

const STORAGE_KEY = "wardrobe_season_mode";
const EVENT_NAME = "wardrobe:season";

export function getActiveSeason(): SeasonMode {
  if (typeof window === "undefined") return "all";
  return (localStorage.getItem(STORAGE_KEY) as SeasonMode) ?? "all";
}

export function setActiveSeason(mode: SeasonMode) {
  localStorage.setItem(STORAGE_KEY, mode);
}

export function isSeasonActive(itemSeason: string, mode: SeasonMode): boolean {
  if (mode === "all") return true;
  if (itemSeason === "all") return true;
  if (itemSeason === "spring" || itemSeason === "autumn") return true;
  if (mode === "summer") return itemSeason === "summer";
  if (mode === "winter") return itemSeason === "winter";
  return true;
}

export function useSeason(): [SeasonMode | null, (m: SeasonMode) => void] {
  const [season, setSeason] = useState<SeasonMode | null>(null);

  useEffect(() => {
    setSeason(getActiveSeason());
    function onSwitch(e: Event) {
      setSeason((e as CustomEvent<SeasonMode>).detail);
    }
    window.addEventListener(EVENT_NAME, onSwitch);
    return () => window.removeEventListener(EVENT_NAME, onSwitch);
  }, []);

  function switchSeason(mode: SeasonMode) {
    setActiveSeason(mode);
    setSeason(mode);
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: mode }));
  }

  return [season, switchSeason];
}

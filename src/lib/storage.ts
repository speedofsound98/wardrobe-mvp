import type { WardrobeFormValues, WardrobeItem } from "./types";

export const CATEGORY_OPTIONS = ["top", "bottom", "shoes", "outerwear", "accessory"] as const;
export const OCCASION_OPTIONS = ["casual", "work", "date", "travel", "gym"] as const;
export const WEATHER_OPTIONS = ["hot", "mild", "cold"] as const;
export const COLOR_OPTIONS = [
  "black",
  "white",
  "gray",
  "blue",
  "navy",
  "brown",
  "beige",
  "green",
  "red",
  "pink",
] as const;
export const SEASON_OPTIONS = ["all", "spring", "summer", "autumn", "winter"] as const;

export const EMPTY_FORM: WardrobeFormValues = {
  name: "",
  imageUrl: "",
  sourceType: "manual",
  sourceValue: "",
  category: "top",
  subcategory: "",
  color: "black",
  season: "all",
  occasion: "casual",
  material: "",
  favorite: false,
};

const STORAGE_KEY = "wardrobe_items_v1";

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function loadItems(): WardrobeItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveItems(items: WardrobeItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}
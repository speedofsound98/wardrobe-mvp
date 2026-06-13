import type { SavedOutfit, WardrobeFormValues, WardrobeItem } from "./types";

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

const OUTFITS_KEY = "wardrobe_saved_outfits_v1";

export function loadSavedOutfits(): SavedOutfit[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(OUTFITS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveOutfit(outfit: SavedOutfit) {
  const outfits = loadSavedOutfits();
  localStorage.setItem(OUTFITS_KEY, JSON.stringify([outfit, ...outfits]));
}

export function deleteSavedOutfit(id: string) {
  const outfits = loadSavedOutfits().filter((o) => o.id !== id);
  localStorage.setItem(OUTFITS_KEY, JSON.stringify(outfits));
}

export function updateItem(id: string, values: WardrobeFormValues) {
  const items = loadItems();
  const updated = items.map((item) =>
    item.id === id ? { ...item, ...values } : item
  );
  saveItems(updated);
}
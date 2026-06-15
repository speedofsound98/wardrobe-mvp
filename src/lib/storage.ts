import type { SavedOutfit, WardrobeFormValues, WardrobeItem } from "./types";
import { type Profile, getActiveProfile, getStorageKey } from "./profiles";

export const CATEGORY_OPTIONS = ["top", "bottom", "shoes", "outerwear", "accessory"] as const;
export const OCCASION_OPTIONS = ["casual", "work", "date", "travel", "gym", "running", "formal", "wedding"] as const;
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

const BASE_ITEMS_KEY = "wardrobe_items_v1";
const BASE_OUTFITS_KEY = "wardrobe_saved_outfits_v1";

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function itemsKey(profile?: Profile) {
  return getStorageKey(BASE_ITEMS_KEY, profile ?? getActiveProfile());
}

function outfitsKey(profile?: Profile) {
  return getStorageKey(BASE_OUTFITS_KEY, profile ?? getActiveProfile());
}

export function loadItems(profile?: Profile): WardrobeItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(itemsKey(profile));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveItems(items: WardrobeItem[], profile?: Profile) {
  if (typeof window === "undefined") return;
  localStorage.setItem(itemsKey(profile), JSON.stringify(items));
}

export function loadSavedOutfits(profile?: Profile): SavedOutfit[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(outfitsKey(profile));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveOutfit(outfit: SavedOutfit, profile?: Profile) {
  const outfits = loadSavedOutfits(profile);
  localStorage.setItem(outfitsKey(profile), JSON.stringify([outfit, ...outfits]));
}

export function deleteSavedOutfit(id: string, profile?: Profile) {
  const outfits = loadSavedOutfits(profile).filter((o) => o.id !== id);
  localStorage.setItem(outfitsKey(profile), JSON.stringify(outfits));
}

export function updateItem(id: string, values: WardrobeFormValues, profile?: Profile) {
  const items = loadItems(profile);
  const updated = items.map((item) =>
    item.id === id ? { ...item, ...values } : item
  );
  saveItems(updated, profile);
}
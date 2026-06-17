import type { SavedOutfit, WardrobeFormValues, WardrobeItem } from "./types";
import { type Profile, getActiveProfile, getStorageKey } from "./profiles";

export const CATEGORY_OPTIONS = ["top", "pants", "skirt", "dress", "shoes", "outerwear", "accessory"] as const;
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
  occasions: ["casual"],
  material: "",
  favorite: false,
};

const BASE_ITEMS_KEY = "wardrobe_items_v1";
const BASE_OUTFITS_KEY = "wardrobe_saved_outfits_v1";
const SHARED_ITEMS_KEY = "wardrobe_items_shared_v1";

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function itemsKey(profile?: Profile) {
  return getStorageKey(BASE_ITEMS_KEY, profile ?? getActiveProfile());
}

function outfitsKey(profile?: Profile) {
  return getStorageKey(BASE_OUTFITS_KEY, profile ?? getActiveProfile());
}

function migrate(item: WardrobeItem): WardrobeItem {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const a = item as any;
  if (a.category === "bottom") a.category = "pants";
  if (typeof a.occasions === "undefined") {
    a.occasions = a.occasion ? [a.occasion] : ["casual"];
    delete a.occasion;
  }
  return a as WardrobeItem;
}

function parseItems(raw: string | null): WardrobeItem[] {
  try {
    return raw ? (JSON.parse(raw) as WardrobeItem[]).map(migrate) : [];
  } catch {
    return [];
  }
}

function loadSharedItems(): WardrobeItem[] {
  if (typeof window === "undefined") return [];
  return parseItems(localStorage.getItem(SHARED_ITEMS_KEY)).map((i) => ({ ...i, shared: true }));
}

function saveSharedItems(items: WardrobeItem[]) {
  if (typeof window === "undefined") return;
  // strip the runtime-only `shared` flag before persisting
  localStorage.setItem(SHARED_ITEMS_KEY, JSON.stringify(items.map(({ shared: _, ...i }) => i)));
}

export function loadItems(profile?: Profile): WardrobeItem[] {
  if (typeof window === "undefined") return [];
  const own = parseItems(localStorage.getItem(itemsKey(profile)));
  const shared = loadSharedItems();
  // de-dupe: if an item somehow appears in both, own copy wins
  const ownIds = new Set(own.map((i) => i.id));
  return [...own, ...shared.filter((i) => !ownIds.has(i.id))];
}

export function saveItems(items: WardrobeItem[], profile?: Profile) {
  if (typeof window === "undefined") return;
  const own = items.filter((i) => !i.shared);
  const shared = items.filter((i) => i.shared);
  localStorage.setItem(itemsKey(profile), JSON.stringify(own));
  if (shared.length > 0) saveSharedItems(shared);
}

export function shareItem(id: string, ownerProfile: Profile) {
  if (typeof window === "undefined") return;
  // remove from owner's profile storage
  const own = parseItems(localStorage.getItem(itemsKey(ownerProfile)));
  const item = own.find((i) => i.id === id);
  if (!item) return;
  localStorage.setItem(itemsKey(ownerProfile), JSON.stringify(own.filter((i) => i.id !== id)));
  // add to shared pool
  const shared = loadSharedItems();
  saveSharedItems([...shared.filter((i) => i.id !== id), item]);
}

export function unshareItem(id: string, toProfile: Profile) {
  if (typeof window === "undefined") return;
  const shared = loadSharedItems();
  const item = shared.find((i) => i.id === id);
  if (!item) return;
  // move from shared pool to the requesting profile
  saveSharedItems(shared.filter((i) => i.id !== id));
  const own = parseItems(localStorage.getItem(itemsKey(toProfile)));
  localStorage.setItem(itemsKey(toProfile), JSON.stringify([...own.filter((i) => i.id !== id), { ...item, shared: undefined }]));
}

export function updateItem(id: string, values: WardrobeFormValues, profile?: Profile) {
  // item might live in own storage or shared pool
  const ownKey = itemsKey(profile);
  const own = parseItems(localStorage.getItem(ownKey));
  if (own.some((i) => i.id === id)) {
    localStorage.setItem(ownKey, JSON.stringify(own.map((i) => (i.id === id ? { ...i, ...values } : i))));
    return;
  }
  // try shared pool
  const shared = loadSharedItems();
  if (shared.some((i) => i.id === id)) {
    saveSharedItems(shared.map((i) => (i.id === id ? { ...i, ...values } : i)));
  }
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

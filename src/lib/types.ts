export type WardrobeCategory = "top" | "pants" | "skirt" | "dress" | "shoes" | "outerwear" | "accessory";
export type SourceType = "manual" | "photo" | "link";

export type WardrobeItem = {
  id: string;
  name: string;
  imageUrl: string;
  sourceType: SourceType;
  sourceValue: string;
  category: WardrobeCategory;
  subcategory: string;
  color: string;
  season: string;
  occasions: string[];
  material: string;
  favorite: boolean;
  imagePosition?: { x: number; y: number };
  createdAt: string;
};

export type WardrobeFormValues = Omit<WardrobeItem, "id" | "createdAt">;

export type OutfitResult = {
  top: WardrobeItem | null;
  bottom: WardrobeItem | null;
  dress: WardrobeItem | null;
  shoe: WardrobeItem;
  jacket: WardrobeItem | null;
  score: number;
};

export type SavedOutfit = {
  id: string;
  occasion: string;
  weather: string;
  savedAt: string;
  outfit: OutfitResult;
};

export type WardrobeCategory = "top" | "bottom" | "shoes" | "outerwear" | "accessory";
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
  occasion: string;
  material: string;
  favorite: boolean;
  createdAt: string;
};

export type WardrobeFormValues = Omit<WardrobeItem, "id" | "createdAt">;

export type OutfitResult = {
  top: WardrobeItem;
  bottom: WardrobeItem;
  shoe: WardrobeItem;
  jacket: WardrobeItem | null;
  score: number;
};
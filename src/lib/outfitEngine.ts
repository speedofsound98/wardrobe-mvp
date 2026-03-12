import type { OutfitResult, WardrobeItem } from "./types";

function colorScore(top?: WardrobeItem | null, bottom?: WardrobeItem | null, shoes?: WardrobeItem | null) {
  const neutrals = new Set(["black", "white", "gray", "navy", "beige", "brown"]);
  const colors = [top?.color, bottom?.color, shoes?.color].filter(Boolean) as string[];

  let score = 0;
  const neutralCount = colors.filter((color) => neutrals.has(color)).length;
  score += neutralCount * 2;
  if (new Set(colors).size <= 2) score += 3;
  if (colors.includes("red") && colors.includes("pink")) score -= 2;

  return score;
}

function occasionScore(item: WardrobeItem | null, occasion: string) {
  if (!item) return 0;
  if (item.occasion === occasion) return 4;
  if (occasion === "casual" && ["travel", "date"].includes(item.occasion)) return 2;
  if (occasion === "work" && item.category === "shoes" && ["black", "brown", "navy"].includes(item.color)) return 2;
  return 0;
}

function weatherScore(item: WardrobeItem | null, weather: string) {
  if (!item) return 0;
  if (weather === "cold" && item.category === "outerwear") return 4;
  if (weather === "hot" && item.category === "outerwear") return -3;
  if (weather === "hot" && item.material.toLowerCase().includes("wool")) return -2;
  return 1;
}

export function generateOutfit(items: WardrobeItem[], occasion: string, weather: string): OutfitResult | null {
  const tops = items.filter((item) => item.category === "top");
  const bottoms = items.filter((item) => item.category === "bottom");
  const shoes = items.filter((item) => item.category === "shoes");
  const outerwear = items.filter((item) => item.category === "outerwear");

  if (!tops.length || !bottoms.length || !shoes.length) return null;

  let best: OutfitResult | null = null;
  let bestScore = -Infinity;

  for (const top of tops) {
    for (const bottom of bottoms) {
      for (const shoe of shoes) {
        const jacketCandidates =
          weather === "cold" ? (outerwear.length ? outerwear : [null]) : [null, ...outerwear];

        for (const jacket of jacketCandidates) {
          let score = 0;
          score += occasionScore(top, occasion) + occasionScore(bottom, occasion) + occasionScore(shoe, occasion);
          score += weatherScore(top, weather) + weatherScore(bottom, weather) + weatherScore(shoe, weather) + weatherScore(jacket, weather);
          score += colorScore(top, bottom, shoe);

          if (top.favorite) score += 1;
          if (bottom.favorite) score += 1;
          if (shoe.favorite) score += 1;
          if (jacket?.favorite) score += 1;
          if (weather === "cold" && jacket) score += 2;
          if (occasion
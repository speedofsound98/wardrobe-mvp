import type { OutfitResult, WardrobeItem } from "./types";

// Occasions where every item must match — no casual substitutes
const STRICT_OCCASIONS = new Set(["running", "gym", "formal", "wedding"]);

function colorScore(a?: WardrobeItem | null, b?: WardrobeItem | null, c?: WardrobeItem | null) {
  const neutrals = new Set(["black", "white", "gray", "navy", "beige", "brown"]);
  const colors = [a?.color, b?.color, c?.color].filter(Boolean) as string[];

  let score = 0;
  score += colors.filter((color) => neutrals.has(color)).length * 2;
  if (new Set(colors).size <= 2) score += 3;
  if (colors.includes("red") && colors.includes("pink")) score -= 2;

  return score;
}

function occasionScore(item: WardrobeItem | null, occasion: string): number {
  if (!item) return 0;
  const occasions = item.occasions ?? [];
  if (occasions.includes(occasion)) return 5;

  // strict occasions get a heavy penalty for mismatches
  if (STRICT_OCCASIONS.has(occasion)) return -8;

  // lenient fallbacks for casual-adjacent occasions
  if (occasion === "casual" && occasions.some((o) => ["travel", "date"].includes(o))) return 2;
  if (occasion === "work" && item.category === "shoes" && ["black", "brown", "navy"].includes(item.color)) return 2;

  return -1;
}

function weatherScore(item: WardrobeItem | null, weather: string): number {
  if (!item) return 0;
  const material = item.material ?? "";
  if (weather === "cold" && item.category === "outerwear") return 4;
  if (weather === "hot" && item.category === "outerwear") return -3;
  if (weather === "hot" && material.toLowerCase().includes("wool")) return -2;
  return 1;
}

export function generateOutfits(items: WardrobeItem[], occasion: string, weather: string, topN = 10): OutfitResult[] {
  const strict = STRICT_OCCASIONS.has(occasion);

  function matchesOccasion(item: WardrobeItem) {
    return (item.occasions ?? []).includes(occasion);
  }

  const allTops = items.filter((i) => i.category === "top");
  const allBottoms = items.filter((i) => i.category === "pants" || i.category === "skirt");
  const allDresses = items.filter((i) => i.category === "dress");
  const allShoes = items.filter((i) => i.category === "shoes");
  const outerwear = items.filter((i) => i.category === "outerwear");

  // For strict occasions, prefer matching items but fall back to all if none match
  function preferMatching(pool: WardrobeItem[]) {
    if (!strict) return pool;
    const matching = pool.filter(matchesOccasion);
    return matching.length > 0 ? matching : pool;
  }

  const tops = preferMatching(allTops);
  const bottoms = preferMatching(allBottoms);
  const dresses = preferMatching(allDresses);
  const shoes = preferMatching(allShoes);

  if (!allShoes.length) return [];

  const results: OutfitResult[] = [];

  const jacketCandidates = (w: string) =>
    w === "cold" ? (outerwear.length ? outerwear : [null]) : [null, ...outerwear];

  // top + bottom outfits
  for (const top of tops) {
    for (const bottom of bottoms) {
      for (const shoe of shoes) {
        for (const jacket of jacketCandidates(weather)) {
          let score = 0;
          score += occasionScore(top, occasion) + occasionScore(bottom, occasion) + occasionScore(shoe, occasion);
          score += weatherScore(top, weather) + weatherScore(bottom, weather) + weatherScore(shoe, weather) + weatherScore(jacket, weather);
          score += colorScore(top, bottom, shoe);
          if (top.favorite) score += 1;
          if (bottom.favorite) score += 1;
          if (shoe.favorite) score += 1;
          if (jacket?.favorite) score += 1;
          if (weather === "cold" && jacket) score += 2;
          if (occasion === "work" && jacket) score += 1;
          results.push({ top, bottom, dress: null, shoe, jacket: jacket ?? null, score });
        }
      }
    }
  }

  // dress outfits — skip for strict sport occasions
  if (!strict || occasion === "formal" || occasion === "wedding") {
    for (const dress of dresses) {
      for (const shoe of shoes) {
        for (const jacket of jacketCandidates(weather)) {
          let score = 0;
          score += occasionScore(dress, occasion) + occasionScore(shoe, occasion);
          score += weatherScore(dress, weather) + weatherScore(shoe, weather) + weatherScore(jacket, weather);
          score += colorScore(dress, shoe);
          if (dress.favorite) score += 1;
          if (shoe.favorite) score += 1;
          if (jacket?.favorite) score += 1;
          if (weather === "cold" && jacket) score += 2;
          if (occasion === "formal" || occasion === "date" || occasion === "wedding") score += 3;
          results.push({ top: null, bottom: null, dress, shoe, jacket: jacket ?? null, score });

          for (const top of tops) {
            let layeredScore = score + occasionScore(top, occasion) + weatherScore(top, weather) + 1;
            if (top.favorite) layeredScore += 1;
            results.push({ top, bottom: null, dress, shoe, jacket: jacket ?? null, score: layeredScore });
          }
        }
      }
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, topN);
}

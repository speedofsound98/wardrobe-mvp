"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import OutfitCard from "@/components/OutfitCard";
import { OCCASION_OPTIONS, WEATHER_OPTIONS, loadItems, saveOutfit, uid } from "@/lib/storage";
import { generateOutfits } from "@/lib/outfitEngine";
import type { OutfitResult, WardrobeItem } from "@/lib/types";

export default function OutfitPage() {
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [occasion, setOccasion] = useState("casual");
  const [weather, setWeather] = useState("mild");
  const [index, setIndex] = useState(0);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setItems(loadItems());
  }, []);

  const outfits = generateOutfits(items, occasion, weather);
  const outfit: OutfitResult | null = outfits[index] ?? null;

  function handleShuffle() {
    setIndex((prev) => (outfits.length > 1 ? (prev + 1) % outfits.length : 0));
    setSaved(false);
  }

  function handleFilterChange(setter: (v: string) => void, value: string) {
    setter(value);
    setIndex(0);
    setSaved(false);
  }

  function handleSave() {
    if (!outfit) return;
    saveOutfit({ id: uid(), occasion, weather, savedAt: new Date().toISOString(), outfit });
    setSaved(true);
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Pick an outfit</h1>
        <p className="mt-2 text-slate-600">
          {outfits.length > 0 ? `${index + 1} of ${outfits.length} suggestions` : "Add items to get started."}
        </p>
      </div>

      <div className="mb-6 grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Occasion</label>
          <select
            value={occasion}
            onChange={(e) => handleFilterChange(setOccasion, e.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          >
            {OCCASION_OPTIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Weather</label>
          <select
            value={weather}
            onChange={(e) => handleFilterChange(setWeather, e.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          >
            {WEATHER_OPTIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      <OutfitCard outfit={outfit} onSave={outfit && !saved ? handleSave : undefined} />

      {outfit && (
        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={handleShuffle}
            disabled={outfits.length <= 1}
            className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-40"
          >
            <RefreshCw className="h-4 w-4" />
            Try another
          </button>
          {saved && <p className="text-sm text-green-600">Outfit saved!</p>}
        </div>
      )}
    </main>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import OutfitCard from "@/components/OutfitCard";
import { OCCASION_OPTIONS, WEATHER_OPTIONS, loadItems } from "@/lib/storage";
import { generateOutfit } from "@/lib/outfitEngine";
import type { WardrobeItem } from "@/lib/types";

export default function OutfitPage() {
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [occasion, setOccasion] = useState("casual");
  const [weather, setWeather] = useState("mild");

  useEffect(() => {
    setItems(loadItems());
  }, []);

  const outfit = useMemo(() => generateOutfit(items, occasion, weather), [items, occasion, weather]);

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Pick an outfit</h1>
        <p className="mt-2 text-slate-600">Rule-based suggestions for the MVP.</p>
      </div>

      <div className="mb-6 grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Occasion</label>
          <select
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          >
            {OCCASION_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Weather</label>
          <select
            value={weather}
            onChange={(e) => setWeather(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          >
            {WEATHER_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <OutfitCard outfit={outfit} />
    </main>
  );
}
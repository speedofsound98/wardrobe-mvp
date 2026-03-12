"use client";

import { useEffect, useMemo, useState } from "react";
import ItemCard from "@/components/ItemCard";
import FilterBar from "@/components/FilterBar";
import { CATEGORY_OPTIONS, loadItems, saveItems } from "@/lib/storage";
import type { WardrobeItem } from "@/lib/types";

export default function WardrobePage() {
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    setItems(loadItems());
  }, []);

  useEffect(() => {
    saveItems(items);
  }, [items]);

  const filteredItems = useMemo(() => {
    if (filterCategory === "all") return items;
    return items.filter((item) => item.category === filterCategory);
  }, [items, filterCategory]);

  function handleDelete(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function handleToggleFavorite(id: string) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, favorite: !item.favorite } : item))
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Your wardrobe</h1>
        <p className="mt-2 text-slate-600">Filter and manage the clothing items you added.</p>
      </div>

      <FilterBar
        value={filterCategory}
        onChange={setFilterCategory}
        options={["all", ...CATEGORY_OPTIONS]}
      />

      {filteredItems.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
          No items yet in this filter.
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onDelete={handleDelete}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}
    </main>
  );
}
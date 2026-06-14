"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import ItemCard from "@/components/ItemCard";
import FilterBar from "@/components/FilterBar";
import { CATEGORY_OPTIONS, loadItems, saveItems } from "@/lib/storage";
import type { WardrobeItem } from "@/lib/types";
import Link from "next/link";

function SkeletonCard() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm animate-pulse">
      <div className="mb-3 aspect-square rounded-2xl bg-slate-100" />
      <div className="mb-2 h-4 w-2/3 rounded-full bg-slate-100" />
      <div className="h-3 w-1/2 rounded-full bg-slate-100" />
    </div>
  );
}

function WardrobeContent() {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [filterCategory, setFilterCategory] = useState(searchParams.get("category") ?? "all");
  const [loading, setLoading] = useState(true);
  const initialized = useRef(false);

  useEffect(() => {
    setItems(loadItems());
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      return;
    }
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

  if (loading) {
    return (
      <>
        <FilterBar value={filterCategory} onChange={setFilterCategory} options={["all", ...CATEGORY_OPTIONS]} />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white p-16 text-center">
        <p className="text-lg font-medium text-slate-700">Your wardrobe is empty</p>
        <p className="mt-1 text-sm text-slate-400">Start by adding your first clothing item.</p>
        <Link
          href="/add"
          className="mt-4 inline-block rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          Add first item
        </Link>
      </div>
    );
  }

  return (
    <>
      <FilterBar value={filterCategory} onChange={setFilterCategory} options={["all", ...CATEGORY_OPTIONS]} />
      {filteredItems.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
          No items in this category.
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} onDelete={handleDelete} onToggleFavorite={handleToggleFavorite} />
          ))}
        </div>
      )}
    </>
  );
}

export default function WardrobePage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Your wardrobe</h1>
        <p className="mt-2 text-slate-600">Filter and manage the clothing items you added.</p>
      </div>
      <Suspense>
        <WardrobeContent />
      </Suspense>
    </main>
  );
}

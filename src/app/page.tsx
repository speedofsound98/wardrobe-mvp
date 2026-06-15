"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Shirt, PlusCircle, Sparkles } from "lucide-react";
import { loadItems } from "@/lib/storage";
import { useProfile } from "@/lib/useProfile";
import type { WardrobeCategory, WardrobeItem } from "@/lib/types";

const CATEGORIES: WardrobeCategory[] = ["top", "pants", "skirt", "dress", "shoes", "outerwear", "accessory"];

const ONBOARDING_STEPS = [
  { href: "/add", icon: PlusCircle, label: "Add a clothing item", description: "Upload a photo and fill in the details." },
  { href: "/outfit", icon: Sparkles, label: "Generate an outfit", description: "Pick an occasion and weather to get a suggestion." },
  { href: "/outfits", icon: Shirt, label: "Save your favourites", description: "Bookmark outfits you want to wear again." },
];

export default function HomePage() {
  const [profile] = useProfile();
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setItems(loadItems(profile));
    setLoading(false);
  }, [profile]);

  const lastAdded = items[0];
  const countByCategory = Object.fromEntries(
    CATEGORIES.map((cat) => [cat, items.filter((i) => i.category === cat).length])
  );

  if (!loading && items.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Welcome to your wardrobe</h1>
        <p className="mt-2 text-slate-500">Get started in three steps.</p>

        <div className="mt-10 space-y-3 text-left">
          {ONBOARDING_STEPS.map(({ href, icon: Icon, label, description }, i) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-400"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white text-sm font-bold">
                {i + 1}
              </div>
              <div>
                <p className="font-semibold text-slate-900">{label}</p>
                <p className="text-sm text-slate-500">{description}</p>
              </div>
              <Icon className="ml-auto h-5 w-5 shrink-0 text-slate-400" />
            </Link>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Your wardrobe</h1>
        <p className="mt-1 text-slate-500">{items.length} item{items.length !== 1 ? "s" : ""} total</p>
      </div>

      {/* Category breakdown */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={`/wardrobe?category=${cat}`}
            className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm transition hover:border-slate-400"
          >
            <p className="text-2xl font-bold text-slate-900">{countByCategory[cat]}</p>
            <p className="mt-0.5 text-xs capitalize text-slate-500">{cat}</p>
          </Link>
        ))}
      </div>

      {/* Last added */}
      {lastAdded && (
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="mb-3 text-xs uppercase tracking-wide text-slate-400">Last added</p>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
              {lastAdded.imageUrl ? (
                <img src={lastAdded.imageUrl} alt={lastAdded.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-300">
                  <Shirt className="h-6 w-6" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900">{lastAdded.name || "Untitled item"}</p>
              <p className="text-sm capitalize text-slate-500">
                {lastAdded.category} · {lastAdded.color} · {lastAdded.occasion}
              </p>
            </div>
            <Link
              href={`/edit/${lastAdded.id}`}
              className="ml-auto shrink-0 rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              Edit
            </Link>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Link
          href="/wardrobe"
          className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-400"
        >
          <Shirt className="h-5 w-5 text-slate-500" />
          <span className="font-medium text-slate-800">Browse wardrobe</span>
        </Link>
        <Link
          href="/add"
          className="flex items-center gap-3 rounded-2xl bg-slate-900 p-4 shadow-sm transition hover:bg-slate-700"
        >
          <PlusCircle className="h-5 w-5 text-white" />
          <span className="font-medium text-white">Add item</span>
        </Link>
        <Link
          href="/outfit"
          className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-400"
        >
          <Sparkles className="h-5 w-5 text-slate-500" />
          <span className="font-medium text-slate-800">Pick an outfit</span>
        </Link>
      </div>
    </main>
  );
}

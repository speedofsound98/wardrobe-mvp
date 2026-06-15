"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { deleteSavedOutfit, loadSavedOutfits } from "@/lib/storage";
import { useProfile } from "@/lib/useProfile";
import type { SavedOutfit } from "@/lib/types";
import OutfitCard from "@/components/OutfitCard";

export default function OutfitsPage() {
  const [profile] = useProfile();
  const [outfits, setOutfits] = useState<SavedOutfit[]>([]);

  useEffect(() => {
    if (!profile) return;
    setOutfits(loadSavedOutfits(profile));
  }, [profile]);

  function handleDelete(id: string) {
    deleteSavedOutfit(id, profile ?? undefined);
    setOutfits((prev) => prev.filter((o) => o.id !== id));
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Saved outfits</h1>
          <p className="mt-1 text-slate-500">{outfits.length} outfit{outfits.length !== 1 ? "s" : ""} saved</p>
        </div>
        <Link
          href="/outfit"
          className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          Generate new
        </Link>
      </div>

      {outfits.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 p-12 text-center text-slate-400">
          No saved outfits yet.{" "}
          <Link href="/outfit" className="font-medium text-slate-700 underline underline-offset-2">
            Generate one
          </Link>{" "}
          and save it.
        </div>
      ) : (
        <div className="space-y-6">
          {outfits.map((saved) => (
            <div key={saved.id} className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <p className="text-xs capitalize text-slate-500">
                  {saved.occasion} · {saved.weather} · {new Date(saved.savedAt).toLocaleDateString()}
                </p>
                <button
                  onClick={() => handleDelete(saved.id)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
                >
                  <Trash2 className="h-3 w-3" />
                  Remove
                </button>
              </div>
              <OutfitCard outfit={saved.outfit} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

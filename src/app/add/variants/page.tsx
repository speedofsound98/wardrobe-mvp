"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Upload } from "lucide-react";
import { CATEGORY_OPTIONS, COLOR_OPTIONS, OCCASION_OPTIONS, SEASON_OPTIONS, loadItems, saveItems, uid } from "@/lib/storage";
import { useProfile } from "@/lib/useProfile";
import type { WardrobeCategory, WardrobeItem } from "@/lib/types";

type Variant = {
  id: string;
  color: string;
  subcategory: string;
  quantity: number;
  imageUrl: string;
  uploading: boolean;
  previewUrl: string | null;
};

function newVariant(): Variant {
  return { id: uid(), color: "black", subcategory: "", quantity: 1, imageUrl: "", uploading: false, previewUrl: null };
}

export default function AddVariantsPage() {
  const router = useRouter();
  const [profile] = useProfile();

  // shared base fields
  const [name, setName] = useState("");
  const [category, setCategory] = useState<WardrobeCategory>("top");
  const [brand, setBrand] = useState("");
  const [material, setMaterial] = useState("");
  const [season, setSeason] = useState("all");
  const [occasions, setOccasions] = useState<string[]>(["casual"]);
  const [favorite, setFavorite] = useState(false);

  const [variants, setVariants] = useState<Variant[]>([newVariant()]);

  function updateVariant(id: string, patch: Partial<Variant>) {
    setVariants((prev) => prev.map((v) => (v.id === id ? { ...v, ...patch } : v)));
  }

  function addVariant() {
    setVariants((prev) => [...prev, newVariant()]);
  }

  function removeVariant(id: string) {
    if (variants.length === 1) return;
    setVariants((prev) => prev.filter((v) => v.id !== id));
  }

  async function handleVariantImage(id: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    updateVariant(id, { previewUrl: localUrl, uploading: true });
    const data = new FormData();
    data.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: data });
    const json = await res.json();
    if (json.url) {
      updateVariant(id, { imageUrl: json.url, uploading: false, previewUrl: null });
      URL.revokeObjectURL(localUrl);
    } else {
      updateVariant(id, { uploading: false, previewUrl: null });
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (variants.some((v) => v.uploading)) return;
    const existing = loadItems(profile ?? undefined);
    const newItems: WardrobeItem[] = variants.map((v) => ({
      id: uid(),
      name: variants.length === 1 ? name : `${name} — ${v.color}${v.subcategory ? ` (${v.subcategory})` : ""}`,
      category,
      subcategory: v.subcategory,
      color: v.color,
      season,
      occasions,
      material,
      brand,
      quantity: v.quantity,
      favorite,
      imageUrl: v.imageUrl,
      sourceType: v.imageUrl ? "photo" : "manual",
      sourceValue: "",
      createdAt: new Date().toISOString(),
    }));
    saveItems([...newItems, ...existing], profile ?? undefined);
    router.push("/wardrobe");
  }

  const anyUploading = variants.some((v) => v.uploading);

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Add variants</h1>
        <p className="mt-2 text-slate-600">Set shared details once, then define each variant (color, subcategory, photo).</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* shared base */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">Shared fields</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium">Item name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Oxford Shirt, Levi's 501…"
                required
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none placeholder:text-slate-400 focus:border-slate-400"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as WardrobeCategory)} className="w-full rounded-2xl border border-slate-200 px-4 py-3">
                {CATEGORY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Brand</label>
              <input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Uniqlo, Zara, Levi's…" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none placeholder:text-slate-400 focus:border-slate-400" />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Material</label>
              <input value={material} onChange={(e) => setMaterial(e.target.value)} placeholder="cotton, denim…" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none placeholder:text-slate-400 focus:border-slate-400" />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Season</label>
              <select value={season} onChange={(e) => setSeason(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3">
                {SEASON_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">Occasions</label>
              <div className="flex flex-wrap gap-2">
                {OCCASION_OPTIONS.map((option) => {
                  const selected = occasions.includes(option);
                  return (
                    <button key={option} type="button"
                      onClick={() => {
                        const next = selected ? occasions.filter((o) => o !== option) : [...occasions, option];
                        setOccasions(next.length ? next : [option]);
                      }}
                      className={`rounded-full border px-3 py-1 text-xs font-medium capitalize transition ${selected ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="fav" checked={favorite} onChange={(e) => setFavorite(e.target.checked)} />
              <label htmlFor="fav" className="text-sm font-medium">Mark as favorite</label>
            </div>
          </div>
        </div>

        {/* variants */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Variants</h2>

          {variants.map((v, i) => (
            <div key={v.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm font-medium text-slate-400 w-6 shrink-0">{i + 1}</span>

                {/* photo */}
                <div className="flex items-center gap-2 shrink-0">
                  {(v.previewUrl || v.imageUrl) && (
                    <img src={v.previewUrl ?? v.imageUrl} alt="" className={`h-12 w-12 rounded-xl object-cover ${v.previewUrl ? "opacity-50" : ""}`} />
                  )}
                  <label className="cursor-pointer rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50">
                    <Upload className="h-4 w-4" />
                    <input type="file" accept="image/*" className="sr-only" onChange={(e) => handleVariantImage(v.id, e)} />
                  </label>
                </div>

                {/* color */}
                <div className="flex-1 min-w-32">
                  <label className="mb-1 block text-xs text-slate-400">Color</label>
                  <select value={v.color} onChange={(e) => updateVariant(v.id, { color: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
                    {COLOR_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* subcategory */}
                <div className="flex-1 min-w-32">
                  <label className="mb-1 block text-xs text-slate-400">Subcategory</label>
                  <input value={v.subcategory} onChange={(e) => updateVariant(v.id, { subcategory: e.target.value })} placeholder="jeans, corduroy…" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-300 focus:border-slate-400" />
                </div>

                {/* quantity */}
                <div className="w-20 shrink-0">
                  <label className="mb-1 block text-xs text-slate-400">Qty</label>
                  <input type="number" min={1} value={v.quantity} onChange={(e) => updateVariant(v.id, { quantity: Math.max(1, parseInt(e.target.value) || 1) })} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400" />
                </div>

                <button type="button" onClick={() => removeVariant(v.id)} disabled={variants.length === 1} className="mt-4 rounded-xl p-2 text-slate-400 hover:bg-slate-100 disabled:opacity-30">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          <button type="button" onClick={addVariant} className="flex w-full items-center justify-center gap-2 rounded-3xl border border-dashed border-slate-300 py-3 text-sm font-medium text-slate-500 hover:border-slate-400 hover:bg-slate-50 transition">
            <Plus className="h-4 w-4" />
            Add variant
          </button>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={anyUploading} className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-50">
            {anyUploading ? "Uploading…" : `Save ${variants.length} item${variants.length > 1 ? "s" : ""}`}
          </button>
        </div>
      </form>
    </main>
  );
}

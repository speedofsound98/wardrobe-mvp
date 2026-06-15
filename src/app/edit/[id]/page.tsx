"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ItemForm from "@/components/ItemForm";
import { loadItems, updateItem } from "@/lib/storage";
import { useProfile } from "@/lib/useProfile";
import type { WardrobeFormValues, WardrobeItem } from "@/lib/types";

const EMPTY_FORM: WardrobeFormValues = {
  name: "", imageUrl: "", sourceType: "manual", sourceValue: "",
  category: "top", subcategory: "", color: "black", season: "all",
  occasion: "casual", material: "", favorite: false,
};

export default function EditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [profile] = useProfile();

  const [item, setItem] = useState<WardrobeItem | null | "loading">("loading");
  const [form, setForm] = useState<WardrobeFormValues>(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    const found = loadItems(profile).find((i) => i.id === id) ?? null;
    setItem(found);
    if (found) {
      const { id: _id, createdAt: _c, ...values } = found;
      setForm(values);
    }
  }, [id, profile]);

  function updateField<K extends keyof WardrobeFormValues>(field: K, value: WardrobeFormValues[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setUploading(true);

    const data = new FormData();
    data.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: data });
    const json = await res.json();
    setUploading(false);

    if (json.url) {
      updateField("imageUrl", json.url);
      updateField("sourceType", "photo");
      URL.revokeObjectURL(localUrl);
      setPreviewUrl(null);
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (uploading) return;
    updateItem(id, form, profile ?? undefined);
    router.push("/wardrobe");
  }

  if (item === "loading") return null;

  if (!item) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-10">
        <p className="text-slate-500">Item not found.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Edit item</h1>
        <p className="mt-2 text-slate-600">Update the details for {item.name || "this item"}.</p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <ItemForm
          form={form}
          updateField={updateField}
          handleImageUpload={handleImageUpload}
          onSubmit={handleSubmit}
          submitLabel={uploading ? "Uploading…" : "Save changes"}
          disabled={uploading}
          previewUrl={previewUrl}
        />
      </div>
    </main>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ItemForm from "@/components/ItemForm";
import { EMPTY_FORM, loadItems, saveItems, uid } from "@/lib/storage";
import { useProfile } from "@/lib/useProfile";
import type { WardrobeFormValues } from "@/lib/types";

export default function AddPage() {
  const router = useRouter();
  const [profile] = useProfile();
  const [form, setForm] = useState<WardrobeFormValues>(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  function updateField<K extends keyof WardrobeFormValues>(field: K, value: WardrobeFormValues[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    // show local preview immediately while upload is in flight
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    setUploading(true);
    setUploadError(null);
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
    } else {
      setUploadError(json.error ?? "Upload failed. Please try again.");
      setPreviewUrl(null);
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (uploading) return;

    const items = loadItems(profile ?? undefined);
    const newItem = {
      id: uid(),
      ...form,
      createdAt: new Date().toISOString(),
    };

    saveItems([newItem, ...items], profile ?? undefined);
    router.push("/wardrobe");
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Add clothing item</h1>
        <p className="mt-2 text-slate-600">Upload a photo and fill in the details.</p>
      </div>

      {uploadError && (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {uploadError}
        </div>
      )}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <ItemForm
          form={form}
          updateField={updateField}
          handleImageUpload={handleImageUpload}
          onSubmit={handleSubmit}
          submitLabel={uploading ? "Uploading…" : "Save item"}
          disabled={uploading}
          previewUrl={previewUrl}
        />
      </div>
    </main>
  );
}

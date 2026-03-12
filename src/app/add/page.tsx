"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ItemForm from "@/components/ItemForm";
import { EMPTY_FORM, loadItems, saveItems, uid } from "@/lib/storage";
import type { WardrobeFormValues } from "@/lib/types";

export default function AddPage() {
  const router = useRouter();
  const [form, setForm] = useState<WardrobeFormValues>(EMPTY_FORM);

  function updateField<K extends keyof WardrobeFormValues>(field: K, value: WardrobeFormValues[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      updateField("imageUrl", String(reader.result));
      updateField("sourceType", "photo");
    };
    reader.readAsDataURL(file);
  }
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const items = loadItems();
    const newItem = {
      id: uid(),
      ...form,
      createdAt: new Date().toISOString(),
    };

    saveItems([newItem, ...items]);
    router.push("/wardrobe");
  }
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Add clothing item</h1>
        <p className="mt-2 text-slate-600">Start with one clothing photo at a time for the MVP.</p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <ItemForm
          form={form}
          updateField={updateField}
          handleImageUpload={handleImageUpload}
          onSubmit={handleSubmit}
          submitLabel="Save item"
        />
      </div>
    </main>
  );
}
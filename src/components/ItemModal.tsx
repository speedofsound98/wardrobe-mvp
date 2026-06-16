"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X, Pencil, Shirt } from "lucide-react";
import type { WardrobeItem } from "@/lib/types";

type ItemModalProps = {
  item: WardrobeItem;
  onClose: () => void;
};

export default function ItemModal({ item, onClose }: ItemModalProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const rows: [string, string][] = [
    ["Category", item.category],
    ["Subcategory", item.subcategory || "—"],
    ["Color", item.color],
    ["Season", item.season],
    ["Occasions", (item.occasions ?? []).join(", ") || "—"],
    ["Material", item.material || "—"],
    ["Favorite", item.favorite ? "Yes" : "No"],
    ["Added", new Date(item.createdAt).toLocaleDateString()],
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/80 p-1.5 text-slate-500 shadow hover:bg-white"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="aspect-square w-full bg-slate-100">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-300">
              <Shirt className="h-16 w-16" />
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <h2 className="text-xl font-bold text-slate-900">{item.name || "Untitled item"}</h2>
            <Link
              href={`/edit/${item.id}`}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Link>
          </div>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
            {rows.map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs font-medium text-slate-400">{label}</dt>
                <dd className="text-sm capitalize text-slate-800">{value}</dd>
              </div>
            ))}
          </dl>

          {item.sourceValue && (
            <p className="mt-4 truncate text-xs text-slate-400">
              Source: {item.sourceValue}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

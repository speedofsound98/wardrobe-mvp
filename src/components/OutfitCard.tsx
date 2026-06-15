import { Shirt } from "lucide-react";
import type { OutfitResult, WardrobeItem } from "@/lib/types";

function ItemThumb({ item, label }: { item: WardrobeItem; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-200">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">
            <Shirt className="h-5 w-5" />
          </div>
        )}
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
        <p className="text-sm font-medium text-slate-900">{item.name}</p>
        <p className="text-xs capitalize text-slate-500">{item.color} · {item.occasion}</p>
      </div>
    </div>
  );
}

type OutfitCardProps = {
  outfit: OutfitResult | null;
  onSave?: () => void;
};

export default function OutfitCard({ outfit, onSave }: OutfitCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      {!outfit ? (
        <p className="text-slate-500">
          Add at least one top, one bottom, and one pair of shoes to generate an outfit.
        </p>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Suggested outfit</p>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
              Score {outfit.score}
            </span>
          </div>
          <ItemThumb item={outfit.top} label="Top" />
          <ItemThumb item={outfit.bottom} label="Bottom" />
          <ItemThumb item={outfit.shoe} label="Shoes" />
          {outfit.jacket && <ItemThumb item={outfit.jacket} label="Outerwear" />}

          {onSave && (
            <button
              onClick={onSave}
              className="mt-2 w-full rounded-2xl border border-slate-200 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Save this outfit
            </button>
          )}
        </div>
      )}
    </div>
  );
}

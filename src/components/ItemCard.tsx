import { Heart, Shirt, Trash2 } from "lucide-react";
import type { WardrobeItem } from "@/lib/types";

type ItemCardProps = {
  item: WardrobeItem;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
};

export default function ItemCard({ item, onDelete, onToggleFavorite }: ItemCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 aspect-square overflow-hidden rounded-2xl bg-slate-100">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">
            <Shirt className="h-12 w-12" />
          </div>
        )}
      </div>

      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-900">{item.name || "Untitled item"}</h3>
          <p className="text-sm text-slate-500">
            {item.category} · {item.color} · {item.occasion}
          </p>
        </div>

        <button
          onClick={() => onToggleFavorite(item.id)}
          className="rounded-full p-2 hover:bg-slate-100"
          aria-label="Toggle favorite"
        >
          <Heart className={`h-4 w-4 ${item.favorite ? "fill-current text-rose-500" : "text-slate-400"}`} />
        </button>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => onDelete(item.id)}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      </div>
    </div>
  );
}
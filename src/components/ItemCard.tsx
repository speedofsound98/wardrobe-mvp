import { Heart, Pencil, Shirt, Trash2, Users } from "lucide-react";
import Link from "next/link";
import type { WardrobeItem } from "@/lib/types";

type ItemCardProps = {
  item: WardrobeItem;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onView?: (item: WardrobeItem) => void;
};

export default function ItemCard({ item, onDelete, onToggleFavorite, onView }: ItemCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <button
        onClick={() => onView?.(item)}
        className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100 focus:outline-none"
        aria-label="View item details"
      >
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="h-full w-full object-cover"
            style={item.imagePosition ? { objectPosition: `${item.imagePosition.x}% ${item.imagePosition.y}%` } : undefined}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">
            <Shirt className="h-6 w-6" />
          </div>
        )}
      </button>

      <button
        onClick={() => onView?.(item)}
        className="min-w-0 flex-1 text-left focus:outline-none"
        aria-label="View item details"
      >
        <div className="flex items-center gap-1.5">
          <p className="truncate text-sm font-semibold text-slate-900">{item.name || "Untitled item"}</p>
          {item.shared && <Users className="h-3 w-3 shrink-0 text-violet-400" aria-label="Shared" />}
        </div>
        <p className="truncate text-xs capitalize text-slate-500">
          {item.category} · {item.color} · {(item.occasions ?? []).join(", ")}
        </p>
      </button>

      <div className="flex shrink-0 items-center gap-1">
        <button
          onClick={() => onToggleFavorite(item.id)}
          className="rounded-lg p-1.5 hover:bg-slate-100"
          aria-label="Toggle favorite"
        >
          <Heart className={`h-3.5 w-3.5 ${item.favorite ? "fill-current text-rose-500" : "text-slate-400"}`} />
        </button>
        <Link
          href={`/edit/${item.id}`}
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
          aria-label="Edit"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Link>
        <button
          onClick={() => onDelete(item.id)}
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
          aria-label="Delete"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

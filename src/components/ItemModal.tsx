"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { X, Pencil, Shirt, Move } from "lucide-react";
import type { WardrobeItem } from "@/lib/types";

type ItemModalProps = {
  item: WardrobeItem;
  onClose: () => void;
  onUpdate?: (updated: WardrobeItem) => void;
};

export default function ItemModal({ item, onClose, onUpdate }: ItemModalProps) {
  const [pos, setPos] = useState(item.imagePosition ?? { x: 50, y: 50 });
  const [dragging, setDragging] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<{ mx: number; my: number; px: number; py: number } | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const applyDelta = useCallback((clientX: number, clientY: number) => {
    if (!dragStart.current || !imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const dx = ((dragStart.current.mx - clientX) / rect.width) * 100;
    const dy = ((dragStart.current.my - clientY) / rect.height) * 100;
    setPos({
      x: Math.max(0, Math.min(100, dragStart.current.px + dx)),
      y: Math.max(0, Math.min(100, dragStart.current.py + dy)),
    });
  }, []);

  function onMouseDown(e: React.MouseEvent) {
    e.preventDefault();
    dragStart.current = { mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y };
    setDragging(true);
  }

  function onTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    dragStart.current = { mx: t.clientX, my: t.clientY, px: pos.x, py: pos.y };
    setDragging(true);
  }

  useEffect(() => {
    if (!dragging) return;
    function onMouseMove(e: MouseEvent) { applyDelta(e.clientX, e.clientY); }
    function onTouchMove(e: TouchEvent) { applyDelta(e.touches[0].clientX, e.touches[0].clientY); }
    function onUp() {
      setDragging(false);
      dragStart.current = null;
      // save position
      if (onUpdate) onUpdate({ ...item, imagePosition: pos });
    }
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onUp);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging, pos, applyDelta]);

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

        {/* draggable image */}
        <div
          ref={imgRef}
          className={`relative aspect-square w-full overflow-hidden bg-slate-100 select-none ${item.imageUrl ? (dragging ? "cursor-grabbing" : "cursor-grab") : ""}`}
          onMouseDown={item.imageUrl ? onMouseDown : undefined}
          onTouchStart={item.imageUrl ? onTouchStart : undefined}
        >
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.name}
              draggable={false}
              className="h-full w-full object-cover transition-none"
              style={{ objectPosition: `${pos.x}% ${pos.y}%` }}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-300">
              <Shirt className="h-16 w-16" />
            </div>
          )}
          {item.imageUrl && (
            <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/40 px-2 py-1 text-xs text-white backdrop-blur-sm">
              <Move className="h-3 w-3" />
              drag to reframe
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

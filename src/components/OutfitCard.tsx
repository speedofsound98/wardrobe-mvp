import type { OutfitResult } from "@/lib/types";

type OutfitCardProps = {
  outfit: OutfitResult | null;
};

export default function OutfitCard({ outfit }: OutfitCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      {!outfit ? (
        <p className="text-slate-500">
          Add at least one top, one bottom, and one pair of shoes to generate an outfit.
        </p>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Suggested outfit</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">
              Score: {outfit.score}
            </h2>
          </div>

          <div className="space-y-3 text-sm">
            <div className="rounded-2xl bg-slate-50 p-3">
              <span className="font-medium">Top:</span> {outfit.top.name}
            </div>
            <div className="rounded-2xl bg-slate-50 p-3">
              <span className="font-medium">Bottom:</span> {outfit.bottom.name}
            </div>
            <div className="rounded-2xl bg-slate-50 p-3">
              <span className="font-medium">Shoes:</span> {outfit.shoe.name}
            </div>
            {outfit.jacket && (
              <div className="rounded-2xl bg-slate-50 p-3">
                <span className="font-medium">Outerwear:</span> {outfit.jacket.name}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
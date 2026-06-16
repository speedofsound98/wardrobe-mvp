import {
  CATEGORY_OPTIONS,
  COLOR_OPTIONS,
  OCCASION_OPTIONS,
  SEASON_OPTIONS,
} from "@/lib/storage";
import type { WardrobeCategory, WardrobeFormValues } from "@/lib/types";

type ItemFormProps = {
  form: WardrobeFormValues;
  updateField: <K extends keyof WardrobeFormValues>(field: K, value: WardrobeFormValues[K]) => void;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.FormEvent) => void;
  submitLabel: string;
  disabled?: boolean;
  previewUrl?: string | null;
};

export default function ItemForm({
  form,
  updateField,
  handleImageUpload,
  onSubmit,
  submitLabel,
  disabled = false,
  previewUrl = null,
}: ItemFormProps) {
  return (
    <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <label className="mb-1 block text-sm font-medium">Item name</label>
        <input
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
          placeholder="Blue Oxford Shirt"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none placeholder:text-slate-400 focus:border-slate-400"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Upload photo</label>
        <label className={`flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          {form.sourceType === "photo" ? "Change photo" : "Choose file"}
          <input type="file" accept="image/*" onChange={handleImageUpload} disabled={disabled} className="sr-only" />
        </label>
        {(previewUrl || (form.imageUrl && form.sourceType === "photo")) && (
          <img
            src={previewUrl ?? form.imageUrl}
            alt="preview"
            className={`mt-2 h-20 w-20 rounded-2xl object-cover ${previewUrl ? "opacity-60" : ""}`}
          />
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Or paste image URL</label>
        <input
          value={form.sourceValue}
          onChange={(e) => {
            updateField("sourceValue", e.target.value);
            updateField("sourceType", e.target.value ? "link" : "manual");
            if (e.target.value) updateField("imageUrl", e.target.value);
          }}
          placeholder="https://..."
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none placeholder:text-slate-400 focus:border-slate-400"
        />
        {form.imageUrl && form.sourceType === "link" && (
          <img src={form.imageUrl} alt="preview" className="mt-2 h-20 w-20 rounded-2xl object-cover" />
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Category</label>
        <select
          value={form.category}
          onChange={(e) => updateField("category", e.target.value as WardrobeCategory)}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3"
        >
          {CATEGORY_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Subcategory</label>
        <input
          value={form.subcategory}
          onChange={(e) => updateField("subcategory", e.target.value)}
          placeholder="shirt, jeans, sneakers"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none placeholder:text-slate-400 focus:border-slate-400"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Color</label>
        <select
          value={form.color}
          onChange={(e) => updateField("color", e.target.value)}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3"
        >
          {COLOR_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Season</label>
        <select
          value={form.season}
          onChange={(e) => updateField("season", e.target.value)}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3"
        >
          {SEASON_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="md:col-span-2">
        <label className="mb-2 block text-sm font-medium">Occasions</label>
        <div className="flex flex-wrap gap-2">
          {OCCASION_OPTIONS.map((option) => {
            const selected = form.occasions.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() => {
                  const next = selected
                    ? form.occasions.filter((o) => o !== option)
                    : [...form.occasions, option];
                  updateField("occasions", next.length ? next : [option]);
                }}
                className={`rounded-full border px-3 py-1 text-xs font-medium capitalize transition ${
                  selected
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Material</label>
        <input
          value={form.material}
          onChange={(e) => updateField("material", e.target.value)}
          placeholder="cotton"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none placeholder:text-slate-400 focus:border-slate-400"
        />
      </div>

      <div className="md:col-span-2 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={form.favorite}
            onChange={(e) => updateField("favorite", e.target.checked)}
          />
          Mark as favorite
        </label>

        <button
          type="submit"
          disabled={disabled}
          className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-50"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
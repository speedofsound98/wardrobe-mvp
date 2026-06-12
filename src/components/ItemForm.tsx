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
};

export default function ItemForm({
  form,
  updateField,
  handleImageUpload,
  onSubmit,
  submitLabel,
  disabled = false,
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

      <div className="md:col-span-2 flex items-center gap-6">
        <div>
          <label className="mb-1 block text-sm font-medium">Photo</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} disabled={disabled} className="block w-full text-sm" />
        </div>
        {form.imageUrl && (
          <img src={form.imageUrl} alt="preview" className="h-24 w-24 rounded-2xl object-cover shrink-0" />
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

      <div>
        <label className="mb-1 block text-sm font-medium">Occasion</label>
        <select
          value={form.occasion}
          onChange={(e) => updateField("occasion", e.target.value)}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3"
        >
          {OCCASION_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
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
type FilterBarProps = {
  value: string;
  onChange: (value: string) => void;
  options: string[];
};

export default function FilterBar({ value, onChange, options }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`rounded-full px-4 py-2 text-sm ${
            value === option
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
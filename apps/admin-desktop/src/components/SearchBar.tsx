type SearchBarProps = {
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
};

export function SearchBar({ placeholder, value, onChange }: SearchBarProps) {
  return (
    <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3 text-sm text-slate-300">
      <span className="text-slate-400">Search</span>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
      />
    </label>
  );
}

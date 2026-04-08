import { Search } from 'lucide-react';

type SearchBarProps = {
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
};

export function SearchBar({ placeholder, value, onChange, label = 'Search' }: SearchBarProps) {
  return (
    <label className="flex items-center gap-3 rounded-[22px] border border-white/10 bg-slate-950/55 px-4 py-3 text-sm text-slate-300 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-slate-400">
        <Search className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <span className="block text-[11px] uppercase tracking-[0.24em] text-slate-500">{label}</span>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          className="mt-1 w-full bg-transparent text-white outline-none placeholder:text-slate-500"
        />
      </div>
    </label>
  );
}

type NavItem = {
  id: string;
  label: string;
};

type MobileBottomNavProps<T extends string> = {
  items: readonly { id: T; label: string }[];
  activeTab: T;
  onChange: (tab: T) => void;
};

export function MobileBottomNav<T extends string>({
  items,
  activeTab,
  onChange
}: MobileBottomNavProps<T>) {
  return (
    <nav className="sticky bottom-4 mt-6 grid grid-cols-3 gap-2 rounded-[28px] border border-slate-200/70 bg-white/90 p-2 shadow-[0_18px_55px_rgba(15,23,42,0.12)] backdrop-blur-xl">
      {items.map((item) => {
        const isActive = item.id === activeTab;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={`rounded-2xl px-3 py-3 text-sm font-medium transition ${
              isActive ? 'bg-slate-950 text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}

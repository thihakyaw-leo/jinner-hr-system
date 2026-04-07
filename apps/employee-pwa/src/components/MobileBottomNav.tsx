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
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm grid grid-cols-3 gap-1.5 rounded-full border border-white/10 bg-[#0a0f1c]/80 p-1.5 shadow-[0_20px_60px_rgba(3,105,161,0.2)] backdrop-blur-2xl z-50">
      {items.map((item) => {
        const isActive = item.id === activeTab;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={`relative rounded-full px-2 py-3 text-sm font-semibold tracking-wide transition-all duration-300 transform active:scale-95 ${
              isActive 
                ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-white shadow-inner shadow-cyan-400/20 shadow-[0_0_15px_rgba(56,189,248,0.2)] border border-cyan-400/30' 
                : 'text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}

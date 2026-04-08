type NavItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

type MobileBottomNavProps = {
  items: NavItem[];
  activeTab: string;
  onChange: (tab: string) => void;
};

export function MobileBottomNav({ items, activeTab, onChange }: MobileBottomNavProps) {
  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] max-w-md grid grid-cols-5 gap-1 rounded-2xl border border-white/10 bg-[#0a0f1c]/90 p-1.5 shadow-[0_20px_60px_rgba(3,105,161,0.2)] backdrop-blur-2xl z-50"
    >
      {items.map((item) => {
        const isActive = item.id === activeTab;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={`relative flex flex-col items-center gap-1 rounded-xl px-1 py-2.5 text-[10px] font-semibold tracking-wide transition-all duration-300 transform active:scale-95 ${
              isActive 
                ? 'bg-linear-to-r from-blue-500/20 to-cyan-500/20 text-white shadow-inner shadow-cyan-400/20 border border-cyan-400/30' 
                : 'text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            <span className={`transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>
              {item.icon}
            </span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

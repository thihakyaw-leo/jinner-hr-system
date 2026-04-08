type StatusPillProps = {
  label: string;
  tone: 'emerald' | 'sky' | 'amber' | 'rose';
  className?: string;
};

const toneMap = {
  emerald: 'bg-emerald-400/18 text-emerald-200 border-emerald-400/20 shadow-[inset_0_0_0_1px_rgba(52,211,153,0.15)]',
  sky: 'bg-sky-400/18 text-sky-100 border-sky-400/20 shadow-[inset_0_0_0_1px_rgba(125,211,252,0.15)]',
  amber: 'bg-amber-400/18 text-amber-100 border-amber-400/20 shadow-[inset_0_0_0_1px_rgba(fb,bf,24,0.15)]',
  rose: 'bg-rose-400/18 text-rose-100 border-rose-400/20 shadow-[inset_0_0_0_1px_rgba(fb,71,3b,0.15)]'
};

export function StatusPill({ label, tone, className = '' }: StatusPillProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[0.8rem] font-medium uppercase tracking-[0.1em] backdrop-blur-md transition-all ${toneMap[tone]} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full bg-current opacity-80`} />
      {label}
    </span>
  );
}

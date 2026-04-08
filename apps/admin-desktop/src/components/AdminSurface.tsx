import type { LucideIcon } from 'lucide-react';
import type { PropsWithChildren, ReactNode } from 'react';

type Accent = 'sky' | 'emerald' | 'amber' | 'rose';

const accentMap: Record<Accent, string> = {
  sky: 'from-sky-400/20 via-sky-400/8 to-transparent text-sky-200',
  emerald: 'from-emerald-400/20 via-emerald-400/8 to-transparent text-emerald-200',
  amber: 'from-amber-300/20 via-amber-300/8 to-transparent text-amber-100',
  rose: 'from-rose-400/20 via-rose-400/8 to-transparent text-rose-200'
};

type AdminSurfaceProps = PropsWithChildren<{
  className?: string;
}>;

type AdminSectionHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
};

type AdminStatCardProps = {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  accent?: Accent;
};

export function AdminSurface({ className = '', children }: AdminSurfaceProps) {
  return (
    <section
      className={`rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.94),rgba(15,23,42,0.78))] p-6 shadow-[0_24px_70px_rgba(2,8,23,0.42)] backdrop-blur-xl ${className}`}
    >
      {children}
    </section>
  );
}

export function AdminSectionHeader({
  eyebrow,
  title,
  description,
  action,
  className = ''
}: AdminSectionHeaderProps) {
  return (
    <header className={`flex flex-col gap-4 md:flex-row md:items-start md:justify-between ${className}`}>
      <div className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.3em] text-sky-200/75">{eyebrow}</p>
        <h2 className="mt-3 text-2xl font-semibold text-white md:text-[2rem]">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">{description}</p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}

export function AdminStatCard({
  label,
  value,
  detail,
  icon: Icon,
  accent = 'sky'
}: AdminStatCardProps) {
  return (
    <article className="rounded-[26px] border border-white/10 bg-slate-950/55 p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.26em] text-slate-400">{label}</p>
          <p className="mt-4 text-3xl font-semibold text-white">{value}</p>
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${accentMap[accent]}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-300">{detail}</p>
    </article>
  );
}

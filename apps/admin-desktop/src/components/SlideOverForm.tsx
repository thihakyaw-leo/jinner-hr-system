import type { PropsWithChildren } from 'react';

type SlideOverFormProps = PropsWithChildren<{
  title: string;
  description: string;
  footer?: string;
}>;

export function SlideOverForm({ title, description, footer, children }: SlideOverFormProps) {
  return (
    <aside className="rounded-[28px] border border-white/10 bg-white/6 p-5 shadow-[0_24px_70px_rgba(4,12,24,0.28)] backdrop-blur-2xl">
      <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/75">Slide-over form</p>
      <h3 className="mt-3 text-xl font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
      <div className="mt-5 grid gap-3">{children}</div>
      {footer ? <p className="mt-4 text-xs leading-5 text-slate-400">{footer}</p> : null}
    </aside>
  );
}

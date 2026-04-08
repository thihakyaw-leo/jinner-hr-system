import type { PropsWithChildren } from 'react';

type GlassPanelProps = PropsWithChildren<{
  className?: string;
}>;

export function GlassPanel({ className = '', children }: GlassPanelProps) {
  return (
    <section
      className={`rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(15,23,42,0.82))] p-6 shadow-[0_24px_70px_rgba(2,8,23,0.35)] backdrop-blur-3xl ${className}`}
    >
      {children}
    </section>
  );
}

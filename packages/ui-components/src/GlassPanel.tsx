import type { PropsWithChildren } from 'react';

type GlassPanelProps = PropsWithChildren<{
  className?: string;
}>;

export function GlassPanel({ className = '', children }: GlassPanelProps) {
  return (
    <section
      className={className}
      style={{
        padding: '24px',
        borderRadius: '28px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.06))',
        boxShadow: '0 18px 55px rgba(4, 12, 24, 0.18)',
        backdropFilter: 'blur(20px)'
      }}
    >
      {children}
    </section>
  );
}

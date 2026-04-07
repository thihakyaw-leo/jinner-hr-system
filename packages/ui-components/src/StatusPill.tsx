type StatusPillProps = {
  label: string;
  tone: 'emerald' | 'sky' | 'amber' | 'rose';
};

const toneMap = {
  emerald: 'rgba(38, 201, 139, 0.18)',
  sky: 'rgba(83, 178, 255, 0.2)',
  amber: 'rgba(245, 181, 52, 0.22)',
  rose: 'rgba(255, 111, 145, 0.2)'
};

export function StatusPill({ label, tone }: StatusPillProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 14px',
        borderRadius: '999px',
        background: toneMap[tone],
        border: '1px solid rgba(255,255,255,0.08)',
        fontSize: '0.9rem'
      }}
    >
      {label}
    </span>
  );
}

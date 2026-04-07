type SectionTitleProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionTitle({ eyebrow, title, description }: SectionTitleProps) {
  return (
    <header style={{ marginBottom: '20px' }}>
      <p
        style={{
          margin: 0,
          textTransform: 'uppercase',
          letterSpacing: '0.16em',
          fontSize: '0.75rem',
          color: 'rgba(136, 171, 205, 0.92)'
        }}
      >
        {eyebrow}
      </p>
      <h2 style={{ margin: '10px 0 8px', fontSize: '1.5rem' }}>{title}</h2>
      <p style={{ margin: 0, color: 'rgba(185, 202, 220, 0.9)' }}>{description}</p>
    </header>
  );
}

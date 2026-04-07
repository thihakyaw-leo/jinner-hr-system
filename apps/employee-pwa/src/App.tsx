import { GlassPanel, StatusPill } from '@thihakyaw-leo/ui-components';

export default function App() {
  return (
    <main className="mobile-shell">
      <header className="mobile-header">
        <div>
          <p className="mobile-eyebrow">Employee PWA</p>
          <h1>Daily HR essentials in a mobile-first shell.</h1>
        </div>
        <StatusPill label="PWA ready" tone="emerald" />
      </header>

      <section className="mobile-stack">
        <GlassPanel>
          <h2>Check-in</h2>
          <p>Connect this card to the `/api/attendance/check-in` endpoint.</p>
        </GlassPanel>

        <GlassPanel>
          <h2>My liabilities</h2>
          <p>Render deductions, remaining balances, and payment history here.</p>
        </GlassPanel>

        <GlassPanel>
          <h2>Salary details</h2>
          <p>Use the shared types package for monthly payroll summaries and slips.</p>
        </GlassPanel>
      </section>
    </main>
  );
}

import { GlassPanel } from '@thihakyaw-leo/ui-components';
import type { LiabilitySummary } from '@thihakyaw-leo/shared-types';

type MyLiabilitiesPageProps = {
  liabilities: LiabilitySummary[];
  outstanding: number;
  isLoading: boolean;
};

export function MyLiabilitiesPage({ liabilities, outstanding, isLoading }: MyLiabilitiesPageProps) {
  return (
    <section className="space-y-4">
      <header>
        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Liabilities</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">My liabilities</h1>
      </header>

      <GlassPanel className="border border-slate-200/70 bg-white/80 !shadow-[0_20px_55px_rgba(15,23,42,0.08)]">
        <div className="space-y-3 text-slate-800">
          <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">Outstanding balance</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">MMK {outstanding.toLocaleString()}</p>
          </div>
          {isLoading ? (
            <p className="text-sm leading-6 text-slate-600">Loading liabilities...</p>
          ) : liabilities.length === 0 ? (
            <p className="text-sm leading-6 text-slate-600">No liabilities found.</p>
          ) : (
            <div className="grid gap-3">
              {liabilities.map((item) => (
                <article key={item.id} className="rounded-3xl border border-slate-200/70 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{item.reason_type}</p>
                  <p className="mt-2 text-lg font-semibold text-slate-950">
                    Remaining: MMK {item.remaining_balance.toLocaleString()}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Total: MMK {item.total_amount.toLocaleString()}
                  </p>
                  {item.description ? <p className="mt-2 text-sm text-slate-600">{item.description}</p> : null}
                </article>
              ))}
            </div>
          )}
        </div>
      </GlassPanel>
    </section>
  );
}

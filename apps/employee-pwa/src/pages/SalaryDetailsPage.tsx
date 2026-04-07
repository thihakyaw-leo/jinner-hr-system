import { GlassPanel } from '@thihakyaw-leo/ui-components';
import type { PayrollSummary } from '@thihakyaw-leo/shared-types';

type SalaryDetailsPageProps = {
  payroll: PayrollSummary | null;
  isLoading: boolean;
};

export function SalaryDetailsPage({ payroll, isLoading }: SalaryDetailsPageProps) {
  return (
    <section className="space-y-4">
      <header>
        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Payroll</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">Salary details</h1>
      </header>

      <GlassPanel className="border border-slate-200/70 bg-white/80 !shadow-[0_20px_55px_rgba(15,23,42,0.08)]">
        <div className="space-y-3 text-slate-800">
          {isLoading ? (
            <p className="text-sm leading-6 text-slate-600">Loading latest payroll...</p>
          ) : payroll ? (
            <div className="grid gap-3">
              <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Period</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">
                  {payroll.month}/{payroll.year}
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Net pay</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">
                  MMK {payroll.net_pay.toLocaleString()}
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Deductions</p>
                <p className="mt-2 text-xl font-semibold text-slate-950">
                  MMK {payroll.total_deductions.toLocaleString()}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm leading-6 text-slate-600">No payroll record found yet.</p>
          )}
        </div>
      </GlassPanel>
    </section>
  );
}

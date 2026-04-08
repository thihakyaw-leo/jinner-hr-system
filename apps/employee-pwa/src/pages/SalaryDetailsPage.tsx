import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent, StatusPill } from '@thihakyaw-leo/ui-components';
import type { PayrollSummary, LiabilitySummary } from '@thihakyaw-leo/shared-types';

type SalaryDetailsPageProps = {
  payroll: PayrollSummary | null;
  liabilities: LiabilitySummary[];
  outstanding: number;
  isLoading: boolean;
};

export function SalaryDetailsPage({ payroll, liabilities, outstanding, isLoading }: SalaryDetailsPageProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'payroll' | 'liabilities'>('payroll');

  return (
    <section className="space-y-6 pb-24 px-4 pt-6 max-w-2xl mx-auto">
      <header className="flex flex-col gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{t('salary.eyebrow')}</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">{t('salary.title')}</h1>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-white/40 backdrop-blur-md rounded-2xl border border-white/50 shadow-sm max-w-[320px]">
          <button
            onClick={() => setActiveTab('payroll')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-xl transition-all ${
              activeTab === 'payroll'
                ? 'bg-[#0a0f1c] text-white shadow-lg'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t('nav.payroll')}
          </button>
          <button
            onClick={() => setActiveTab('liabilities')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-xl transition-all ${
              activeTab === 'liabilities'
                ? 'bg-[#0a0f1c] text-white shadow-lg'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t('nav.liabilities')}
          </button>
        </div>
      </header>

      {isLoading ? (
        <Card>
          <CardContent className="p-10">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="h-8 w-8 animate-spin rounded-full border-3 border-blue-400 border-t-transparent" />
              <p className="text-sm text-slate-400 font-medium">{t('salary.loading')}</p>
            </div>
          </CardContent>
        </Card>
      ) : activeTab === 'payroll' ? (
        /* Payroll Content */
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            {payroll ? (
              <div className="divide-y divide-white/10">
                <div className="p-6">
                  <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">{t('salary.period')}</p>
                  <p className="mt-2 text-2xl font-bold text-white">
                    {payroll.month}/{payroll.year}
                  </p>
                </div>
                <div className="p-6 bg-linear-to-br from-emerald-500/5 to-cyan-500/5">
                  <p className="text-xs uppercase tracking-wider text-emerald-400 font-medium">{t('salary.net_pay')}</p>
                  <p className="mt-2 text-3xl font-bold text-emerald-300">
                    MMK {payroll.net_pay.toLocaleString()}
                  </p>
                </div>
                <div className="grid grid-cols-2 divide-x divide-white/10">
                  <div className="p-5">
                    <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">{t('salary.basic_salary')}</p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      MMK {payroll.basic_salary.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-5">
                    <p className="text-xs uppercase tracking-wider text-rose-400 font-medium">{t('salary.deductions')}</p>
                    <p className="mt-2 text-lg font-semibold text-rose-300">
                      -MMK {payroll.total_deductions.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-10 text-center">
                <p className="text-sm text-slate-400">{t('salary.no_record')}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        /* Liabilities Content */
        <div className="space-y-6">
          {/* Outstanding Balance Summary */}
          <Card className="bg-linear-to-br from-rose-500/10 to-orange-500/10 border-rose-500/20">
            <CardContent className="p-6 text-center">
              <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">{t('liabilities.outstanding')}</p>
              <p className="mt-3 text-4xl font-bold text-rose-300">MMK {outstanding.toLocaleString()}</p>
            </CardContent>
          </Card>

          {liabilities.length === 0 ? (
            <Card>
              <CardContent className="p-10 text-center">
                <p className="text-sm text-slate-400">{t('liabilities.no_record')}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {liabilities.map((item) => (
                <Card key={item.id} className="hover:bg-white/10 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">{item.reason_type}</p>
                      <StatusPill
                        label={item.status === 'active' ? t('liabilities.remaining') : item.status}
                        tone={item.status === 'active' ? 'amber' : 'emerald'}
                      />
                    </div>
                    <p className="text-xl font-bold text-white">
                      {t('liabilities.remaining')}: MMK {item.remaining_balance.toLocaleString()}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      {t('liabilities.total')}: MMK {item.total_amount.toLocaleString()}
                    </p>
                    {item.description && (
                      <p className="mt-3 text-sm text-slate-300 border-t border-white/10 pt-3">{item.description}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

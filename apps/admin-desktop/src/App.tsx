import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StatusPill } from '@thihakyaw-leo/ui-components';
import { useApiHealth } from './hooks/useApiHealth';
import { useAuthSession } from './hooks/useAuthSession';
import { DashboardPage } from './pages/DashboardPage';
import { EmployeesPage } from './pages/EmployeesPage';
import { LiabilitiesPage } from './pages/LiabilitiesPage';
import { LoginPage } from './pages/LoginPage';
import { PayrollPage } from './pages/PayrollPage';

const NAV_IDS = ['dashboard', 'employees', 'liabilities', 'payroll'] as const;
type AdminPageId = (typeof NAV_IDS)[number];

export default function App() {
  const { t } = useTranslation();
  const [activePage, setActivePage] = useState<AdminPageId>('dashboard');
  const { healthStatus, apiBaseUrl } = useApiHealth();
  const { isReady, isLoading, error, login, logout, sessionLabel, token, user } = useAuthSession();

  const navItems = useMemo(() => [
    { id: 'dashboard', label: t('nav.dashboard') },
    { id: 'employees', label: t('nav.employees') },
    { id: 'liabilities', label: t('nav.liabilities') },
    { id: 'payroll', label: t('nav.payroll') }
  ] as const, [t]);

  const page = useMemo(() => {
    if (!token) {
      return null;
    }

    switch (activePage) {
      case 'employees':
        return <EmployeesPage token={token} />;
      case 'liabilities':
        return <LiabilitiesPage />;
      case 'payroll':
        return <PayrollPage />;
      case 'dashboard':
      default:
        return <DashboardPage apiBaseUrl={apiBaseUrl} />;
    }
  }, [activePage, apiBaseUrl, token]);

  if (!isReady) {
    return <main className="min-h-screen bg-slate-950" />;
  }

  if (!token) {
    return <LoginPage isLoading={isLoading} error={error} onSubmit={login} />;
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(58,130,246,0.18),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.16),transparent_30%),linear-gradient(145deg,#07111d,#0f1f31_42%,#08131e)] px-5 py-6 text-slate-100 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-4 rounded-[32px] border border-white/10 bg-white/6 p-5 shadow-[0_28px_80px_rgba(4,12,24,0.35)] backdrop-blur-2xl md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.35em] text-sky-200/80">{t('login.app_name')}</p>
            <h1 className="max-w-3xl text-3xl font-semibold leading-tight md:text-5xl">
              Admin desktop control center for people, payroll, liabilities, and day-to-day HR operations.
            </h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <StatusPill label={healthStatus} tone="emerald" />
            <StatusPill label={sessionLabel} tone="sky" />
            <button
              type="button"
              onClick={logout}
              className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
            >
              {t('nav.sign_out')}
            </button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
          <aside className="rounded-[28px] border border-white/10 bg-slate-950/30 p-4 shadow-[0_22px_65px_rgba(5,12,23,0.22)] backdrop-blur-xl">
            <p className="mb-3 text-xs uppercase tracking-[0.28em] text-slate-300/70">Modules</p>
            <nav className="space-y-2">
              {navItems.map((item) => {
                const isActive = item.id === activePage;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActivePage(item.id as AdminPageId)}
                    className={`w-full rounded-2xl px-4 py-3 text-left text-sm transition ${
                      isActive
                        ? 'bg-sky-400/20 text-white shadow-[inset_0_0_0_1px_rgba(125,211,252,0.25)]'
                        : 'bg-white/4 text-slate-300 hover:bg-white/8 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-slate-300">
              <p className="font-semibold uppercase tracking-[0.24em] text-slate-400">Signed in user</p>
              <p className="mt-2 text-sm text-white">{user?.name}</p>
              <p className="mt-1 uppercase text-slate-400">{user?.role}</p>
            </div>
          </aside>

          <section>{page}</section>
        </div>
      </div>
    </main>
  );
}

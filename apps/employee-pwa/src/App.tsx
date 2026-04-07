import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { MyLiabilitiesPage } from './pages/MyLiabilitiesPage';
import { SalaryDetailsPage } from './pages/SalaryDetailsPage';
import { MobileBottomNav } from './components/MobileBottomNav';
import { useActiveTab } from './hooks/useActiveTab';
import { useEmployeeData } from './hooks/useEmployeeData';
import { useEmployeeSession } from './hooks/useEmployeeSession';

const TAB_IDS = ['home', 'liabilities', 'salary'] as const;
type TabId = (typeof TAB_IDS)[number];

export default function App() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useActiveTab<TabId>('home');
  const { isReady, isLoading, error, login, logout, user, token, sessionLabel } = useEmployeeSession();
  const employeeData = useEmployeeData(token);

  const tabs = useMemo(() => [
    { id: 'home', label: t('nav.home') },
    { id: 'liabilities', label: t('nav.liabilities') },
    { id: 'salary', label: t('nav.payroll') }
  ] as const, [t]);

  const page = useMemo(() => {
    if (!user) {
      return null;
    }

    switch (activeTab) {
      case 'liabilities':
        return (
          <MyLiabilitiesPage
            liabilities={employeeData.liabilities}
            outstanding={employeeData.outstanding}
            isLoading={employeeData.isLoading}
          />
        );
      case 'salary':
        return <SalaryDetailsPage payroll={employeeData.latestPayroll} isLoading={employeeData.isLoading} />;
      case 'home':
      default:
        return (
          <HomePage
            employeeName={sessionLabel}
            onCheckIn={employeeData.checkIn}
            isLoading={employeeData.isLoading}
            lastCheckIn={employeeData.lastCheckIn}
            error={employeeData.error}
          />
        );
    }
  }, [activeTab, employeeData, sessionLabel, user]);

  if (!isReady) {
    return <main className="min-h-screen bg-slate-50" />;
  }

  if (!token) {
    return <LoginPage isLoading={isLoading} error={error} onSubmit={login} />;
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_28%),linear-gradient(180deg,#f8fbff,#e6f0fb)] px-4 py-5 text-slate-900">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-md flex-col">
        <div className="mb-4 flex items-center justify-between rounded-[24px] border border-white/80 bg-white/70 px-4 py-3 text-sm shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
          <span className="truncate pr-3 text-slate-700">{sessionLabel}</span>
          <button type="button" onClick={logout} className="font-medium text-slate-950">
            {t('nav.sign_out')}
          </button>
        </div>
        {page}
        {/* We cast here because exact inference over mapped mapped array loses literal string occasionally */}
        <MobileBottomNav items={tabs as unknown as {id: TabId, label: string}[]} activeTab={activeTab} onChange={setActiveTab} />
      </div>
    </main>
  );
}

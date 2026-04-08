import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { LeaveRequestPage } from './pages/LeaveRequestPage';
import { AttendanceHistoryPage } from './pages/AttendanceHistoryPage';
import { SalaryDetailsPage } from './pages/SalaryDetailsPage';
import { ProfilePage } from './pages/ProfilePage';
import { MobileBottomNav } from './components/MobileBottomNav';
import { NotificationBell } from './components/NotificationBell';
import { useActiveTab } from './hooks/useActiveTab';
import { useEmployeeData } from './hooks/useEmployeeData';
import { useEmployeeSession } from './hooks/useEmployeeSession';

const TAB_IDS = ['home', 'leave', 'attendance', 'salary', 'profile'] as const;
type TabId = (typeof TAB_IDS)[number];

// SVG Icons for bottom nav
const HomeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
);
const LeaveIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
);
const AttendanceIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const SalaryIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
);
const ProfileIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
);

export default function App() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useActiveTab<TabId>('home');
  const { isReady, isLoading, error, login, logout, user, token, sessionLabel } = useEmployeeSession();
  const employeeData = useEmployeeData(token);

  const tabs = useMemo(() => [
    { id: 'home', label: t('nav.home'), icon: <HomeIcon /> },
    { id: 'leave', label: t('nav.leave'), icon: <LeaveIcon /> },
    { id: 'attendance', label: t('nav.attendance'), icon: <AttendanceIcon /> },
    { id: 'salary', label: t('nav.payroll'), icon: <SalaryIcon /> },
    { id: 'profile', label: t('nav.profile'), icon: <ProfileIcon /> }
  ], [t]);

  const page = useMemo(() => {
    if (!user || !token) {
      return null;
    }

    switch (activeTab) {
      case 'leave':
        return <LeaveRequestPage token={token} />;
      case 'attendance':
        return <AttendanceHistoryPage token={token} />;
      case 'salary':
        return (
          <SalaryDetailsPage 
            payroll={employeeData.latestPayroll} 
            liabilities={employeeData.liabilities}
            outstanding={employeeData.outstanding}
            isLoading={employeeData.isLoading} 
          />
        );
      case 'profile':
        return <ProfilePage token={token} onLogout={logout} />;
      case 'home':
      default:
        return (
          <HomePage
            employeeName={sessionLabel}
            onCheckIn={employeeData.checkIn}
            onCheckOut={employeeData.checkOut}
            isLoading={employeeData.isLoading}
            lastCheckIn={employeeData.lastCheckIn}
            error={employeeData.error}
          />
        );
    }
  }, [activeTab, employeeData, sessionLabel, user, token, logout]);

  if (!isReady) {
    return <main className="min-h-screen bg-slate-50" />;
  }

  if (!token) {
    return <LoginPage isLoading={isLoading} error={error} onSubmit={login} />;
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_28%),linear-gradient(180deg,#f8fbff,#e6f0fb)] px-4 py-5 text-slate-900">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-md flex-col">
        {/* Top Header Bar */}
        <div className="mb-4 flex items-center justify-between rounded-[24px] border border-white/80 bg-white/70 px-4 py-3 text-sm shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
          <span className="truncate pr-3 text-slate-700">{sessionLabel}</span>
          <div className="flex items-center gap-2">
            <NotificationBell token={token} />
            <button type="button" onClick={logout} className="font-medium text-slate-950">
              {t('nav.sign_out')}
            </button>
          </div>
        </div>
        {page}
        <MobileBottomNav items={tabs} activeTab={activeTab} onChange={(id) => setActiveTab(id as TabId)} />
      </div>
    </main>
  );
}

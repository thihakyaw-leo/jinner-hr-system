import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Banknote,
  Briefcase,
  Calendar,
  LayoutDashboard,
  Users
} from 'lucide-react';
import { useApiHealth } from './hooks/useApiHealth';
import { useAuthSession } from './hooks/useAuthSession';
import {
  AdminShell,
  type AdminNavItem,
  type AdminPageId
} from './components/AdminShell';
import { AttendancePage } from './pages/AttendancePage';
import { DashboardPage } from './pages/DashboardPage';
import { EmployeesPage } from './pages/EmployeesPage';
import { LiabilitiesPage } from './pages/LiabilitiesPage';
import { LoginPage } from './pages/LoginPage';
import { PayrollPage } from './pages/PayrollPage';

const NAV_IDS = ['dashboard', 'employees', 'attendance', 'liabilities', 'payroll'] as const;

type PageMeta = {
  title: string;
  description: string;
};

const navIconMap = {
  dashboard: LayoutDashboard,
  employees: Users,
  attendance: Calendar,
  liabilities: Briefcase,
  payroll: Banknote
} as const;

export default function App() {
  const { t, i18n } = useTranslation();
  const [activePage, setActivePage] = useState<AdminPageId>('dashboard');
  const { healthStatus, apiBaseUrl } = useApiHealth();
  const { isReady, isLoading, error, login, logout, sessionLabel, token, user } = useAuthSession();

  const navItems = useMemo<AdminNavItem[]>(
    () =>
      NAV_IDS.map((id) => ({
        id,
        label: t(`nav.${id}`),
        icon: navIconMap[id]
      })),
    [t]
  );

  const pageMeta = useMemo<Record<AdminPageId, PageMeta>>(
    () => ({
      dashboard: {
        title: t('shell.dashboard_title'),
        description: t('shell.dashboard_description')
      },
      employees: {
        title: t('shell.employees_title'),
        description: t('shell.employees_description')
      },
      attendance: {
        title: t('shell.attendance_title'),
        description: t('shell.attendance_description')
      },
      liabilities: {
        title: t('shell.liabilities_title'),
        description: t('shell.liabilities_description')
      },
      payroll: {
        title: t('shell.payroll_title'),
        description: t('shell.payroll_description')
      }
    }),
    [t]
  );

  const page = useMemo(() => {
    if (!token) {
      return null;
    }

    switch (activePage) {
      case 'employees':
        return <EmployeesPage token={token} />;
      case 'attendance':
        return <AttendancePage token={token} user={user} />;
      case 'liabilities':
        return <LiabilitiesPage />;
      case 'payroll':
        return <PayrollPage />;
      case 'dashboard':
      default:
        return (
          <DashboardPage
            apiBaseUrl={apiBaseUrl}
            healthStatus={healthStatus}
            userName={user?.name ?? 'Admin'}
          />
        );
    }
  }, [activePage, apiBaseUrl, healthStatus, token, user]);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'my' : 'en');
  };

  if (!isReady) {
    return <main className="min-h-screen bg-slate-950" />;
  }

  if (!token) {
    return <LoginPage isLoading={isLoading} error={error} onSubmit={login} />;
  }

  return (
    <AdminShell
      activePage={activePage}
      appName={t('login.app_name')}
      healthStatus={healthStatus}
      languageLabel={i18n.language === 'en' ? 'MY' : 'EN'}
      modulesLabel={t('shell.modules')}
      navItems={navItems}
      onLogout={logout}
      onPageChange={setActivePage}
      onToggleLanguage={toggleLanguage}
      pageDescription={pageMeta[activePage].description}
      pageTitle={pageMeta[activePage].title}
      sessionLabel={sessionLabel}
      signOutLabel={t('nav.sign_out')}
      signedInUserLabel={t('shell.signed_in_user')}
      user={user}
    >
      {page}
    </AdminShell>
  );
}

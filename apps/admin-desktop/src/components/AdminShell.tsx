import type { AuthUser } from '@thihakyaw-leo/shared-types';
import { StatusPill } from '@thihakyaw-leo/ui-components';
import {
  Globe,
  Menu,
  Shield,
  X
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';

export type AdminPageId = 'dashboard' | 'employees' | 'attendance' | 'liabilities' | 'payroll';

export type AdminNavItem = {
  id: AdminPageId;
  label: string;
  icon: LucideIcon;
};

type AdminShellProps = {
  activePage: AdminPageId;
  appName: string;
  children: ReactNode;
  healthStatus: string;
  languageLabel: string;
  modulesLabel: string;
  navItems: AdminNavItem[];
  onLogout: () => void;
  onPageChange: (id: AdminPageId) => void;
  onToggleLanguage: () => void;
  pageDescription: string;
  pageTitle: string;
  sessionLabel: string;
  signOutLabel: string;
  signedInUserLabel: string;
  user: AuthUser | null;
};

function formatRole(role: AuthUser['role'] | undefined) {
  if (!role) {
    return 'Manager';
  }

  return role.charAt(0).toUpperCase() + role.slice(1);
}

function getInitials(name: string | undefined) {
  if (!name) {
    return 'HR';
  }

  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function AdminShell({
  activePage,
  appName,
  children,
  healthStatus,
  languageLabel,
  modulesLabel,
  navItems,
  onLogout,
  onPageChange,
  onToggleLanguage,
  pageDescription,
  pageTitle,
  sessionLabel,
  signOutLabel,
  signedInUserLabel,
  user
}: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const healthTone =
    healthStatus === 'API ready' ? 'emerald' : healthStatus === 'Checking API' ? 'amber' : 'rose';

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.2),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.18),transparent_28%),linear-gradient(145deg,#020617,#0f172a_45%,#111827)] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-[1700px] gap-5 px-4 py-4 md:px-6">
        <aside className={`hidden shrink-0 lg:block ${sidebarOpen ? 'w-72' : 'w-24'}`}>
          <div className="flex h-full flex-col rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(15,23,42,0.88))] p-4 shadow-[0_24px_70px_rgba(2,8,23,0.5)] backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3 rounded-[26px] border border-white/10 bg-white/5 px-3 py-3">
              {sidebarOpen ? (
                <div className="min-w-0">
                  <p className="truncate text-[11px] uppercase tracking-[0.3em] text-sky-200/75">
                    {appName}
                  </p>
                  <p className="mt-1 truncate text-sm text-slate-300">Desktop workspace</p>
                </div>
              ) : null}
              <button
                type="button"
                onClick={() => setSidebarOpen((current) => !current)}
                className="rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-300 transition hover:bg-white/10 hover:text-white"
                title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              >
                {sidebarOpen ? (
                  <Menu className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="mt-6">
              {sidebarOpen ? (
                <p className="px-3 text-xs uppercase tracking-[0.28em] text-slate-400">
                  {modulesLabel}
                </p>
              ) : null}
              <nav className="mt-3 space-y-2">
                {navItems.map(({ id, icon: Icon, label }) => {
                  const active = id === activePage;

                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => onPageChange(id)}
                      className={`flex w-full items-center gap-3 rounded-[24px] px-3 py-3 text-left transition ${
                        active
                          ? 'bg-sky-400/18 text-white shadow-[inset_0_0_0_1px_rgba(125,211,252,0.28)]'
                          : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      } ${sidebarOpen ? 'justify-start' : 'justify-center'}`}
                      title={label}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      {sidebarOpen ? <span className="truncate text-sm font-medium">{label}</span> : null}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="mt-auto rounded-[28px] border border-white/10 bg-white/5 p-4">
              <div className={`flex items-center gap-3 ${sidebarOpen ? '' : 'justify-center'}`}>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-400/20 font-semibold text-sky-100">
                  {getInitials(user?.name)}
                </div>
                {sidebarOpen ? (
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">{user?.name ?? appName}</p>
                    <p className="mt-1 truncate text-xs uppercase tracking-[0.22em] text-slate-400">
                      {formatRole(user?.role)}
                    </p>
                  </div>
                ) : null}
              </div>

              {sidebarOpen ? (
                <div className="mt-4 border-t border-white/10 pt-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                    {signedInUserLabel}
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-300">
                    <Shield className="h-4 w-4 text-sky-300" />
                    <span className="truncate">{sessionLabel}</span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(15,23,42,0.82))] px-5 py-5 shadow-[0_24px_70px_rgba(2,8,23,0.35)] backdrop-blur-xl md:px-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
              <div className="max-w-4xl">
                <p className="text-xs uppercase tracking-[0.35em] text-sky-200/75">{appName}</p>
                <h1 className="mt-3 text-3xl font-semibold leading-tight text-white md:text-4xl">
                  {pageTitle}
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 md:text-base">
                  {pageDescription}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 xl:justify-end">
                <StatusPill label={healthStatus} tone={healthTone} />
                <StatusPill label={sessionLabel} tone="sky" />
                <button
                  type="button"
                  onClick={onToggleLanguage}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
                >
                  <Globe className="h-4 w-4" />
                  <span>{languageLabel}</span>
                </button>
                <button
                  type="button"
                  onClick={onLogout}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                  <span>{signOutLabel}</span>
                </button>
              </div>
            </div>

            <div className="mt-5 flex gap-2 overflow-x-auto lg:hidden">
              {navItems.map(({ id, icon: Icon, label }) => {
                const active = id === activePage;

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onPageChange(id)}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
                      active
                        ? 'bg-sky-400/18 text-white shadow-[inset_0_0_0_1px_rgba(125,211,252,0.28)]'
                        : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </header>

          <div className="mt-5">{children}</div>
        </div>
      </div>
    </main>
  );
}

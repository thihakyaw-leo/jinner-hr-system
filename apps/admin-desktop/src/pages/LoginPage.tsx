import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GlassPanel } from '@thihakyaw-leo/ui-components';

type LoginPageProps = {
  isLoading: boolean;
  error: string | null;
  onSubmit: (input: { employee_code: string; password: string }) => Promise<unknown>;
};

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, GlassPanel, Input } from '@thihakyaw-leo/ui-components';
import { KeyRound, Languages, User } from 'lucide-react';

type LoginPageProps = {
  isLoading: boolean;
  error: string | null;
  onSubmit: (input: { employee_code: string; password: string }) => Promise<unknown>;
};

export function LoginPage({ isLoading, error, onSubmit }: LoginPageProps) {
  const { t, i18n } = useTranslation();
  const [employeeCode, setEmployeeCode] = useState('');
  const [password, setPassword] = useState('');

  const toggleLanguage = () => {
    void i18n.changeLanguage(i18n.language === 'en' ? 'my' : 'en');
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#020617] p-6 text-slate-100 selection:bg-sky-500/30">
      {/* Dynamic Background Elements */}
      <div className="pointer-events-none absolute -left-[10%] -top-[10%] h-[600px] w-[600px] rounded-full bg-sky-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-[10%] -right-[10%] h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(15,23,42,0)_0%,#020617_100%)]" />

      {/* Floating Language Switcher */}
      <div className="absolute right-8 top-8 z-50">
        <button
          type="button"
          onClick={toggleLanguage}
          className="group flex h-12 items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium text-slate-200 backdrop-blur-xl transition-all hover:bg-white/10 hover:text-white active:scale-95 shadow-2xl"
        >
          <Languages className="h-4 w-4 text-sky-400 transition-transform group-hover:rotate-12" />
          <span>{i18n.language === 'en' ? 'Myanmar' : 'English'}</span>
        </button>
      </div>

      <div className="relative z-10 w-full max-w-[540px]">
        {/* Brand/Logo Area */}
        <header className="mb-10 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-sky-400 to-indigo-600 shadow-[0_0_40px_rgba(14,165,233,0.25)]">
            <span className="text-2xl font-bold text-white">J</span>
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-sky-400/80">
            {t('login.app_name')}
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            {t('login.welcome_back')}
          </h1>
          <p className="mx-auto mt-4 max-w-[320px] text-sm leading-6 text-slate-400">
            {t('login.description')}
          </p>
        </header>

        <GlassPanel className="border-white/[0.08] bg-slate-900/40 p-8 md:p-10">
          <form
            className="space-y-6"
            onSubmit={(event) => {
              event.preventDefault();
              void onSubmit({ employee_code: employeeCode, password });
            }}
          >
            <Input
              label={t('login.emp_code_label')}
              value={employeeCode}
              onChange={(event) => setEmployeeCode(event.target.value)}
              placeholder={t('login.emp_code_placeholder')}
              icon={<User className="h-5 w-5" />}
              autoComplete="username"
              required
            />

            <Input
              label={t('login.password_label')}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={t('login.password_placeholder')}
              icon={<KeyRound className="h-5 w-5" />}
              autoComplete="current-password"
              required
            />

            {error ? (
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-300">
                {error}
              </div>
            ) : null}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              {isLoading ? t('login.signing_in') : t('login.sign_in_button')}
            </Button>
          </form>
        </GlassPanel>

        <footer className="mt-10 text-center">
          <p className="text-xs text-slate-500 tracking-wide">
            © 2026 Admin Portal • Powered by Jinner Ecosystem
          </p>
        </footer>
      </div>
    </main>
  );
}

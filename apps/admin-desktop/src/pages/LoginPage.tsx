import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GlassPanel } from '@thihakyaw-leo/ui-components';

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
    i18n.changeLanguage(i18n.language === 'en' ? 'my' : 'en');
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(58,130,246,0.18),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.16),transparent_30%),linear-gradient(145deg,#07111d,#0f1f31_42%,#08131e)] px-5 py-6 text-slate-100 md:px-8 relative">
      {/* Floating Language Switcher */}
      <div className="absolute top-6 right-8 z-50">
        <button 
          onClick={toggleLanguage}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-md transition-all active:scale-95 shadow-lg"
        >
          {i18n.language === 'en' ? 'မြ' : 'EN'}
        </button>
      </div>

      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-5xl items-center justify-center relative z-10">
        <GlassPanel className="w-full max-w-xl">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.35em] text-sky-200/80">{t('login.app_name')}</p>
            <h1 className="text-4xl font-semibold text-white">{t('login.welcome_back')}</h1>
            <p className="text-sm leading-6 text-slate-300">
              {t('login.description')}
            </p>
          </div>

          <form
            className="mt-6 grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              void onSubmit({ employee_code: employeeCode, password });
            }}
          >
            <label className="grid gap-2 text-sm text-slate-300">
              {t('login.emp_code_label')}
              <input
                value={employeeCode}
                onChange={(event) => setEmployeeCode(event.target.value)}
                className="rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                placeholder={t('login.emp_code_placeholder')}
              />
            </label>

            <label className="grid gap-2 text-sm text-slate-300">
              {t('login.password_label')}
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                placeholder={t('login.password_placeholder')}
              />
            </label>

            {error ? <p className="text-sm text-rose-300">{error}</p> : null}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 rounded-2xl bg-cyan-300 px-4 py-3 font-medium text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? t('login.signing_in') : t('login.sign_in_button')}
            </button>
          </form>
        </GlassPanel>
      </div>
    </main>
  );
}

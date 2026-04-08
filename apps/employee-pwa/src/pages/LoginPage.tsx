import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, Button, Input } from '@thihakyaw-leo/ui-components';

type LoginPageProps = {
  isLoading: boolean;
  error: string | null;
  onSubmit: (input: { employee_code: string; password: string }) => Promise<unknown>;
};

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, Button, Input } from '@thihakyaw-leo/ui-components';
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
      {/* Immersive background effects */}
      <div className="pointer-events-none absolute -left-[10%] -top-[10%] h-[400px] w-[400px] rounded-full bg-sky-500/10 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-[10%] -right-[10%] h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-[100px]" />

      {/* Floating Language Switcher */}
      <div className="fixed right-6 top-6 z-50">
        <button
          type="button"
          onClick={toggleLanguage}
          title={i18n.language === 'en' ? 'Myanmar' : 'English'}
          aria-label={i18n.language === 'en' ? 'Switch to Myanmar' : 'Switch to English'}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 backdrop-blur-xl transition-all hover:bg-white/10 hover:text-white active:scale-95 shadow-2xl"
        >
          <Languages className="h-4 w-4" />
        </button>
      </div>

      <div className="relative z-10 w-full max-w-[440px]">
        {/* Mobile-centric header */}
        <header className="mb-8 text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-[20px] bg-gradient-to-br from-sky-400 to-indigo-600 shadow-[0_0_30px_rgba(14,165,233,0.2)]">
            <span className="text-xl font-bold text-white">J</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-sky-400/80">
            {t('login.app_name')}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            {t('login.welcome_back')}
          </h1>
        </header>

        <Card className="border-white/[0.06] bg-slate-900/40 shadow-2xl backdrop-blur-3xl">
          <CardHeader className="border-none pb-2 pt-8 text-center">
            <CardDescription className="text-slate-400">
              {t('login.description')}
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-8 pt-6">
            <form
              className="space-y-5"
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
                required
              />

              <Input
                label={t('login.password_label')}
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={t('login.password_placeholder')}
                icon={<KeyRound className="h-5 w-5" />}
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
          </CardContent>
        </Card>

        <footer className="mt-8 text-center">
          <p className="text-[10px] uppercase tracking-widest text-slate-500">
            Powered by Jinner Ecosystem
          </p>
        </footer>
      </div>
    </main>
  );
}

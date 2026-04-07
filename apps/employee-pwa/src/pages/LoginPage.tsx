import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, Button, Input } from '@thihakyaw-leo/ui-components';

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
    <main className="min-h-screen flex items-center justify-center p-4 lg:p-8">
      {/* Floating Language Switcher */}
      <div className="fixed top-6 right-6 z-50">
        <button 
          onClick={toggleLanguage}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-md transition-all active:scale-95 shadow-lg"
        >
          {i18n.language === 'en' ? 'မြ' : 'EN'}
        </button>
      </div>

      {/* Dynamic atmospheric glowing orbs */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <Card className="w-full max-w-md relative z-10">
        <CardHeader className="text-center pb-4 pt-10 border-none">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-600 mb-6 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-blue-400/80 mb-2">{t('login.app_name')}</p>
          <CardTitle>{t('login.welcome_back')}</CardTitle>
          <CardDescription className="mt-2 text-slate-300">
            {t('login.description')}
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-10">
          <form
            className="grid gap-5"
            onSubmit={(event) => {
              event.preventDefault();
              void onSubmit({ employee_code: employeeCode, password });
            }}
          >
            <div className="space-y-4">
              <Input
                label={t('login.emp_code_label')}
                value={employeeCode}
                onChange={(event) => setEmployeeCode(event.target.value)}
                placeholder={t('login.emp_code_placeholder')}
                required
              />
              <Input
                label={t('login.password_label')}
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={t('login.password_placeholder')}
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                <p className="text-sm text-red-400 text-center">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full mt-2"
            >
              {isLoading ? t('login.signing_in') : t('login.sign_in_button')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

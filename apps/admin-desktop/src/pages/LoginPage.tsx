import { useState } from 'react';
import { GlassPanel } from '@thihakyaw-leo/ui-components';

type LoginPageProps = {
  isLoading: boolean;
  error: string | null;
  onSubmit: (input: { employee_code: string; password: string }) => Promise<unknown>;
};

export function LoginPage({ isLoading, error, onSubmit }: LoginPageProps) {
  const [employeeCode, setEmployeeCode] = useState('');
  const [password, setPassword] = useState('');

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(58,130,246,0.18),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.16),transparent_30%),linear-gradient(145deg,#07111d,#0f1f31_42%,#08131e)] px-5 py-6 text-slate-100 md:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-5xl items-center justify-center">
        <GlassPanel className="w-full max-w-xl">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.35em] text-sky-200/80">Admin access</p>
            <h1 className="text-4xl font-semibold text-white">Sign in to Jinner HR Admin Desktop</h1>
            <p className="text-sm leading-6 text-slate-300">
              Use an employee code and password from the D1 `employees` table.
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
              Employee code
              <input
                value={employeeCode}
                onChange={(event) => setEmployeeCode(event.target.value)}
                className="rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                placeholder="JNR-001"
              />
            </label>

            <label className="grid gap-2 text-sm text-slate-300">
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                placeholder="Enter your password"
              />
            </label>

            {error ? <p className="text-sm text-rose-300">{error}</p> : null}

            <button
              type="submit"
              disabled={isLoading}
              className="rounded-2xl bg-cyan-300 px-4 py-3 font-medium text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </GlassPanel>
      </div>
    </main>
  );
}

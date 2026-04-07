import { GlassPanel, StatusPill } from '@thihakyaw-leo/ui-components';
import { CheckInButton } from '../components/CheckInButton';

type HomePageProps = {
  employeeName: string;
  onCheckIn: () => Promise<void>;
  isLoading: boolean;
  lastCheckIn: string | null;
  error: string | null;
};

export function HomePage({ employeeName, onCheckIn, isLoading, lastCheckIn, error }: HomePageProps) {
  return (
    <section className="space-y-4">
      <header className="rounded-[32px] border border-white/70 bg-white/70 p-5 shadow-[0_24px_65px_rgba(15,23,42,0.1)] backdrop-blur-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-sky-700/70">Employee PWA</p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight text-slate-950">
              Daily HR essentials in a mobile-first experience.
            </h1>
            <p className="mt-2 text-sm text-slate-600">{employeeName}</p>
          </div>
          <StatusPill label="PWA ready" tone="emerald" />
        </div>
      </header>

      <GlassPanel className="border border-slate-200/70 bg-white/75 !shadow-[0_20px_55px_rgba(15,23,42,0.08)]">
        <div className="space-y-4 text-slate-800">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Check-in</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">Start your workday</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Use the button below to create a real attendance record in the backend.
            </p>
          </div>
          <CheckInButton disabled={isLoading} onClick={() => void onCheckIn()} />
          {lastCheckIn ? (
            <p className="text-sm text-emerald-700">Last check-in: {new Date(lastCheckIn).toLocaleString()}</p>
          ) : null}
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        </div>
      </GlassPanel>

      <div className="grid gap-4">
        <GlassPanel className="border border-slate-200/70 bg-white/70 !shadow-[0_20px_55px_rgba(15,23,42,0.08)]">
          <h2 className="text-lg font-semibold text-slate-950">Today summary</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Show shift info, branch notices, and pending actions here.
          </p>
        </GlassPanel>
      </div>
    </section>
  );
}

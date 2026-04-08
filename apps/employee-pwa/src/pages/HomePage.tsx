import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent, Avatar, StatusPill, Button } from '@thihakyaw-leo/ui-components';

type HomePageProps = {
  employeeName: string;
  onCheckIn: () => Promise<void>;
  onCheckOut: () => Promise<void>;
  isLoading: boolean;
  lastCheckIn: string | null;
  error: string | null;
};

export function HomePage({ employeeName, onCheckIn, onCheckOut, isLoading, lastCheckIn, error }: HomePageProps) {
  const { t } = useTranslation();
  const [elapsedTime, setElapsedTime] = useState<string>('00:00:00');

  useEffect(() => {
    if (!lastCheckIn) {
      setElapsedTime('00:00:00');
      return;
    }

    const interval = setInterval(() => {
      const start = new Date(lastCheckIn).getTime();
      const now = new Date().getTime();
      const diff = now - start;

      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);

      setElapsedTime(
        `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [lastCheckIn]);

  return (
    <section className="space-y-6 pb-24 px-4 pt-6 max-w-2xl mx-auto">
      {/* Top Section */}
      <h1 className="text-3xl font-light text-white tracking-tight">
        {t('home.greeting')} <br />
        <span className="font-semibold">{employeeName}</span>
      </h1>

      {/* Main Check-In Widget */}
      <Card className="border-sky-500/10 bg-[linear-gradient(135deg,rgba(14,165,233,0.1),rgba(79,70,229,0.08))] shadow-[0_20px_50px_rgba(2,8,23,0.4)] backdrop-blur-3xl">
        <CardContent className="flex flex-col items-center p-8 text-center">
          <Avatar
            size="xl"
            fallback={employeeName}
            status={lastCheckIn ? 'online' : 'offline'}
            className="mb-6 shadow-[0_0_50px_rgba(14,165,233,0.3)] ring-2 ring-sky-400/20"
          />
          <StatusPill
            label={lastCheckIn ? t('home.checked_in') : t('home.not_checked_in')}
            tone={lastCheckIn ? 'emerald' : 'amber'}
            className="mb-8"
          />

          {lastCheckIn && (
            <div className="mb-8">
              <p className="font-mono text-5xl font-bold tracking-[0.15em] text-white">
                {elapsedTime}
              </p>
              <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.4em] text-sky-400">
                {t('attendance.working_hours')}
              </p>
            </div>
          )}

          <Button
            variant={lastCheckIn ? 'secondary' : 'primary'}
            size="lg"
            className="w-full shadow-2xl transition-all active:scale-[0.98]"
            onClick={() => void (lastCheckIn ? onCheckOut() : onCheckIn())}
            isLoading={isLoading}
          >
            {lastCheckIn ? t('home.check_out_button') : t('home.check_in_button')}
          </Button>

          {lastCheckIn && (
            <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-slate-400">
              {t('home.last_check_in')}{' '}
              <span className="text-sky-300">
                {new Date(lastCheckIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </p>
          )}
          {error && (
            <div className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-300">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Grid Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="hover:bg-white/10 transition-colors cursor-pointer group">
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wider text-slate-400 font-medium mb-1 group-hover:text-cyan-300 transition-colors">{t('home.shift_label')}</p>
            <p className="text-xl font-semibold text-white">09:00 - 18:00</p>
          </CardContent>
        </Card>
        <Card className="hover:bg-white/10 transition-colors cursor-pointer group">
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wider text-slate-400 font-medium mb-1 group-hover:text-indigo-300 transition-colors">{t('home.pending_label')}</p>
            <p className="text-xl font-semibold text-white">{t('home.tasks_value', { count: 2 })}</p>
          </CardContent>
        </Card>
      </div>

      {/* Announcements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('home.announcements_title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-l-2 border-sky-400/50 bg-sky-400/5 pl-4 py-2 hover:bg-sky-400/10 rounded-r-2xl transition-all cursor-pointer group">
            <p className="text-sm font-semibold text-white group-hover:text-sky-300 transition-colors">{t('home.announcement_1')}</p>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">{t('home.announcement_1_time')}</p>
          </div>
          <div className="border-l-2 border-white/10 bg-white/5 pl-4 py-2 hover:bg-white/10 rounded-r-2xl transition-all cursor-pointer group">
            <p className="text-sm font-semibold text-white group-hover:text-slate-200 transition-colors">{t('home.announcement_2')}</p>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">{t('home.announcement_2_time')}</p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent, Avatar, StatusPill, Button } from '@thihakyaw-leo/ui-components';

type HomePageProps = {
  employeeName: string;
  onCheckIn: () => Promise<void>;
  isLoading: boolean;
  lastCheckIn: string | null;
  error: string | null;
};

export function HomePage({ employeeName, onCheckIn, isLoading, lastCheckIn, error }: HomePageProps) {
  const { t } = useTranslation();

  return (
    <section className="space-y-6 pb-24 px-4 pt-6 max-w-2xl mx-auto">
      {/* Top Section */}
      <h1 className="text-3xl font-light text-white tracking-tight">
        {t('home.greeting')} <br />
        <span className="font-semibold">{employeeName}</span>
      </h1>

      {/* Main Check-In Widget */}
      <Card className="bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border-blue-500/20">
        <CardContent className="p-6 flex flex-col items-center text-center">
          <Avatar 
            size="xl" 
            fallback={employeeName} 
            status="online" 
            className="mb-4 shadow-[0_0_40px_rgba(56,189,248,0.3)]"
          />
          <StatusPill label={lastCheckIn ? t('home.checked_in') : t('home.not_checked_in')} tone={lastCheckIn ? "emerald" : "amber"} className="mb-6" />
          
          <Button 
            variant="primary" 
            size="lg" 
            className="w-full text-lg py-4 rounded-full font-bold tracking-wide shadow-blue-500/40 transform active:scale-[0.98]"
            onClick={() => void onCheckIn()}
            isLoading={isLoading}
          >
            {lastCheckIn ? t('home.check_out_button') : t('home.check_in_button')}
          </Button>

          {lastCheckIn && (
            <p className="mt-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
              {t('home.last_check_in')} <span className="text-blue-300">{new Date(lastCheckIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </p>
          )}
          {error && <p className="mt-3 text-sm text-red-400 bg-red-400/10 rounded-lg p-2">{error}</p>}
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
          <div className="border-l-2 border-blue-400 pl-4 py-1.5 hover:bg-white/5 rounded-r-xl transition-all cursor-pointer">
            <p className="text-sm font-medium text-white">{t('home.announcement_1')}</p>
            <p className="text-xs text-slate-400 mt-0.5">{t('home.announcement_1_time')}</p>
          </div>
          <div className="border-l-2 border-slate-600 pl-4 py-1.5 hover:bg-white/5 rounded-r-xl transition-all cursor-pointer">
            <p className="text-sm font-medium text-white">{t('home.announcement_2')}</p>
            <p className="text-xs text-slate-400 mt-0.5">{t('home.announcement_2_time')}</p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

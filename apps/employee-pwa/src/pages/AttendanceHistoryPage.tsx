import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, StatusPill } from '@thihakyaw-leo/ui-components';
import type { AttendanceRecord, AttendanceSummary } from '@thihakyaw-leo/shared-types';
import { apiBaseUrl } from '../hooks/apiBaseUrl';

type AttendanceHistoryPageProps = {
  token: string;
};

export function AttendanceHistoryPage({ token }: AttendanceHistoryPageProps) {
  const { t } = useTranslation();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [summary, setSummary] = useState<AttendanceSummary>({ total: 0, present: 0, rate: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${apiBaseUrl}/api/attendance/mine`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = (await res.json()) as { items?: AttendanceRecord[]; summary?: AttendanceSummary };
        setRecords(data.items ?? []);
        setSummary(data.summary ?? { total: 0, present: 0, rate: 0 });
      } catch {
        // silent
      } finally {
        setIsLoading(false);
      }
    };

    void fetchAttendance();
  }, [token]);

  const formatTime = (iso: string) => {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getDuration = (startIso: string, endIso: string | null) => {
    if (!endIso) return '---';
    const start = new Date(startIso).getTime();
    const end = new Date(endIso).getTime();
    const diff = end - start;
    if (diff < 0) return '---';

    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return `${h}h ${m}m`;
  };

  return (
    <section className="space-y-6 pb-24 px-4 pt-6 max-w-2xl mx-auto">
      <header>
        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{t('attendance.eyebrow')}</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">{t('attendance.title')}</h1>
      </header>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">{t('attendance.total_days')}</p>
            <p className="mt-2 text-2xl font-bold text-white">{summary.total}</p>
          </CardContent>
        </Card>
        <Card className="bg-linear-to-br from-emerald-500/10 to-green-500/10 border-emerald-500/20">
          <CardContent className="p-4 text-center">
            <p className="text-xs uppercase tracking-wider text-emerald-400 font-medium">{t('attendance.present')}</p>
            <p className="mt-2 text-2xl font-bold text-emerald-300">{summary.present}</p>
          </CardContent>
        </Card>
        <Card className="bg-linear-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
          <CardContent className="p-4 text-center">
            <p className="text-xs uppercase tracking-wider text-cyan-400 font-medium">{t('attendance.present_rate')}</p>
            <p className="mt-2 text-2xl font-bold text-cyan-300">{summary.rate}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Records List */}
      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />
              <p className="text-sm text-slate-400">{t('attendance.loading')}</p>
            </div>
          </CardContent>
        </Card>
      ) : records.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-slate-400">{t('attendance.no_record')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {records.map((record) => (
            <Card key={record.id} className="hover:bg-white/10 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{record.work_date}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                      <span className="text-[10px] uppercase tracking-wider text-slate-500">
                        {t('attendance.check_in_time')}: <span className="text-slate-200">{formatTime(record.check_in)}</span>
                      </span>
                      {record.check_out && (
                        <span className="text-[10px] uppercase tracking-wider text-slate-500">
                          {t('attendance.check_out_time')}: <span className="text-slate-200">{formatTime(record.check_out)}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <StatusPill
                      label={t(`attendance.${record.status}`)}
                      tone={record.status === 'present' ? 'emerald' : record.status === 'late' ? 'amber' : 'rose'}
                    />
                    {record.check_out && (
                      <p className="text-xs font-bold text-cyan-400">
                        {getDuration(record.check_in, record.check_out)}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}

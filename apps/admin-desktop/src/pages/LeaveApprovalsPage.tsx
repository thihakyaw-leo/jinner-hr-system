import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GlassPanel, StatusPill } from '@thihakyaw-leo/ui-components';
import type { AuthUser, LeaveRequest } from '@thihakyaw-leo/shared-types';
import { apiBaseUrl } from '../hooks/apiBaseUrl';

type LeaveApprovalsPageProps = {
  token: string;
  user: AuthUser | null;
};

export function LeaveApprovalsPage({ token, user }: LeaveApprovalsPageProps) {
  const { t } = useTranslation();
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${apiBaseUrl}/api/leave?status=${filter}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = (await res.json()) as { items?: LeaveRequest[] };
      setRequests(data.items ?? []);
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchRequests();
  }, [token, filter]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this leave request?')) return;
    try {
      await fetch(`${apiBaseUrl}/api/leave/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchRequests();
    } catch {
      // silent
    }
  };

  const handleReview = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await fetch(`${apiBaseUrl}/api/leave/${id}/review`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      await fetchRequests();
    } catch {
      // silent
    }
  };

  const statusTone = (status: string) => {
    if (status === 'approved') return 'emerald' as const;
    if (status === 'rejected') return 'rose' as const;
    return 'amber' as const;
  };

  return (
    <div className="space-y-5">
      <GlassPanel>
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-sky-200/80">{t('leave.title')}</p>
          </div>
          <div className="flex gap-2">
            {(['pending', 'approved', 'rejected'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`rounded-full px-4 py-2 text-xs font-medium transition-all ${
                  filter === s
                    ? 'bg-sky-400/20 text-white border border-sky-400/30'
                    : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                }`}
              >
                {t(`leave.status_${s}`)}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center gap-3 py-4">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
            <p className="text-sm text-slate-300">Loading...</p>
          </div>
        ) : requests.length === 0 ? (
          <p className="text-sm text-slate-400 py-4">{t('leave.no_requests')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="pb-3 text-xs uppercase tracking-wider text-slate-400 font-medium">{t('leave.employee')}</th>
                  <th className="pb-3 text-xs uppercase tracking-wider text-slate-400 font-medium">{t('leave.type')}</th>
                  <th className="pb-3 text-xs uppercase tracking-wider text-slate-400 font-medium">{t('leave.dates')}</th>
                  <th className="pb-3 text-xs uppercase tracking-wider text-slate-400 font-medium">{t('leave.reason')}</th>
                  <th className="pb-3 text-xs uppercase tracking-wider text-slate-400 font-medium text-right">{t('leave.action')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4">
                      <p className="font-medium text-white">{req.employee_name ?? 'Unknown'}</p>
                      <p className="text-xs text-slate-400">{req.employee_code}</p>
                    </td>
                    <td className="py-4">
                      <span className="text-slate-200">{t(`leave.${req.leave_type}`)}</span>
                    </td>
                    <td className="py-4">
                      <p className="text-slate-200">{req.start_date}</p>
                      <p className="text-xs text-slate-400">→ {req.end_date}</p>
                    </td>
                    <td className="py-4">
                      <p className="text-slate-300 max-w-[200px] truncate">{req.reason ?? '—'}</p>
                    </td>
                    <td className="py-4 text-right">
                      {req.status === 'pending' ? (
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => void handleReview(req.id, 'approved')}
                            className="rounded-xl bg-emerald-500/20 px-3 py-1.5 text-xs font-medium text-emerald-300 border border-emerald-400/30 hover:bg-emerald-500/30 transition-colors"
                          >
                            {t('leave.approve')}
                          </button>
                          <button
                            onClick={() => void handleReview(req.id, 'rejected')}
                            className="rounded-xl bg-rose-500/20 px-3 py-1.5 text-xs font-medium text-rose-300 border border-rose-400/30 hover:bg-rose-500/30 transition-colors"
                          >
                            {t('leave.reject')}
                          </button>
                        </div>
                       ) : (
                        <div className="flex items-center justify-end gap-3">
                          <StatusPill label={t(`leave.status_${req.status}`)} tone={statusTone(req.status)} />
                          {user?.role === 'owner' && (
                            <button
                              onClick={() => void handleDelete(req.id)}
                              className="rounded-lg bg-white/5 p-1.5 text-rose-400 transition hover:bg-white/10"
                              title="Delete Request"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassPanel>
    </div>
  );
}

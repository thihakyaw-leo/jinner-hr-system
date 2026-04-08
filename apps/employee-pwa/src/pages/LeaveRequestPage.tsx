import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent, StatusPill, Button } from '@thihakyaw-leo/ui-components';
import type { LeaveRequest, LeaveType } from '@thihakyaw-leo/shared-types';
import { apiBaseUrl } from '../hooks/apiBaseUrl';

type LeaveRequestPageProps = {
  token: string;
};

const LEAVE_TYPES: LeaveType[] = ['annual', 'sick', 'personal', 'unpaid'];

export function LeaveRequestPage({ token }: LeaveRequestPageProps) {
  const { t } = useTranslation();
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [leaveType, setLeaveType] = useState<LeaveType>('annual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${apiBaseUrl}/api/leave/mine`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = (await res.json()) as { items?: LeaveRequest[] };
      setRequests(data.items ?? []);
    } catch {
      setError('Unable to load leave requests.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchRequests();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`${apiBaseUrl}/api/leave`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          leave_type: leaveType,
          start_date: startDate,
          end_date: endDate,
          reason: reason || undefined
        })
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? 'Failed to submit.');
      }

      setShowForm(false);
      setStartDate('');
      setEndDate('');
      setReason('');
      await fetchRequests();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusTone = (status: string) => {
    if (status === 'approved') return 'emerald';
    if (status === 'rejected') return 'rose';
    return 'amber';
  };

  const statusLabel = (status: string) => {
    if (status === 'approved') return t('leave.status_approved');
    if (status === 'rejected') return t('leave.status_rejected');
    return t('leave.status_pending');
  };

  return (
    <section className="space-y-6 pb-24 px-4 pt-6 max-w-2xl mx-auto">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{t('leave.eyebrow')}</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">{t('leave.title')}</h1>
        </div>
        <Button variant="primary" size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? t('leave.cancel') : t('leave.new_request')}
        </Button>
      </header>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
          <p className="text-sm text-red-400 text-center">{error}</p>
        </div>
      )}

      {/* New Leave Request Form */}
      {showForm && (
        <Card className="border-blue-500/20 bg-linear-to-br from-blue-500/5 to-cyan-500/5">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-medium mb-2">
                  {t('leave.leave_type')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {LEAVE_TYPES.map((lt) => (
                    <button
                      key={lt}
                      type="button"
                      onClick={() => setLeaveType(lt)}
                      className={`rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                        leaveType === lt
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                          : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {t(`leave.${lt}`)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="leave-start-date" className="block text-xs uppercase tracking-wider text-slate-400 font-medium mb-2">
                    {t('leave.start_date')}
                  </label>
                  <input
                    id="leave-start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    title={t('leave.start_date')}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-400/50"
                  />
                </div>
                <div>
                  <label htmlFor="leave-end-date" className="block text-xs uppercase tracking-wider text-slate-400 font-medium mb-2">
                    {t('leave.end_date')}
                  </label>
                  <input
                    id="leave-end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    title={t('leave.end_date')}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-400/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-medium mb-2">
                  {t('leave.reason')}
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={t('leave.reason_placeholder')}
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-400/50 resize-none"
                />
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isSubmitting}>
                {isSubmitting ? t('leave.submitting') : t('leave.submit')}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Leave Requests List */}
      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />
              <p className="text-sm text-slate-400">Loading...</p>
            </div>
          </CardContent>
        </Card>
      ) : requests.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-slate-400">{t('leave.no_requests')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => (
            <Card key={req.id} className="hover:bg-white/10 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-semibold text-white">{t(`leave.${req.leave_type}`)}</p>
                  <StatusPill label={statusLabel(req.status)} tone={statusTone(req.status)} />
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {req.start_date} → {req.end_date}
                </p>
                {req.reason && (
                  <p className="mt-2 text-sm text-slate-300">{req.reason}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}

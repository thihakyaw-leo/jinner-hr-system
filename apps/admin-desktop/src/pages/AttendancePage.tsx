import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StatusPill } from '@thihakyaw-leo/ui-components';
import type { AuthUser, LeaveRequest } from '@thihakyaw-leo/shared-types';
import { Calendar, CheckCircle, Clock, Shield, Trash2, XCircle } from 'lucide-react';
import {
  AdminSectionHeader,
  AdminStatCard,
  AdminSurface
} from '../components/AdminSurface';
import { apiBaseUrl } from '../hooks/apiBaseUrl';

type AttendancePageProps = {
  token: string;
  user: AuthUser | null;
};

export function AttendancePage({ token, user }: AttendancePageProps) {
  const { t } = useTranslation();
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${apiBaseUrl}/api/leave?status=${filter}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = (await res.json()) as { items?: LeaveRequest[]; error?: string };

      if (!res.ok) {
        throw new Error(data.error ?? 'Unable to load leave requests.');
      }

      setRequests(data.items ?? []);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error ? fetchError.message : 'Unable to load leave requests.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchRequests();
  }, [filter, token]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this leave request?')) {
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/leave/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? 'Unable to delete leave request.');
      }

      await fetchRequests();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : 'Unable to delete leave request.'
      );
    }
  };

  const handleReview = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/leave/${id}/review`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? 'Unable to update leave request.');
      }

      await fetchRequests();
    } catch (reviewError) {
      setError(
        reviewError instanceof Error ? reviewError.message : 'Unable to update leave request.'
      );
    }
  };

  const summary = useMemo(() => {
    const pendingCount = requests.filter((request) => request.status === 'pending').length;

    return {
      total: requests.length,
      pendingCount
    };
  }, [requests]);

  const statusTone = (status: string) => {
    if (status === 'approved') return 'emerald' as const;
    if (status === 'rejected') return 'rose' as const;
    return 'amber' as const;
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-5">
        <AdminSurface>
          <AdminSectionHeader
            eyebrow={t('nav.attendance')}
            title="Attendance workspace"
            description="The prototype grouped leave with attendance, so this phase maps the real leave approval workflow into that workspace without inventing new attendance-only data flows."
          />

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <AdminStatCard
              label="Visible requests"
              value={String(summary.total)}
              detail="Rows currently returned from the selected leave status filter."
              icon={Calendar}
            />
            <AdminStatCard
              label="Pending actions"
              value={String(summary.pendingCount)}
              detail="Requests that still need an approve or reject decision."
              icon={Clock}
              accent="amber"
            />
            <AdminStatCard
              label="Delete access"
              value={user?.role === 'owner' ? 'Owner' : 'Disabled'}
              detail="Only owners keep delete access after a request has been reviewed."
              icon={Shield}
              accent="rose"
            />
          </div>
        </AdminSurface>

        <AdminSurface>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">{t('leave.title')}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Review leave requests from the same dense table layout used across the new admin shell.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {(['pending', 'approved', 'rejected'] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFilter(status)}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    filter === status
                      ? 'bg-sky-400/18 text-white shadow-[inset_0_0_0_1px_rgba(125,211,252,0.28)]'
                      : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {t(`leave.status_${status}`)}
                </button>
              ))}
            </div>
          </div>

          {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}

          <div className="mt-6 overflow-hidden rounded-[26px] border border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px]">
                <thead className="bg-slate-950/70 text-left">
                  <tr className="text-[11px] uppercase tracking-[0.26em] text-slate-400">
                    <th className="px-4 py-4 font-medium">{t('leave.employee')}</th>
                    <th className="px-4 py-4 font-medium">{t('leave.type')}</th>
                    <th className="px-4 py-4 font-medium">{t('leave.dates')}</th>
                    <th className="px-4 py-4 font-medium">{t('leave.reason')}</th>
                    <th className="px-4 py-4 text-right font-medium">{t('leave.action')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 bg-white/[0.03]">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-sm text-slate-300">
                        Loading leave requests...
                      </td>
                    </tr>
                  ) : requests.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-sm text-slate-300">
                        {t('leave.no_requests')}
                      </td>
                    </tr>
                  ) : (
                    requests.map((request) => (
                      <tr key={request.id} className="transition hover:bg-white/[0.04]">
                        <td className="px-4 py-4">
                          <p className="text-sm font-medium text-white">
                            {request.employee_name ?? 'Unknown'}
                          </p>
                          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">
                            {request.employee_code}
                          </p>
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-200">
                          {t(`leave.${request.leave_type}`)}
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-300">
                          <p>{request.start_date}</p>
                          <p className="mt-1 text-xs text-slate-500">to {request.end_date}</p>
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-300">
                          {request.reason ?? 'No reason supplied.'}
                        </td>
                        <td className="px-4 py-4">
                          {request.status === 'pending' ? (
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => void handleReview(request.id, 'approved')}
                                className="inline-flex items-center gap-2 rounded-2xl border border-emerald-300/15 bg-emerald-400/12 px-3 py-2 text-sm text-emerald-100 transition hover:bg-emerald-400/18"
                              >
                                <CheckCircle className="h-4 w-4" />
                                <span>{t('leave.approve')}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => void handleReview(request.id, 'rejected')}
                                className="inline-flex items-center gap-2 rounded-2xl border border-rose-300/15 bg-rose-400/12 px-3 py-2 text-sm text-rose-100 transition hover:bg-rose-400/18"
                              >
                                <XCircle className="h-4 w-4" />
                                <span>{t('leave.reject')}</span>
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-3">
                              <StatusPill
                                label={t(`leave.status_${request.status}`)}
                                tone={statusTone(request.status)}
                              />
                              {user?.role === 'owner' ? (
                                <button
                                  type="button"
                                  onClick={() => void handleDelete(request.id)}
                                  className="inline-flex items-center gap-2 rounded-2xl border border-rose-300/15 bg-rose-400/12 px-3 py-2 text-sm text-rose-100 transition hover:bg-rose-400/18"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span>Delete</span>
                                </button>
                              ) : null}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </AdminSurface>
      </div>

      <div className="space-y-5">
        <AdminSurface>
          <AdminSectionHeader
            eyebrow="Approval rules"
            title="Current behavior"
            description="The redesign keeps the existing leave approval contract intact and avoids expanding into unsupported attendance analytics."
          />

          <div className="mt-6 space-y-4">
            {[
              {
                title: 'Manager and owner review',
                detail: 'The table still reads from the filtered admin leave endpoint and supports approve or reject actions.'
              },
              {
                title: 'Owner-only delete',
                detail: 'Delete remains limited to owners after a request has already been reviewed.'
              },
              {
                title: 'No extra attendance widgets',
                detail: 'This workspace intentionally does not introduce new charts or attendance summaries that need fresh routes.'
              }
            ].map((item) => (
              <article
                key={item.title}
                className="rounded-[22px] border border-white/10 bg-slate-950/55 p-4"
              >
                <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{item.detail}</p>
              </article>
            ))}
          </div>
        </AdminSurface>
      </div>
    </div>
  );
}

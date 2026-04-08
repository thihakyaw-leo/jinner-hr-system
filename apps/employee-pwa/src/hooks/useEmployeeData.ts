import { useEffect, useState } from 'react';
import type { LiabilitySummary, PayrollSummary, AttendanceRecord } from '@thihakyaw-leo/shared-types';
import { apiBaseUrl } from './apiBaseUrl';

type UseEmployeeDataResult = {
  liabilities: LiabilitySummary[];
  outstanding: number;
  latestPayroll: PayrollSummary | null;
  lastCheckIn: string | null;
  isLoading: boolean;
  error: string | null;
  checkIn: () => Promise<void>;
  checkOut: () => Promise<void>;
};

export function useEmployeeData(token: string | null): UseEmployeeDataResult {
  const [liabilities, setLiabilities] = useState<LiabilitySummary[]>([]);
  const [outstanding, setOutstanding] = useState(0);
  const [latestPayroll, setLatestPayroll] = useState<PayrollSummary | null>(null);
  const [lastCheckIn, setLastCheckIn] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (signal?: AbortSignal) => {
    if (!token) {
      setLiabilities([]);
      setOutstanding(0);
      setLatestPayroll(null);
      setLastCheckIn(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await Promise.all([
        // Get liabilities
        fetch(`${apiBaseUrl}/api/liabilities/mine`, {
          headers: { Authorization: `Bearer ${token}` },
          signal
        }).then(async (response) => {
          const payload = (await response.json()) as { items?: LiabilitySummary[]; outstanding?: number; error?: string };
          if (!response.ok) throw new Error(payload.error ?? 'Unable to load liabilities.');
          setLiabilities(payload.items ?? []);
          setOutstanding(payload.outstanding ?? 0);
        }),
        // Get latest payroll
        fetch(`${apiBaseUrl}/api/payroll/mine/latest`, {
          headers: { Authorization: `Bearer ${token}` },
          signal
        }).then(async (response) => {
          const payload = (await response.json()) as { item?: PayrollSummary | null; error?: string };
          if (!response.ok) throw new Error(payload.error ?? 'Unable to load payroll.');
          setLatestPayroll(payload.item ?? null);
        }),
        // Get latest attendance session
        fetch(`${apiBaseUrl}/api/attendance/mine`, {
          headers: { Authorization: `Bearer ${token}` },
          signal
        }).then(async (response) => {
          const payload = (await response.json()) as { items?: AttendanceRecord[]; error?: string };
          if (!response.ok) throw new Error(payload.error ?? 'Unable to load attendance.');
          
          const latest = payload.items?.[0];
          // Determine if we are currently checked in (last record has no check_out)
          if (latest && !latest.check_out) {
            setLastCheckIn(latest.check_in);
          } else {
            setLastCheckIn(null);
          }
        })
      ]);
    } catch (fetchError) {
      if ((fetchError as Error).name !== 'AbortError') {
        setError(fetchError instanceof Error ? fetchError.message : 'Unable to load employee data.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    void fetchData(controller.signal);
    return () => controller.abort();
  }, [token]);

  const checkIn = async () => {
    if (!token) throw new Error('Not authenticated.');
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${apiBaseUrl}/api/attendance/check-in`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      const payload = (await response.json()) as { checked_in_at?: string; error?: string };
      if (!response.ok) throw new Error(payload.error ?? 'Unable to check in.');
      
      setLastCheckIn(payload.checked_in_at ?? null);
    } finally {
      setIsLoading(false);
    }
  };

  const checkOut = async () => {
    if (!token) throw new Error('Not authenticated.');
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${apiBaseUrl}/api/attendance/check-out`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      const payload = (await response.json()) as { checked_out_at?: string; error?: string };
      if (!response.ok) throw new Error(payload.error ?? 'Unable to check out.');
      
      setLastCheckIn(null);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    liabilities,
    outstanding,
    latestPayroll,
    lastCheckIn,
    isLoading,
    error,
    checkIn,
    checkOut
  };
}

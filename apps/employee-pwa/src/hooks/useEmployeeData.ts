import { useEffect, useState } from 'react';
import type { LiabilitySummary, PayrollSummary } from '@thihakyaw-leo/shared-types';
import { apiBaseUrl } from './apiBaseUrl';

type UseEmployeeDataResult = {
  liabilities: LiabilitySummary[];
  outstanding: number;
  latestPayroll: PayrollSummary | null;
  lastCheckIn: string | null;
  isLoading: boolean;
  error: string | null;
  checkIn: () => Promise<void>;
};

export function useEmployeeData(token: string | null): UseEmployeeDataResult {
  const [liabilities, setLiabilities] = useState<LiabilitySummary[]>([]);
  const [outstanding, setOutstanding] = useState(0);
  const [latestPayroll, setLatestPayroll] = useState<PayrollSummary | null>(null);
  const [lastCheckIn, setLastCheckIn] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setLiabilities([]);
      setOutstanding(0);
      setLatestPayroll(null);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    void Promise.all([
      fetch(`${apiBaseUrl}/api/liabilities/mine`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal
      }).then(async (response) => {
        const payload = (await response.json()) as {
          items?: LiabilitySummary[];
          outstanding?: number;
          error?: string;
        };

        if (!response.ok) {
          throw new Error(payload.error ?? 'Unable to load liabilities.');
        }

        setLiabilities(payload.items ?? []);
        setOutstanding(payload.outstanding ?? 0);
      }),
      fetch(`${apiBaseUrl}/api/payroll/mine/latest`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal
      }).then(async (response) => {
        const payload = (await response.json()) as {
          item?: PayrollSummary | null;
          error?: string;
        };

        if (!response.ok) {
          throw new Error(payload.error ?? 'Unable to load payroll.');
        }

        setLatestPayroll(payload.item ?? null);
      })
    ])
      .catch((fetchError) => {
        if ((fetchError as Error).name !== 'AbortError') {
          setError(fetchError instanceof Error ? fetchError.message : 'Unable to load employee data.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [token]);

  const checkIn = async () => {
    if (!token) {
      throw new Error('Not authenticated.');
    }

    setError(null);

    const response = await fetch(`${apiBaseUrl}/api/attendance/check-in`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const payload = (await response.json()) as {
      checked_in_at?: string;
      error?: string;
    };

    if (!response.ok) {
      const message = payload.error ?? 'Unable to check in.';
      setError(message);
      throw new Error(message);
    }

    setLastCheckIn(payload.checked_in_at ?? null);
  };

  return {
    liabilities,
    outstanding,
    latestPayroll,
    lastCheckIn,
    isLoading,
    error,
    checkIn
  };
}

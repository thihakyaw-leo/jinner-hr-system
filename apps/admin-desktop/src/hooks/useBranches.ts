import { useEffect, useState } from 'react';
import type { BranchSummary } from '@thihakyaw-leo/shared-types';
import { apiBaseUrl } from './apiBaseUrl';

export function useBranches(token: string | null) {
  const [items, setItems] = useState<BranchSummary[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setItems([]);
      return;
    }

    const controller = new AbortController();
    setError(null);

    void fetch(`${apiBaseUrl}/api/branches`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      signal: controller.signal
    })
      .then(async (response) => {
        const payload = (await response.json()) as { items?: BranchSummary[]; error?: string };

        if (!response.ok) {
          throw new Error(payload.error ?? 'Unable to load branches.');
        }

        setItems(payload.items ?? []);
      })
      .catch((fetchError) => {
        if ((fetchError as Error).name !== 'AbortError') {
          setError(fetchError instanceof Error ? fetchError.message : 'Unable to load branches.');
        }
      });

    return () => controller.abort();
  }, [token]);

  return { items, error };
}

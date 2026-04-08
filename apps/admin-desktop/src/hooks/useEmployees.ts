import { useEffect, useState } from 'react';
import type { CreateEmployeeInput, EmployeeSummary } from '@thihakyaw-leo/shared-types';
import { apiBaseUrl } from './apiBaseUrl';

type UseEmployeesOptions = {
  token: string | null;
  search: string;
};

export function useEmployees({ token, search }: UseEmployeesOptions) {
  const [items, setItems] = useState<EmployeeSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setItems([]);
      return;
    }

    const controller = new AbortController();
    const query = search.trim();

    setIsLoading(true);
    setError(null);

    void fetch(`${apiBaseUrl}/api/employees${query ? `?q=${encodeURIComponent(query)}` : ''}`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      signal: controller.signal
    })
      .then(async (response) => {
        const payload = (await response.json()) as { items?: EmployeeSummary[]; error?: string };

        if (!response.ok) {
          throw new Error(payload.error ?? 'Unable to load employees.');
        }

        setItems(payload.items ?? []);
      })
      .catch((fetchError) => {
        if ((fetchError as Error).name !== 'AbortError') {
          setError(fetchError instanceof Error ? fetchError.message : 'Unable to load employees.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [search, token]);

  const createEmployee = async (input: CreateEmployeeInput) => {
    if (!token) {
      throw new Error('Not authenticated.');
    }

    setIsCreating(true);
    setError(null);

    try {
      const response = await fetch(`${apiBaseUrl}/api/employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(input)
      });

      const payload = (await response.json()) as { item?: EmployeeSummary; error?: string };

      if (!response.ok || !payload.item) {
        throw new Error(payload.error ?? 'Unable to create employee.');
      }

      setItems((current) => [payload.item as EmployeeSummary, ...current]);
      return payload.item;
    } catch (createError) {
      const message = createError instanceof Error ? createError.message : 'Unable to create employee.';
      setError(message);
      throw createError;
    } finally {
      setIsCreating(false);
    }
  };

  const updateEmployee = async (id: string, input: Partial<CreateEmployeeInput>) => {
    if (!token) throw new Error('Not authenticated.');
    setIsUpdating(true);
    setError(null);
    try {
      const response = await fetch(`${apiBaseUrl}/api/employees/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(input)
      });
      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? 'Unable to update employee.');
      }
      setItems((current) =>
        current.map((item) => (item.id === id ? { ...item, ...input } : item))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed.');
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteEmployee = async (id: string) => {
    if (!token) throw new Error('Not authenticated.');
    setIsDeleting(true);
    setError(null);
    try {
      const response = await fetch(`${apiBaseUrl}/api/employees/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? 'Unable to delete employee.');
      }
      setItems((current) => current.filter((item) => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed.');
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  return { items, isLoading, isCreating, isUpdating, isDeleting, error, createEmployee, updateEmployee, deleteEmployee };
}

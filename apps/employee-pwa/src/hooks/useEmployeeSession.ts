import { useEffect, useMemo, useState } from 'react';
import type { AuthResponse, AuthUser } from '@thihakyaw-leo/shared-types';
import { apiBaseUrl } from './apiBaseUrl';

const storageKey = 'jinner-employee-session';

type StoredSession = {
  token: string;
  user: AuthUser;
};

export function useEmployeeSession() {
  const [session, setSession] = useState<StoredSession | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);

    if (raw) {
      try {
        setSession(JSON.parse(raw) as StoredSession);
      } catch {
        localStorage.removeItem(storageKey);
      }
    }

    setIsReady(true);
  }, []);

  const login = async (input: { employee_code: string; password: string }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(input)
      });

      const payload = (await response.json()) as AuthResponse | { error: string };

      if (!response.ok || 'error' in payload) {
        throw new Error('error' in payload ? payload.error : 'Login failed.');
      }

      const nextSession = {
        token: payload.token,
        user: payload.user
      };

      setSession(nextSession);
      localStorage.setItem(storageKey, JSON.stringify(nextSession));
      return nextSession;
    } catch (loginError) {
      const message = loginError instanceof Error ? loginError.message : 'Login failed.';
      setError(message);
      throw loginError;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setSession(null);
    setError(null);
    localStorage.removeItem(storageKey);
  };

  const sessionLabel = useMemo(() => {
    if (!session) {
      return 'Signed out';
    }

    return `${session.user.name} (${session.user.employee_code})`;
  }, [session]);

  return {
    session,
    token: session?.token ?? null,
    user: session?.user ?? null,
    isReady,
    isLoading,
    error,
    login,
    logout,
    sessionLabel
  };
}

import { useEffect, useMemo, useState } from 'react';
import type { AuthResponse, AuthUser } from '@thihakyaw-leo/shared-types';
import { apiBaseUrl } from './apiBaseUrl';

const storageKey = 'jinner-admin-session';

type StoredSession = {
  token: string;
  user: AuthUser;
};

type LoginInput = {
  employee_code: string;
  password: string;
};

export function useAuthSession() {
  const [session, setSession] = useState<StoredSession | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(storageKey);

    if (raw) {
      try {
        setSession(JSON.parse(raw) as StoredSession);
      } catch {
        sessionStorage.removeItem(storageKey);
      }
    }

    setIsReady(true);
  }, []);

  const login = async ({ employee_code, password }: LoginInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ employee_code, password })
      });

      const payload = (await response.json()) as AuthResponse | { error: string };

      if (!response.ok || 'error' in payload) {
        throw new Error('error' in payload ? payload.error : 'Login failed.');
      }

      if (payload.user.role !== 'owner' && payload.user.role !== 'manager') {
        throw new Error('Access denied. Only owners and managers can access the admin center.');
      }

      const nextSession = {
        token: payload.token,
        user: payload.user
      };

      setSession(nextSession);
      sessionStorage.setItem(storageKey, JSON.stringify(nextSession));
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
    sessionStorage.removeItem(storageKey);
  };

  const sessionLabel = useMemo(() => {
    if (!session) {
      return 'Signed out';
    }

    return `Signed in as ${session.user.employee_code}`;
  }, [session]);

  return {
    session,
    isReady,
    isLoading,
    error,
    login,
    logout,
    sessionLabel,
    token: session?.token ?? null,
    user: session?.user ?? null
  };
}

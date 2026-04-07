import type { AppEnv } from './types';

export const getAllowedOrigins = (env: AppEnv['Bindings']) => {
  const origins = new Set([
    'http://localhost:1420',
    'http://127.0.0.1:1420',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'tauri://localhost'
  ]);

  if (env.ADMIN_DESKTOP_ORIGIN) {
    origins.add(env.ADMIN_DESKTOP_ORIGIN);
  }

  if (env.EMPLOYEE_PWA_ORIGIN) {
    origins.add(env.EMPLOYEE_PWA_ORIGIN);
  }

  return [...origins];
};

export const hashPassword = async (password: string) => {
  const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
  return Array.from(new Uint8Array(buffer), (value) => value.toString(16).padStart(2, '0')).join('');
};

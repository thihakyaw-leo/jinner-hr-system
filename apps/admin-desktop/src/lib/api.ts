import { apiBaseUrl } from './config';

export const fetchHealth = async () => {
  const response = await fetch(`${apiBaseUrl}/health`);

  if (!response.ok) {
    throw new Error('Backend health check failed.');
  }

  return response.json() as Promise<{ ok: boolean; service: string }>;
};

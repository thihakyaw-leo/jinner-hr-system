import { useEffect, useState } from 'react';
import { apiBaseUrl } from './apiBaseUrl';

export function useApiHealth() {
  const [healthStatus, setHealthStatus] = useState('Checking API');

  useEffect(() => {
    let isMounted = true;

    void fetch(`${apiBaseUrl}/health`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Health endpoint failed.');
        }

        if (isMounted) {
          setHealthStatus('API ready');
        }
      })
      .catch(() => {
        if (isMounted) {
          setHealthStatus('API unavailable');
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { healthStatus, apiBaseUrl };
}

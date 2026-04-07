import { useEffect, useState } from 'react';
import { GlassPanel, SectionTitle, StatusPill } from '@thihakyaw-leo/ui-components';
import type { DashboardMetric } from '@thihakyaw-leo/shared-types';
import { apiBaseUrl } from './lib/config';
import { authStore } from './lib/auth';
import { fetchHealth } from './lib/api';

const metrics: DashboardMetric[] = [
  { label: 'Employees', value: '128', tone: 'emerald' },
  { label: 'Today Attendance', value: '94%', tone: 'sky' },
  { label: 'Pending Leaves', value: '06', tone: 'amber' },
  { label: 'Open Liabilities', value: '18', tone: 'rose' }
];

const modules = [
  'System Overview Dashboard',
  'Employee Management',
  'Attendance Monitoring',
  'Leave Request Approvals'
];

export default function App() {
  const sessionMode = authStore.describe();
  const [healthStatus, setHealthStatus] = useState('Checking API');

  useEffect(() => {
    let isMounted = true;

    void fetchHealth()
      .then(() => {
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

  return (
    <main className="admin-shell">
      <div className="background-orb orb-left" />
      <div className="background-orb orb-right" />

      <section className="hero-bar">
        <div>
          <p className="eyebrow">Jinner HR System</p>
          <h1>Admin command center for people, payroll, and daily operations.</h1>
        </div>

        <div className="hero-meta">
          <StatusPill label={healthStatus} tone="emerald" />
          <StatusPill label={sessionMode} tone="sky" />
        </div>
      </section>

      <section className="dashboard-grid">
        <GlassPanel className="panel panel-hero">
          <SectionTitle
            eyebrow="Live stack"
            title="Secure desktop operations"
            description={`Connected to ${apiBaseUrl} with an in-memory token strategy by default.`}
          />
          <div className="metric-row">
            {metrics.map((metric) => (
              <div key={metric.label} className={`metric-card tone-${metric.tone}`}>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
              </div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="panel panel-modules">
          <SectionTitle
            eyebrow="Modules"
            title="Operations architecture"
            description="The starter layout is organized around the core admin workflows."
          />
          <div className="module-list">
            {modules.map((moduleName) => (
              <article key={moduleName} className="module-card">
                <h2>{moduleName}</h2>
                <p>Ready for CRUD screens, analytics, and action-focused slide-over flows.</p>
              </article>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="panel panel-service">
          <SectionTitle
            eyebrow="Service layer"
            title="Backend integration starter"
            description="Use the shared fetch client for auth, employee CRUD, attendance, and payroll endpoints."
          />
          <pre>{`POST /api/auth/login\nPOST /api/liabilities/create\nPOST /api/attendance/check-in`}</pre>
        </GlassPanel>

        <GlassPanel className="panel panel-security">
          <SectionTitle
            eyebrow="Auth posture"
            title="Desktop token handling"
            description="Tokens stay in memory during development. Swap the adapter to a keychain-backed Tauri plugin for persistent sessions."
          />
          <ul>
            <li>Keep JWTs out of long-lived localStorage.</li>
            <li>Refresh session state from explicit login only.</li>
            <li>Centralize authenticated fetch behavior in one client.</li>
          </ul>
        </GlassPanel>
      </section>
    </main>
  );
}

import { GlassPanel, SectionTitle } from '@thihakyaw-leo/ui-components';
import type { DashboardMetric } from '@thihakyaw-leo/shared-types';
import { BentoGrid } from '../components/BentoGrid';
import { SearchBar } from '../components/SearchBar';
import { SlideOverForm } from '../components/SlideOverForm';

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

type DashboardPageProps = {
  apiBaseUrl: string;
};

export function DashboardPage({ apiBaseUrl }: DashboardPageProps) {
  return (
    <div className="space-y-5">
      <SearchBar placeholder="Search employees, payroll periods, approvals..." />

      <BentoGrid>
        <div className="xl:col-span-8">
          <GlassPanel className="h-full">
            <SectionTitle
              eyebrow="Overview"
              title="Secure desktop operations"
              description={`Connected to ${apiBaseUrl}. This page is ready for dashboard widgets and analytics feeds.`}
            />

            <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-3xl border border-white/10 bg-white/4 px-4 py-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]"
                >
                  <p className="text-sm text-slate-300">{metric.label}</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{metric.value}</p>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>

        <div className="xl:col-span-4">
          <SlideOverForm
            title="Create employee flow"
            description="This panel is reserved for slide-over CRUD forms such as employee onboarding, liability creation, and payroll adjustments."
          />
        </div>

        <div className="xl:col-span-7">
          <GlassPanel className="h-full">
            <SectionTitle
              eyebrow="Modules"
              title="Feature architecture"
              description="The admin app is now split into reusable components, hooks, and page modules."
            />

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {modules.map((moduleName) => (
                <article key={moduleName} className="rounded-3xl border border-white/10 bg-slate-950/25 p-4">
                  <h3 className="text-lg font-semibold text-white">{moduleName}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Ready for CRUD workflows, reporting widgets, and role-aware actions.
                  </p>
                </article>
              ))}
            </div>
          </GlassPanel>
        </div>

        <div className="xl:col-span-5">
          <GlassPanel className="h-full">
            <SectionTitle
              eyebrow="Service layer"
              title="Backend endpoints"
              description="The desktop shell is aligned with the backend router layout."
            />
            <pre className="mt-5 whitespace-pre-wrap rounded-3xl border border-white/10 bg-slate-950/35 p-4 text-sm text-slate-200">{`POST /api/auth/login
POST /api/liabilities/create
POST /api/attendance/check-in`}</pre>
          </GlassPanel>
        </div>
      </BentoGrid>
    </div>
  );
}

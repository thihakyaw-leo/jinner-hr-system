import {
  Banknote,
  BarChart3,
  Briefcase,
  Calendar,
  CheckCircle,
  Globe,
  Shield,
  Users
} from 'lucide-react';
import {
  AdminSectionHeader,
  AdminStatCard,
  AdminSurface
} from '../components/AdminSurface';

type DashboardPageProps = {
  apiBaseUrl: string;
  healthStatus: string;
  userName: string;
};

export function DashboardPage({ apiBaseUrl, healthStatus, userName }: DashboardPageProps) {
  const stats = [
    {
      label: 'Supported modules',
      value: '5',
      detail: 'Dashboard, employees, attendance, liabilities, and payroll are wired into the new shell.',
      icon: BarChart3,
      accent: 'sky' as const
    },
    {
      label: 'API health',
      value: healthStatus === 'API ready' ? 'Ready' : 'Watch',
      detail: `Current Worker target: ${apiBaseUrl}`,
      icon: Globe,
      accent: healthStatus === 'API ready' ? ('emerald' as const) : ('amber' as const)
    },
    {
      label: 'Primary workflows',
      value: '3',
      detail: 'Employee CRUD, leave approvals, and session-aware admin access remain active.',
      icon: CheckCircle,
      accent: 'emerald' as const
    },
    {
      label: 'Operator',
      value: userName,
      detail: 'The desktop shell keeps the current authenticated admin context visible at all times.',
      icon: Shield,
      accent: 'rose' as const
    }
  ];

  const rolloutCards = [
    {
      title: 'Employee lifecycle',
      description: 'Create, edit, and remove staff records while keeping role and branch assignments aligned with the backend.'
    },
    {
      title: 'Attendance workspace',
      description: 'Managers and owners can review leave requests from the new attendance lane without introducing extra endpoints.'
    },
    {
      title: 'Finance modules',
      description: 'Liabilities and payroll now share the same visual system while remaining limited to the currently supported contracts.'
    }
  ];

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_380px]">
      <div className="space-y-5">
        <AdminSurface>
          <AdminSectionHeader
            eyebrow="Operations overview"
            title="Prototype-inspired control room"
            description="The admin desktop now follows the denser navigation, card rhythm, and operational framing from the reference UI while preserving the existing backend-connected flows."
          />

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <AdminStatCard key={stat.label} {...stat} />
            ))}
          </div>
        </AdminSurface>

        <AdminSurface>
          <AdminSectionHeader
            eyebrow="Rollout lanes"
            title="What this desktop release covers"
            description="Phase 1 focuses on a UI port that keeps real workflows visible and avoids unsupported prototype-only modules."
          />

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {rolloutCards.map((card, index) => {
              const Icon = index === 0 ? Users : index === 1 ? Calendar : Briefcase;

              return (
                <article
                  key={card.title}
                  className="rounded-[26px] border border-white/10 bg-slate-950/50 p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-400/15 text-sky-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-white">{card.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{card.description}</p>
                </article>
              );
            })}
          </div>
        </AdminSurface>
      </div>

      <div className="space-y-5">
        <AdminSurface>
          <AdminSectionHeader
            eyebrow="Connected routes"
            title="Desktop-to-Worker alignment"
            description="The dashboard keeps the current backend surface visible so UI work stays grounded in the routes that actually exist."
          />

          <div className="mt-6 space-y-3">
            {[
              'POST /api/auth/login',
              'GET /api/employees',
              'POST /api/employees',
              'GET /api/leave?status=pending',
              'POST /api/liabilities/create'
            ].map((route) => (
              <div
                key={route}
                className="rounded-[22px] border border-white/10 bg-slate-950/55 px-4 py-3 text-sm text-slate-200"
              >
                {route}
              </div>
            ))}
          </div>
        </AdminSurface>

        <AdminSurface>
          <AdminSectionHeader
            eyebrow="Phase 1 constraints"
            title="Intentional omissions"
            description="Unsupported prototype sections stay out of the shell in this release so the desktop does not advertise dead ends."
          />

          <div className="mt-6 space-y-4">
            {[
              {
                label: 'No damaged-items module',
                detail: 'That prototype section has no current schema or admin route backing it.'
              },
              {
                label: 'No admin settings screen',
                detail: 'Company settings remain out of scope until the required persistence model exists.'
              },
              {
                label: 'No global notification center',
                detail: 'The top bar stays operational and avoids introducing placeholder-only interactions.'
              }
            ].map((item) => (
              <article
                key={item.label}
                className="rounded-[22px] border border-white/10 bg-slate-950/55 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-slate-200">
                    <Banknote className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{item.label}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{item.detail}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </AdminSurface>
      </div>
    </div>
  );
}

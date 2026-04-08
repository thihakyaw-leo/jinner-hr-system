import { Banknote, Briefcase, Shield, Users } from 'lucide-react';
import {
  AdminSectionHeader,
  AdminStatCard,
  AdminSurface
} from '../components/AdminSurface';

export function PayrollPage() {
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-5">
        <AdminSurface>
          <AdminSectionHeader
            eyebrow="Finance workspace"
            title="Payroll"
            description="The payroll area now follows the same operational visual language as the rest of the admin shell while staying honest about the current route surface."
          />

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <AdminStatCard
              label="Current route"
              value="GET"
              detail="Existing payroll access is still employee-focused through `/api/payroll/mine/latest`."
              icon={Banknote}
            />
            <AdminStatCard
              label="Desktop state"
              value="Planning"
              detail="This release restyles the workspace without inventing admin payroll execution flows."
              icon={Shield}
              accent="amber"
            />
            <AdminStatCard
              label="Schema ready"
              value="Yes"
              detail="Payroll rows already store period, deductions, status, and net pay in D1."
              icon={Briefcase}
              accent="emerald"
            />
          </div>
        </AdminSurface>

        <AdminSurface>
          <AdminSectionHeader
            eyebrow="Module posture"
            title="Why this page stays focused"
            description="The prototype suggested a broader payroll workspace, but phase 1 keeps this page aligned with the routes and data model that already exist."
          />

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              {
                title: 'No admin payroll runner yet',
                detail: 'The redesigned page does not pretend that a monthly payroll execution flow already exists.'
              },
              {
                title: 'Shared visual system',
                detail: 'Cards, headers, spacing, and module framing now match employees and attendance.'
              },
              {
                title: 'Deletion remains protected',
                detail: 'Owner-only payroll deletion still belongs to the backend contract, not a new phase-1 UI action.'
              },
              {
                title: 'Future-safe staging',
                detail: 'The workspace is visually ready for period summaries and approval checkpoints when those routes arrive.'
              }
            ].map((item) => (
              <article
                key={item.title}
                className="rounded-[24px] border border-white/10 bg-slate-950/55 p-5"
              >
                <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{item.detail}</p>
              </article>
            ))}
          </div>
        </AdminSurface>
      </div>

      <div className="space-y-5">
        <AdminSurface>
          <AdminSectionHeader
            eyebrow="Backend contract"
            title="Current Worker surface"
            description="This page documents the current payroll backend shape so future UI expansion stays implementation-led."
          />

          <div className="mt-6 space-y-4">
            <article className="rounded-[22px] border border-white/10 bg-slate-950/55 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-sky-200">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Employee-driven data</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Payroll retrieval is currently oriented around the authenticated employee record rather than an admin ledger view.
                  </p>
                </div>
              </div>
            </article>

            <pre className="whitespace-pre-wrap rounded-[22px] border border-white/10 bg-slate-950/70 p-4 text-sm leading-6 text-slate-200">{`GET /api/payroll/mine/latest
DELETE /api/payroll/:id`}</pre>
          </div>
        </AdminSurface>
      </div>
    </div>
  );
}

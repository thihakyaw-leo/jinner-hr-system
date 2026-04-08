import { Banknote, Briefcase, Shield, Users } from 'lucide-react';
import {
  AdminSectionHeader,
  AdminStatCard,
  AdminSurface
} from '../components/AdminSurface';

export function LiabilitiesPage() {
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-5">
        <AdminSurface>
          <AdminSectionHeader
            eyebrow="Finance workspace"
            title="Liabilities"
            description="This module now shares the prototype-inspired layout while remaining intentionally scoped to the liability routes and finance concepts that already exist."
          />

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <AdminStatCard
              label="Protected route"
              value="POST"
              detail="Liability creation still targets `/api/liabilities/create`."
              icon={Briefcase}
            />
            <AdminStatCard
              label="Current rollout"
              value="UI shell"
              detail="The visual port is in place even though the admin listing workflow is not yet expanded."
              icon={Shield}
              accent="amber"
            />
            <AdminStatCard
              label="Finance model"
              value="Active"
              detail="The backend still tracks total amount, remaining balance, and status."
              icon={Banknote}
              accent="emerald"
            />
          </div>
        </AdminSurface>

        <AdminSurface>
          <AdminSectionHeader
            eyebrow="Phase 1 focus"
            title="What this page does now"
            description="The liabilities workspace stays informative and avoids fake CRUD controls until the admin-side listing and editing flow is explicitly expanded."
          />

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              {
                title: 'Creation contract',
                detail: 'The backend expects `employee_id`, `amount`, `reason_type`, and optional `description`.'
              },
              {
                title: 'Finance follow-up',
                detail: 'Remaining balance and status updates remain backend-supported, but no new admin editor is added in this pass.'
              },
              {
                title: 'Workflow consistency',
                detail: 'The page now matches the same panel system, spacing, and section rhythm as the rest of the admin shell.'
              },
              {
                title: 'No dead controls',
                detail: 'Prototype actions without supporting flows are omitted instead of being shown as disabled placeholders.'
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
            title="Admin context"
            description="The current UI is deliberately explicit about what the backend already supports so future CRUD work can layer on safely."
          />

          <div className="mt-6 space-y-4">
            <article className="rounded-[22px] border border-white/10 bg-slate-950/55 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-sky-200">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Per-employee liabilities</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Liability records remain bound to employees and do not yet expose a dedicated admin list route.
                  </p>
                </div>
              </div>
            </article>

            <pre className="whitespace-pre-wrap rounded-[22px] border border-white/10 bg-slate-950/70 p-4 text-sm leading-6 text-slate-200">{`POST /api/liabilities/create
PUT /api/liabilities/:id
DELETE /api/liabilities/:id`}</pre>
          </div>
        </AdminSurface>
      </div>
    </div>
  );
}

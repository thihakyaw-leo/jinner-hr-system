import { useState } from 'react';
import type { CreateEmployeeInput } from '@thihakyaw-leo/shared-types';
import { GlassPanel, SectionTitle } from '@thihakyaw-leo/ui-components';
import { useBranches } from '../hooks/useBranches';
import { useEmployees } from '../hooks/useEmployees';
import { SearchBar } from '../components/SearchBar';
import { SlideOverForm } from '../components/SlideOverForm';

type EmployeesPageProps = {
  token: string;
};

const initialForm: CreateEmployeeInput = {
  employee_code: '',
  name: '',
  password: '',
  role: 'staff',
  branch_id: '',
  status: 'active',
  is_first_login: true
};

export function EmployeesPage({ token }: EmployeesPageProps) {
  const [search, setSearch] = useState('');
  const [form, setForm] = useState<CreateEmployeeInput>(initialForm);
  const { items: branches, error: branchesError } = useBranches(token);
  const { items, isLoading, isCreating, error, createEmployee } = useEmployees({ token, search });

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
      <GlassPanel>
        <SectionTitle
          eyebrow="Employees"
          title="Employee management"
          description="Scaffolded page for employee CRUD, filtering, and branch-aware user administration."
        />
        <SearchBar
          placeholder="Search by employee code, branch, or role..."
          value={search}
          onChange={setSearch}
        />
        <div className="mt-5 overflow-hidden rounded-3xl border border-white/10">
          <div className="grid grid-cols-[1.1fr_1.2fr_.8fr_.8fr] gap-3 bg-slate-950/35 px-4 py-3 text-xs uppercase tracking-[0.22em] text-slate-400">
            <span>Code</span>
            <span>Name</span>
            <span>Role</span>
            <span>Status</span>
          </div>

          <div className="divide-y divide-white/10 bg-white/3">
            {isLoading ? (
              <div className="px-4 py-6 text-sm text-slate-300">Loading employees...</div>
            ) : items.length === 0 ? (
              <div className="px-4 py-6 text-sm text-slate-300">No employees found.</div>
            ) : (
              items.map((employee) => (
                <div
                  key={employee.id}
                  className="grid grid-cols-[1.1fr_1.2fr_.8fr_.8fr] gap-3 px-4 py-4 text-sm text-slate-100"
                >
                  <span>{employee.employee_code}</span>
                  <span>{employee.name}</span>
                  <span className="capitalize text-slate-300">{employee.role}</span>
                  <span className="capitalize text-slate-300">{employee.status}</span>
                </div>
              ))
            )}
          </div>
        </div>
        {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
      </GlassPanel>

      <SlideOverForm
        title="Create employee"
        description="Add a new employee record. This currently requires a valid existing branch ID."
        footer="Tip: seed a branch first in D1 so the branch_id foreign key succeeds."
      >
        <form
          className="grid gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            void createEmployee(form).then(() => setForm(initialForm));
          }}
        >
          <input
            value={form.employee_code}
            onChange={(event) => setForm((current) => ({ ...current, employee_code: event.target.value }))}
            placeholder="Employee code"
            className="rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
          />
          <input
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            placeholder="Full name"
            className="rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
          />
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            placeholder="Temporary password"
            className="rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
          />
          <select
            value={form.branch_id}
            onChange={(event) => setForm((current) => ({ ...current, branch_id: event.target.value }))}
            className="rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3 text-sm text-white outline-none"
          >
            <option value="">Select branch</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
          <select
            value={form.role}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                role: event.target.value as CreateEmployeeInput['role']
              }))
            }
            className="rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3 text-sm text-white outline-none"
          >
            <option value="staff">staff</option>
            <option value="manager">manager</option>
            <option value="admin">admin</option>
          </select>
          <button
            type="submit"
            disabled={isCreating}
            className="rounded-2xl bg-cyan-300 px-4 py-3 font-medium text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCreating ? 'Creating...' : 'Create employee'}
          </button>
          {branchesError ? <p className="text-sm text-rose-300">{branchesError}</p> : null}
        </form>
      </SlideOverForm>
    </div>
  );
}

import { useMemo, useState } from 'react';
import type { CreateEmployeeInput, EmployeeSummary } from '@thihakyaw-leo/shared-types';
import {
  Banknote,
  Building,
  Edit2,
  Plus,
  Shield,
  Trash2,
  Users
} from 'lucide-react';
import { AdminModal } from '../components/AdminModal';
import {
  AdminSectionHeader,
  AdminStatCard,
  AdminSurface
} from '../components/AdminSurface';
import { SearchBar } from '../components/SearchBar';
import { useBranches } from '../hooks/useBranches';
import { useEmployees } from '../hooks/useEmployees';

type EmployeesPageProps = {
  token: string;
};

const initialForm: CreateEmployeeInput = {
  employee_code: '',
  name: '',
  password: '',
  role: 'sales',
  branch_id: '',
  status: 'active',
  basic_salary: 0,
  is_first_login: true
};

type FormMode = 'create' | 'edit';

function formatRoleLabel(role: CreateEmployeeInput['role']) {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

function formatStatusLabel(status: NonNullable<CreateEmployeeInput['status']>) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatCurrency(value: number | undefined) {
  return `MMK ${(value ?? 0).toLocaleString()}`;
}

export function EmployeesPage({ token }: EmployeesPageProps) {
  const [search, setSearch] = useState('');
  const [form, setForm] = useState<CreateEmployeeInput>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<FormMode>('create');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { items: branches, error: branchesError } = useBranches(token);
  const {
    items,
    isLoading,
    isCreating,
    isUpdating,
    error,
    createEmployee,
    updateEmployee,
    deleteEmployee
  } = useEmployees({ token, search });

  const branchLookup = useMemo(
    () => new Map(branches.map((branch) => [branch.id, branch.name])),
    [branches]
  );

  const stats = useMemo(() => {
    const activeCount = items.filter((employee) => employee.status === 'active').length;
    const leadershipCount = items.filter(
      (employee) => employee.role === 'owner' || employee.role === 'manager'
    ).length;
    const branchCount = new Set(items.map((employee) => employee.branch_id)).size;

    return {
      total: items.length,
      activeCount,
      leadershipCount,
      branchCount
    };
  }, [items]);

  const resetForm = () => {
    setEditingId(null);
    setForm(initialForm);
    setModalMode('create');
    setIsModalOpen(false);
  };

  const openCreateModal = () => {
    setModalMode('create');
    setEditingId(null);
    setForm(initialForm);
    setIsModalOpen(true);
  };

  const openEditModal = (employee: EmployeeSummary) => {
    setModalMode('edit');
    setEditingId(employee.id);
    setForm({
      employee_code: employee.employee_code,
      name: employee.name,
      password: '',
      role: employee.role,
      branch_id: employee.branch_id,
      status: employee.status,
      basic_salary: employee.basic_salary,
      is_first_login: employee.is_first_login
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      if (modalMode === 'edit' && editingId) {
        const { employee_code, password, is_first_login, ...updateData } = form;
        void employee_code;
        void password;
        void is_first_login;
        await updateEmployee(editingId, updateData);
      } else {
        await createEmployee(form);
      }

      resetForm();
    } catch {
      // Hook-managed error state
    }
  };

  return (
    <>
      <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-5">
          <AdminSurface>
            <AdminSectionHeader
              eyebrow="People operations"
              title="Employee management"
              description="The prototype table density is now applied to the real employee CRUD workspace, including search, branch-aware assignments, and role management."
              action={
                <button
                  type="button"
                  onClick={openCreateModal}
                  className="inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-sky-400/18 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-400/24"
                >
                  <Plus className="h-4 w-4" />
                  <span>New employee</span>
                </button>
              }
            />

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <AdminStatCard
                label="Employee count"
                value={String(stats.total)}
                detail="Live rows returned from the current employee listing endpoint."
                icon={Users}
              />
              <AdminStatCard
                label="Active staff"
                value={String(stats.activeCount)}
                detail="Employees currently marked as active in the backend."
                icon={Shield}
                accent="emerald"
              />
              <AdminStatCard
                label="Active branches"
                value={String(stats.branchCount)}
                detail="Unique branches represented in the current table view."
                icon={Building}
                accent="amber"
              />
            </div>
          </AdminSurface>

          <AdminSurface>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <h2 className="text-xl font-semibold text-white">Employee directory</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Search by employee code or name, then launch create or edit flows from the same workspace.
                </p>
              </div>
              <div className="w-full max-w-xl">
                <SearchBar
                  label="Employee lookup"
                  placeholder="Search by employee code or name..."
                  value={search}
                  onChange={setSearch}
                />
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-[26px] border border-white/10">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[820px]">
                  <thead className="bg-slate-950/70 text-left">
                    <tr className="text-[11px] uppercase tracking-[0.26em] text-slate-400">
                      <th className="px-4 py-4 font-medium">Code</th>
                      <th className="px-4 py-4 font-medium">Employee</th>
                      <th className="px-4 py-4 font-medium">Branch</th>
                      <th className="px-4 py-4 font-medium">Role</th>
                      <th className="px-4 py-4 font-medium">Salary</th>
                      <th className="px-4 py-4 font-medium">Status</th>
                      <th className="px-4 py-4 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 bg-white/[0.03]">
                    {isLoading ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-sm text-slate-300">
                          Loading employees...
                        </td>
                      </tr>
                    ) : items.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-sm text-slate-300">
                          No employees found for the current search.
                        </td>
                      </tr>
                    ) : (
                      items.map((employee) => (
                        <tr key={employee.id} className="transition hover:bg-white/[0.04]">
                          <td className="px-4 py-4 text-sm font-medium text-white">
                            {employee.employee_code}
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-sm font-medium text-white">{employee.name}</p>
                            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">
                              Created {new Date(employee.created_at).toLocaleDateString()}
                            </p>
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-300">
                            {branchLookup.get(employee.branch_id) ?? 'Unassigned'}
                          </td>
                          <td className="px-4 py-4">
                            <span className="inline-flex rounded-full border border-sky-300/15 bg-sky-400/12 px-3 py-1 text-xs font-medium text-sky-100">
                              {formatRoleLabel(employee.role)}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-300">
                            {formatCurrency(employee.basic_salary)}
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                                employee.status === 'active'
                                  ? 'border border-emerald-300/15 bg-emerald-400/12 text-emerald-100'
                                  : 'border border-amber-300/15 bg-amber-400/12 text-amber-100'
                              }`}
                            >
                              {formatStatusLabel(employee.status)}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => openEditModal(employee)}
                                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10"
                              >
                                <Edit2 className="h-4 w-4 text-sky-300" />
                                <span>Edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete ${employee.name}?`)) {
                                    void deleteEmployee(employee.id);
                                  }
                                }}
                                className="inline-flex items-center gap-2 rounded-2xl border border-rose-300/15 bg-rose-400/12 px-3 py-2 text-sm text-rose-100 transition hover:bg-rose-400/20"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
          </AdminSurface>
        </div>

        <div className="space-y-5">
          <AdminSurface>
            <AdminSectionHeader
              eyebrow="Workspace notes"
              title="Role-aware behavior"
              description="This phase keeps the real permission model front and center while restyling the UI around the prototype."
            />

            <div className="mt-6 space-y-4">
              <article className="rounded-[22px] border border-white/10 bg-slate-950/55 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-sky-200">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Leadership seats</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {stats.leadershipCount} employee record(s) currently carry owner or manager access.
                    </p>
                  </div>
                </div>
              </article>

              <article className="rounded-[22px] border border-white/10 bg-slate-950/55 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-amber-100">
                    <Building className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Branch dependencies</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      Employee creation still depends on valid branch records because `branch_id` is enforced by the backend.
                    </p>
                  </div>
                </div>
              </article>

              <article className="rounded-[22px] border border-white/10 bg-slate-950/55 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-emerald-200">
                    <Banknote className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Salary baseline</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      Salary values remain tied to the existing employee schema and continue to feed downstream finance workflows.
                    </p>
                  </div>
                </div>
              </article>
            </div>

            {branchesError ? <p className="mt-4 text-sm text-rose-300">{branchesError}</p> : null}
          </AdminSurface>
        </div>
      </div>

      <AdminModal
        open={isModalOpen}
        title={modalMode === 'edit' ? 'Edit employee' : 'Create employee'}
        description={
          modalMode === 'edit'
            ? 'Update the selected record without leaving the current directory view.'
            : 'Create a new employee record with branch, role, salary, and login details.'
        }
        onClose={resetForm}
      >
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm text-slate-300">
              <span>Employee code</span>
              {modalMode === 'edit' ? (
                <div className="rounded-[22px] border border-white/10 bg-slate-950/55 px-4 py-3 text-sm text-white">
                  {form.employee_code}
                </div>
              ) : (
                <input
                  value={form.employee_code}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, employee_code: event.target.value }))
                  }
                  placeholder="e.g. JNR-001"
                  className="rounded-[22px] border border-white/10 bg-slate-950/55 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
                />
              )}
            </label>

            <label className="grid gap-2 text-sm text-slate-300">
              <span>Full name</span>
              <input
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="Employee full name"
                className="rounded-[22px] border border-white/10 bg-slate-950/55 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
              />
            </label>

            {modalMode === 'create' ? (
              <label className="grid gap-2 text-sm text-slate-300">
                <span>Temporary password</span>
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, password: event.target.value }))
                  }
                  placeholder="Create initial password"
                  className="rounded-[22px] border border-white/10 bg-slate-950/55 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
                />
              </label>
            ) : null}

            <label className="grid gap-2 text-sm text-slate-300">
              <span>Basic salary</span>
              <input
                type="number"
                value={form.basic_salary}
                onChange={(event) =>
                  setForm((current) => ({ ...current, basic_salary: Number(event.target.value) }))
                }
                placeholder="0"
                className="rounded-[22px] border border-white/10 bg-slate-950/55 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
              />
            </label>

            <label className="grid gap-2 text-sm text-slate-300">
              <span>Branch</span>
              <select
                value={form.branch_id}
                onChange={(event) =>
                  setForm((current) => ({ ...current, branch_id: event.target.value }))
                }
                className="rounded-[22px] border border-white/10 bg-slate-950/55 px-4 py-3 text-sm text-white outline-none"
              >
                <option value="">Select branch</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm text-slate-300">
              <span>Role</span>
              <select
                value={form.role}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    role: event.target.value as CreateEmployeeInput['role']
                  }))
                }
                className="rounded-[22px] border border-white/10 bg-slate-950/55 px-4 py-3 text-sm text-white outline-none"
              >
                <option value="sales">Sales Staff</option>
                <option value="cashier">Cashier</option>
                <option value="manager">Manager</option>
                <option value="owner">Owner</option>
              </select>
            </label>

            <label className="grid gap-2 text-sm text-slate-300">
              <span>Status</span>
              <select
                value={form.status}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    status: event.target.value as NonNullable<CreateEmployeeInput['status']>
                  }))
                }
                className="rounded-[22px] border border-white/10 bg-slate-950/55 px-4 py-3 text-sm text-white outline-none"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>
          </div>

          <div className="flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={resetForm}
              className="rounded-[22px] border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-300 transition hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="inline-flex items-center justify-center gap-2 rounded-[22px] border border-sky-300/20 bg-sky-400/18 px-5 py-3 text-sm font-medium text-white transition hover:bg-sky-400/24 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus className="h-4 w-4" />
              <span>
                {isCreating || isUpdating
                  ? modalMode === 'edit'
                    ? 'Updating...'
                    : 'Creating...'
                  : modalMode === 'edit'
                    ? 'Update employee'
                    : 'Create employee'}
              </span>
            </button>
          </div>
        </form>
      </AdminModal>
    </>
  );
}

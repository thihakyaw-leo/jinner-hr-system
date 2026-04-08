import { Hono } from 'hono';
import type { AppEnv } from '../types';
import { hashPassword } from '../utils';

const employeeRoutes = new Hono<AppEnv>();

employeeRoutes.get('/', async (c) => {
  const query = c.req.query('q')?.trim() ?? '';

  const statement = query
    ? c.env.DB.prepare(
        `SELECT id, employee_code, name, role, status, branch_id, is_first_login, created_at
         FROM employees
         WHERE employee_code LIKE ? OR name LIKE ?
         ORDER BY created_at DESC
         LIMIT 50`
      ).bind(`%${query}%`, `%${query}%`)
    : c.env.DB.prepare(
        `SELECT id, employee_code, name, role, status, branch_id, basic_salary, is_first_login, created_at
         FROM employees
         ORDER BY created_at DESC
         LIMIT 50`
      );

  const result = await statement.all<{
    id: string;
    employee_code: string;
    name: string;
    role: 'owner' | 'manager' | 'cashier' | 'sales';
    status: 'active' | 'inactive';
    branch_id: string;
    basic_salary: number;
    is_first_login: number;
    created_at: string;
  }>();

  return c.json({
    items: (result.results ?? []).map((employee) => ({
      ...employee,
      is_first_login: Boolean(employee.is_first_login)
    }))
  });
});

employeeRoutes.post('/', async (c) => {
  const actor = c.get('jwtPayload');

  if (actor.role !== 'owner' && actor.role !== 'manager') {
    return c.json({ error: 'Only owners and managers can create employees.' }, 403);
  }

  const body = await c.req.json<{
    employee_code?: string;
    name?: string;
    password?: string;
    role?: 'owner' | 'manager' | 'cashier' | 'sales';
    branch_id?: string;
    status?: 'active' | 'inactive';
    basic_salary?: number;
    is_first_login?: boolean;
  }>();

  const employeeCode = body.employee_code?.trim();
  const name = body.name?.trim();
  const password = body.password ?? '';
  const role = body.role;
  const branchId = body.branch_id?.trim();
  const status = body.status ?? 'active';
  const basicSalary = Number(body.basic_salary) || 0;
  const isFirstLogin = body.is_first_login ?? true;

  if (!employeeCode || !name || !password || !role || !branchId) {
    return c.json({ error: 'employee_code, name, password, role, and branch_id are required.' }, 400);
  }

  // Permission check: only owners can create owners or managers
  if (actor.role !== 'owner' && (role === 'owner' || role === 'manager')) {
    return c.json({ error: 'Only owners can create owners or managers.' }, 403);
  }

  const branch = await c.env.DB.prepare('SELECT id FROM branches WHERE id = ? LIMIT 1')
    .bind(branchId)
    .first<{ id: string }>();

  if (!branch) {
    return c.json({ error: 'branch_id does not exist.' }, 400);
  }

  const passwordHash = await hashPassword(password);
  const id = crypto.randomUUID();

  const result = await c.env.DB.prepare(
    `INSERT INTO employees (
      id,
      employee_code,
      branch_id,
      name,
      password_hash,
      role,
      status,
      basic_salary,
      is_first_login,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
  )
    .bind(id, employeeCode, branchId, name, passwordHash, role, status, basicSalary, isFirstLogin ? 1 : 0)
    .run();

  if (!result.success) {
    return c.json({ error: 'Unable to create employee.' }, 500);
  }

  return c.json(
    {
      item: {
        id,
        employee_code: employeeCode,
        branch_id: branchId,
        name,
        role,
        status,
        basic_salary: basicSalary,
        is_first_login: isFirstLogin
      }
    },
    201
  );
});

employeeRoutes.put('/:id', async (c) => {
  const actor = c.get('jwtPayload');
  const id = c.req.param('id');

  if (actor.role !== 'owner' && actor.role !== 'manager') {
    return c.json({ error: 'Only owners and managers can edit employees.' }, 403);
  }

  const body = await c.req.json<{
    name?: string;
    role?: 'owner' | 'manager' | 'cashier' | 'sales';
    status?: 'active' | 'inactive';
    basic_salary?: number;
    branch_id?: string;
  }>();

  // Load the target employee
  const target = await c.env.DB.prepare('SELECT id, role FROM employees WHERE id = ? LIMIT 1')
    .bind(id)
    .first<{ id: string; role: string }>();

  if (!target) {
    return c.json({ error: 'Employee not found.' }, 404);
  }

  // Permission logic: Only owners can edit other owners/managers
  if (actor.role !== 'owner' && (target.role === 'owner' || target.role === 'manager')) {
    return c.json({ error: 'Only owners can edit owner and manager accounts.' }, 403);
  }

  // Permission logic: Managers can't elevate roles to owner/manager
  if (actor.role !== 'owner' && (body.role === 'owner' || body.role === 'manager')) {
    return c.json({ error: 'Only owners can assign owner and manager roles.' }, 403);
  }

  const updates: string[] = [];
  const params: any[] = [];

  if (body.name) {
    updates.push('name = ?');
    params.push(body.name);
  }
  if (body.role) {
    updates.push('role = ?');
    params.push(body.role);
  }
  if (body.status) {
    updates.push('status = ?');
    params.push(body.status);
  }
  if (body.basic_salary !== undefined) {
    updates.push('basic_salary = ?');
    params.push(body.basic_salary);
  }
  if (body.branch_id) {
    updates.push('branch_id = ?');
    params.push(body.branch_id);
  }

  if (updates.length === 0) {
    return c.json({ error: 'No fields provided for update.' }, 400);
  }

  updates.push('updated_at = CURRENT_TIMESTAMP');
  params.push(id);

  const query = `UPDATE employees SET ${updates.join(', ')} WHERE id = ?`;
  const result = await c.env.DB.prepare(query).bind(...params).run();

  if (!result.success) {
    return c.json({ error: 'Unable to update employee.' }, 500);
  }

  return c.json({ success: true, message: 'Employee updated successfully.' });
});

employeeRoutes.delete('/:id', async (c) => {
  const actor = c.get('jwtPayload');
  const id = c.req.param('id');

  // Only owner can delete
  if (actor.role !== 'owner') {
    return c.json({ error: 'Only owners can delete employees.' }, 403);
  }

  // Can't delete self
  if (actor.id === id) {
    return c.json({ error: 'You cannot delete your own account.' }, 400);
  }

  const result = await c.env.DB.prepare('DELETE FROM employees WHERE id = ?').bind(id).run();

  if (!result.success) {
    return c.json({ error: 'Unable to delete employee.' }, 500);
  }

  return c.json({ success: true, message: 'Employee deleted successfully.' });
});

export default employeeRoutes;

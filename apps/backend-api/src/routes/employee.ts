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
        `SELECT id, employee_code, name, role, status, branch_id, is_first_login, created_at
         FROM employees
         ORDER BY created_at DESC
         LIMIT 50`
      );

  const result = await statement.all<{
    id: string;
    employee_code: string;
    name: string;
    role: 'admin' | 'manager' | 'staff';
    status: 'active' | 'inactive';
    branch_id: string;
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

  if (actor.role !== 'admin') {
    return c.json({ error: 'Only admins can create employees.' }, 403);
  }

  const body = await c.req.json<{
    employee_code?: string;
    name?: string;
    password?: string;
    role?: 'admin' | 'manager' | 'staff';
    branch_id?: string;
    status?: 'active' | 'inactive';
    is_first_login?: boolean;
  }>();

  const employeeCode = body.employee_code?.trim();
  const name = body.name?.trim();
  const password = body.password ?? '';
  const role = body.role;
  const branchId = body.branch_id?.trim();
  const status = body.status ?? 'active';
  const isFirstLogin = body.is_first_login ?? true;

  if (!employeeCode || !name || !password || !role || !branchId) {
    return c.json({ error: 'employee_code, name, password, role, and branch_id are required.' }, 400);
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
      is_first_login,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
  )
    .bind(id, employeeCode, branchId, name, passwordHash, role, status, isFirstLogin ? 1 : 0)
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
        is_first_login: isFirstLogin
      }
    },
    201
  );
});

export default employeeRoutes;

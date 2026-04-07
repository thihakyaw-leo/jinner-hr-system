import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import type { AppEnv, EmployeeRecord } from '../types';
import { hashPassword } from '../utils';

const authRoutes = new Hono<AppEnv>();

authRoutes.post('/login', async (c) => {
  const body = await c.req.json<{ employee_code?: string; password?: string }>();
  const employeeCode = body.employee_code?.trim();
  const password = body.password ?? '';

  if (!employeeCode || !password) {
    return c.json({ error: 'employee_code and password are required.' }, 400);
  }

  const employee = await c.env.DB.prepare(
    `SELECT id, employee_code, branch_id, name, password_hash, role, status, is_first_login
     FROM employees
     WHERE employee_code = ?
     LIMIT 1`
  )
    .bind(employeeCode)
    .first<EmployeeRecord>();

  if (!employee || employee.status !== 'active') {
    return c.json({ error: 'Invalid credentials.' }, 401);
  }

  const incomingPasswordHash = await hashPassword(password);

  if (incomingPasswordHash !== employee.password_hash) {
    return c.json({ error: 'Invalid credentials.' }, 401);
  }

  const token = await sign(
    {
      id: employee.id,
      employee_code: employee.employee_code,
      role: employee.role,
      branch_id: employee.branch_id,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12
    },
    c.env.JWT_SECRET
  );

  return c.json({
    token,
    user: {
      id: employee.id,
      employee_code: employee.employee_code,
      name: employee.name,
      role: employee.role,
      branch_id: employee.branch_id,
      is_first_login: Boolean(employee.is_first_login)
    }
  });
});

export default authRoutes;

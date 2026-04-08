import { Hono } from 'hono';
import type { AppEnv } from '../types';
import { hashPassword } from '../utils';

const profileRoutes = new Hono<AppEnv>();

// Get current employee profile
profileRoutes.get('/me', async (c) => {
  const payload = c.get('jwtPayload');

  const employee = await c.env.DB.prepare(
    `SELECT id, employee_code, name, role, branch_id, phone, address, email, status, is_first_login, created_at
     FROM employees WHERE id = ? LIMIT 1`
  )
    .bind(payload.id)
    .first<{
      id: string;
      employee_code: string;
      name: string;
      role: string;
      branch_id: string;
      phone: string | null;
      address: string | null;
      email: string | null;
      status: string;
      is_first_login: number;
      created_at: string;
    }>();

  if (!employee) {
    return c.json({ error: 'Employee not found.' }, 404);
  }

  return c.json({
    item: {
      ...employee,
      is_first_login: Boolean(employee.is_first_login)
    }
  });
});

// Update profile fields (phone, address, email)
profileRoutes.put('/me', async (c) => {
  const payload = c.get('jwtPayload');
  const body = await c.req.json<{
    phone?: string;
    address?: string;
    email?: string;
  }>();

  const phone = body.phone?.trim() ?? null;
  const address = body.address?.trim() ?? null;
  const email = body.email?.trim() ?? null;

  const result = await c.env.DB.prepare(
    `UPDATE employees SET phone = ?, address = ?, email = ? WHERE id = ?`
  )
    .bind(phone, address, email, payload.id)
    .run();

  if (!result.success) {
    return c.json({ error: 'Unable to update profile.' }, 500);
  }

  return c.json({ success: true });
});

// Change password
profileRoutes.put('/me/password', async (c) => {
  const payload = c.get('jwtPayload');
  const body = await c.req.json<{
    current_password?: string;
    new_password?: string;
  }>();

  const currentPassword = body.current_password?.trim();
  const newPassword = body.new_password?.trim();

  if (!currentPassword || !newPassword) {
    return c.json({ error: 'current_password and new_password are required.' }, 400);
  }

  if (newPassword.length < 6) {
    return c.json({ error: 'New password must be at least 6 characters.' }, 400);
  }

  const employee = await c.env.DB.prepare(
    'SELECT id, password_hash FROM employees WHERE id = ? LIMIT 1'
  )
    .bind(payload.id)
    .first<{ id: string; password_hash: string }>();

  if (!employee) {
    return c.json({ error: 'Employee not found.' }, 404);
  }

  // Verify current password
  const currentHash = await hashPassword(currentPassword);
  if (currentHash !== employee.password_hash) {
    return c.json({ error: 'Current password is incorrect.' }, 401);
  }

  // Update password
  const newHash = await hashPassword(newPassword);
  await c.env.DB.prepare(
    'UPDATE employees SET password_hash = ?, is_first_login = 0 WHERE id = ?'
  )
    .bind(newHash, payload.id)
    .run();

  return c.json({ success: true });
});

export default profileRoutes;
